const express = require("express");
const { ethers } = require("ethers");
const { createWeb3Instance } = require("./services/blockchain");
const { fetchPoolData } = require("./services/graphql");
const { toChecksumAddress, formatNumber } = require("./utils/helpers");
const contractABI = require("./abi.json"); // you can find this on our git or any block explorer
const erc20Abi = require("./erc20abi.json");
const chainConfigurations = require("./config/chainConfigurations");
const cors = require('cors');
const { fetch30DayFees } = require('./services/graphql');
const axios = require("axios");

const app = express();
const PORT = 3000;
const REFRESH_INTERVAL = 600000; // 10 minutes
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.getTime() / 1000;
}

function formatTokenValue(value, decimals) {
  const valueBigInt = BigInt(value);
  const divisor = BigInt(10 ** decimals);
  const beforeDecimal = valueBigInt / divisor;
  const afterDecimal = valueBigInt % divisor;
  
  return beforeDecimal.toString() + '.' + afterDecimal.toString().padStart(decimals, '0');
}



async function fetchTVL(poolAddress, tokenAddress, decimals, provider) {
  let tvl;

  try {
    if (tokenAddress === ADDRESS_ZERO) {
      tvl = await provider.getBalance(poolAddress);
    } else {
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
      tvl = await tokenContract.balanceOf(poolAddress);
    }
  } catch (error) {
    console.error(`Error fetching TVL for pool ${poolAddress}: ${error}`);
    return "0";
  }

  return formatTokenValue(tvl.toString(), decimals);
}


async function calculateAPRForPools() {
  const currentTime = new Date();
  const to = currentTime.getTime() / 1000;

  let response = {};
  for (const [chainName, chainDetails] of Object.entries(chainConfigurations)) {
    const provider = createWeb3Instance(chainName);
    response[chainName] = {};

    for (const [poolAddress, poolDetails] of Object.entries(chainDetails.pools)) {
      try {
        const contract = new ethers.Contract(poolAddress, contractABI, provider);
        const contractData = await fetchContractData(contract, provider, poolAddress, poolDetails);

        let tvl = contractData.TVL ? parseFloat(contractData.TVL) : 0;

        response[chainName][poolAddress] = {
          ...poolDetails,
          ...contractData,
          ...(await calculateAPRAndRelatedValues(poolDetails, chainDetails.chainId, tvl, to)),
        };
      } catch (error) {
        console.error(`Error processing pool ${poolAddress}:`, error);
      }
    }
  }
  return response;
}


async function calculateAPRAndRelatedValues(poolDetails, chainId, tvl, to) {
  const aprValues = {};

  const dayRanges = [1, 7, 30, 365];
  for (const days of dayRanges) {
    const from = getDateDaysAgo(days);
    const dayProducts = await fetchPoolData(from, to);
    const [apr, totalReturn, pnl, fees] = calculateApr(
      dayProducts,
      poolDetails,
      chainId,
      tvl,
      days
    );

    aprValues[`${days}DayData`] = {
      APR: apr.toFixed(2) + "%",
      TotalReturn: totalReturn,
      PnL: pnl,
      Fees: fees,
    };
  }

  return aprValues;
}

async function fetchContractData(contract, provider, poolAddress, poolDetails) {
  try {
    const utilization = await contract.getUtilization();
    const minDepositTime = await contract.minDepositTime();
    const openInterestRaw = await contract.openInterest();
    const withdrawFee = await contract.withdrawFee();
    const currency = await contract.currency();

    const checksummedCurrency = toChecksumAddress(currency);
    const openInterest = formatNumber(openInterestRaw, Math.pow(10, 18), 6);

    let tvl;
    if (currency === ADDRESS_ZERO) {
        tvl = await provider.getBalance(poolAddress);
        tvl = formatTokenValue(tvl.toString(), 18);
    } else {
        tvl = await fetchTVL(poolAddress, currency, poolDetails.decimals, provider);
    }

    const responseData = {
      Utilization: formatNumber(utilization, 100, 2),
      MinimumDepositTime: minDepositTime.toString(),
      OpenInterest: openInterest,
      TVL: tvl,
      WithdrawFee: formatNumber(withdrawFee, 100, 1),
      Currency: checksummedCurrency,
    };
    return responseData;

  } catch (error) {
    console.error(`Failed to fetch data for contract at ${poolAddress}:`, error);
    throw error;
  }
}

function calculateApr(dayProducts, poolDetails, poolChainId, tvl, days) {
  let totalPnL = 0;
  let totalFees = 0;
  const feePercentage = poolDetails.feePercentage / 100;

  dayProducts.forEach((product) => {
      const [productCurrency, productChainId] = product._id.split(":").slice(1, 3);
      if (toChecksumAddress(productCurrency) === poolDetails.currency && productChainId === poolChainId.toString()) {
          totalPnL += product.cumulativePnl || 0;
          totalFees += (product.cumulativeFees || 0) * feePercentage;
      }
  });

  // Calculate annualized incentives
  const annualIncentives = poolDetails.tokenweeklyIncentives ? poolDetails.tokenweeklyIncentives * 52 : 0;

  // Total return including incentives
  const totalReturn = totalPnL < 0 ? totalFees + Math.abs(totalPnL) + annualIncentives : totalFees - totalPnL + annualIncentives;

  const annualizedReturn = totalReturn * (365 / days);
  const apr = tvl > 0 ? (annualizedReturn / tvl) * 100 : 0;

  return [apr, totalReturn, totalPnL, totalFees];
}


async function calculateTotalAPR() {
  try {
      const thirtyDayFees = await fetch30DayFees();
      const annualizedFees = thirtyDayFees * 12;

      const priceResponse = await axios.get('https://coins.llama.fi/prices/current/optimism:0x28b42698Caf46B4B012CF38b6C75867E0762186D');
      const tokenPrice = priceResponse.data.coins['optimism:0x28b42698Caf46B4B012CF38b6C75867E0762186D'].price;
      const value = tokenPrice * 4000000;

      const totalAPR = (annualizedFees / value) * 100;
      return totalAPR;
  } catch (error) {
      console.error("Error calculating total APR: ", error);
      throw error;
  }
}

calculateTotalAPR().then(totalAPR => {
  // left blank but we can log here if we want
}).catch(error => {
  console.error(error);
});


let cachedData = {};

async function refreshData() {
  try {
      const poolData = await calculateAPRForPools();
      const unidexTokenStatsAPR = await calculateTotalAPR();

      cachedData = {
          ...poolData, // Spread the pool data
          unidexTokenStats: {
              APR: unidexTokenStatsAPR.toFixed(2) + '%'
          }
      };
  } catch (error) {
      console.error("Error refreshing data: ", error);
  }
}

refreshData();
setInterval(refreshData, REFRESH_INTERVAL);

app.use(cors());

app.get("/pools", async (req, res) => {
  if (Object.keys(cachedData).length === 0) {
      res.status(503).send("Data is still loading. Please try again in a few moments.");
  } else {
      res.json(cachedData);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
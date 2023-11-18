const express = require("express");
const { ethers } = require("ethers");

const app = express();
const PORT = 3000;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const REFRESH_INTERVAL = 600000; // 10 minute

const contractABI = require("./abi.json");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const chainConfigurations = {
  optimism: {
    rpcUrl: "https://optimism.llamarpc.com",
    pools: {
      "0xCdDF71750E596b4C38785afFEc3bd4C9bff43f6F": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
        name: "DAI Pool",
      },
    },
  },
  zksync: {
    rpcUrl: "https://mainnet.era.zksync.io",
    pools: {
      "0xa41A6a4A04E711B53a82E594CeB525e89206627A": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4",
        name: "USDC Pool",
      },
    },
  },
  base: {
    rpcUrl: "https://base.llamarpc.com",
    pools: {
      "0x9Ba3db52BC401F4EF8ba23e56268C3AdE0290837": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: ADDRESS_ZERO,
        name: "ETH Pool",
      },
      "0xEfD0B28810dC3cdD88763f40DCc44462bb85Cf32": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0x417ac0e078398c154edfadd9ef675d30be60af93",
        name: "CRVusd Pool",
      },
      "0xe10f7BCFf83A0263c03Ba27795d11f4B1631Ef4e": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0x78a087d713be963bf307b18f2ff8122ef9a63ae9",
        name: "BSWAP Pool",
      },
    },
  },
  fantom: {
    rpcUrl: "https://rpc.ftm.tools/",
    pools: {
      "0xBec7d4561037e657830F78b87e780AeE1d09Fc7B": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: ADDRESS_ZERO,
        name: "FTM Pool",
      },
    },
  },
  scroll: {
    rpcUrl: "https://rpc.scroll.io",
    pools: {
      "0x615B1fcf461249b12342726819CB6Da23413CB48": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: ADDRESS_ZERO,
        name: "ETH Pool",
      },
    },
  },
  metis: {
    rpcUrl: "https://andromeda.metis.io/?owner=1088	",
    pools: {
      "0x9Ba3db52BC401F4EF8ba23e56268C3AdE0290837": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: ADDRESS_ZERO,
        name: "ETH Pool",
      },
    },
  },
  arbitrum: {
    rpcUrl: "https://arbitrum.llamarpc.com",
    pools: {
      "0xdAF7D157F5c6E0F1d7917Ca02a7C185cEF81e6d0": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: ADDRESS_ZERO,
        name: "ETH Pool",
      },
      "0x09E122453A079bc2Be621769ae7799e53dA0054E": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
        name: "USDC Pool",
      },
      "0xb764729C6bEbd6E60E151F2c46aFce7D6Ff513fD": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
        name: "DAI Pool",
      },
      "0x9f6B9e253De52C5fD6c65283ff472b15520a7070": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
        name: "USDT Pool",
      },
      "0xe736742Eb62F271c48F4a26168FD8F356AeE68db": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
        name: "WBTC Pool",
      },
      "0xF1Cb521C753e41906073eBEd30FE34BCB00845f8": {
        logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
        currency: "0x912ce59144191c1204e64559fe8253a0e49e6548",
        name: "ARB Pool",
      },
    },
  },
};

const web3Instances = {};
for (const [chain, config] of Object.entries(chainConfigurations)) {
  web3Instances[chain] = new ethers.JsonRpcProvider(config.rpcUrl);
}

function formatNumber(number, scaleFactor, decimalPlaces) {
  const scaledNumber = Number(number) / scaleFactor;
  return scaledNumber.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

async function fetchContractData(contractAddress, abi, provider) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  try {
    const utilization = await contract.getUtilization();
    const minDepositTime = await contract.minDepositTime();
    const openInterestRaw = await contract.openInterest();
    const totalSupply = await contract.totalSupply();
    const withdrawFee = await contract.withdrawFee();
    const currency = await contract.currency();

    const openInterest = formatNumber(openInterestRaw, Math.pow(10, 18), 6); 

    return {
      Utilization: formatNumber(utilization, 100, 2),
      MinimumDepositTime: minDepositTime.toString(),
      OpenInterest: openInterest,
      TVL: totalSupply.toString(),
      WithdrawFee: formatNumber(withdrawFee, 100, 1),
      Currency: currency,
    };
  } catch (error) {
    console.error(
      `Failed to fetch data for contract at ${contractAddress}:`,
      error
    );
    throw error;
  }
}

async function buildApiResponse() {
  let response = {};
  for (const [chainName, chainDetails] of Object.entries(chainConfigurations)) {
    const provider = new ethers.JsonRpcProvider(chainDetails.rpcUrl);
    response[chainName] = {};

    for (const [poolAddress, poolDetails] of Object.entries(
      chainDetails.pools
    )) {
      const data = await fetchContractData(poolAddress, contractABI, provider);
      response[chainName][poolAddress] = {
        ...poolDetails,
        ...data,
      };
    }
  }
  return response;
}

let cachedData = {};

async function refreshData() {
  try {
    const data = await buildApiResponse();
    cachedData = data;
  } catch (error) {
    console.error("Error refreshing data: ", error);
  }
}

refreshData();
setInterval(refreshData, REFRESH_INTERVAL);

app.get("/pools", async (req, res) => {
  if (Object.keys(cachedData).length === 0) {
    res
      .status(503)
      .send("Data is still loading. Please try again in a few moments.");
  } else {
    res.json(cachedData);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

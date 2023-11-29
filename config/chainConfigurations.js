const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
require('dotenv').config();

module.exports = {
    optimism: {
        rpcUrl: process.env.OPTIMISM_RPC_URL,
        chainId: '10',
        pools: {
          "0xCdDF71750E596b4C38785afFEc3bd4C9bff43f6F": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/dai.svg",
            currency: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            name: "DAI Pool",
            feePercentage: 35,
            decimals: 18,
          },
        },
      },
      zksync: {
        rpcUrl: process.env.ZKSYNC_RPC_URL,
        chainId: '324',
        pools: {
          "0xa41A6a4A04E711B53a82E594CeB525e89206627A": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/usdc.svg",
            currency: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
            name: "USDC Pool",
            feePercentage: 35,
            decimals: 6,
          },
        },
      },
      evmos: {
        rpcUrl: process.env.EVMOS_RPC_URL,
        chainId: '9001',
        pools: {
          "0x21708707f03A19C3a4ea5E1a132B5cF96b86F294": {
            logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stevmos.png",
            currency: "0x2C68D1d6aB986Ff4640b51e1F14C716a076E44C4",
            name: "STEVMOS Pool",
            feePercentage: 35,
            decimals: 18,
          },
        },
      },
      base: {
        rpcUrl: process.env.BASE_RPC_URL,
        chainId: '8453',
        pools: {
          "0x9Ba3db52BC401F4EF8ba23e56268C3AdE0290837": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/eth.svg",
            currency: ADDRESS_ZERO,
            name: "ETH Pool",
            feePercentage: 35,
            decimals: 18,
          },
          "0xEfD0B28810dC3cdD88763f40DCc44462bb85Cf32": {
            logo: "https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xf939e0a03fb07f59a73314e73794be0e57ac1b4e.png",
            currency: "0x417Ac0e078398C154EdFadD9Ef675d30Be60Af93",
            name: "CRVusd Pool",
            feePercentage: 35,
            decimals: 18,
          },
          "0xe10f7BCFf83A0263c03Ba27795d11f4B1631Ef4e": {
            logo: "https://assets.coingecko.com/coins/images/31245/standard/Baseswap_LogoNew.jpg?1696530070",
            currency: "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9",
            name: "BSWAP Pool",
            feePercentage: 35,
            decimals: 18,
          },
        },
      },
      fantom: {
        rpcUrl: process.env.FANTOM_RPC_URL,
        chainId: '250',
        pools: {
          "0xBec7d4561037e657830F78b87e780AeE1d09Fc7B": {
            logo: "https://assets.coingecko.com/coins/images/4001/standard/Fantom_round.png?1696504642",
            currency: ADDRESS_ZERO,
            name: "FTM Pool",
            feePercentage: 35,
            decimals: 18,
          },
        },
      },
      scroll: {
        rpcUrl: process.env.SCROLL_RPC_URL,
        chainId: '1088',
        pools: {
          "0x615B1fcf461249b12342726819CB6Da23413CB48": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/eth.svg",
            currency: ADDRESS_ZERO,
            name: "ETH Pool",
            feePercentage: 35,
            decimals: 18,
          },
        },
      },
      metis: {
        rpcUrl: process.env.METIS_RPC_URL,
        chainId: '1088',
        pools: {
          "0x9Ba3db52BC401F4EF8ba23e56268C3AdE0290837": {
            logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/9640.png",
            currency: ADDRESS_ZERO,
            name: "METIS Pool",
            feePercentage: 35,
            decimals: 18,
          },
        },
      },
      arbitrum: {
        rpcUrl: process.env.ARBITRUM_RPC_URL,
        chainId: '42161',
        pools: {
          "0xdAF7D157F5c6E0F1d7917Ca02a7C185cEF81e6d0": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/eth.svg",
            currency: ADDRESS_ZERO,
            name: "ETH Pool",
            feePercentage: 35,
            decimals: 18,
          },
          "0x09E122453A079bc2Be621769ae7799e53dA0054E": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/usdc.svg",
            currency: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            name: "USDC Pool",
            feePercentage: 35,
            decimals: 6,
          },
          "0xb764729C6bEbd6E60E151F2c46aFce7D6Ff513fD": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/dai.svg",
            currency: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            name: "DAI Pool",
            feePercentage: 35,
            decimals: 18,
          },
          "0x9f6B9e253De52C5fD6c65283ff472b15520a7070": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/usdt.svg",
            currency: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            name: "USDT Pool",
            feePercentage: 35,
            decimals: 6,
          },
          "0xe736742Eb62F271c48F4a26168FD8F356AeE68db": {
            logo: "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/mainx/SVG/btc.svg",
            currency: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
            name: "WBTC Pool",
            feePercentage: 35,
            decimals: 6,
          },
          "0xF1Cb521C753e41906073eBEd30FE34BCB00845f8": {
            logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
            currency: "0x912CE59144191C1204E64559FE8253a0e49E6548",
            name: "ARB Pool",
            feePercentage: 35,
            decimals: 18,
          },
        },
      },
};

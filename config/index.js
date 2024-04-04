require('dotenv').config();

const config = {
    rpcUrls: {
        optimism: process.env.OPTIMISM_RPC_URL,
        zksync: process.env.ZKSYNC_RPC_URL,
        base: process.env.BASE_RPC_URL,
        fantom: process.env.FANTOM_RPC_URL,
        scroll: process.env.SCROLL_RPC_URL,
        metis: process.env.METIS_RPC_URL,
        arbitrum: process.env.ARBITRUM_RPC_URL,
        evmos: process.env.EVMOS_RPC_URL,
        bsc: process.env.BSC_RPC_URL,
        mode: process.env.MODE_RPC_URL,
        molten: process.env.MOLTEN_RPC_URL
    },
    graphqlEndpoint: process.env.GRAPHQL_ENDPOINT
};

module.exports = config;

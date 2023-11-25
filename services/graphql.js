const axios = require("axios");
const config = require("../config");

async function fetchPoolData(from, to) {
    const query = {
        query: /* GraphQL */ `
            query ($gt: Float, $lte: Float) {
                DayProducts(filter: {_operators: {date: {gt: $gt, lte: $lte}}}, limit: 0) {
                    _id
                    cumulativeFees
                    cumulativePnl
                }
            }`,
        variables: { gt: from, lte: to },
    };

    try {
        const response = await axios.post(config.graphqlEndpoint, query);
        return response.data.data.DayProducts;
    } catch (error) {
        console.error("Error fetching data from GraphQL API: ", error);
        throw error;
    }
}

module.exports = {
    fetchPoolData
};

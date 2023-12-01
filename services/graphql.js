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

async function fetch30DayFees() {
    const thirtyDaysAgo = Math.floor(new Date().getTime() / 1000) - 30 * 24 * 60 * 60;
    const query = {
        query: /* GraphQL */ `
            query ($gte: Float) {
                DayProducts(filter: {_operators: {date: {gte: $gte}}}, limit: 0) {
                    cumulativeFeesUsd
                }
            }`,
        variables: { gte: thirtyDaysAgo },
    };

    try {
        const response = await axios.post(config.graphqlEndpoint, query);
        const totalFees = response.data.data.DayProducts.map(product => product.cumulativeFeesUsd)
                            .reduce((acc, curr) => acc + curr, 0);
        return totalFees * 0.35; //UNIDX fee share
    } catch (error) {
        console.error("Error fetching 30-day fees from GraphQL API: ", error);
        throw error;
    }
}

module.exports = {
    fetchPoolData,
    fetch30DayFees
};
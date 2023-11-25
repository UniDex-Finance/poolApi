const Web3 = require('web3');

function toChecksumAddress(address) {
    return Web3.utils.toChecksumAddress(address);
}

function formatNumber(number, scaleFactor, decimalPlaces) {
    const scaledNumber = Number(number) / scaleFactor;
    return scaledNumber.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
}

module.exports = {
    toChecksumAddress,
    formatNumber
};

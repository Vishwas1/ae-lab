const formatBech32 = (
    address,
    longForm = false,
    length = 4,
    start = 4
) => {
    if (!address) {
        return `Address Not Found`
    } else if (address.indexOf(`1`) === -1) {
        return `Not A Valid Bech32 Address`
    } else if (longForm) {
        return address
    } else {
        return (
            address.split(`1`)[0] +
            address.slice(3, 3 + start) +
            `…` +
            address.slice(-1 * length)
        )
    }
}
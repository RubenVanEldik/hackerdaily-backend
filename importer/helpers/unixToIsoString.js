/**
 * unixToIsoString - Return an ISO datestring from a timestamp
 *
 * @param {Integer!} timestamp Unix timestamp
 *
 * @return {String} ISO-8601 datetime string
 */
module.exports = timestamp => {
  return timestamp && !isNaN(timestamp)
    ? new Date(timestamp * 1000).toISOString()
    : null
}

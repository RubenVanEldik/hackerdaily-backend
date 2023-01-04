const fetch = require('node-fetch')
require('dotenv').config()

/**
 * sendHeartbeat - Send a heartbeat to the monitoring service
 *
 * @return {null}
 */
const sendHeartbeat = async () => {
  if (process.env.BETTER_UPTIME_HEARTBEAT_KEY) {
    await fetch(`https://betteruptime.com/api/v1/heartbeat/${process.env.BETTER_UPTIME_HEARTBEAT_KEY}`)
  }
}

module.exports = sendHeartbeat

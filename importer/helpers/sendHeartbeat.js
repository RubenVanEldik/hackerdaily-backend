const fetch = require('node-fetch')
require('dotenv').config()

/**
 * sendHeartbeat - Send a heartbeat to the monitoring service
 *
 * @return {null}
 */
const sendHeartbeat = async () => {
  if (process.env.BETTER_UPTIME_HEARTBEAT_KEY) {
    try {
      await fetch(`https://betteruptime.com/api/v1/heartbeat/${process.env.BETTER_UPTIME_HEARTBEAT_KEY}`)
    } catch (error) {
      console.error('Error sending heartbeat:', error)
    }
  }
}

module.exports = sendHeartbeat

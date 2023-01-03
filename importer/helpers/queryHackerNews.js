const fetch = require('node-fetch')
require('dotenv').config()

/**
 * queryHackerNews - Fetch data from the HN API
 *
 * @param {String!} query The query for the HN API
 *
 * @return {Object} The data from the Hacker News server
 */
const queryHackerNews = async query => {
  try {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/${query}.json`)
    const json = await response.json()
    return json
  } catch (error) {
    // If there was a 'FetchError', try again, otherwise return undefined
    if (error.name === 'FetchError') {
      console.error('There was a fetch error for Hacker News')
      return await queryHackerNews(query)
    }
    console.error(error)
  }
}

module.exports = queryHackerNews

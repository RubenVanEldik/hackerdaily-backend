const fetch = require('node-fetch')
require('dotenv').config()

const fetchItemsToFetch = require('./helpers/fetchItemsToFetch')
const fetchOldestSavedItem = require('./helpers/fetchOldestSavedItem')
const queryHackerNews = require('./helpers/queryHackerNews')
const sendHeartbeat = require('./helpers/sendHeartbeat')
const upsertItem = require('./helpers/upsertItem')
const upsertUser = require('./helpers/upsertUser')

/**
  * waitUntilHackerDailyIsLive - Only return when the HackerDaily backend is available
  *
  * @return {void}
  */
const waitUntilHackerDailyIsLive = async () => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/healthz`)

    if (await response.text() !== 'OK') {
      throw new Error()
    }
  } catch (err) {
    console.log('The HackerDaily backend is not yet available')

    // Wait 2 seconds and try again
    await new Promise(resolve => setTimeout(resolve, 2000))
    await waitUntilHackerDailyIsLive()
  }
}

/**
  * fetchNewItems - Fetch all items that have been added since the last update
  *
  * @return {void}
  */
const importNewItems = async () => {
  // Fetch an array of all new items
  const itemsToFetch = await fetchItemsToFetch()
  console.log(`${itemsToFetch.length} new items`)

  // Loop over all new item IDs
  for (const itemId of itemsToFetch) {
    const item = await upsertItem(itemId)

    // Update to the console
    if (item) {
      const percentageDone = ((itemId - itemsToFetch[0]) / itemsToFetch.length * 100).toFixed(3)
      console.log(`${item.type.padEnd(7)} - ${item.id} (${percentageDone}%)`)
    }
  }
  console.log('Up to date!')
}

/**
 * randomTimeout - Wait a random amount of time before executing the function
 * to decrease the peak load on the back-end
 *
 * @param {Function} fn Function to call after timeout
 * @param {*} variable Variables for function
 *
 * @return {Result of fn} The invoked function
 */
const randomTimeout = async (fn, variable) => {
  const time = Math.random() * 20000
  await new Promise(resolve => setTimeout(resolve, time))
  return fn(variable)
}

/**
  * updateItems - Update all updated items that already exist in the HackerDaily back-end
  *
  * @return {void}
  */
let previousUpdates
const updateItems = async () => {
  const updates = await queryHackerNews('updates')

  // Check if the updates have already been processed
  if (JSON.stringify(updates) === previousUpdates) return
  previousUpdates = JSON.stringify(updates)

  const oldestSavedItem = await fetchOldestSavedItem()
  const relevantItems = updates.items.filter(itemId => itemId >= oldestSavedItem)

  await Promise.all([
    ...updates.profiles.map(profile => randomTimeout(upsertUser, profile)),
    ...relevantItems.map(item => randomTimeout(upsertItem, item))
  ])

  console.log(`Updated ${updates.items.length} items and ${updates.profiles.length} users`)
  sendHeartbeat()
}

(async function () {
  // Wait until the HackerDaily backend is available
  await waitUntilHackerDailyIsLive()

  // Import (almost) all missing items and simultaniously start the update loop
  importNewItems()
  setInterval(updateItems, 25000)
})()

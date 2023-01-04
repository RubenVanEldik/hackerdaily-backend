const queryHackerNews = require('./queryHackerNews')
const queryHackerDaily = require('./queryHackerDaily')

const query = `
  query ($aWeekAgo: timestamptz!) {
    stories(order_by: {id: asc}, where: {posted_at: {_gte: $aWeekAgo}}) {
      id
    }
    comments(order_by: {id: asc}, where: {posted_at: {_gte: $aWeekAgo}}) {
      id
    }
  }
`

/**
 * fetchItemsToFetch - Return the items between the last item in the HackerDaily backend and the newest item on Hacker News
 *
 * @return {Array} Array with all new post IDs
 */
module.exports = async () => {
  const maxNewItem = await queryHackerNews('maxitem')

  if (!maxNewItem || typeof maxNewItem !== 'number') {
    throw new Error('Max item on HN is not defined')
  }

  // Calculate the time a week ago
  const today = new Date()
  const aWeekAgo = new Date(today.setTime(today.getTime() - (7 * 24 * 60 * 60 * 1000)))

  // Query the IDs of all stored stories and comments in the last week
  const { stories, comments } = await queryHackerDaily(query, { aWeekAgo })

  // Get a list with all item IDs from last week and get the first item ID of last week
  const itemIdsFromLastWeek = [...stories.map(({ id }) => id), ...comments.map(({ id }) => id)]
  const firstItemFromLastWeek = itemIdsFromLastWeek.length ? Math.min(...itemIdsFromLastWeek) : 0

  // Get the ID of the first item that should be fetched
  const firstItemToFetch = Math.max(firstItemFromLastWeek, maxNewItem - Math.pow(10, 5)) + 1

  // Check which items from the last week are not stored yet
  const itemsToFetch = []
  for (let i = firstItemToFetch; i <= maxNewItem; i++) {
    if (!itemIdsFromLastWeek.includes(i)) {
      itemsToFetch.push(i)
    }
  }

  // Return a list with the item IDs that should be fetched
  return itemsToFetch
}

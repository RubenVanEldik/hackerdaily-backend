const queryHackerNews = require('./queryHackerNews')
const queryHackerDaily = require('./queryHackerDaily')

const query = `
{
  stories(order_by: {id: desc}, limit: 1) {
    id
  }
  comments(order_by: {id: desc}, limit: 1) {
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

  // Query the most recent story and comment
  const { stories: [lastStory], comments: [lastComment] } = await queryHackerDaily(query)

  // Get the ID of the first item that should be fetched
  const maxNumberOfItemsToFetch = 75000
  const firstItemToFetch = Math.max(lastStory.id ?? 0, lastComment.id ?? 0, maxNewItem - maxNumberOfItemsToFetch) + 1

  const itemsToFetch = []
  for (let i = firstItemToFetch; i <= maxNewItem; i++) {
    if (!items.includes(i)) itemsToFetch.push(i)
  }

  return itemsToFetch
}

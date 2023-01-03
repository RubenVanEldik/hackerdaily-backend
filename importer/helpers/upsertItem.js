const queryHackerNews = require('./queryHackerNews')
const upsertUser = require('./upsertUser')
const upsertStory = require('./upsertStory')
const upsertComment = require('./upsertComment')

/**
 * fetchAndUpsertItem - Fetch the item and upsert the user (if any) and the story or comment
 *
 * @param {Object!} itemId ID of the item to be fetched and upserted
 *
 * @return {void}
 */
module.exports = async itemId => {
  // Fetch the item and skip if the item is null
  const item = await queryHackerNews(`item/${itemId}`)
  if (item === null) return

  // Create or update the user
  if (item.by) await upsertUser(item.by)

  // Create or update the story or comment
  if (item.type === 'story') await upsertStory(item)
  else if (item.type === 'comment') await upsertComment(item)

  return item
}

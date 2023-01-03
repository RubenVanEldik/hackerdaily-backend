const queryHackerDaily = require('./queryHackerDaily')

const query = `
  query ($id: Int!) {
    story(id: $id) {
      id
    }
    comment(id: $id) {
      id
      story_id
    }
  }
`

/**
 * fetchAscendants - Return the story ID and comment ID of a specific item
 *
 * @param {Integer} id Item ID
 *
 * @return {Object} Object with the story ID  and parent comment ID
 */
module.exports = async parentId => {
  // Check if parent item is a story or comment
  const { story, comment } = await queryHackerDaily(query, { id: parentId })

  // Return the appropriate IDs, if the parent is neither a story or comment it is not saved in our database
  if (story) return { story: parentId, parentComment: null }
  if (comment) return { story: comment.story_id, parentComment: parentId }
  return { story: null, parentComment: null }
}

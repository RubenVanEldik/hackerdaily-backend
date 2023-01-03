const Sentiment = require('sentiment')
const queryHackerDaily = require('./queryHackerDaily')
const fetchAscendants = require('./fetchAscendants')
const unixToIsoString = require('./unixToIsoString')

var sentiment = new Sentiment()

const upsertQuery = `
  mutation ($comment: comments_insert_input!) {
    insert_comment(object: $comment, on_conflict: {constraint: comments_pkey, update_columns: [text, user_id, story_id, parent_comment_id, sentiment]}) {
      id
      imported_at
      updated_at
    }
  }
`

const incrementAscendantQuery = `
  mutation ($id: Int!) {
    update_comment(pk_columns: {id: $id}, _inc: {descendants: 1}) {
      parent_comment_id
    }
  }
`

/**
 * measureSentiment - Estimate the amount of positivity in a comment
 *
 * @param {String} text The text of the comment
 *
 * @return {Number} The amount of positivite sentiment
 */
const measureSentiment = (text) => {
  if (!text) return null

  // Remove quotes since they're not written by the commenter
  const cleanedText = text
    .split('<p>')
    .filter(sentence => !sentence.startsWith('&gt;'))
    .join(' ')
    .replace(/&#x27;/g, '\'')

  const { comparative } = sentiment.analyze(cleanedText)
  return Math.min(Math.max(comparative + 1, 0.5), 1.5)
}

/**
 * incrementAscendants - Increment the descendants of the comment and
 * recursively for all parent comments as well
 *
 * @param {Integer} id The comment that needs to be updated
 *
 * @return {void}
 */
const incrementAscendants = async id => {
  const response = await queryHackerDaily(incrementAscendantQuery, { id })
  const parentCommentId = response?.update_comment.parent_comment_id
  if (parentCommentId) incrementAscendants(parentCommentId)
}

/**
  * upsertComment - Create or update a comment in the HackerDaily back-end
  *
  * @param {object} comment Comment that gets created/updated
  *
  * @return {void}
  */
module.exports = async ({ id, by, text, parent, time, deleted = false, dead = false }) => {
  const { story, parentComment } = await fetchAscendants(parent)
  if (!story) return

  const comment = {
    id,
    text,
    deleted,
    dead,
    length: text ? text.split(' ').length : null,
    sentiment: measureSentiment(text),
    user_id: by,
    story_id: story,
    parent_comment_id: parentComment,
    posted_at: unixToIsoString(time)
  }

  const response = await queryHackerDaily(upsertQuery, { comment })
  const upsertedComment = response?.insert_comment

  // Increment the descendants field of all the ascendants of the comment
  // if its a new comment
  if (parentComment && upsertedComment.imported_at === upsertedComment.updated_at) {
    incrementAscendants(parentComment)
  }
}

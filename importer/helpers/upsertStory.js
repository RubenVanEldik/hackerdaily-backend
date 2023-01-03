const queryHackerDaily = require('./queryHackerDaily')
const unixToIsoString = require('./unixToIsoString')

const storyQuery = `
  mutation ($story: stories_insert_input!) {
    insert_story(object: $story, on_conflict: {constraint: stories_pkey, update_columns: [user_id, title, text, url, score, descendants, dead]}) {
      id
    }
  }
`

/**
  * upsertStory - Create or update a story in the HackerDaily back-end
  *
  * @param {Object} item Story that gets created/updated
  *
  * @return {void}
  */
module.exports = async ({ id, by, title, text, url = null, score, descendants, dead, time }) => {
  const story = {
    id,
    user_id: by,
    title,
    text,
    url,
    score,
    descendants,
    dead,
    posted_at: unixToIsoString(time)
  }

  await queryHackerDaily(storyQuery, { story })
}

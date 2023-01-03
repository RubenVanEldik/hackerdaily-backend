const queryHackerNews = require('./queryHackerNews')
const queryHackerDaily = require('./queryHackerDaily')
const unixToIsoString = require('./unixToIsoString')

const query = `
  mutation ($id: String!, $about: String, $karma: Int!, $joinedAt: timestamptz!) {
    insert_user(object: {id: $id, about: $about, karma: $karma, joined_at: $joinedAt}, on_conflict: {constraint: users_pkey, update_columns: [about, karma]}) {
      id
      about
      karma
      joined_at
    }
  }
`

/**
 * upserUser - Check if the user exists and if not create a new user
 *
 * @param {String} userId The username
 *
 * @return {void}
 */
module.exports = async userId => {
  const user = await queryHackerNews(`user/${userId}`)

  if (user) {
    const { id, about, karma, created } = user
    const joinedAt = unixToIsoString(created)

    await queryHackerDaily(query, { id, about, karma, joinedAt })
  }
}

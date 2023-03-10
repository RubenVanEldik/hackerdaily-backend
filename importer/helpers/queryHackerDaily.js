const { GraphQLClient } = require('graphql-request')
require('dotenv').config()

const backendUrl = `${process.env.BACKEND_URL}/v1/graphql`
const client = new GraphQLClient(backendUrl, {
  headers: {
    'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
  }
})

/**
 * queryHackerDaily - Fetch or mutate data on the HackerDaily server
 *
 * @param {GQL String!} query GQL query
 * @param {Object} variables Optional object with GQL variables
 *
 * @return {Object} The data from the HackerDaily server
 */
const queryHackerDaily = async (query, variables) => {
  try {
    const response = await client.request(query, variables)
    return response
  } catch (error) {
    // If there was a 'FetchError', try again, otherwise return undefined
    if (['FetchError', 'ClientError'].includes(error.name)) {
      console.error(`There was a '${error.name}' when querying HackerDaily`)
      return await queryHackerDaily(query, variables)
    }
    console.error(error)
  }
}

module.exports = queryHackerDaily

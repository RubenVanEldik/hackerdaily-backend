const queryHackerDaily = require('./queryHackerDaily')

const query = `
  {
    stories_aggregate {
      aggregate {
        min {
          id
        }
      }
    }
    comments_aggregate {
      aggregate {
        min {
          id
        }
      }
    }
  }
`

module.exports = async () => {
  const result = await queryHackerDaily(query)

  const oldestStory = result.stories_aggregate.aggregate.min.id
  const oldestComment = result.stories_aggregate.aggregate.min.id

  return Math.min(oldestStory, oldestComment) || 0
}

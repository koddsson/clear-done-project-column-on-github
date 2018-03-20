const {GraphQLClient} = require('graphql-request')

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`
  }
})

const query = `{
  organization(login: "github") {
    project(number: 225) {
      columns(last:1) {
        edges {
          node {
            name
            cards(first:100) {
              nodes {
                id
              }
            }
          }
        }
      }
    }
  }
}`

const deleteCardMutation = `
mutation DeleteProjectCard($input: DeleteProjectCardInput!) {
  deleteProjectCard(input: $input) {
    deletedCardId
  }
}`
;(async function() {
  const data = await client.request(query)
  const column = data.organization.project.columns.edges[0].node
  const cardIds = column.cards.nodes.map(node => node.id)

  if (!column.name.includes === 'Done') {
    console.log('Got the wrong column, exiting')
    return
  }

  console.log(`Found the correct column, proceeding to delete ${cardIds.length} cards`)

  for (const id of cardIds) {
    const results = await client.request(deleteCardMutation, {input: {cardId: id}})
    console.log(results)
  }
})()

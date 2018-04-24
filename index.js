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
                note
                content {
                  ... on PullRequest {
                    title
                    url
                  }
                  ... on Issue {
                    title
                    url
                  }
                }
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

  const cards = {notes: [], links: []}
  for (const node of column.cards.nodes) {
    if (node.note) {
      cards.notes.push(node.note)
    } else {
      cards.links.push({
        title: node.content.title,
        url: node.content.url
      })
    }
    await client.request(deleteCardMutation, {input: {cardId: node.id}})
  }

  // TODO: Input current datetime here
  console.log('# This weeks report')
  console.log('### Finished notes')
  for (const note of cards.notes) {
    console.log(`- ${note}`)
  }

  console.log('---')

  console.log('### Finished issues and pull requests')
  // TODO: Reverse this list
  for (const link of cards.links) {
    console.log(`- [${link.title}](${link.url})`)
  }
})()

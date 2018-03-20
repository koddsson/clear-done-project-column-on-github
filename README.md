# clear-done-project-column-on-github

Very simple GraphQL script that will take all the cards in a colum that has 'Done' in its name and deletes them. Useful for cleaning out your board.

## How to use

Export a GitHub token as `GRAPHQL_TOKEN` and run `npm start`. 

## ⚠️ Warning ⚠️

This is a quick and dirty script I threw together for my own use-case. Please make sure you add a `return` before the scripts starts deleting stuff and verify that you want to delete all those cards.

Don't complain to me if you run this without doing some precautions 💁‍♀️

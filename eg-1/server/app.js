const express = require('express');
const {graphqlHTTP} = require('express-graphql');

const schema = require('./schema/schema')

const app = express()
const PORT = 4343;

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
})

const { ApolloServer, gql } = require('apollo-server');
const fs = require(`fs`);
const path = require(`path`);

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// HackerNewsのfeed
let links = [
  {
    id: 'link-0',
    description: 'GraphQLチュートリアルをUdemyで学ぶ',
    url: 'www.udemy-graphql-tutorial.com',
  },
];

const resolvers = {
  Query: {
    info: () => 'HackerNewsクローン',
    feed: () => links,
  },

  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);
      return link;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`${url}でサーバを起動中・・・`));

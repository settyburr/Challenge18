import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs } from '../src/typeDefs/typeDefs.js';
import resolvers from '../src/typeDefs/resolvers.js';
import { error } from 'node:console';
import { IncomingHttpHeaders } from 'node:http';



const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  await server.start();

  app.use(
    '/graphql',
    cors(), 
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || ''; 
        return { token };
      },
    })
  );
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

startApolloServer().catch((error) => console.error(error));

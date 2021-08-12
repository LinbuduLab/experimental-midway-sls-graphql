import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessFunction,
  ServerlessTriggerType,
  Query,
  ALL,
} from '@midwayjs/decorator';
import { Context, FaaSHTTPContext } from '@midwayjs/faas';
import { GraphQLService } from '../lib/core';
import { RenderPlaygroundQueryOptions } from '../typing';
import { gql } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { ApolloServer } from '../lib/apollo';

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String): User
  }
  type User {
    name: String
    username: String
  }
`;
const users = [
  { name: 'Leeroy Jenkins', username: 'leeroy' },
  { name: 'Foo Bar', username: 'foobar' },
];

const resolvers = {
  Query: {
    users() {
      return users;
    },
    user(parent, { username }) {
      return users.find(user => user.username === username);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

@Provide()
export class HelloHTTPService {
  @Inject()
  ctx: Context;

  @Inject()
  graphql: GraphQLService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/graphql',
    method: 'get',
  })
  async graphqlPlaygroundHandler(
    @Query(ALL) playgroundOptions: RenderPlaygroundQueryOptions
  ) {
    console.log(this.ctx);
    return await this.graphql.playground(this.ctx, playgroundOptions);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/graphql',
    method: 'post',
  })
  async graphqlHandler() {
    return this.graphql.handler(this.ctx);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/micro',
    method: 'get',
  })
  async apolloHandler() {
    const server = new ApolloServer({ schema });
    await server.start();
    return server.createHandler({
      path: '/micro',
      req: this.ctx.request,
      res: this.ctx.response,
    });
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/micro',
    method: 'post',
  })
  async apolloPostHandler() {
    const server = new ApolloServer({ schema });
    await server.start();
    return server.createHandler({
      path: '/micro',
      req: this.ctx.request,
      res: this.ctx.response,
    });
  }
}

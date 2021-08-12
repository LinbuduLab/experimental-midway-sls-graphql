import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessFunction,
  ServerlessTriggerType,
  Query,
  ALL,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { RenderPlaygroundQueryOptions } from '../typing';
import { ApolloServerMidway } from '../lib/apollo-server-midway';
import { GraphQLService } from '../lib/core';
import { experimentHandler } from '../lib/apollo-wrapper';
import {
  APOLLO_SERVER_MIDWAY_PATH,
  DEPRECATED_HANDLER_PATH,
  ORIGIN_GRAPHQL_HANDLER_PATH,
  schema,
} from '../lib/constants';

@Provide()
export class HelloHTTPService {
  @Inject()
  ctx: Context;

  @Inject()
  graphql: GraphQLService;

  // Handled by Original GraphQL
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: ORIGIN_GRAPHQL_HANDLER_PATH,
    method: 'get',
  })
  async graphqlPlaygroundHandler(
    @Query(ALL) playgroundOptions: RenderPlaygroundQueryOptions
  ) {
    return await this.graphql.playground(this.ctx, playgroundOptions);
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: ORIGIN_GRAPHQL_HANDLER_PATH,
    method: 'post',
  })
  async graphqlHandler() {
    return this.graphql.handler(this.ctx);
  }

  // Handled by Apollo-Server-Midway + TypeGraphQL
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: APOLLO_SERVER_MIDWAY_PATH,
    method: 'get',
  })
  async apolloHandler() {
    return await experimentHandler({
      path: APOLLO_SERVER_MIDWAY_PATH,
      ...this.ctx,
    });
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: APOLLO_SERVER_MIDWAY_PATH,
    method: 'post',
  })
  async apolloPostHandler() {
    return await experimentHandler({
      path: APOLLO_SERVER_MIDWAY_PATH,
      ...this.ctx,
    });
  }

  // Handled by Apollo-Server-Midway + Splited `Schema Definition` & `Resolvers`
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: DEPRECATED_HANDLER_PATH,
    method: 'get',
  })
  async apolloHandlerDeprecated() {
    const server = new ApolloServerMidway({ schema });
    await server.start();
    return server.createHandler({
      path: DEPRECATED_HANDLER_PATH,
      req: this.ctx.request,
      res: this.ctx.response,
    });
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: DEPRECATED_HANDLER_PATH,
    method: 'post',
  })
  async apolloPostHandlerDeprecated() {
    const server = new ApolloServerMidway({ schema });
    await server.start();
    return server.createHandler({
      path: DEPRECATED_HANDLER_PATH,
      req: this.ctx.request,
      res: this.ctx.response,
    });
  }
}

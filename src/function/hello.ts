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

import { ApolloServer } from '../lib/apollo';
import { GraphQLService } from '../lib/core';
import { createApolloServer } from '../lib/apollo-wrapper';
import { schema } from '../lib/tmp-schema';

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
    path: '/apollo',
    method: 'get',
  })
  async apolloHandler() {
    return await createApolloServer({
      path: '/apollo',
      ...this.ctx,
    });
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/apollo',
    method: 'post',
  })
  async apolloPostHandler() {
    return await createApolloServer({
      path: '/apollo',
      ...this.ctx,
    });
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/deprecated',
    method: 'get',
  })
  async apolloHandlerDeprecated() {
    const server = new ApolloServer({ schema });
    await server.start();
    return server.createHandler({
      path: '/deprecated',
      req: this.ctx.request,
      res: this.ctx.response,
    });
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/deprecated',
    method: 'post',
  })
  async apolloPostHandlerDeprecated() {
    const server = new ApolloServer({ schema });
    await server.start();
    return server.createHandler({
      path: '/deprecated',
      req: this.ctx.request,
      res: this.ctx.response,
    });
  }
}

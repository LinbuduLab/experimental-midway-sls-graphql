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
import { GraphQLService } from '../lib/core';
import { experimentalCreateHandler } from '../lib/create-apollo-handler';
import {
  APOLLO_SERVER_MIDWAY_PATH,
  ORIGIN_GRAPHQL_HANDLER_PATH,
} from '../lib/constants';

const apolloHandlerFuncName = 'apollo-handler';
const graphqlHandlerFuncName = 'graphql-handler';

@Provide()
export class HelloHTTPService {
  @Inject()
  ctx: Context;

  @Inject()
  graphql: GraphQLService;

  @ServerlessFunction({
    functionName: graphqlHandlerFuncName,
  })
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

  @ServerlessFunction({
    functionName: apolloHandlerFuncName,
  })
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: APOLLO_SERVER_MIDWAY_PATH,
    method: 'get',
  })
  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: APOLLO_SERVER_MIDWAY_PATH,
    method: 'post',
  })
  async apolloHandler() {
    return await experimentalCreateHandler({
      path: '/apollo',
      context: this.ctx,
    });
  }
}

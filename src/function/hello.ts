import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
  ALL,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { GraphQLService } from '../lib/core';
import { RenderPlaygroundQueryOptions } from '../typing';

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
}

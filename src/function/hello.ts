import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { GraphQLService } from '../service/GraphQLService';

@Provide()
export class HelloHTTPService {
  @Inject()
  ctx: Context;

  @Inject()
  graphql: GraphQLService;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/',
    method: 'get',
  })
  async handleHTTPEvent(@Query() name = 'midwayjs') {
    return `Hello ${name}！！`;
  }

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/graphql',
    method: 'get',
  })
  async graphqlHandler() {
    return this.graphql.endpoint(this.ctx);
  }
}

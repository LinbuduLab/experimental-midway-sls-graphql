import { Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { join } from 'path';
import { GraphQLService } from './service/GraphQLService';

@Configuration({
  // imports: ['tgql'],
  importConfigs: [join(__dirname, './config/')],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  async onReady(container: IMidwayContainer) {
    container.registerObject('graphql', new GraphQLService());
  }
}

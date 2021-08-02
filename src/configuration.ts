import { Configuration, listModule } from '@midwayjs/decorator';
import {
  ILifeCycle,
  IMidwayApplication,
  IMidwayContainer,
} from '@midwayjs/core';
import { join } from 'path';
import { GraphQLService } from './lib/core';

const CONTEXT_DECORATOR_KEY = 'decorator:graphql:ctx';

@Configuration({
  importConfigs: [join(__dirname, './config/')],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  async onReady(container: IMidwayContainer, app: IMidwayApplication) {
    const graphql = new GraphQLService(container, app);
    container.registerObject('graphql', graphql);
    this.injectDecorators();
  }

  private injectDecorators() {
    // const modules = listModule(CONTEXT_DECORATOR_KEY);
    // console.log('modules: ', modules);
    // for (const mod of modules) {
    //   console.log('mod: ', mod);
    //   // 实现自定义能力
    //   // 从 mod 上拿元数据，做不同的处理
    //   // 提前初始化等 app.applicationContext.getAsync(getProviderId(mod));
    // }
  }
}

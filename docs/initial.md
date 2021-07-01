# Midway-FaaS + TypeGraphQL

```typescript
// 创建 GraphQLService 实例 并注册到Midway容器中
@Configuration({
  namespace: "graphql",
  importConfigs: ["./config/"],
})
export class ContainerConfiguration implements ILifeCycle {
  async onReady(container: IMidwayContainer): Promise<void> {
    const graphql = new GraphQLService(container);

    container.registerObject("graphql", graphql);
  }
}

// 使用
  @Inject()
  ctx: FaasContext;

  @Inject()
  graphql: GraphQLService;

  @Func('your.function.handler')
  async index() {
    return this.graphql.endpoint(this.ctx);
  }
```



配置：

这里可以应该可以支持传入tql的配置？

- 提供一批默认配置
- playground的配置！
- useMock的mock能力，by msw？
- Query Complexity配置？
- Voyager配置？
- Prisma配置？
- 自带的Container配置？
- Apollo-server-vercel ？
- AuthChecker？

```typescript
export = {
  graphql: {
    resolvers: 'resolver/*.js',
    playground: true,
    useMock: false,
  },
};
```



```typescript
// 这个意思是GraphQL的Context实际上就来自于FaaSContext？
export interface GraphQLContext extends FaaSContext {
  logger: Logger;
}

// 这里应该可以做脱敏啥的？
const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
  try {
    return await next();
  } catch (err) {
    console.error(err);
    // rethrow the error
    throw err;
  }
};
```



```typescript
@Provide()
export class GraphQLService {
  private config: GraphQLConfiguration;

  _schema?: GraphQLSchema;

  constructor(container: IMidwayContainer) {
    this.config = container.getConfigService().getConfiguration('graphql');

    this._init();
  }

  private _init() {
    if (this.config.resolvers) {
      // 如果配置了resolvers 就从配置的去找
      let schema = buildSchemaSync({
        resolvers: [path.resolve(__dirname, this.config.resolvers)],
        dateScalarMode: 'timestamp',
        container: () => {
          return {
            // TODO: 这个是啥？
            // TypeGraphQL 的container API + FaaSContext？
            get: (target: any, data: ResolverData<GraphQLContext>) => {
              return data.context.requestContext.resolve(target);
            },
          };
        },
        globalMiddlewares: [ErrorInterceptor],
      });
      // mock这个是？不会去基于resolver创建了？这个的意义是？
      // 来自于Graphql-faker，应该是可以被msw替代的
    //   if (this.config.useMock) {
    //     schema = buildWithFakeDefinitions(new Source(printSchema(schema)));
    //   }
      this._schema = schema;
    }
  }

  get schema() {
    if (!this._schema) {
      throw new Error('GraphQL schema is undefined.');
    }
    return this._schema;
  }

  /

  async endpoint(ctx: FaaSContext) {
    // 这个配置应当是可以只获取一次的？
    const options: GraphQLConfiguration = ctx.requestContext.getConfigService().getConfiguration('graphql');
    // 这个不用也判断下路径吗，是因为tql不能配url？那能不能给faas支持这个能力
    if (ctx.req.method === 'GET' && options.playground) {
      ctx.type = 'html';
      // 渲染playground返回
      ctx.body = await renderPlaygroundPage({
        workspaceName: 'playground',
        settings: {
          'request.credentials': 'include',
        } as ISettings,
      });
      return;
    }
    let body = ctx.req.body
    // 为了兼容阿里云faas，对body做一个解析
    if (body) {
      try {
        body = JSON.parse(body)
      } catch (e) {

      }
    }


    // query语句和query变量
    const { query, variables } = body;

    if (!this.schema || !Object.keys(this.schema).length) {
      throw new Error('[graphql endpoint] GraphQLSchema import fail, please inject schema to your index.ts');
    }

    // const loggerService = this.container.get<LoggerService>('log4js:logger');

    // ctx.logger = loggerService.create(ctx);

    // POST、无body，走mock
    if (this.config.useMock) {
      return await graphql({
       
      });
    }

    // POST、有body，走正常响应
    // 这是执行方法
    return await graphql({
      schema: this.schema,
      source: query,
      variableValues: variables,
      contextValue: ctx,
    });
  }
}
```



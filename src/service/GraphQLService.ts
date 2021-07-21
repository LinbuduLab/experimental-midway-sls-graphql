import { Provide, Inject } from '@midwayjs/decorator';
import { graphql, GraphQLSchema, printSchema, Source } from 'graphql';
import { Context as FaaSContext } from '@midwayjs/faas';
import * as path from 'path';
import {
  buildSchemaSync,
  Maybe,
  MiddlewareFn,
  ResolverData,
} from 'type-graphql';

export interface GraphQLContext extends FaaSContext {
  __key__: never;
}

@Provide()
export class GraphQLService {
  _schema?: GraphQLSchema;

  constructor() {
    this._init();
  }

  private _init() {
    this._schema = buildSchemaSync({
      resolvers: [path.resolve(__dirname, 'resolver/*')],
      container: () => {
        console.log('container init');
        return {
          get: (target: any, data: ResolverData<GraphQLContext>) => {
            return data.context.requestContext.resolve(target);
          },
        };
      },
    });
  }

  get schema(): GraphQLSchema {
    return this._schema;
  }

  async endpoint(ctx: FaaSContext) {
    let body = ctx.req.body;
    if (body) {
      body = JSON.parse(body);
      console.log('body: ', body);
    }

    const { query, variables } = body;

    // console.log('this.schema: ', this.schema.getTypeMap()['T']);
    // console.log('this.schema: ', this.schema);
    // console.log('this.schema: ', this.schema.getQueryType());
    // console.log('this.schema: ', this.schema.());

    return await graphql({
      schema: this.schema,
      source: query,
      variableValues: variables,
      contextValue: ctx,
    });
  }
}

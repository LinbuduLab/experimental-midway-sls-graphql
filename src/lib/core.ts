import { graphql, GraphQLSchema, printSchema, Source } from 'graphql';
import { Context as FaaSContext } from '@midwayjs/faas';
import * as path from 'path';
import { buildSchemaSync, ClassType, Maybe, ResolverData } from 'type-graphql';
import { midwayFaaSPlayground } from './playground-faas';
import { ErrorInterceptor } from './error-interceptor';

import { PluginConfig, RenderPlaygroundQueryOptions } from '../typing';
import { IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
import { buildWithFakeDefinitions } from '../lib/mock/def';
import { fakeFieldResolver, fakeTypeResolver } from '../lib/mock/schema';

export interface GraphQLContext extends FaaSContext {
  __key__: never;
}

export class GraphQLService {
  _schema?: GraphQLSchema;
  config: PluginConfig;

  constructor(_container: IMidwayContainer, app: IMidwayApplication) {
    this.config = app.getConfig('faasGraphQLConfig');

    this._init();
  }

  private _init() {
    const schema = this.buildGraphQLSchema();
    this._schema = this.config.mock
      ? this.useFakerExtendedSchema(schema)
      : schema;
  }

  private useFakerExtendedSchema(schema: GraphQLSchema) {
    const extendedSchema = buildWithFakeDefinitions(
      new Source(printSchema(schema))
    );
    return extendedSchema;
  }

  private buildGraphQLSchema() {
    return buildSchemaSync({
      resolvers: [path.resolve(__dirname, 'resolver/*')],
      dateScalarMode: 'timestamp',

      globalMiddlewares: [ErrorInterceptor],
      container: () => {
        return {
          get: (target: ClassType, data: ResolverData<GraphQLContext>) => {
            // or resolve
            return data.context.requestContext.getAsync(target);
          },
        };
      },
    });
  }

  get schema(): GraphQLSchema {
    return this._schema;
  }

  async handler(ctx: FaaSContext) {
    let body = ctx.req.body;
    if (body) {
      body = JSON.parse(body);
    }

    const { query, variables } = body;

    if (!this.schema || !Object.keys(this.schema).length) {
      throw new Error('[ Midway-FaaS-GraphQL ] Invalid Built GraphQLSchema');
    }

    return await graphql({
      schema: this.schema,
      source: query,
      variableValues: variables,
      contextValue: ctx,
    });
  }

  async fakeHandler(ctx: FaaSContext) {
    let body = ctx.req.body;
    if (body) {
      body = JSON.parse(body);
    }

    const { query, variables } = body;

    if (!this.schema || !Object.keys(this.schema).length) {
      throw new Error('[ Midway-FaaS-GraphQL ] Invalid Built GraphQLSchema');
    }

    return await graphql({
      schema: this.schema,
      typeResolver: fakeTypeResolver,
      fieldResolver: fakeFieldResolver,
      source: query,
      variableValues: variables,
    });
  }

  async playground(
    ctx: FaaSContext,
    renderOptions: RenderPlaygroundQueryOptions
  ) {
    return midwayFaaSPlayground({ editorOptions: renderOptions })(ctx);
  }

  async fakerEndPoint(
    query: string,
    variables: Maybe<{ [key: string]: any }>,
    source: string
  ) {
    const schema = buildWithFakeDefinitions(new Source(source));
    return await graphql({
      schema,
      typeResolver: fakeTypeResolver,
      fieldResolver: fakeFieldResolver,
      source: query,
      variableValues: variables,
    });
  }
}

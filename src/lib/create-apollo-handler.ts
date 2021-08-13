import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import path from 'path';
import { buildSchemaSync } from 'type-graphql';
import { CreateHandlerOption } from './types';
import { playgroundDefaultSettings } from './constants';
import { ApolloServerMidway } from './apollo-server-midway';
import { ResolveTimeExtensionMiddleware } from './resolve-time';
import { resolveTimeExtensionPlugin } from './resolve-time-extension';
import { queryComplexityExtensionPlugin } from './query-complexity-plugin';

export async function experimentalCreateHandler(option: CreateHandlerOption) {
  const schema = buildSchemaSync({
    resolvers: [path.resolve(__dirname, 'resolver/*')],
    globalMiddlewares: [ResolveTimeExtensionMiddleware],
    dateScalarMode: 'timestamp',
    ...option.schema,
  });

  const server = new ApolloServerMidway({
    schema,
    plugins: [
      // Auto disabled inside sls container?
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: playgroundDefaultSettings,
      }),
      resolveTimeExtensionPlugin(),
      queryComplexityExtensionPlugin(schema),
    ].filter(Boolean),
  });

  await server.start();
  return server.createHandler({
    path: option.path,
    context: option.context,
  });
}

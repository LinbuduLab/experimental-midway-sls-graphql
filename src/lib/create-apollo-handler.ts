import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import path from 'path';
import { buildSchemaSync } from 'type-graphql';
import { CreateExpHandlerOption } from './types';
import { playgroundDefaultSettings } from './constants';
import { ApolloServerMidway } from './apollo-server-midway';
import { ResolveTimeExtensionMiddleware } from './resolve-time';
import { resolveTimeExtensionPlugin } from './resolve-time-extension';

export async function experimentalCreateHandler(
  option: CreateExpHandlerOption
) {
  const schema = buildSchemaSync({
    resolvers: [path.resolve(__dirname, 'resolver/*')],
    globalMiddlewares: [ResolveTimeExtensionMiddleware],
    dateScalarMode: 'timestamp',
  });

  const server = new ApolloServerMidway({
    schema,
    plugins: [
      // Auto disabled inside sls container?
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: playgroundDefaultSettings,
      }),
      resolveTimeExtensionPlugin(),
    ],
  });

  await server.start();
  return server.createHandler({
    path: option.path,
    req: option.request,
    res: option.response,
  });
}

import {
  ApolloServerBase,
  GraphQLOptions,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import { parseAll } from '@hapi/accept';
import path from 'path';
import { graphqlCoreHandler } from './apollo-server-midway';
import { buildSchemaSync } from 'type-graphql';
import { LandingPage } from 'apollo-server-plugin-base';
import { ApolloContext, MidwayReq, MidwayRes } from './types';
import { Context } from '@midwayjs/faas';

export interface ServerRegistration {
  path?: string;
  req: MidwayReq;
  res: MidwayRes;
}

export async function createApolloServer(config: { path: string } & Context) {
  const schema = buildSchemaSync({
    resolvers: [path.resolve(__dirname, 'resolver/*')],
    dateScalarMode: 'timestamp',
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'editor.cursorShape': 'block',
          'editor.theme': 'dark',
          'editor.reuseHeaders': true,
          'tracing.hideTracingResponse': false,
          'queryPlan.hideQueryPlanResponse': false,
          'editor.fontSize': 14,
          'editor.fontFamily': 'Fira Code',
          'schema.polling.enable': true,
          'schema.polling.interval': 2000,
        },
      }),
    ],
  });

  await server.start();
  return server.createHandler({
    path: config.path,
    req: config.request,
    res: config.response,
  });
}

export class ApolloServer extends ApolloServerBase {
  async createGraphQLServerOptions(
    req: MidwayReq,
    res: MidwayRes
  ): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ req, res });
  }

  public async createHandler({ path, req, res }: ServerRegistration) {
    this.assertStarted('createHandler');

    this.graphqlPath = path || '/graphql';

    const landingPage = this.getLandingPage();

    if (
      landingPage &&
      this.handleGraphqlRequestsWithLandingPage({ req, res, landingPage })
    ) {
      return;
    }

    if (await this.handleGraphqlRequestsWithServer({ req, res })) {
      return;
    }
  }

  private handleGraphqlRequestsWithLandingPage({
    req,
    res,
    landingPage,
  }: ApolloContext & {
    landingPage: LandingPage;
  }): boolean {
    let handled = false;

    const url = req.url!.split('?')[0];
    if (req.method === 'GET' && url === this.graphqlPath) {
      const accept = parseAll(req.headers);
      const types = accept.mediaTypes as string[];
      const prefersHtml =
        types.find(
          (x: string) => x === 'text/html' || x === 'application/json'
        ) === 'text/html';

      if (prefersHtml) {
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.body = landingPage.html;
        handled = true;
      }
    }

    return handled;
  }

  private async handleGraphqlRequestsWithServer({
    req,
    res,
  }: ApolloContext): Promise<boolean> {
    let handled = false;
    const url = req.url!.split('?')[0];
    if (url === this.graphqlPath) {
      const graphqlHandler = graphqlCoreHandler(() => {
        return this.createGraphQLServerOptions(req, res);
      });
      await graphqlHandler(req, res);
      handled = true;
    }
    return handled;
  }
}

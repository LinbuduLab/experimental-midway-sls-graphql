import { ApolloServerBase, GraphQLOptions } from 'apollo-server-core';
import { parseAll } from '@hapi/accept';

import { graphqlCoreHandler } from './apollo-server-midway';

import { LandingPage } from 'apollo-server-plugin-base';
import { ApolloContext, MidwayReq, MidwayRes } from './types';

export interface ServerRegistration {
  path?: string;
  req: MidwayReq;
  res: MidwayRes;
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
    console.log('landingPage: ', landingPage?.html.length);

    // Use handler to split request
    // LandingPage 只会处理 GET graphql path
    if (
      landingPage &&
      this.handleGraphqlRequestsWithLandingPage({ req, res, landingPage })
    ) {
      console.log('Langing Page!');
      return;
    }
    if (await this.handleGraphqlRequestsWithServer({ req, res })) {
      console.log('Server Side!');
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

import { Context } from '@midwayjs/faas';

export type MidwayReq = Context['request'];
export type MidwayRes = Context['response'];

export type ApolloContext = {
  req: MidwayReq;
  res: MidwayRes;
};

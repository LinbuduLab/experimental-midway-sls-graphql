import { Context } from '@midwayjs/faas';

export type MidwayReq = Context['request'];
export type MidwayRes = Context['response'];

export type ApolloContext = {
  req: MidwayReq;
  res: MidwayRes;
};

export type CreateHandlerOption = ApolloContext & {
  path?: string;
  functionName?: string;
};

export type CreateExpHandlerOption = Context & {
  path?: string;
  functionName?: string;
};

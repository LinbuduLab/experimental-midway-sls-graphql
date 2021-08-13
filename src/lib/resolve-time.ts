import {
  MiddlewareFn,
  MiddlewareInterface,
  NextFn,
  ResolverData,
} from 'type-graphql';

export class ResolveTimeExtensionMiddleware implements MiddlewareInterface {
  async use({ info }: ResolverData, next: NextFn) {
    // extract `extensions` object from GraphQLResolveInfo object to get the `logMessage` value
    // const { logMessage } =
    //   info.parentType.getFields()[info.fieldName].extensions || {};

    // if (logMessage) {
    //   this.logger.log(logMessage);
    // }
    const start = Date.now();
    await next();
    const resolveTime = Date.now() - start;
    // console.log(info);
    // info.
    // info.returnType.extensions = {
    //   ext: 'xxx',
    //   resolveTime,
    // };
  }
}

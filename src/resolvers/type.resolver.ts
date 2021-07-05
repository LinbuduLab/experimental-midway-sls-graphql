import { Resolver, Query } from 'type-graphql';
import { T } from '../graphql/type';

@Resolver(type => T)
export class TResolver {
  @Query(type => T)
  QueryT(): T {
    return {
      X: 'xxx',
    };
  }
}

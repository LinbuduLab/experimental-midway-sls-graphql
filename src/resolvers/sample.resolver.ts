import { Provide, Inject } from '@midwayjs/decorator';
import { Resolver, Query } from 'type-graphql';
import { SampleService } from '../service/sample-service';
import { SampleType } from '../graphql/type';
import { GraphQLService } from '../lib/core';
import { Ctx, Tmp } from '../lib/decorators';

@Provide()
@Resolver(type => SampleType)
export class SampleResolver {
  @Inject()
  graphql: GraphQLService;

  @Ctx()
  @Tmp()
  xxx: string;

  @Inject()
  sampleService1: SampleService;

  @Query(type => SampleType)
  QuerySample(): SampleType {
    console.log(this.xxx);
    // console.log(this.graphql);
    // console.log(this.sampleService);
    return {
      SampleField: 'xxx',
    };
  }

  @Query()
  QueryContextValue(): string {
    // console.log(this.sampleService);
    // return this.
    return '';
  }
}

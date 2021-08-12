import { Provide, Inject, App } from '@midwayjs/decorator';
import { Resolver, Query, FieldResolver, Root } from 'type-graphql';
import { SampleService } from '../service/sample-service';
import { SampleType } from '../graphql/sample.type';
import { ChildType } from '../graphql/child.type';
import { GraphQLService } from '../lib/core';

@Provide()
@Resolver(type => SampleType)
export class SampleResolver {
  @Inject()
  graphql: GraphQLService;

  @Inject()
  sampleService1: SampleService;

  @Query(type => SampleType)
  QuerySample(): SampleType {
    return {
      SampleField: 'SampleField',
      Child: {
        ChildField: 'ChildField',
      },
    };
  }

  @FieldResolver(() => String)
  FieldQuerySample(@Root() sample: SampleType) {
    console.log('sample: ', sample);
    return `FieldQuerySample! ${sample.SampleField}`;
  }
}

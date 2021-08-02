import { Provide, Inject } from '@midwayjs/decorator';
import { Resolver, Query } from 'type-graphql';
import { SampleService } from '../service/sample-service';
import { SampleType } from '../graphql/type';

@Provide()
@Resolver(type => SampleType)
export class SampleResolver {
  // constructor(private readonly sampleService: SampleService) {}

  @Inject()
  sampleService1: SampleService;

  @Query(type => SampleType)
  QuerySample(): SampleType {
    // console.log(this.sampleService);
    return {
      SampleField: 'xxx',
    };
  }
}

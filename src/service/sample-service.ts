import { Provide } from '@midwayjs/decorator';

@Provide()
export class SampleService {
  sampleMethod() {
    return 'Sample!';
  }
}

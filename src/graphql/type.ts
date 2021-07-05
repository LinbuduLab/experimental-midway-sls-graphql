import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class T {
  @Field()
  X!: string;
}

import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from "./User"

export class Price {
  @prop({ ref: () => User, required: true })
  public counselorId!: Ref<User>;

  @prop()
  public chat?: number;

  @prop()
  public video?: number;

  @prop()
  public audio?: number;
}

const PriceModel = getModelForClass(Price);
export default PriceModel;

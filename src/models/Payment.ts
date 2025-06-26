import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

class Payment {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ ref: () => User, required: true })
  public counselorId!: Ref<User>;

  @prop({ required: true })
  public transaction_id!: string;

  @prop({ required: true })
  public payment_amount!: number;

  @prop({ default: Date.now })
  public payment_at!: Date;
}

const PaymentModel = getModelForClass(Payment, {
  schemaOptions: { timestamps: true }, 
});

export default PaymentModel;

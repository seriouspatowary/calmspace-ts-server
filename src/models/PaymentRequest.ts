import { prop, getModelForClass, Ref, modelOptions } from '@typegoose/typegoose';
import { User } from './User';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class PaymentRequest {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ ref: () => User })
  public counselorId!: Ref<User>;

  @prop({ required: true })
  public razorpay_order_id!: string;

  @prop({ required: true })
  public receipt!: string;

  @prop({ required: true })
  public payment_amount!: number;

  @prop({ default: 'created' })
  public status!: 'created' | 'pending' | 'paid' | 'failed';

  @prop()
  public currency?: string;
}

const PaymentRequestModel = getModelForClass(PaymentRequest);

export default PaymentRequestModel;

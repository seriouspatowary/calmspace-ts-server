import { prop, getModelForClass,Ref, modelOptions } from '@typegoose/typegoose';
import { User } from './User';


@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class PaymentResponse {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;
  
  @prop({ ref: () => User })
  public counselorId!: Ref<User>;

  @prop({ required: true })
  public transaction_id!: string; 
  
  @prop({ required: true })
  public razorpay_order_id!: string;

  @prop({ required: true })
  public razorpay_signature!: string;

  @prop({ required: true })
  public receipt!: string;

  @prop({ required: true })
  public payment_amount!: number; 

  @prop({ default: 'pending' })
  public status!: string;

  @prop({ default: Date.now })
  public payment_at!: Date;
}

const PaymentResponseModel = getModelForClass(PaymentResponse);

export default PaymentResponseModel;

import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { User } from "./User";

export class Transaction {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ required: true })
  public merchantTransactionId!: string;

  @prop({ required: true })
  public amount!: number; // in paise (e.g., 10000 = ₹100.00)

  @prop()
  public mobileNumber?: string;

  @prop({ enum: ["PENDING", "PAYMENT_SUCCESS", "PAYMENT_ERROR"], default: "PENDING" })
  public status!: "PENDING" | "PAYMENT_SUCCESS" | "PAYMENT_ERROR";

  @prop({ default: Date.now })
  public createdAt!: Date;

  @prop()
  public updatedAt?: Date;
}

const TransactionModel = getModelForClass(Transaction, {
  schemaOptions: { timestamps: true },
});

export default TransactionModel;

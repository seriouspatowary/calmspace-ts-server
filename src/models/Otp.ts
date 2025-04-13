import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  },
})
export class Otp {
  @prop({ required: true })
  email!: string;

  @prop({ required: true })
  otp!: string; // Store hashed OTP

  @prop({
    default: Date.now,
    expires: 300, // document expires after 300 seconds (5 mins)
  })
  created_at?: Date;
}

const OtpModel = getModelForClass(Otp);
export default OtpModel;
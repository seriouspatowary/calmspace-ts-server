import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from '../models/User'; 
import 'reflect-metadata';

export class VerificationMaster {
  @prop({ ref: () => User, required: true, unique: true })
  userId!: Ref<User>;

  @prop({ required: true })
  adminVerified!: boolean;

  @prop({ default: () => new Date() })
  createdAt!: Date;
}

// Create the model
const VerificationMasterModel = getModelForClass(VerificationMaster, {
  schemaOptions: { timestamps: true },
});
export default VerificationMasterModel
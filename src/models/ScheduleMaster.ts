import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from '../models/User';
import 'reflect-metadata';

export class ScheduleMaster {
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop({ required: true })
  scheduleAt!: Date;

  @prop({ type: () => [String], required: true })
  scheduleTimes!: string[];

  @prop({ default: () => new Date() })
  createdAt!: Date;

  @prop({ default: () => new Date() })
  updatedAt!: Date;
}

// Create the model
const ScheduleMasterModel = getModelForClass(ScheduleMaster, {
  schemaOptions: { timestamps: true }, // this will override manual createdAt/updatedAt
});

export default ScheduleMasterModel;

import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from '../models/User'; 

export class ProgressBar {
  @prop({ ref: () => User, required: true, unique: true })
  userId!: Ref<User>;

  @prop({ required: true })
  QuestionScore!: number;

  @prop({ default: 100 })
  counselorScore!: number;

  @prop({ default: () => new Date() })
  date!: Date;
}

const ProgressBarModel = getModelForClass(ProgressBar);
export default ProgressBarModel;

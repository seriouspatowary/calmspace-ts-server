import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from '../models/User'; 
import 'reflect-metadata';

export class VideoCallOrder{
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop({ ref: () => User, required: true})
  counselorId!: Ref<User>;
    
  @prop({required: true})
  counselorName!: String;
    
  @prop({ required: true })
  scheduleDate!: Date;

  @prop({ required: true })
  scheduleTime!: String;

  @prop({ required: true })
  meetLink!: String;
    
  @prop({ required: true ,unique: true})
  orderId!: String;
    
  @prop({ default: 0 })
  active!: number;

  @prop({ default: () => new Date() })
  createdAt!: Date;
  
}

const VideoCallOrderModel = getModelForClass(VideoCallOrder, {
  schemaOptions: { timestamps: true },
});
export default VideoCallOrderModel
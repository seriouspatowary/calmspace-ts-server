import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User'; // Make sure this is the correct path to your User model

class Message {
  @prop({ ref: () => User, required: true })
  public senderId!: Ref<User>;

  @prop({ ref: () => User, required: true })
  public receiverId!: Ref<User>;

  @prop()
  public text?: string;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;
}

const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
});

export default MessageModel;

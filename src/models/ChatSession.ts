import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

class ChatSession {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ ref: () => User, required: true })
  public counselorId!: Ref<User>;

  @prop({ required: true }) // e.g., 20 for 20 mins
  public duration!: number;

  @prop({ required: true }) // amount paid
  public amount!: number;

  @prop({ default: Date.now }) // when chat was unlocked
  public startedAt!: Date;

  @prop()
  public expiredAt?: Date; // startedAt + duration

  @prop({ default: false })
  public isExpired?: boolean;
}

const ChatSessionModel = getModelForClass(ChatSession, {
  schemaOptions: { timestamps: true },
});

export default ChatSessionModel;

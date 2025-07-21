import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
  Severity,
} from '@typegoose/typegoose'
import { User } from './User'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Post {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>

  @prop({ required: true })
  public text!: string

  // Reactions as a single string field (e.g., "like", "love", etc.)
  @prop({ type: String, enum: ['like', 'dislike'], default: null })
  public reactions?: 'like' | 'dislike' | null
  
  @prop({ default: Date.now })
  public createdAt?: Date

  @prop({ default: Date.now })
  public updatedAt?: Date
}

const PostModel = getModelForClass(Post, {
  schemaOptions: { timestamps: true },
})

export default PostModel

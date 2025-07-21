import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
  Severity,
} from '@typegoose/typegoose'
import { User } from './User'
import {Post} from './Comunity'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class ReplyPost {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>

  @prop({ ref: () => Post, required: true })
  public postId!: Ref<Post> // Link to original Post

  @prop({ required: true })
  public text!: string

  // Reactions as a single string
  @prop({ type: String, enum: ['like', 'dislike'], default: null })
  public reactions?: 'like' | 'dislike' | null
  

  @prop({ default: Date.now })
  public createdAt?: Date

  @prop({ default: Date.now })
  public updatedAt?: Date
}

const ReplyPostModel = getModelForClass(ReplyPost, {
  schemaOptions: { timestamps: true },
})

export default ReplyPostModel

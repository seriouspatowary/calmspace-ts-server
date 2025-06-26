import { prop, getModelForClass, Ref, modelOptions, Severity } from '@typegoose/typegoose'
import { User } from './User'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW, // ✅ allow mixed types like Map<string, string[]>
  },
})
class Post {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>

  @prop({ required: true })
  public text!: string

  @prop({
    default: () =>
      new Map([
        ['like', []],
        ['love', []],
        ['laugh', []],
        ['wow', []],
        ['sad', []],
        ['angry', []],
      ]),
  })
  public reactions!: Map<string, string[]>

  @prop({ default: Date.now })
  public createdAt?: Date

  @prop({ default: Date.now })
  public updatedAt?: Date
}

const PostModel = getModelForClass(Post, {
  schemaOptions: { timestamps: true },
})

export default PostModel

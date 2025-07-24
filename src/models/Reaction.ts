import {
    prop,
    Ref,
    getModelForClass,
    modelOptions,
    Severity,
  } from '@typegoose/typegoose'
  import { User } from './User'
  import {Post} from './Comunity'
  
  @modelOptions({
    options: {
      allowMixed: Severity.ALLOW,
    },
    schemaOptions: {
      timestamps: true, // adds createdAt and updatedAt
    },
  })
  export class Reaction {
    @prop({ ref: () => User, required: true })
    public userId!: Ref<User>
  
    @prop({ ref: () => Post, required: true })
    public postId!: Ref<Post>
  
    @prop({
      required: true,
      enum: ['like', 'dislike'],
    })
    public reactionType!: 'like' | 'dislike'
  }
  
  const ReactionModel = getModelForClass(Reaction)
  export default ReactionModel
  
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop()
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop()
  age!: number;

  @prop({
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  })
  pic?: string;

  @prop({ enum: ["user", "counselor"], default: "user" })
  role!: "user" | "counselor";

  @prop()
  gender!: string;

  @prop({ default: false })
  emailVerified?: boolean;

  @prop({ default: false })
  profileMaking?: boolean;

  @prop()
  createdAt?: Date;
}

// ✅ Export the model
const UserModel = getModelForClass(User);
export default UserModel;

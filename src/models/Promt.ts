// models/UserPrompt.ts
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from '../models/User'; // Adjust path as needed
import 'reflect-metadata';

export class UserPrompt {
  @prop({ ref: () => User, required: true, unique: true })
  userId!: Ref<User>;

  @prop({ required: true })
  age!: number;

  @prop({ required: true })
  gender!: string;

  @prop({ required: true })
  maxBudget!: number;

  @prop({ required: true })
  minBudget!: number;

  @prop({ required: true })
  language!: string;

  @prop({ default: () => new Date() })
  createdAt!: Date;
}

// Create the model
export const UserPromptModel = getModelForClass(UserPrompt, {
  schemaOptions: { timestamps: true },
});

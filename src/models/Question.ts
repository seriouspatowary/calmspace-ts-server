import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

// 👇 Define Option as a nested class
class Option {
  @prop({ required: true })
  text!: string;

  @prop({ required: true })
  weightage!: number;
}

// 👇 Define the main Question class
@modelOptions({
  schemaOptions: {
    timestamps: false, // You can enable if needed
  },
})
export class Question {
  @prop({ required: true })
  question!: string;

  @prop({ required: true })
  sort_order!: number;

  @prop({ type: () => [Option], required: true, _id: false })
  options!: Option[];
}

// ✅ Export the model

const QuestionModel = getModelForClass(Question);
export default QuestionModel;

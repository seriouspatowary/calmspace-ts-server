import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Define the interface for the document
export interface IArticleContent {
  title?: string;
  body?: string;
}

export interface IArticle extends Document {
  title: string;
  author: string;
  designation?: string;
  imgSrc?: string;
  createdAt: string;
  category: string;
  type?: string;
  desc?: string;
  content: IArticleContent[];
  message?: string;
}

// 2. Define the schema
const ArticleSchema: Schema<IArticle> = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  designation: { type: String },
  imgSrc: { type: String },
  createdAt: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String },
  desc: { type: String },
  content: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  message: { type: String },
});

// 3. Export the model
const Article: Model<IArticle> = mongoose.model<IArticle>("Article", ArticleSchema);
export default Article;

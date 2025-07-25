import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

class ArticleContent {
  @prop()
  public title?: string;

  @prop()
  public body?: string;
}

@modelOptions({
  schemaOptions: {
    collection: 'articles', 
  }
})
class Article {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public author!: string;

  @prop()
  public designation?: string;

  @prop()
  public imgSrc?: string;

  @prop({ required: true })
  public createdAt!: string;

  @prop({ required: true })
  public category!: string;

  @prop()
  public type?: string;

  @prop()
  public desc?: string;

  @prop({ type: () => [ArticleContent] }) 
  public content!: ArticleContent[];

  @prop()
  public message?: string;
}

// 3. Export the model
const ArticleModel = getModelForClass(Article);
export default ArticleModel;

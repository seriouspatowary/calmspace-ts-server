import { prop, getModelForClass } from '@typegoose/typegoose';

class Feature {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  subtitle!: string;

  @prop({
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  })
  imgSrc!: string;

  @prop({ default: () => new Date() })
  date!: Date;
}

const FeatureModel = getModelForClass(Feature);
export default FeatureModel;

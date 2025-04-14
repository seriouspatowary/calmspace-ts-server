import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './User'; // adjust the import as per your file structure
import { Price } from './Price'; // adjust as needed

@pre<Counselor>('save', async function () {
  if (this.isNew) {
    const user = await mongoose.model('User').findById(this.counselorId);
    if (!user) {
      throw new Error('User not found');
    }

    const initials = user.name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const date = new Date(this.registrationDate ?? Date.now());
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

    const count = (await mongoose.model('Counselor').countDocuments()) + 1;
    const index = String(count).padStart(3, '0');

    this.employeeId = `${initials}${formattedDate}${index}`;
  }
})
export class Counselor {
  @prop({ ref: () => User, required: true, unique: true })
  public counselorId!: Ref<User>;

  @prop()
  public experience?: string;

  @prop()
  public degree?: string;

  @prop()
  public therapy?: string;

  @prop()
  public info?: string;

  @prop()
  public expertise?: string;

  @prop({
    type: () => [String],
    validate: {
      validator: (val: string[]) => val.length <= 3,
      message: '{PATH} exceeds the limit of 3',
    },
  })
  public speciality?: string[];

  @prop({ type: () => [String] })
  public languages?: string[];

  @prop({ enum: ['online', 'offline'], default: 'offline' })
  public status?: string;

  @prop({ unique: true })
  public employeeId?: string;

  @prop({ ref: () => Price })
  public priceId?: Ref<Price>;

  @prop({ default: () => new Date() })
  public registrationDate?: Date;

  @prop({ default: false })
  public adminVerified?: boolean;

  @prop()
  public PhoneNumber?: number;
}

const CounselorModel = getModelForClass(Counselor);
export default CounselorModel;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class MedicalProfile extends Document {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  middleName: string;

  @Prop({ type: String, required: true, trim: true })
  grandFatherName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({ type: String, required: true, enum: ['m', 'f'] })
  gender: string;

  @Prop({ type: String, required: true, trim: true })
  phoneNumber: string;

  @Prop({ type: Date, required: true })
  birthDate: string;

  @Prop({ type: String, required: true, trim: true })
  idNumber: string;

  @Prop({ type: String, required: true, trim: true })
  city: string;

  @Prop({ type: String, required: true, trim: true })
  street: string;

  @Prop({ type: String, required: true, trim: true })
  birthCity: string;

  @Prop({
    type: String,
    trim: true,
    lowercase: true,
  })
  email: string;
}

export const MedicalProfileSchema =
  SchemaFactory.createForClass(MedicalProfile);

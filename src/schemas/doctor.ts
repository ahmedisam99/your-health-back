import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Doctor extends Document {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, trim: true })
  phoneNumber: string;

  @Prop({ type: String, default: '', trim: true })
  specialization: string;

  @Prop({ type: String, default: '', trim: true })
  profilePicture: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

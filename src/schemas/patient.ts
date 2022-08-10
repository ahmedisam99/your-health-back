import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Patient extends Document {
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

  @Prop({ type: String, trim: true, default: '' })
  address: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, trim: true })
  phoneNumber: string;

  @Prop({ type: String, default: '', trim: true })
  profilePicture: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalProfile',
    default: null,
  })
  medicalProfileId: mongoose.Types.ObjectId;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

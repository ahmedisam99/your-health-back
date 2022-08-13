import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Admin extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, default: '', trim: true })
  profilePicture: string;

  @Prop({ type: String, required: true })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

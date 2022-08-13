import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: false,
  },
})
export class Complaint extends Document {
  @Prop({ type: String, required: true, trim: true })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'fromModel',
    default: null,
  })
  from: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['Doctor', 'Patient', 'Admin'],
  })
  fromModel: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'toModel',
    default: null,
  })
  to: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['Doctor', 'Patient', 'Admin'],
  })
  toModel: string;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

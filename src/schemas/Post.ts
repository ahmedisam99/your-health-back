import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: false,
  },
})
export class Post extends Document {
  @Prop({ type: String, required: true, trim: true })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  })
  doctorId: mongoose.Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  })
  likes: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

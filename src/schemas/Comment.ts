import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: false,
  },
})
export class Comment extends Document {
  @Prop({ type: String, required: true, trim: true })
  content: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
  })
  postId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    refPath: 'commenterModel',
    required: true,
  })
  commenterId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['Doctor', 'Patient'] })
  commenterModel: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

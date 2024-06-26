const mongoose = require('mongoose');
const { transformId } = require('../utils/transformId');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "'user' is required"],
    },
    content: {
      type: String,
      required: [true, "'content' is required"],
    },
    image: {
      type: String,
      default: '',
    },
    likes: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true, transform: transformId },
    toObject: { virtuals: true, transform: transformId },
    strict: 'throw',
  }
);

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

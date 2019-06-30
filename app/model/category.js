'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const categorySchema = new Schema({
    name: {
      unique: true,
      type: String,
    },
    movies: [{
      type: ObjectId,
      ref: 'Movie',
    }],
  }, {
    timestamps: true,
  });

  return mongoose.model('Category', categorySchema);
};

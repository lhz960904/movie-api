'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const keywordSchema = new Schema({
    name: {
      type: String,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  }, {
    timestamps: true,
  });

  return mongoose.model('Keyword', keywordSchema);
};

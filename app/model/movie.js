'use strict';

const STATUS = {
  comming: 0,
  playing: 1,
  // 1: 上映中 0: 即将上映
};

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const movieSchema = new Schema({
    doubanId: {
      unique: true,
      type: Number,
    },
    author: String,
    title: String,
    summary: String,
    rate: Number,
    duration: String,
    movieTypes: [ String ],
    pubdate: String,
    poster: String,
    casts: [{
      name: String,
      avatar: String,
    }],
    cover: String,
    video: String,
    isPlay: {
      type: Number,
      default: STATUS.comming,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  }, {
    timestamps: true,
  });

  return mongoose.model('Movie', movieSchema);
};

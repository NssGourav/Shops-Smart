const mongoose = require('mongoose');

const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
};

module.exports = {
  Schema: mongoose.Schema,
  model: mongoose.model.bind(mongoose),
  Types: mongoose.Types,
  baseSchemaOptions,
};

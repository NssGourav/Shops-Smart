const { Schema, model, baseSchemaOptions } = require('./base');

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  baseSchemaOptions
);

module.exports = model('Category', categorySchema);

const { Schema, model, baseSchemaOptions } = require('./base');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'CUSTOMER' },
  },
  baseSchemaOptions
);

module.exports = model('User', userSchema);

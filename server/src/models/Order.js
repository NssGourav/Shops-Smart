const { Schema, model, baseSchemaOptions } = require('./base');

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  {
    _id: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

orderItemSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

const paymentSchema = new Schema(
  {
    method: { type: String, required: true },
    status: { type: String, required: true },
    transactionId: { type: String, default: null },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'PENDING' },
    items: { type: [orderItemSchema], default: [] },
    payment: { type: paymentSchema, default: null },
  },
  baseSchemaOptions
);

module.exports = model('Order', orderSchema);

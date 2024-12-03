const { default: mongoose, Schema } = require('mongoose');

const cartSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    name: {type: String, required: true},
    images: {type: [String], required: true}, 
    price: {type: String, required: true},
    color: {type: String, required: true},
    size: {type: String, required: true},
    variant: {
      type: Object,
      default: {}, 
    },
    quantity: { type: Number, required: true, default: 1 }, 
  },
  { timestamps: true } 
);

const CartItem = mongoose.model('CartItem', cartSchema);

module.exports = CartItem;

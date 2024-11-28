const { default: mongoose, Schema } = require('mongoose');

const cartSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true }, 
    variant: {
      type: Object,
      default: {}, 
    },
    quantity: { type: Number, required: true, default: 1 }, 
    price: { type: Number, required: true }, 
  },
  { timestamps: true } 
);

const CartItem = mongoose.model('CartItem', cartSchema);

module.exports = CartItem;

import { Schema, model } from "mongoose";

const CartSchema = new Schema({
  products: [
    {
      _id: false,
      product: { type: Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, default: 1, required: true },
    },
  ],
});

export const CartModel = model("carts", CartSchema);

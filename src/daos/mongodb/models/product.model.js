import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new Schema({
	status: { type: 'boolean', default: false},
	title: { type: String, required: true, index: true },
	description: { type: String, required: true },
	code: { type: String, required: true, unique: true },
	stock: { type: Number, required: true },
	price: { type: Number, required: true },
	category: { type: String, required: true, index: true },
	thumbnails: [ {type: String, required: false}],

})

ProductSchema.plugin(mongoosePaginate);

export const ProductModel = model("products", ProductSchema)
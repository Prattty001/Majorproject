// import mongoose from "mongoose";
// import { loadType } from "mongoose-currency";

// const Schema = mongoose.Schema;
// loadType(mongoose);

// const ProductSchema = new Schema(
//   {
//     price: {
//       type: mongoose.Types.Currency,
//       currency: "USD",
//       get: (v) => v / 100,
//     },
//     expense: {
//       type: mongoose.Types.Currency,
//       currency: "USD",
//       get: (v) => v / 100,
//     },
//     transactions: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Transaction",
//       },
//     ],
//   },
//   { timestamps: true, toJSON: { getters: true } }
// );

// const Product = mongoose.model("Product", ProductSchema);

// export default Product;


import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    price: {
      type: Number, // Store in cents and divide by 100 for proper display
      get: (v) => v / 100,
    },
    expense: {
      type: Number, // Store in cents
      get: (v) => v / 100,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true, toJSON: { getters: true } }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;

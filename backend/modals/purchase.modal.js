import mongoose from "mongoose"


const purchaseSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
   },
   courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
   },
   paymentId: {
      type: String,
      required: true,
   },
   amount: {
      type: Number,
      required: true,
   },
   status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
   },
}, { timestamps: true });

export const Purchase = mongoose.model("Purchase", purchaseSchema)
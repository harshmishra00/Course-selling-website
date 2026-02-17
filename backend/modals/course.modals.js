import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    lectures: [
        {
            title: String,
            description: String,
            videoUrl: String,
            public_id: String,
            isFree: Boolean,
        }
    ],
    category: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    enrolledStudents: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    ],

})

export const Course = mongoose.model("Course", courseSchema)


import { Purchase } from "../modals/purchase.modal.js";
import { Course } from "../modals/course.modals.js";
import { v2 as cloudinary } from 'cloudinary';

export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price, category, level } = req.body;

    try {
        if (!title || !description || !price || !category || !level) {
            return res.status(400).json({ errors: "All fields are required" })
        }

        const { image } = req.files
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ errors: "No file uploaded" })
        }

        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ errors: "Invalid image format! Only JPG and PNG format image is allowed" });
        }

        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ errors: "Error uploading image to cloudinary" })
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url,
            },
            creatorId: adminId,
            category,
            level
        }
        const course = await Course.create(courseData)
        res.json({
            message: "Course created successfully",
            course
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ errors: "Error creating course" })
    }
};

export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price, image, category, level, isPublished, lectures } = req.body;

    try {
        const courseSearch = await Course.findById(courseId);
        if (!courseSearch) {
            return res.status(404).json({ errors: "Course not found" });
        }
        const course = await Course.findOneAndUpdate(
            { _id: courseId, creatorId: adminId },
            {
                title,
                description,
                price,
                image: {
                    public_id: image?.public_id,
                    url: image?.url,
                },
                category,
                level,
                isPublished,
                lectures
            },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ error: "Course not found or not authorized" });
        }

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        res.status(500).json({ errors: "Error in updating course" });
        console.log("Error in course updating", error);
    }
};

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;

    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId
        })
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
        return res.status(200).json({ message: "Course deleted successfully" })
    } catch (error) {
        res.status(500).json({ errors: "Error in deleting course" })
        console.log("Error in deleting the course", error)
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
        res.status(200).json({ courses })
    } catch (error) {
        return res.status(500).json({ errors: "Error in getting course" })
        console.log("Error getting courses", error)
    }
};

export const courseDetails = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ errors: "Error in getting course detail" })
        console.log("Error in getting course detail", error)
    }
}

export const buyCourses = async (req, res) => {
    const { userId } = req;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ errors: "Course not found" })
        }
        const existingPurchase = await Purchase.findOne({ userId, courseId })
        if (existingPurchase) {
            return res.status(400).json({ errors: "You have already purchased this course" })
        }

        const newPurchase = new Purchase({
            userId,
            courseId,
            amount: course.price,
            paymentId: `MOCK_PAYMENT_${Date.now()}`,
            status: "completed"
        })
        await newPurchase.save()
        res.status(201).json({ message: "Course purchased successfully", newPurchase })
    } catch (error) {
        res.status(500).json({ errors: "Error in buying course" })
        console.log("Error in buying course", error)
    }
}
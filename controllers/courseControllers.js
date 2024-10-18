const Course = require('../models/course');
const Admin = require('../models/admin');

const generateCourseId = async () => {
    const lastCourse = await Course.findOne().sort({ course_id: -1 }).exec(); // หารายวิชาล่าสุดตาม course_id
    if (!lastCourse) {
        // กรณีไม่มีรายวิชาในฐานข้อมูล
        return 'A0001';
    }
    const lastCourseId = lastCourse.course_id; // ดึงค่า course_id ของรายวิชาล่าสุด
    let letterPart = lastCourseId.slice(0, 1); // ตัวอักษร A-Z
    let numberPart = parseInt(lastCourseId.slice(1), 10); // ตัวเลข 001-9999

    // เพิ่มค่า numberPart
    numberPart += 1;

    if (numberPart > 9999) {
        // ถ้าเกิน 9999 ให้เปลี่ยนตัวอักษรและรีเซ็ตตัวเลข
        letterPart = String.fromCharCode(letterPart.charCodeAt(0) + 1);
        numberPart = 1;
    }

    const newCourseID = `${letterPart}${numberPart.toString().padStart(4, '0')}`; // ประกอบ course_id ใหม่
    return newCourseID;
};

exports.createCourse = async (req, res) => {
    const course_id = await generateCourseId();
    const {
        coursecode,
        coursename,
        credits,
        instructor,
        groups,
        accepting
    } = req.body;

    const course = new Course({
        course_id,
        coursecode,
        coursename,
        credits,
        instructor,
        groups,
        accepting
    });

    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find(); // ดึงข้อมูลรายวิชาทั้งหมด
        res.status(200).json(courses); // ส่งข้อมูลรายวิชาทั้งหมด
    } catch (err) {
        res.status(500).json({ message: err.message }); // หากเกิดข้อผิดพลาด
    }
};

exports.getCourseByID = async (req, res) => {
    try {
        const { course_id } = req.params; // ดึง user_id จากพารามิเตอร์ URL
        const course = await Course.findOne({ course_id }); // ค้นหาผู้ใช้ด้วย user_id
        if (!course) return res.status(404).json({ message: 'ไม่พบข้อมูลรายวิชา' }); 
        res.status(200).json(course); // ส่งข้อมูลผู้ใช้ที่พบกลับไป
    } catch (err) {
        res.status(500).json({ message: err.message }); // หากเกิดข้อผิดพลาด
    }
};
// exports.updateCourse = async (req, res) => {
//     try {
//         const { course_id } = req.params; // แก้ไขพารามิเตอร์ที่ใช้ในการค้นหา
//         const course = await Course.findOne({ course_id }); // ค้นหาด้วย course_id
//         if (!course) return res.status(404).json({ message: 'ไม่พบรายวิชา' });
        
//         const updateData = { $set: req.body }; // เตรียมข้อมูลที่จะอัปเดต
//         await Course.updateOne({ course_id }, updateData); // อัปเดตรายวิชาด้วย course_id
        
//         res.status(200).json({ message: 'อัปเดตรายวิชาสำเร็จ' });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };


exports.updateCourse = async (req, res) => {
    const updateData = req.body; // รับข้อมูลทั้งหมดจาก body
    const courseId = req.params.course_id; // รับ course_id จากพารามิเตอร์ใน URL

    try {
        // ค้นหาและอัปเดตรายวิชาที่มี course_id ตรงกับ courseId
        const updatedCourse = await Course.findOneAndUpdate(
            { course_id: courseId }, // เงื่อนไขการค้นหา
            updateData, // ข้อมูลที่จะอัปเดต
            { new: true } // คืนค่าผลลัพธ์ที่อัปเดตแล้ว
        );

        if (!updatedCourse) {
            return res.status(404).send("ไม่พบรายวิชา."); // ตรวจสอบว่าพบรายวิชาหรือไม่
        }

        console.log('อัปเดตข้อมูลสำเร็จ');
        res.status(200).send("อัปเดตข้อมูลสำเร็จ.");
    } catch (err) {
        console.error(err);
        res.status(500).send("เกิดข้อผิดพลาดในการอัพเดตรายวิชา.");
    }
};
exports.deleteCourse = async (req, res) => {
    try {
        const { course_id } = req.params; // ใช้ course_id แทน id ใน params
        const course = await Course.findOne({  }); // ค้นหารายวิชาด้วย course_id
        if (!course) return res.status(404).json({ message: 'ไม่พบรายวิชา' });
        await Course.deleteOne({ course_id }); // ลบรายวิชาด้วย course_id
        res.status(200).json({ message: 'ลบรายวิชาสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

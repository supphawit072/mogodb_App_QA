const Form = require("../models/form");

// const generateFormId = async () => {
//     const lastForm = await Forms.findOne().sort({ form_id: -1 }).exec(); // หาฟอร์มล่าสุดตาม form_id
//     if (!lastForm) {
//         return 'A0001'; // ถ้าไม่มีฟอร์มในฐานข้อมูลเลย ให้เริ่มต้นที่ A0001
//     }
//     const lastFormId = lastForm.form_id; // ดึงค่า form_id ของฟอร์มล่าสุด
//     let letterPart = lastFormId.slice(0, 1); // ตัวอักษร A-Z
//     let numberPart = parseInt(lastFormId.slice(1), 10); // ตัวเลข 001-9999

//     // เพิ่มค่า numberPart
//     numberPart += 1;

//     if (numberPart > 9999) {
//         // ถ้าเกิน 9999 ให้เปลี่ยนตัวอักษรและรีเซ็ตตัวเลข
//         letterPart = String.fromCharCode(letterPart.charCodeAt(0) + 1);
//         numberPart = 1;
//     }

//     const newFormID = `${letterPart}${numberPart.toString().padStart(4, '0')}`; // ประกอบ form_id ใหม่
//     return newFormID;
// };

exports.createForm = async (req, res) => {
    // const form_id = await generateFormId();
    const {
        form_id,
        curriculum,
        coursecode_FK,
        coursename_FK,
        credits_FK,
        groups_FK,
        instructor_FK,
        A,
        B_plus,
        B,
        C_plus,
        C,
        D_plus,
        D,
        E,
        F,
        F_percent,
        I,
        W,
        VG,
        G,
        S,
        U,
        total
    } = req.body;

    const form = new Form({
        form_id,
        curriculum,
        coursecode_FK,
        coursename_FK,
        credits_FK,
        groups_FK,
        instructor_FK,
        A,
        B_plus,
        B,
        C_plus,
        C,
        D_plus,
        D,
        E,
        F,
        F_percent,
        I,
        W,
        VG,
        G,
        S,
        U,
        total
    });

    try {
        const newForm = await form.save();
        res.status(201).json(newForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getForms = async (req, res) => {
    try {
        const forms = await Form.find(); // ดึงข้อมูลฟอร์มทั้งหมด
        res.status(200).json(forms); // ส่งข้อมูลฟอร์มทั้งหมด
    } catch (err) {
        res.status(500).json({ message: err.message }); // หากเกิดข้อผิดพลาด
    }
};



exports.getForm = async (req, res) => {
    try {
        const { form_id } = req.params; // ใช้ form_id จากพารามิเตอร์ใน URL
        const form = await Form.findOne({ form_id }); // ค้นหาด้วย form_id
        if (!form) return res.status(404).json({ message: "ไม่พบฟอร์ม" });
        res.status(200).json(form);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.updateForm = async (req, res) => {
    try {
        const { form_id } = req.params; // ใช้ form_id จากพารามิเตอร์ใน URL
        const form = await Form.findOne({ form_id }); // ค้นหาด้วย form_id
        if (!form) return res.status(404).json({ message: 'ไม่พบฟอร์ม' });
        
        const updateData = { $set: req.body }; // เตรียมข้อมูลที่จะอัปเดต
        await Form.updateOne({ form_id }, updateData); // อัปเดตฟอร์มด้วย form_id
        
        console.log(updateData);
        res.status(200).json({ message: 'อัปเดตฟอร์มสำเร็จ' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteForm = async (req, res) => {
    try {
        const { form_id } = req.params; // ใช้ form_id จากพารามิเตอร์ใน URL
        const form = await Form.findOne({ form_id }); // ค้นหาด้วย form_id
        if (!form) return res.status(404).json({ message: 'ไม่พบฟอร์ม' });

        // ลบข้อมูลผู้ใช้ที่เชื่อมโยงกับฟอร์มที่จะลบ หากมีการเชื่อมโยง
        // สมมติว่ามีฟิลด์ form_id_fk ใน Users (ถ้าไม่มีฟิลด์นี้ในโมเดลจริงๆ ให้ลบโค้ดนี้)
        // await Users.deleteMany({ form_id_fk: form_id });

        await Form.deleteOne({ form_id }); // ลบฟอร์มด้วย form_id
        res.status(200).json({ message: 'ลบฟอร์มสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: err.message }); // เปลี่ยนเป็น status code 500 เพื่อบ่งบอกว่าเกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
    }
};

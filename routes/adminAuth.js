const express = require('express');
const router = express.Router();
const { register, login , refresh} = require('../controllers/adminauth');

router.post("/register",register); //ใช้งานได้
router.post("/login",login); //ใช้งานได้
router.post("/refresh",refresh); //ใช้งานได้

module.exports = router;
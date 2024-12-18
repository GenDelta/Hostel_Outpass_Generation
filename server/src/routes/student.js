const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const OutpassDetail = require('../models/Outpassdetail');
const Admin = require('../models/Admin');
const Security = require('../models/Security');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/register', upload.single('photo'), async (req, res) => {
    const { name, email, password, prn } = req.body;
    const photo = req.file ? req.file.filename : null;

    const newStudent = new Student({
        name,
        email,
        password,
        prn,
        photo,
        listItems: [] 
    });

    try {
        await newStudent.save();
        res.status(201).send('Student registered');
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).send('Error registering student');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        let user = await Admin.findOne({ email });
        if (user) {
            const match = user.password === password;
            if (match) return res.status(200).json({ role: 'Admin' });
        }

        user = await Student.findOne({ email });
        if (user) {
            const match = user.password === password;
            if (match) return res.status(200).json({ role: 'Student' });
        }

        user = await Security.findOne({ email });
        if (user) {
            const match = user.password === password;
            if (match) return res.status(200).json({ role: 'Security' });
        }

        res.status(400).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/listItems', async (req, res) => {
    const { email } = req.query;
    console.log('Fetching list items for email:', email);

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            console.log('Student not found:', email);
            return res.status(404).json({ message: 'Student not found' });
        }

        const listItems = student.listItems.map(item => ({
            ...item.toObject(),
            status: item.status || (item.submitted ? 'pending' : 'not submitted')
        }));

        console.log('Sending list items:', listItems);
        res.status(200).json(listItems);
    } catch (error) {
        console.error('Error fetching list items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/listItems', async (req, res) => {
    const { email, listItems } = req.body;
    console.log('Updating list items for email:', email);
    console.log('New list items:', listItems);

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: { listItems } },
            { new: true }
        );

        if (!student) {
            console.log('Student not found for update:', email);
            return res.status(404).json({ message: 'Student not found' });
        }

        console.log('Updated list items:', student.listItems);
        res.status(200).json(student.listItems);
    } catch (error) {
        console.error('Error updating list items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/outpassDetails', async (req, res) => {
    console.log('Creating/Updating outpass details:', req.body);

    try {
        const requiredFields = [
            'studentName', 'studentEmail', 'studentContactNumber',
            'parentName', 'parentEmail', 'parentContactNumber',
            'leaveFrom', 'leaveFromTime', 'leaveTo', 'leaveToTime',
            'reasonForAbsence'
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    message: `Missing required field: ${field}` 
                });
            }
        }

        let outpassDetail;
        const outpassData = {
            ...req.body,
            status: 'pending',
            updatedAt: new Date()
        };

        if (req.body.listItemId) {
            outpassDetail = await OutpassDetail.findOne({ listItemId: req.body.listItemId });
        }

        if (outpassDetail) {
            outpassDetail = await OutpassDetail.findOneAndUpdate(
                { listItemId: req.body.listItemId },
                { $set: outpassData },
                { new: true }
            );
        } else {
            outpassData.listItemId = req.body.listItemId || new mongoose.Types.ObjectId().toString();
            outpassData.createdAt = new Date();
            outpassDetail = new OutpassDetail(outpassData);
            await outpassDetail.save();
        }

        const student = await Student.findOne({ email: req.body.studentEmail });
        if (!student) {
            throw new Error('Student not found');
        }

        const listItemExists = student.listItems.some(item => item.id === outpassDetail.listItemId);
        
        if (listItemExists) {
            student.listItems = student.listItems.map(item => 
                item.id === outpassDetail.listItemId 
                    ? { 
                        ...item.toObject(), 
                        submitted: true,
                        status: 'pending',
                        outpassId: outpassDetail._id.toString()
                    }
                    : item
            );
        } else {
            student.listItems.push({
                id: outpassDetail.listItemId,
                submitted: true,
                status: 'pending',
                outpassId: outpassDetail._id.toString(),
                createdAt: new Date()
            });
        }

        await student.save();
        res.status(201).json(outpassDetail);

    } catch (error) {
        console.error('Error saving outpass details:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});
router.get('/outpassDetails/:id', async (req, res) => {
    try {
        console.log('Fetching outpass details for ID:', req.params.id);
        
        let outpassDetail;
        
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            outpassDetail = await OutpassDetail.findById(req.params.id);
        }
        
        if (!outpassDetail) {
            outpassDetail = await OutpassDetail.findOne({ listItemId: req.params.id });
        }

        if (!outpassDetail) {
            console.log('No outpass details found for ID:', req.params.id);
            return res.status(404).json({ message: 'Outpass details not found' });
        }

        console.log('Found outpass details:', outpassDetail);
        res.status(200).json(outpassDetail);
    } catch (error) {
        console.error('Error fetching outpass details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/outpassDetails/:id', async (req, res) => {
    try {
        console.log('Deleting outpass details for ID:', req.params.id);
        
        let result;
        let outpassDetail;
        
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            outpassDetail = await OutpassDetail.findById(req.params.id);
        }
        if (!outpassDetail) {
            outpassDetail = await OutpassDetail.findOne({ listItemId: req.params.id });
        }

        if (outpassDetail) {
            result = await OutpassDetail.findByIdAndDelete(outpassDetail._id);

            if (outpassDetail.studentEmail) {
                const student = await Student.findOne({ email: outpassDetail.studentEmail });
                if (student) {
                    const updatedListItems = student.listItems.map(item => {
                        if (item.outpassId === outpassDetail._id.toString()) {
                            return {
                                ...item,
                                submitted: false,
                                status: 'not submitted',
                                outpassId: null
                            };
                        }
                        return item;
                    });
                    student.listItems = updatedListItems;
                    await student.save();
                    console.log('Updated student list items after deletion');
                }
            }
        }

        if (result) {
            res.status(200).json({ message: 'Outpass details deleted successfully' });
        } else {
            res.status(404).json({ message: 'Outpass details not found' });
        }
    } catch (error) {
        console.error('Error deleting outpass details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/pendingOutpasses', async (req, res) => {
    try {
        const pendingOutpasses = await OutpassDetail.find({ status: 'pending' })
            .sort({ createdAt: -1 });
        console.log('Fetched pending outpasses:', pendingOutpasses.length);
        res.status(200).json(pendingOutpasses);
    } catch (error) {
        console.error('Error fetching pending outpasses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/admin/outpass/:outpassId/decision', async (req, res) => {
    const { outpassId } = req.params;
    const { decision } = req.body;
    console.log(`Processing ${decision} decision for outpass:`, outpassId);

    if (!['approve', 'reject'].includes(decision)) {
        return res.status(400).json({ message: 'Invalid decision' });
    }

    try {
        let outpass;
        
        if (mongoose.Types.ObjectId.isValid(outpassId)) {
            outpass = await OutpassDetail.findById(outpassId);
        }
        
        if (!outpass) {
            outpass = await OutpassDetail.findOne({ listItemId: outpassId });
        }

        if (!outpass) {
            console.log('Outpass not found:', outpassId);
            return res.status(404).json({ message: 'Outpass not found' });
        }

        const newStatus = decision === 'approve' ? 'approved' : 'rejected';
        outpass.status = newStatus;
        await outpass.save();
        console.log('Updated outpass status to:', newStatus);

        const student = await Student.findOne({ email: outpass.studentEmail });
        if (student) {
            const updatedListItems = student.listItems.map(item => 
                item.outpassId === outpass._id.toString()
                    ? { ...item, status: newStatus }
                    : item
            );
            student.listItems = updatedListItems;
            await student.save();
            console.log('Updated student list items with new status');
        }

        res.status(200).json({
            message: `Outpass ${decision}ed successfully`,
            outpass: outpass
        });
    } catch (error) {
        console.error('Error processing outpass decision:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/approvedOutpasses', async (req, res) => {
    try {
        const approvedOutpasses = await OutpassDetail.find({ status: 'approved' })
            .sort({ createdAt: -1 });
        console.log('Fetched approved outpasses:', approvedOutpasses.length);
        res.status(200).json(approvedOutpasses);
    } catch (error) {
        console.error('Error fetching approved outpasses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
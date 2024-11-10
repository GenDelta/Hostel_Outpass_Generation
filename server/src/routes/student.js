const express = require('express');
const router = express.Router();
const multer = require('multer');
const Student = require('../models/Student');
const OutpassDetail = require('../models/Outpassdetail');
const Admin = require('../models/Admin');
const Security = require('../models/Security');

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Registration route
router.post('/register', upload.single('photo'), async (req, res) => {
    const { name, email, password, prn } = req.body;
    const photo = req.file ? req.file.filename : null;

    const newStudent = new Student({
        name,
        email,
        password,
        prn,
        photo
    });

    try {
        await newStudent.save();
        res.status(201).send('Student registered');
    } catch (err) {
        res.status(400).send('Error registering student');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Request body:', req.body);

    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check in Admin collection
        let user = await Admin.findOne({ email });
        if (user) {
            console.log(`Admin found: ${user.email}`);
            const match = user.password === password;
            console.log(`Password match for Admin: ${match}`);
            if (match) return res.status(200).json({ role: 'Admin' });
        }

        // Check in Student collection
        user = await Student.findOne({ email });
        if (user) {
            console.log(`Student found: ${user.email}`);
            const match = user.password === password;
            console.log(`Password match for Student: ${match}`);
            if (match) return res.status(200).json({ role: 'Student' });
        }

        // Check in Security collection
        user = await Security.findOne({ email });
        if (user) {
            console.log(`Security found: ${user.email}`);
            const match = user.password === password;
            console.log(`Password match for Security: ${match}`);
            if (match) return res.status(200).json({ role: 'Security' });
        }

        console.log('Invalid email or password');
        res.status(400).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to get list items for a student
router.get('/listItems', async (req, res) => {
    const { email } = req.query;
    try {
        const student = await Student.findOne({ email });
        if (student) {
            res.status(200).json(student.listItems);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to update list items for a student
router.post('/listItems', async (req, res) => {
    const { email, listItems } = req.body;
    console.log('Received email:', email);
    console.log('Received listItems:', listItems);
    try {
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: { listItems } },
            { new: true }
        );
        if (student) {
            res.status(200).json(student.listItems);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error updating list items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new route for saving outpass details
router.post('/outpassDetails', async (req, res) => {
    try {
        const outpassDetail = new OutpassDetail({
            ...req.body,
            reasonForAbsence: req.body.reasonForAbsence // Explicitly include reason
        });
        await outpassDetail.save();
        res.status(201).json(outpassDetail);
    } catch (error) {
        console.error('Error saving outpass details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add route for fetching outpass details
router.get('/outpassDetails/:listItemId', async (req, res) => {
    try {
        const outpassDetail = await OutpassDetail.findOne({ listItemId: req.params.listItemId });
        if (outpassDetail) {
            res.status(200).json(outpassDetail);
        } else {
            res.status(404).json({ message: 'Outpass details not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add this new route to handle deleting outpass details
router.delete('/outpassDetails/:listItemId', async (req, res) => {
    try {
        const result = await OutpassDetail.findOneAndDelete({ listItemId: req.params.listItemId });
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
// Update the outpass details POST route to handle submission status
router.post('/outpassDetails', async (req, res) => {
    try {
        // Save the outpass details
        const outpassDetail = new OutpassDetail({
            ...req.body,
            reasonForAbsence: req.body.reasonForAbsence
        });
        await outpassDetail.save();

        // Update the list item's submitted status
        const student = await Student.findOne({ email: req.body.studentEmail });
        if (student) {
            const updatedListItems = student.listItems.map(item => 
                item.id === req.body.listItemId 
                    ? { ...item, submitted: true }
                    : item
            );
            
            student.listItems = updatedListItems;
            await student.save();
        }

        res.status(201).json(outpassDetail);
    } catch (error) {
        console.error('Error saving outpass details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update the GET route for list items to include submitted status
router.get('/listItems', async (req, res) => {
    const { email } = req.query;
    try {
        const student = await Student.findOne({ email });
        if (student) {
            // Ensure each list item has a submitted property
            const listItems = student.listItems.map(item => ({
                ...item,
                submitted: item.submitted || false
            }));
            res.status(200).json(listItems);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update the POST route for list items to preserve submitted status
router.post('/listItems', async (req, res) => {
    const { email, listItems } = req.body;
    console.log('Received email:', email);
    console.log('Received listItems:', listItems);
    try {
        const student = await Student.findOne({ email });
        if (student) {
            // Preserve the submitted status when updating list items
            const updatedListItems = listItems.map(newItem => {
                const existingItem = student.listItems.find(item => item.id === newItem.id);
                return {
                    ...newItem,
                    submitted: existingItem ? existingItem.submitted : false
                };
            });

            student.listItems = updatedListItems;
            await student.save();
            res.status(200).json(updatedListItems);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error updating list items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

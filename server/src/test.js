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
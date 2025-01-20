const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' }));

// Endpoint to receive images
app.post('/upload', (req, res) => {
    const { image, timestamp } = req.body;

    if (!image) {
        return res.status(400).send('No image provided');
    }

    // Decode Base64 image and save it
    const base64Image = image.split(';base64,').pop();
    const fileName = `image_${timestamp}.jpg`;

    fs.writeFile(`./uploads/${fileName}`, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).send('Error saving image');
        }
        console.log('Image saved successfully:', fileName);
        res.send('Image uploaded successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
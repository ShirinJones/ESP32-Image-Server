const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json({ limit: '50mb' })); // For parsing JSON bodies (e.g., Base64 image)
app.use(bodyParser.urlencoded({ extended: true }));

// POST route to handle image uploads
app.post('/upload', (req, res) => {
    const { image, timestamp } = req.body;

    if (!image) {
        return res.status(400).send('No image provided');
    }

    // Decode Base64 image and save to server
    const base64Image = image.split(';base64,').pop();
    const fileName = `image_${timestamp || Date.now()}.png`; // Use timestamp or current time
    const filePath = path.join(__dirname, 'uploads', fileName);

    fs.writeFile(filePath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).send('Failed to save image');
        }
        console.log(`Image saved successfully at ${filePath}`);
        res.status(200).send('Image uploaded successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Server is running! ESP32 can connect now.');
});

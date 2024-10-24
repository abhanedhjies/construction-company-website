const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Correctly import path for file handling

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/constructionDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    service: String,
    date: { type: Date, default: Date.now }
});

// Create Models
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// API Routes
app.post('/feedback', (req, res) => {
    const feedback = new Feedback(req.body);
    feedback.save()
        .then(() => res.status(201).json({ message: 'Feedback submitted successfully!' }))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.post('/appointments', (req, res) => {
    const appointment = new Appointment(req.body);
    appointment.save()
        .then(() => res.status(201).json({ message: 'Appointment booked successfully!' }))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.get('/feedback', (req, res) => {
    Feedback.find()
        .then(feedbacks => res.json(feedbacks))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/appointments', (req, res) => {
    Appointment.find()
        .then(appointments => res.json(appointments))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Serve Static Files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Serve the homepage (project.html) for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'project.html')); // Ensure the file is served from the public directory
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

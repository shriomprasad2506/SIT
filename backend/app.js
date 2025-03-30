const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoute');
const eventsRoutes = require('./routes/eventsRoute');
const newsRoutes = require('./routes/newsRoute');
const facultyStaffRoutes = require('./routes/facultyStaffRoutes');
const announcementsRoutes = require('./routes/announcementsRoutes');
const contactRoutes = require('./routes/contactRoute');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/faculty-staff', facultyStaffRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/contact', contactRoutes);
app.use(errorMiddleware);

module.exports = app;

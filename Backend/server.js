import express from 'express';
import cors from 'cors';
import { sectorsData } from './src/data/sectors.js';
import { servicesData } from './src/data/services.js';
import { jobsData } from './src/data/jobs.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PeopleLabs Consulting API',
    timestamp: new Date().toISOString()
  });
});

// Sectors API
app.get('/api/sectors', (req, res) => {
  res.json({
    count: sectorsData.length,
    sectors: sectorsData
  });
});

// Services API
app.get('/api/services', (req, res) => {
  res.json({
    count: servicesData.length,
    services: servicesData
  });
});

// DYNAMIC JOBS API (GET /api/jobs and GET /api/careers/jobs)
app.get(['/api/jobs', '/api/careers/jobs'], (req, res) => {
  const activeJobs = jobsData.filter(job => job.active !== false);
  res.json({
    success: true,
    count: activeJobs.length,
    jobs: activeJobs
  });
});

// Admin API: Create a new Job opening dynamically
app.post('/api/jobs', (req, res) => {
  const { title, summary, qualifications, experience, location, type } = req.body;

  if (!title || !summary) {
    return res.status(400).json({ error: 'Job title and summary are required.' });
  }

  const newJob = {
    id: `job-${Date.now()}`,
    title,
    summary,
    type: type || 'Full Time',
    experience: experience || '0–3 years',
    location: location || 'Edmonton-based / Remote',
    workModel: 'Remote',
    qualificationsHeading: 'About the Qualifications:',
    qualifications: Array.isArray(qualifications) ? qualifications : [qualifications],
    applyUrl: 'https://peoplelabsconsulting.com/job-posting',
    active: true,
    createdAt: new Date().toISOString()
  };

  jobsData.push(newJob);
  res.status(201).json({ success: true, message: 'Job posting created successfully.', job: newJob });
});

// Admin API: Update an existing Job opening dynamically
app.put('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  const index = jobsData.findIndex(j => j.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Job posting not found.' });
  }

  jobsData[index] = { ...jobsData[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: 'Job posting updated successfully.', job: jobsData[index] });
});

// Admin API: Delete/Deactivate a Job opening dynamically
app.delete('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  const index = jobsData.findIndex(j => j.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Job posting not found.' });
  }

  jobsData[index].active = false;
  res.json({ success: true, message: 'Job posting deactivated successfully.' });
});

// Careers Application Handler
app.post('/api/careers/apply', (req, res) => {
  const { fullName, email, phone, currentLocation, experienceLevel, position, introduction, resumeName, resumeSize } = req.body;

  // Basic Validation
  if (!fullName || !email || !phone || !currentLocation || !experienceLevel || !position) {
    return res.status(400).json({
      error: 'Please fill in all required fields (Full Name, Email, Phone, Location, Experience Level, Position).'
    });
  }

  // Email Format Regex Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Dynamic Whitelist Position Check against active jobs
  const validPositions = jobsData.filter(j => j.active !== false).map(j => j.title);
  if (!validPositions.includes(position)) {
    return res.status(400).json({
      error: 'Invalid position selected. Please select one of our active openings.'
    });
  }

  // File Check
  if (!resumeName) {
    return res.status(400).json({ error: 'Please upload your resume in PDF format.' });
  }

  if (resumeName && !resumeName.toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ error: 'Resume must be a PDF file (.pdf).' });
  }

  console.log('Received career application:', { fullName, email, position, currentLocation, experienceLevel, resumeName });

  res.status(200).json({
    success: true,
    message: 'Application submitted successfully.',
    applicationId: `PLC-APP-${Math.floor(100000 + Math.random() * 900000)}`
  });
});

// Alias route for /api/apply
app.post('/api/apply', (req, res) => {
  return app._router.handle({ ...req, url: '/api/careers/apply' }, res);
});

// Contact Form Handler
app.post('/api/contact', (req, res) => {
  const { name, email, phone, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Please fill in all required fields (Name, Email, Message).'
    });
  }

  console.log('Received contact inquiry for PeopleLabs Consulting:', { name, email, company, message });

  res.status(200).json({
    success: true,
    message: `Thank you ${name}. Your message has been sent to our consulting team. We will respond within 1 business day.`,
    referenceId: `PLC-${Math.floor(100000 + Math.random() * 900000)}`
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PeopleLabs API listening on http://0.0.0.0:${PORT}`);
});

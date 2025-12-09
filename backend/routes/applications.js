// backend/routes/applications.js
var Application = require('../models/application');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pethaven';

const verifyToken = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return res.status(401).json({ message: 'Authorization token missing' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded.id;
    return next();
  });
};

module.exports = (router) => {
  router.route('/applications/user/:userId')
    .get(verifyToken, async (req, res) => {
      try {
        if (req.user !== req.params.userId) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        const applications = await Application.find({ userId: req.params.userId }).populate('petId');
        res.status(200).json(applications);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', details: err.message });
      }
    });

  router.route('/applications')
    .post(verifyToken, async (req, res) => {
      try {
        const application = new Application({
          petId: req.body.petId,
          userId: req.user,
          status: req.body.status || 'pending',
          message: req.body.message || '',
          createdAt: req.body.createdAt || new Date()
        });

        await application.save();
        res.status(201).json({ message: 'Application created!', application });
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Could not create application', details: err.message });
      }
    });

  router.route('/applications')
    .get(verifyToken, async (req, res) => {
      try {
        const applications = await Application.find();
        res.status(200).json(applications);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
      }
    });

  router.route('/applications/pet/:petId')
    .get(verifyToken, async (req, res) => {
      try {
        const applications = await Application.find({ petId: req.params.petId });
        res.status(200).json(applications);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
      }
    });

  router.route('/applications/:id')
    .get(verifyToken, async (req, res) => {
      try {
        const application = await Application.findById(req.params.id);
        if (!application) {
          return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(application);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
      }
    });

  router.route('/applications/:id')
    .put(verifyToken, async (req, res) => {
      try {
        const application = await Application.findById(req.params.id);
        if (!application) {
          return res.status(404).json({ message: 'Application not found' });
        }

        application.status = req.body.status || application.status;
        if (req.body.message !== undefined) {
          application.message = req.body.message;
        }

        await application.save();
        res.status(200).json({ message: 'Application updated!', application });
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Could not update application', details: err.message });
      }
    });

  router.route('/applications/:id')
    .delete(verifyToken, async (req, res) => {
      try {
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Application deleted!' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete application', details: err.message });
      }
    });

  return router;
};

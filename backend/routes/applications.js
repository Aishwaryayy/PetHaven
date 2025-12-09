// backend/routes/applications.js
var Application = require('../models/application');

module.exports = (router) => {
    // CREATE - POST /applications
    router.route('/applications')
        .post(async (req, res) => {
            try {
                const application = new Application({
                    petId: req.body.petId,
                    userId: req.body.userId,
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

    // GET ALL - GET /applications
    router.route('/applications')
        .get(async (req, res) => {
            try {
                const applications = await Application.find();
                res.status(200).json(applications);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error', details: err.message });
            }
        });

    // GET ALL BY PET - GET /applications/pet/:petId
    router.route('/applications/pet/:petId')
        .get(async (req, res) => {
            try {
                const applications = await Application.find({ petId: req.params.petId });
                res.status(200).json(applications);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error', details: err.message });
            }
        });

    // GET ONE - GET /applications/:id
    router.route('/applications/:id')
        .get(async (req, res) => {
            try {
                const application = await Application.findById(req.params.id);  // CHANGED

                if (!application) {
                    return res.status(404).json({ message: 'Application not found' });
                }
                res.status(200).json(application);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error', details: err.message });
            }
        });

    // UPDATE - PUT /applications/:id
    router.route('/applications/:id')
        .put(async (req, res) => {
            try {
                const application = await Application.findById(req.params.id);  // CHANGED
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

    // DELETE - DELETE /applications/:id
    router.route('/applications/:id')
        .delete(async (req, res) => {
            try {
                await Application.findByIdAndDelete(req.params.id);  // CHANGED
                res.status(200).json({ message: 'Application deleted!' });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Could not delete application', details: err.message });
            }
        });

    return router;
};
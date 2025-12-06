var AdopterUser = require('../models/adopterUser') 
var ShelterUser = require('../models/shelterUser')

module.exports = (router) => {
    router.route('/adopterUsers/register')
        .post((req, res) => {
            var adopterUser = new AdopterUser();
            adopterUser.name = req.body.name;
            adopterUser.email = req.body.email;
            adopterUser.role = req.body.role;
            adopterUser.location = req.body.location;
            adopterUser.password = req.body.password;
            adopterUser.save((err) => {
                if (err) return res.status(400).send(err);
                res.status(201).json({ message: 'Adopter user created!', user: adopterUser });
            });
        });
    
    router.route('/adopterUsers/login')
        .post((req, res) => {
            AdopterUser.findOne({ email: req.body.email }, (err, user) => {
                if (err) return res.status(500).send(err);
                if (!user) return res.status(401).json({ message: 'User not found' });
                if (user.password !== req.body.password) {
                    return res.status(401).json({ message: 'Invalid password' });
                }
                res.status(200).json({ message: 'Login successful', user: user });
            });
        });
    
    router.route('/adopterUsers')
        .get((req, res) => {
            AdopterUser.find((err, users) => {
                if (err) return res.status(500).send(err);
                res.status(200).json(users);
            });
        });
    
    router.route('/adopterUsers/:id')
        .get((req, res) => {
            AdopterUser.findById(req.params.id, (err, user) => {
                if (err) return res.status(500).send(err);
                if (!user) return res.status(404).json({ message: 'User not found' });
                res.status(200).json(user);
            });
        });
    
    router.route('/adopterUsers/:id')
        .put((req, res) => {
            AdopterUser.findById(req.params.id, (err, user) => {
                if (err) return res.status(500).send(err);
                if (!user) return res.status(404).json({ message: 'User not found' });
                user.name = req.body.name || user.name;
                user.email = req.body.email || user.email;
                user.location = req.body.location || user.location;
                user.save((err) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json({ message: 'User updated!', user: user });
                });
            });
        });
    
    router.route('/adopterUsers/:id')
        .delete((req, res) => {
            AdopterUser.remove({ _id: req.params.id }, (err) => {
                if (err) return res.status(500).send(err);
                res.status(200).json({ message: 'User deleted!' });
            });
        });
    
    router.route('/shelterUsers/register')
        .post((req, res) => {
            var shelterUser = new ShelterUser();
            shelterUser.name = req.body.name;
            shelterUser.email = req.body.email;
            shelterUser.role = req.body.role;
            shelterUser.address = req.body.address;
            shelterUser.phone = req.body.phone;
            shelterUser.website = req.body.website;
            shelterUser.password = req.body.password;
            shelterUser.save((err) => {
                if (err) return res.status(400).send(err);
                res.status(201).json({ message: 'Shelter user created!', user: shelterUser });
            });
        });
    
    router.route('/shelterUsers/login')
        .post((req, res) => {
            ShelterUser.findOne({ email: req.body.email }, (err, user) => {
                if (err) return res.status(500).send(err);
                if (!user) return res.status(401).json({ message: 'User not found' });
                if (user.password !== req.body.password) {
                    return res.status(401).json({ message: 'Invalid password' });
                }
                res.status(200).json({ message: 'Login successful', user: user });
            });
        });
    
    return router;
}
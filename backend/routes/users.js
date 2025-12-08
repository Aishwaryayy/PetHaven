var AdopterUser = require('../models/adopterUser'); 
var ShelterUser = require('../models/shelterUser');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pethaven';

// Simple JWT verification middleware
const verifyToken = (req, res, next) => {
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
    router.route('/adopterUsers/register')
        .post(async (req, res) => {
            try {
                var adopterUser = new AdopterUser();
                adopterUser.name = req.body.name;
                adopterUser.email = req.body.email;
                adopterUser.role = req.body.role;
                adopterUser.location = req.body.location;
                adopterUser.password = req.body.password;
                await adopterUser.save();
                const token = jwt.sign({ id: adopterUser._id }, JWT_SECRET, { expiresIn: '24h' });
                res.status(201).json({ message: 'Adopter user created!', user: adopterUser, token });
            } catch (err) {
                res.status(400).send(err);
            }
        });
    
    router.route('/adopterUsers/login')
        .post(async (req, res) => {
            try {
                const user = await AdopterUser.findOne({ email: req.body.email });
                if (!user) return res.status(401).json({ message: 'User not found' });
                if (user.password !== req.body.password) {
                    return res.status(401).json({ message: 'Invalid password' });
                }
                const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
                res.status(200).json({ message: 'Login successful', user: user, token });
            } catch (err) {
                res.status(500).send(err);
            }
        });
    
    router.route('/adopterUsers')
        .get(verifyToken, async (req, res) => {
            try {
                const users = await AdopterUser.find();
                res.status(200).json(users);
            } catch (err) {
                res.status(500).send(err);
            }
        });
    
    router.route('/adopterUsers/:id')
        .get(verifyToken, async (req, res) => {
            try {
                const user = await AdopterUser.findById(req.params.id);
                if (!user) return res.status(404).json({ message: 'User not found' });
                res.status(200).json(user);
            } catch (err) {
                res.status(500).send(err);
            }
        });
    
    router.route('/adopterUsers/:id')
        .put(verifyToken, async (req, res) => {
            try {
                const user = await AdopterUser.findById(req.params.id);
                if (!user) return res.status(404).json({ message: 'User not found' });
                user.name = req.body.name || user.name;
                user.email = req.body.email || user.email;
                user.location = req.body.location || user.location;
                await user.save();
                res.status(200).json({ message: 'User updated!', user: user });
            } catch (err) {
                if (err.name === 'CastError') {
                    res.status(500).send(err);
                } else {
                    res.status(400).send(err);
                }
            }
        });
    
    router.route('/adopterUsers/:id')
        .delete(verifyToken, async (req, res) => {
            try {
                await AdopterUser.deleteOne({ _id: req.params.id });
                res.status(200).json({ message: 'User deleted!' });
            } catch (err) {
                res.status(500).send(err);
            }
        });
    
    router.route('/shelterUsers/register')
        .post(async (req, res) => {
            try {
                var shelterUser = new ShelterUser();
                shelterUser.name = req.body.name;
                shelterUser.email = req.body.email;
                shelterUser.role = req.body.role;
                shelterUser.address = req.body.address;
                shelterUser.phone = req.body.phone;
                shelterUser.website = req.body.website;
                shelterUser.password = req.body.password;
                await shelterUser.save();
                const token = jwt.sign({ id: shelterUser._id}, JWT_SECRET, { expiresIn: '24h' });
                res.status(201).json({ message: 'Shelter user created!', user: shelterUser, token });
            } catch (err) {
                res.status(400).send(err);
            }
        });
    
    router.route('/shelterUsers/login')
        .post(async (req, res) => {
            try {
                const user = await ShelterUser.findOne({ email: req.body.email });
                if (!user) return res.status(401).json({ message: 'User not found' });
                if (user.password !== req.body.password) {
                    return res.status(401).json({ message: 'Invalid password' });
                }
                const token = jwt.sign({ id: user._id}, JWT_SECRET, { expiresIn: '24h' });
                res.status(200).json({ message: 'Login successful', user: user, token });
            } catch (err) {
                res.status(500).send(err);
            }
        });
    
    return router;
}
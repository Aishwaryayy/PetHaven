var Pet = require('../models/pet');
const upload = require('../upload');
var jwt = require('jsonwebtoken');
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

  router.route('/pets')
    .post(verifyToken, upload.array('photos', 5), async (req, res) => {
      try {
        const pet = new Pet({
          shelterId: req.body.shelterId,
          name: req.body.name,
          breed: Array.isArray(req.body.breed) ? req.body.breed : [req.body.breed],
          age: req.body.age,
          gender: req.body.gender,
          size: req.body.size,
          location: req.body.location,
          photos: req.files ? req.files.map(file => file.path) : [],
          thumbnail: req.files?.[0]?.path || '',
          profile: {
            summary: req.body.profile?.summary || req.body.summary || '',
            personalityTraits: req.body.profile?.personalityTraits || req.body.personalityTraits || [],
            routine: req.body.profile?.routine || req.body.routine || '',
            goodWithChildren: req.body.profile?.goodWithChildren ?? req.body.goodWithChildren ?? false,
            goodWithDogs: req.body.profile?.goodWithDogs ?? req.body.goodWithDogs ?? false,
            goodWithCats: req.body.profile?.goodWithCats ?? req.body.goodWithCats ?? false
          },
          availability: req.body.availability || 'available',
          datePosted: req.body.datePosted || new Date()
        });
        await pet.save();
        res.status(201).json({ message: 'Pet created!', pet });
      } catch (err) {
        console.error(err);
        res.status(400).send(err);
      }
    });

  router.route('/pets')
    .get(async (req, res) => {
      try {
        const query = {};
        const { breed, minAge, maxAge, gender, size, location, traits } = req.query;

        if (breed) query.breed = { $in: Array.isArray(breed) ? breed : [breed] };
        if (minAge !== undefined && maxAge !== undefined) query.age = { $gte: Number(minAge), $lte: Number(maxAge) };
        if (gender) query.gender = gender;
        if (size) query.size = size;
        if (location) query.location = location;
        if (traits) query['profile.personalityTraits'] = { $in: Array.isArray(traits) ? traits : [traits] };

        const pets = await Pet.find(query);
        res.status(200).json(pets);
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }
    });

  router.route('/pets/shelter/:shelterId')
    .get(verifyToken, async (req, res) => {
      try {
        const pets = await Pet.find({ shelterId: req.params.shelterId });
        res.status(200).json(pets);
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }
    });

  router.route('/pets/:id')
    .get(async (req, res) => {
      try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.status(200).json(pet);
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }
    });

  router.route('/pets/:id')
    .put(verifyToken, upload.array('photos', 5), async (req, res) => {
      try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        if (req.files && req.files.length > 0) {
          const newPhotos = req.files.map(file => file.path);
          pet.photos = [...pet.photos, ...newPhotos];
          pet.thumbnail = pet.thumbnail || newPhotos[0];
        }

        Object.assign(pet, {
          name: req.body.name ?? pet.name,
          breed: req.body['breed[]']
            ? (Array.isArray(req.body['breed[]']) ? req.body['breed[]'] : [req.body['breed[]']])
            : pet.breed,
          age: req.body.age ?? pet.age,
          gender: req.body.gender ?? pet.gender,
          size: req.body.size ?? pet.size,
          location: req.body.location ?? pet.location,
          availability: req.body.availability ?? pet.availability
        });

        if (req.body['profile[summary]'] || req.body['profile[routine]']) {
          pet.profile = {
            summary: req.body['profile[summary]'] ?? pet.profile.summary,
            routine: req.body['profile[routine]'] ?? pet.profile.routine,
            goodWithChildren: req.body['profile[goodWithChildren]'] === 'true',
            goodWithDogs: req.body['profile[goodWithDogs]'] === 'true',
            goodWithCats: req.body['profile[goodWithCats]'] === 'true',
            personalityTraits: req.body['profile[personalityTraits][]']
              ? (Array.isArray(req.body['profile[personalityTraits][]'])
                ? req.body['profile[personalityTraits][]']
                : [req.body['profile[personalityTraits][]']])
              : pet.profile.personalityTraits
          };
        }

        await pet.save();
        res.status(200).json({ message: 'Pet updated!', pet });
      } catch (err) {
        console.error(err);
        res.status(400).send(err);
      }
    });

  router.route('/pets/:id')
    .delete(verifyToken, async (req, res) => {
      try {
        await Pet.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Pet deleted!' });
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }
    });

  return router;
};

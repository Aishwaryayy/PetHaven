var Pet = require('../models/pet');

module.exports = (router) => {
    // CREATE - POST /pets
    router.route('/pets')
        .post((req, res) => {
            var pet = new Pet();
            pet.id = req.body.id;
            pet.shelterId = req.body.shelterId;
            pet.name = req.body.name;
            pet.species = req.body.species;
            pet.breed = req.body.breed;
            pet.age = req.body.age;
            pet.gender = req.body.gender;
            pet.size = req.body.size;
            pet.location = req.body.location;
            pet.thumbnail = req.body.thumbnail;
            pet.photos = req.body.photos || [];
            pet.profile = req.body.profile || {};
            pet.profile.summary = req.body.profile?.summary || req.body.summary || '';
            pet.profile.personalityTraits = req.body.profile?.personalityTraits || req.body.personalityTraits || [];
            pet.profile.routine = req.body.profile?.routine || req.body.routine || '';
            pet.profile.goodWithChildren = req.body.profile?.goodWithChildren !== undefined ? req.body.profile.goodWithChildren : (req.body.goodWithChildren !== undefined ? req.body.goodWithChildren : false);
            pet.profile.goodWithDogs = req.body.profile?.goodWithDogs !== undefined ? req.body.profile.goodWithDogs : (req.body.goodWithDogs !== undefined ? req.body.goodWithDogs : false);
            pet.profile.goodWithCats = req.body.profile?.goodWithCats !== undefined ? req.body.profile.goodWithCats : (req.body.goodWithCats !== undefined ? req.body.goodWithCats : false);
            pet.availability = req.body.availability || 'available';
            pet.datePosted = req.body.datePosted || new Date();
            pet.save((err) => {
                if (err) return res.status(400).send(err);
                res.status(201).json({ message: 'Pet created!', pet: pet });
            });
        });
    
    // GET ALL - GET /pets
    router.route('/pets')
        .get((req, res) => {
            Pet.find((err, pets) => {
                if (err) return res.status(500).send(err);
                res.status(200).json(pets);
            });
        });
    
    // GET ALL PETS BY SHELTER - GET /pets/shelter/:shelterId
    router.route('/pets/shelter/:shelterId')
        .get((req, res) => {
            Pet.find({ shelterId: req.params.shelterId }, (err, pets) => {
                if (err) return res.status(500).send(err);
                res.status(200).json(pets);
            });
        });
    
    // GET ONE - GET /pets/:id
    router.route('/pets/:id')
        .get((req, res) => {
            Pet.findOne({ id: req.params.id }, (err, pet) => {
                if (err) return res.status(500).send(err);
                if (!pet) return res.status(404).json({ message: 'Pet not found' });
                res.status(200).json(pet);
            });
        });
    
    // UPDATE - PUT /pets/:id
    router.route('/pets/:id')
        .put((req, res) => {
            Pet.findOne({ id: req.params.id }, (err, pet) => {
                if (err) return res.status(500).send(err);
                if (!pet) return res.status(404).json({ message: 'Pet not found' });
                
                pet.name = req.body.name || pet.name;
                pet.species = req.body.species || pet.species;
                pet.breed = req.body.breed || pet.breed;
                pet.age = req.body.age !== undefined ? req.body.age : pet.age;
                pet.gender = req.body.gender || pet.gender;
                pet.size = req.body.size || pet.size;
                pet.location = req.body.location || pet.location;
                pet.thumbnail = req.body.thumbnail || pet.thumbnail;
                if (req.body.photos !== undefined) pet.photos = req.body.photos;
                if (req.body.profile !== undefined) {
                    if (req.body.profile.summary !== undefined) pet.profile.summary = req.body.profile.summary;
                    if (req.body.profile.personalityTraits !== undefined) pet.profile.personalityTraits = req.body.profile.personalityTraits;
                    if (req.body.profile.routine !== undefined) pet.profile.routine = req.body.profile.routine;
                    if (req.body.profile.goodWithChildren !== undefined) pet.profile.goodWithChildren = req.body.profile.goodWithChildren;
                    if (req.body.profile.goodWithDogs !== undefined) pet.profile.goodWithDogs = req.body.profile.goodWithDogs;
                    if (req.body.profile.goodWithCats !== undefined) pet.profile.goodWithCats = req.body.profile.goodWithCats;
                }
                if (req.body.availability !== undefined) pet.availability = req.body.availability;
                
                pet.save((err) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json({ message: 'Pet updated!', pet: pet });
                });
            });
        });
    
    // DELETE - DELETE /pets/:id
    router.route('/pets/:id')
        .delete((req, res) => {
            Pet.remove({ id: req.params.id }, (err) => {
                if (err) return res.status(500).send(err);
                res.status(200).json({ message: 'Pet deleted!' });
            });
        });
    
    return router;
}

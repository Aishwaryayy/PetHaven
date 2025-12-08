var Pet = require('../models/pet');

module.exports = (router) => {
    // CREATE - POST /pets
    router.route('/pets')
        .post(async (req, res) => {
            try {
                const pet = new Pet();

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
                pet.profile.goodWithChildren =
                    req.body.profile?.goodWithChildren !== undefined
                        ? req.body.profile.goodWithChildren
                        : (req.body.goodWithChildren !== undefined ? req.body.goodWithChildren : false);
                pet.profile.goodWithDogs =
                    req.body.profile?.goodWithDogs !== undefined
                        ? req.body.profile.goodWithDogs
                        : (req.body.goodWithDogs !== undefined ? req.body.goodWithDogs : false);
                pet.profile.goodWithCats =
                    req.body.profile?.goodWithCats !== undefined
                        ? req.body.profile.goodWithCats
                        : (req.body.goodWithCats !== undefined ? req.body.goodWithCats : false);
                pet.availability = req.body.availability || 'available';
                pet.datePosted = req.body.datePosted || new Date();

                await pet.save(); 
                res.status(201).json({ message: 'Pet created!', pet: pet });
            } catch (err) {
                console.error(err);
                res.status(400).send(err);
            }
        });

    // GET ALL - GET /pets
    router.route('/pets')
        .get(async (req, res) => {
            try {
                const query = {};
                const preferences = req.body?.preferences || {};

                // Filter by breed (array of breeds - match any)
                if (preferences.breed && Array.isArray(preferences.breed) && preferences.breed.length > 0) {
                    query.breed = { $in: preferences.breed };
                }

                // Filter by age range [min, max]
                if (preferences.ageRange && Array.isArray(preferences.ageRange) && preferences.ageRange.length === 2) {
                    const [minAge, maxAge] = preferences.ageRange;
                    if (typeof minAge === 'number' && typeof maxAge === 'number') {
                        query.age = { $gte: minAge, $lte: maxAge };
                    }
                }

                // Filter by gender (skip if empty string)
                if (preferences.gender && preferences.gender.trim() !== '') {
                    query.gender = preferences.gender;
                }

                // Filter by size (skip if empty string)
                if (preferences.size && preferences.size.trim() !== '') {
                    query.size = preferences.size;
                }

                // Filter by location
                if (preferences.location && preferences.location.trim() !== '') {
                    query.location = preferences.location;
                }

                // Filter by traits (array of traits - match any in personalityTraits)
                if (preferences.traits && Array.isArray(preferences.traits) && preferences.traits.length > 0) {
                    query['profile.personalityTraits'] = { $in: preferences.traits };
                }

                const pets = await Pet.find(query); 
                res.status(200).json(pets);
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        });

    // GET ALL PETS BY SHELTER - GET /pets/shelter/:shelterId
    router.route('/pets/shelter/:shelterId')
        .get(async (req, res) => {
            try {
                const pets = await Pet.find({ shelterId: req.params.shelterId });
                res.status(200).json(pets);
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        });

    // GET ONE - GET /pets/:id
    router.route('/pets/:id')
        .get(async (req, res) => {
            try {
                const pet = await Pet.findOne({ id: req.params.id });
                if (!pet) {
                    return res.status(404).json({ message: 'Pet not found' });
                }
                res.status(200).json(pet);
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        });

    // UPDATE - PUT /pets/:id
    router.route('/pets/:id')
        .put(async (req, res) => {
            try {
                const pet = await Pet.findOne({ id: req.params.id });
                if (!pet) {
                    return res.status(404).json({ message: 'Pet not found' });
                }

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

                await pet.save(); 
                res.status(200).json({ message: 'Pet updated!', pet: pet });
            } catch (err) {
                console.error(err);
                res.status(400).send(err);
            }
        });

    // DELETE - DELETE /pets/:id
    router.route('/pets/:id')
        .delete(async (req, res) => {
            try {
                await Pet.deleteOne({ id: req.params.id }); 
                res.status(200).json({ message: 'Pet deleted!' });
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        });

    return router;
};

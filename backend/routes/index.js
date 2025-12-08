var usersRoutes = require('./users');
var petsRoutes = require('./pets');
var applicationsRoutes = require('./applications');

module.exports = (app, router) => {
    usersRoutes(router);
    petsRoutes(router);
    applicationsRoutes(router);

    app.use('/', router);
};

var usersRoutes = require('./users');
var petsRoutes = require('./pets');
var applicationsRoutes = require('./applications');

module.exports = (app, router) => {
    // Register all route modules
    usersRoutes(router);
    petsRoutes(router);
    applicationsRoutes(router);
    
    // Mount the router on the app
    app.use('/', router);
};


const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    errorResponse(res, statusCode, message);
};

module.exports = errorHandler;

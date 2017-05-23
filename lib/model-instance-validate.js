'use strict';

const createErrorResponseObj = require('./create-error-response-obj');

module.exports = ([modelInstance, ...opts] = data) => modelInstance.build(req.body).validate().then(result => {
	if(result && result.errors && result.errors.length > 0){
		return Promise.reject(createErrorResponseObj(result, modelName));
	}
	return Promise.resolve([modelInstance, ...opts]);
});
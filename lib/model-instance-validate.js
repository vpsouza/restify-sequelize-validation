'use strict';

const createErrorResponseObj = require('./create-error-response-obj');

module.exports = ([modelInstance, body, ...opts] = data) => modelInstance.build(body).validate().then(result => {
	if(result && result.errors && result.errors.length > 0){
		return Promise.reject(createErrorResponseObj(result, modelName));
	}
	return Promise.resolve([modelInstance, ...opts]);
});
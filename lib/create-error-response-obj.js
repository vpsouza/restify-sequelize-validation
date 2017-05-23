'use strict';

module.exports = (resultError, modelName) => {
	let errorResponse = {
		model: modelName
	};

	return resultError.errors.reduce((err, obj) => {
		if (!obj[err.path]) {
			obj[err.path] = [];
		}

		obj[err.path].push({
			type: err.type,
			message: err.message
		});
	}, errorResponse);
};
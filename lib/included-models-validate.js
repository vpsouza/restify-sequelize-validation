'use strict';

const getIncludedModels = require('./get-included-models');

module.exports = ([modelInstance, body, ...opts] = data) => {
	const createSuccessReturn = () => Promise.resolve([modelInstance, body, ...opts]);

	let includedModels = getIncludedModels(body, modelInstance, true);
	if(includedModels.length > 0){
		let arrayToBeValidated = [];
		includedModels.forEach(function(includedModel){
			if(Array.isArray(body[includedModel.relName])){
				Array.prototype.push.apply(arrayToBeValidated, body[includedModel.relName].map(elm => includedModel.target.build(elm)));
			} else {
				arrayToBeValidated.push(includedModel.target.build(body[includedModel.relName]));
			}
		});

		if(arrayToBeValidated.length > 0){
			return Promise.all(arrayToBeValidated.map(elm => elm.validate())).then(
				result => {
					let invalidItems = result.filter(elm => elm && elm.errors && elm.errors.length && elm.errors.length > 0);
					if(invalidItems.length > 0)
						return Promise.reject(
							invalidItems
								.reduce((elm, errors) => errors.push(createErrorResponseObj(elm, modelName + "." + arrayToBeValidated[errors.length].$modelOptions.name.singular)), [])
						);
					return createSuccessReturn();
				}
			);
		} else {
			return createSuccessReturn();
		}
	} else {
		return createSuccessReturn();
	}
};
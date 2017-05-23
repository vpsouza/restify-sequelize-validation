'use strict';

module.exports = (appAuthSecret, server, modelName, models) => {
	const restify = require('restify');
	const getTenant = require('./lib/get-tenant') (appAuthSecret);
	const getModelInstance = require('./lib/get-model-instance')(server,modelName,models);
	const modelInstanceValidate = require('./lib/model-instance-validate');
	const includedModelsValidate = require('./lib/included-models-validate');
    
    return function(req,res,next){
        if(!req.body){
            return res.send(new restify.BadRequestError("Request Body Empty!"));
        } else {
			return [getTenant, getModelInstance, modelInstanceValidate, includedModelsValidate]
				.reduce((chain, task) => chain.then(task), Promise.resolve([req.params.jwt, req.body]))
					.then(res => next())
					.catch(err => res.send(400, err));
        }
    };
};
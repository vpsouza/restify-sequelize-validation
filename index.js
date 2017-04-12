'use strict';

const restify = require('restify'),
      modelUtils = require('./lib/model-utils'),
      getTenant = require('./lib/get-tenant');

/**
 * Applies the Sequelize model validation to request on a Restify webserver
 * based on the given model name. 
 * @param {object} server
 * @param {string} modelName
 * @param {object} models
 * @return {function}
 */
module.exports = function (server, modelName, models){

    function createErrorResponseObj(resultError, modelName){
        let errorResponse = {model: modelName};

        resultError.errors.forEach((elm) => {
            if(!errorResponse[elm.path]){
                errorResponse[elm.path] = [];
            }

            errorResponse[elm.path].push({
                type: elm.type,
                message: elm.message
            });
        });

        return errorResponse;
    }

    return function(req,res,next){
        if(!req.body){
            return res.send(new restify.BadRequestError("Request Body Empty!"));
        } else {
            let modelInstance = getModelInstance(server, getTenant(req), modelName, models);
            modelInstance.build(req.body).validate().then(function(result){
                if(result && result.errors && result.errors.length > 0){
                    return res.send(400, createErrorResponseObj(result, modelName));
                }

                let includedModels = modelUtils.getIncludedModels(req.body, modelInstance, true);
                if(includedModels.length > 0){
                    let arrayToBeValidated = [];
                    includedModels.forEach(function(includedModel){
                        if(Array.isArray(req.body[includedModel.relName])){
                            Array.prototype.push.apply(arrayToBeValidated, req.body[includedModel.relName].map(function(elm){
                                return includedModel.target.build(elm);
                            }));
                        } else {
                            arrayToBeValidated.push(includedModel.target.build(req.body[includedModel.relName]));
                        }
                    });

                    Promise.all(arrayToBeValidated.map(function(elm){
                        return elm.validate();
                    })).then(
                        function(result){
                            if(result){
                                let invalidItems = result.filter(function(elm){
                                    return elm && elm.errors && elm.errors.length && elm.errors.length > 0;
                                });
                                if(invalidItems.length > 0){
                                    let detailedInvalidItems = [];
                                    result.forEach(function(elm, index){
                                        if(elm.errors && elm.errors.length && elm.errors.length > 0){
                                            detailedInvalidItems.push(createErrorResponseObj(elm, modelName + "." + arrayToBeValidated[index].$modelOptions.name.singular));
                                        }
                                    });

                                    return res.send(400, detailedInvalidItems);
                                }
                                next();
                            } else {
                                next();
                            }							
                        }
                    );
                } else {
                    next();
                }
            })
        }
    };

    function getModelInstance(server, tenantID, modelName, models){
        return models(server, tenantID)[modelName.charAt(0).toUpperCase() + modelName.slice(1)];
    }
}
module.exports = (function() {
	return {
		getIncludedModels: function(modelInstance, model, includeRelName){
            /*
            let assoc = {
                address: {
                    accessors: {
                        create: "createAddress",
                        get: "getAddress",
                        set: "setAddress"
                    },
                    as: "address",
                    associationType: "HasOne",
                    foreignKey: "customerId",
                    foreignKeyAttribute: {
                        identifierField: "customerId",
                        isSelfAssociation: false,
                        isSingleAssociation: true,
                        source: { //Model
                            name: "customer"
                        },
                        sourceIdentifier: "id",
                        sourceKey: "id",
                        sourceKeyIsPrimary: true,
                        target: { //Model
                            name: "address"
                        }
                    },
                    source: { //Model
                        name: "customer"
                    },
                    target: { //Model
                        name: "address"
                    }
                },
                contacts: {

                }
            }
            */

            const includedModels = [];
            if(model.getRelations){
                for(let prop in model.getRelations()){
                    if((modelInstance && modelInstance[prop]) || !modelInstance){
                        if(includeRelName){
                            includedModels.push( {relName: prop, target: model.getRelations()[prop].target});
                        } else {
                            includedModels.push(model.getRelations()[prop].target);
                        }
                    }
                }
            }
            
			return includedModels;
		}
	}
})();
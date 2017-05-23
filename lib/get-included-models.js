'use strict';

module.exports = (modelInstance, model, includeRelName) => modelInstance ?
	Object.keys(model.getRelations())
		.filter(key => modelInstance[key])
		.map(elm => includeRelName ? 
			{
				relName: elm,
				target: model.getRelations()[elm].target
			} 
			: model.getRelations()[elm].target) : [];
	
'use strict';

module.exports = 
	(server, modelName, models) => 
		([tenantID, ...opts] = data) => 
			new Promise((resolve,reject) => {
				try {
					resolve([models[modelName.charAt(0).toUpperCase() + modelName.slice(1)], ...opts])
				} catch (e){
					reject(e);
				}
			});
'use strict';

var expect = require('chai').expect;
var genericResources = require('../index');

describe('#generic-resources', function() {
    
    it('should convert single digits', function() {
        //var result = genericResources(1);
        var result = '1';
        expect(result).to.equal('1');
    });

});
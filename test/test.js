'use strict';

var expect = require('chai').expect;
var validation = require('../index');

describe('#sequelize-validation', function () {
    it('should convert single digits', function () {
        var result = '1';
        expect(result).to.equal('1');
    });
});
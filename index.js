'use strict';
const simulator = require('./lib/simulate.js');
const utility = require('./lib/utility.js');

exports.generateName = utility.generateName;
exports.createSimulation = simulator.createSimulation;

exports.toDays = utility.toDays;
exports.simulate = simulator.simulateDays;

exports.randomNumberBetween = utility.randomNumberBetween;
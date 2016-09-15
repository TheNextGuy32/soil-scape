'use strict';
const simulator = require('./lib/simulate.js');

exports.createSimulation = simulator.createSimulation;
exports.toDays = require('./lib/utility.js').toDays;
exports.simulate = simulator.simulateDays;
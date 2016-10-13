"use strict"
const plant = require('./plant.js');
//  var tectonic = require('./tectonic.js');
const land = require('./land.js');
const weather = require('./weather.js');
const water = require('./water.js');
const context = require('./context.js');

const utility = require('./utility.js');

exports.createSimulation = (specs) => {
  const ctx = context(
      specs.name
      , specs.size.columns, specs.size.rows
      , specs.plantsPer
      , specs.tilt, specs.rotation
      , specs.rules);

  land.createBlobbyLandmass(ctx);
  water.createOcean(ctx, ctx.area * 2);

  //  tectonic.createTectonicPlates(ctx);
  plant.sprayPlants(ctx);

  weather.setSunlight(ctx);
  weather.estimateRainfall(ctx);

  return ctx;
};
const simulateDay = (ctx) => {
  plant.simulatePlants(ctx);
};
const onMonth = (ctx) => {

};
const onYear = (ctx) => {

};
exports.simulateDays = (ctx, days, every) => {
  const dates = [];
  for (let d = 0; d < days; d += 1) {
    ctx.days += 1;

    if (ctx.days % 360 === 0) {
      onYear(ctx);
    }

    if (ctx.days % 30 === 0) {
      onMonth(ctx);
    }

    //  Daily logic
    simulateDay(ctx);

    //  Add to dates
    if (ctx.days % every === 0) {
      ctx.calculateHighest();
      dates.push(utility.cloneObject(ctx));
    }

    //  Is the final day saved?
    if (dates.length > 0 && dates[dates.length - 1].days % every === 0) {
      ctx.calculateHighest(ctx);
      dates.push(utility.cloneObject(ctx));
    }
  }
  return dates;
};

var plant = require('./plant.js');
//  var tectonic = require('./tectonic.js');
var land = require('./land.js');
var weather = require('./weather.js');
var water = require('./water.js');
var context = require('./context.js');

var utility = require('./utility.js');

exports.createSimulation = function(specs)
{ 
  var ctx = context(
      specs.name
      , specs.size.columns, specs.size.rows
      , specs.plantsPer
      , specs.tilt, specs.rotation
      , specs.rules);
  
  land.CreateBlobbyLandmass(ctx);
  water.CreateOcean(ctx, ctx.area * 2);

  //  tectonic.CreateTectonicPlates(ctx);
  plant.SprayPlants(ctx);

  weather.SetSunlight(ctx);
  weather.EstimateRainfall(ctx);

  return ctx;
};

exports.simulateDays = function(ctx,days,every)
{
  var dates = [];
  for(var d = 0 ; d < days ; d++)
  {
    ctx.days++;

    if(ctx.days % 360 == 0)
    {
      //  Yearly logic
      onYear(ctx);
    }

    if(ctx.days % 30 == 0)
    {
      //  Monthly logic
      onMonth(ctx);
    }

    //  Daily logic
    simulateDay(ctx);

    //  Add to dates
    if(ctx.days % every == 0)
    {
      ctx.calculateHighest();
      dates.push(utility.cloneObject(ctx));
    }

    //  Is the final day saved?
    if(dates.length>0 && dates[dates.length-1].days % every == 0)
    {
      ctx.calculateHighest(ctx);
      dates.push(utility.cloneObject(ctx));
    }
  }
  return dates;
};

var simulateDay = function(ctx)
{
  plant.simulatePlants(ctx);
};
var onMonth = function(ctx)
{

};
var onYear = function(ctx)
{

};
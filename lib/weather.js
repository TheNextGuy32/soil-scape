exports.SetSunlight = (ctx) => {
  const equator = Math.round(ctx.rows * ctx.tilt);

  const minSunlight = 1;
  const maxSunlight = 100;

  const distanceBeforeTundra = Math.round(ctx.rows / 1.6);

  let lightOnRow = 0;

  for (let y = 0; y < ctx.rows; y += 1) {
    //  Determining sunlight value
    const distanceToEquator = Math.abs(equator - y);

    if (distanceToEquator > distanceBeforeTundra) {
      lightOnRow = minSunlight;
    } else if (distanceToEquator === 0) {
      lightOnRow = maxSunlight;
    } else {
      const lightRatio = 1 - (distanceToEquator / distanceBeforeTundra);
      lightOnRow = Math.round((maxSunlight - minSunlight) * lightRatio);
    }

    //  Setting sunlight value
    for (let x = 0; x < ctx.columns; x += 1) {
      ctx.sunlight[ctx.convertToZ({ f: x, s: y })] = lightOnRow;
    }
  }
};

exports.EstimateRainfall = (ctx) => {
  // var temperature = new Array(ctx.area);
  // var moisture = new Array(ctx.area);

  // //var pendingTemperature = new Array(ctx.area);
  // //var pendingMoisture = new Array(ctx.area);

  // //  Creating the wind!
  // for (var m = 0; m < ctx.area; m++)
  // {
  //     temperature[m] = ctx.sunlight[m];
  //     moisture[m] = 5;

  //     //pendingMoisture[m] = 0;
  //     //pendingTemperature[m] = 0;
  // }

  // var rainLikelihood = new Array(ctx.area);
  // var windDirection = ctx.rotation;

  // for (var m = 0; m < ctx.area; m++)
  // {
  //     var coord = ctx.ConvertToCoord(m);
  //     rainLikelihood[m]=0;


  //     var previousCoord = ctx.ConvertToZ({f:coord.f+windDirection,s:coord.s});
  //     var upCoord = ctx.ConvertToZ({f:nextCoord.f,s:nextCoord.s-1});
  //     var downCoord = ctx.ConvertToZ({f:nextCoord.f,s:nextCoord.s+1});

  //     //  This province has water
  //     if(ctx.depth[m] > 0)
  //     {
  //         rainLikelihood[m]++;
  //     }

  //     if(ctx.depth[previousCoord] == 0)
  //     {
  //         rainLikelihood[m]--;
  //     }

  //     if( coord.y < Math.round(ctx.rows * ctx.tilt))
  //     {
  //         //Above equator

  //     }
  //     else if(coord.y > Math.round(ctx.rows * ctx.tilt))
  //     {
  //         //Below

  //     }
  //     else
  //     {
  //         //on
  //     }


  //     rainLikelihood[m] *= sunlight[m];

  // }

  // for (var q = 0; q < 1000; q++)
  // {
  //     //  Clear pending changes
  //     for (var m = 0; m < ctx.area; m++)
  //     {
  //         pendingMoisture[m] = 0;
  //         pendingTemperature[m] = 0;
  //     }

  //     //  Collecting temperature and moisture from environment
  //     for (var m = 0; m < ctx.area; m++)
  //     {
  //         //  Moisture
  //         if (ctx.depth[m] > 0.0)
  //         {
  //             //  % chance of gaining moisture from ocean
  //             if (utility.randomNumberBetween(0, 100) > 60) moisture[m]++;

  //             //  Don't exceed a moisture of 10
  //             if (moisture[m] > 10) moisture[m] = 10;
  //         }
  //         else
  //         {
  //             //  And losing it to land
  //             moisture[m] -= 2;
  //             if (utility.randomNumberBetween(0, 100) > 60) moisture[m]--;
  //             if (moisture[m] < 0) moisture[m] = 0;
  //         }

  //         //  Temperature
  //         if (ctx.sunlight[m] > temperature[m])
  //         {
  //             //  Gaining temperature from sunlight
  //             temperature[m]++;
  //             moisture[m]++;
  //             if (temperature[m] > 10) temperature[m] = 10;
  //         }
  //         else
  //         {
  //             temperature[m] -= 2;
  //             if (temperature[m] < 0) temperature[m] = 0;
  //         }

  //         //  Artic regions killing moisture
  //         if (temperature[m] <= 1)
  //         {
  //             moisture[m] -= 3;
  //             if (moisture[m] < 0) moisture[m] = 0;
  //         }
  //         else if (temperature[m] <= 3)
  //         {
  //             moisture[m] -= 2;
  //             if (moisture[m] < 0) moisture[m] = 0;
  //         }

  //     }
  //     //  Moving wind!
  //     for (var m = 0; m < ctx.area; m++)
  //     {
  //         var coord = ctx.ConvertToCoord(m);

  //         var nextCoord = ctx.ConvertToZ({f:coord.f+windDirection,s:coord.s});
  //         var upCoord = ctx.ConvertToZ({f:nextCoord.f,s:nextCoord.s-1});
  //         var downCoord = ctx.ConvertToZ({f:nextCoord.f,s:nextCoord.s+1});

  //         if (temperature[m] > pendingTemperature[nextCoord]
  //             &&
  //             moisture[m] > pendingMoisture[nextCoord])
  //         {
  //             pendingTemperature[nextCoord] = temperature[m]++;
  //             pendingMoisture[nextCoord] = moisture[m]++;
  //         }
  //         if (temperature[m] > pendingTemperature[upCoord]
  //             &&
  //             moisture[m] > pendingMoisture[upCoord])
  //         {
  //             pendingTemperature[upCoord] = temperature[m]++;
  //             pendingMoisture[upCoord] = moisture[m]++;
  //         }
  //         if (temperature[m] > pendingTemperature[downCoord]
  //             &&
  //             moisture[m] > pendingMoisture[downCoord])
  //         {
  //             pendingTemperature[downCoord] = temperature[m]++;
  //             pendingMoisture[downCoord] = moisture[m]++;
  //         }
  //     }

  //     //  Applying pending changes to
  //     for (var m = 0; m < ctx.area; m++)
  //     {
  //         temperature[m] = pendingTemperature[m];
  //         moisture[m] = pendingMoisture[m];
  //     }
  // }

  //  Applying the final moisture
  for (let m = 0; m < ctx.area; m += 1) {
    // console.log(moisture[m]);
    ctx.rainfall[m] = 100 * (Math.abs((ctx.rows / 2) - ctx.convertToCoord(m).s) / (ctx.rows / 2));
  }
};

const utility = require('./utility.js');

function getMagnitude(coord) {
  return Math.sqrt(Math.pow(coord.f, 2) + Math.pow(coord.s, 2));
}

function shouldPaint(ctx, coord, goo, threshold, balls) {
  let sum = 0;
  for (let b = 0; b < balls.length; b++) {
    //  can we get to ball by wrapping aroudn the torus?
    let distanceX = Math.abs(balls[b].coord.f - coord.f);
    if (distanceX > ctx.columns / 2) {
      distanceX = ctx.columns - distanceX;
    }
    let distanceY = Math.abs(balls[b].coord.s - coord.s);
    if (distanceY > ctx.rows / 2) {
      distanceY = ctx.rows - distanceY;
    }

    sum += balls[b].radius / Math.max(
      0.0001, Math.pow(getMagnitude({ f: distanceX, s: distanceY }), goo));
  }
  // console.log(sum);
  return sum > threshold;
}

function createBlob(ctx, startingCoord, radius, numberNodes) {
  const balls = [];

  //  creating the balls
  for (let n = 0; n < numberNodes; n++) {
    balls.push(
      {
        coord: {
          f: startingCoord.f + utility.randomNumberBetween(-radius * 2, radius * 2),
          s: startingCoord.s + utility.randomNumberBetween(-radius * 2, radius * 2),
        },
        radius: radius / numberNodes,
      });
  }

  //  Tralling throuhg all provinces seeing if they are the blob.
  const blob = [];
  for (let z = 0; z < ctx.area; z++) {
    if (shouldPaint(ctx, ctx.convertToCoord(z), 1, 0.8, balls)) {
      blob.push(z);
    }
  }
  return blob;
}


exports.createBlobbyLandmass = (ctx) => {
  for (let z = 0; z < ctx.area; z++) {
    ctx.continentMap[z] = 0;
  }

  for (let b = 0; b < 3; b++) {
    const startingCoord = {
      f: (ctx.columns / 2) + utility.randomNumberBetween(-ctx.columns / 10, -ctx.columns / 10),
      s: (ctx.rows / 2) + utility.randomNumberBetween(-ctx.rows / 10, -ctx.rows / 10),
    };

    const continent = createBlob(ctx, startingCoord, ctx.columns / 10, 6);
    for (let p = 0; p < continent.length; p++) {
      if (!ctx.continent[continent[p]]) {
        ctx.height[continent[p]] += utility.randomNumberBetween(2, 5);
        ctx.continent[continent[p]] = true;
      }
    }
  }
};
exports.createLandmass = (ctx) => {
  for (let z = 0; z < ctx.area; z++) {
    ctx.continentMap[z] = 0;
  }

  for (let c = 0; c < 3; c++) {
    //  create continent height
    let centerContinentX = -1;
    let centerContinentY = -1;

    while (centerContinentX === -1 || centerContinentY === -1) {
      const attemptedX = (ctx.columns / 2) +
        utility.randomNumberBetween(-ctx.columns / 4, ctx.columns / 4);
      const attemptedY = (ctx.rows / 2) +
        utility.randomNumberBetween(-ctx.rows / 4, ctx.rows / 4);

      if (ctx.continentMap[ctx.convertToZ({ f: attemptedX, s: attemptedY })] === 0) {
        centerContinentX = attemptedX;
        centerContinentY = attemptedY;
      }
    }

    // How far we venture from the continent to place a blob
    const radius = ((ctx.columns + ctx.rows) / 2) / 6;

    for (let i = 0; i < 5; i++) {
      const blobCenter = {
        f: centerContinentX + utility.randomNumberBetween(-radius, radius),
        s: centerContinentY + utility.randomNumberBetween(-radius, radius) };

      ctx.wrapCoordinate(blobCenter);

      const blobRadius = utility.randomNumberBetween(2, 8);

      const blobResults = ctx.getRingOfCoordinates(ctx.convertToZ(blobCenter), blobRadius, true);

      for (let p = 0; p < blobResults.length; p++) {
        if (!ctx.continent[blobResults[p]]) {
          ctx.height[blobResults[p]] += utility.randomNumberBetween(2, 5);
          ctx.continent[blobResults[p]] = true;
        }
      }
    }
  }
};

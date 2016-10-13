"use strict"
const utility = require('./utility');

function createPillarOfWaterAtZ(ctx, z, unitsOfWater) {
  ctx.depth[z] += unitsOfWater;
  ctx.unresolvedWater[z] = true;
}


function giveWater(z, accuracy, ctx) {
  let lastIndex = -1;

  let depth = ctx.depth[z];

  if (depth === 0) {
    ctx.unresolvedWater[z] = false;
    return lastIndex;
  }

  const height = ctx.height[z];
  let elevation = depth + height;

  const neighbors = ctx.getNeighbors(z, false);

  let numberPossibleDonees = 0;
  //  Continually give out water till you can't
  do {
    depth = ctx.depth[z];
    elevation = depth + height;

    let steepestSlope = 0;
    let steepestSlopeValue = 0;
    numberPossibleDonees = 0;

    //  Find the steepest slope
    for (let n = 0; n < neighbors.length; n++) {
      const nIndex = neighbors[n];

      const neighborDepth = ctx.depth[nIndex];
      const neighborHeight = ctx.height[nIndex];
      const neighborElevation = neighborDepth + neighborHeight;

      const slope = elevation - neighborElevation;

      //  Do we have a downward slow too great?
      if (slope > accuracy) {
        numberPossibleDonees++;

        if (slope > steepestSlopeValue) {
          steepestSlope = n;
          steepestSlopeValue = slope;
        }
      }

      //  Do we have an upward slope that is too great?
      if (slope < -accuracy) {
        //  If that plot has water then it needs to queue up for it
        if (neighborDepth > 0) {
          ctx.unresolvedWater[nIndex] = true;
          lastIndex = nIndex;
        }
      }
    }

    if (numberPossibleDonees >= 1) {
      //  There was at least one downward slope that was too great

      const nIndex = neighbors[steepestSlope];
      ctx.unresolvedWater[nIndex] = true;

      //  Can we pass half our height difference
      if (ctx.depth[z] > (steepestSlopeValue / 2)) {
        //  Yes we can
        ctx.depth[z] -= (steepestSlopeValue / 2);
        ctx.depth[nIndex] += (steepestSlopeValue / 2);
      } else {
        //  No we cant give enoguht to level them so we give all instead
        ctx.depth[z] = 0;
        ctx.depth[nIndex] += ctx.depth[z];
      }
    } else {
      //  There was nothing to put out so
      ctx.unresolvedWater[z] = false;
    }
  }
  // If we had more than one possibility than we can try again
  while (numberPossibleDonees > 1 && ctx.depth[z] > 0);

  return lastIndex;
}
function resolveWater(ctx) {
  const accuracy = 0.05;// 0.005;
  let next = 0;
  while ((next = giveWater(next, accuracy, ctx)) < ctx.area) {
    if (next === -1) {
      next = 0;

      do {
        next++;
        if (next >= ctx.area) {
          return;
        }
      } while (!ctx.unresolvedWater[next]);
    }
  }
}
exports.flushWater = function (ctx) {
  for (let z = 0; z < ctx.area; z++) {
    if (ctx.depth[z] > 0) {
      ctx.unresolvedWater[z] = true;
    }
  }
  resolveWater(ctx);
};
exports.CreateOcean = (ctx, totalWaterRequired) => {
  const numberPillars = ctx.area;

  const startFlat = true;
  if (startFlat) {
    for (let p = 0; p < ctx.area; p++) {
      if (!ctx.continent[p]) {
        createPillarOfWaterAtZ(ctx,
          p,
          totalWaterRequired / numberPillars);
      } else {
        let pillarZ = -1;
        while (pillarZ === -1) {
          const attempt = utility.randomNumberBetween(0, ctx.area);
          if (!ctx.continent[attempt]) {
            pillarZ = attempt;
          }
        }

        createPillarOfWaterAtZ(ctx,
          pillarZ,
          totalWaterRequired / numberPillars);
      }
    }
  } else {
    for (let p = 0; p < numberPillars; p++) {
      let pillarZ = -1;
      while (pillarZ === -1) {
        const attempt = utility.randomNumberBetween(0, ctx.area);
        if (!ctx.continent[attempt]) {
          pillarZ = attempt;
        }
      }

      createPillarOfWaterAtZ(ctx,
        pillarZ,
        totalWaterRequired / numberPillars);
    }
  }
  resolveWater(ctx);
};

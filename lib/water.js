"use strict"
const utility = require('./utility');

function createPillarOfWaterAtZ(ctx, z, unitsOfWater) {
  ctx.datasets.depth.value[z] += unitsOfWater;
  ctx.datasets.unresolvedWater.value[z] = true;
}


function giveWater(z, accuracy, ctx) {
  let lastIndex = -1;

  let depth = ctx.datasets.depth.value[z];

  if (depth === 0) {
    ctx.datasets.unresolvedWater.value[z] = false;
    return lastIndex;
  }

  const height = ctx.datasets.height.value[z];
  let elevation = depth + height;

  const neighbors = ctx.getNeighbors(z, false);

  let numberPossibleDonees = 0;
  //  Continually give out water till you can't
  do {
    depth = ctx.datasets.depth.value[z];
    elevation = depth + height;

    let steepestSlope = 0;
    let steepestSlopeValue = 0;
    numberPossibleDonees = 0;

    //  Find the steepest slope
    for (let n = 0; n < neighbors.length; n++) {
      const nIndex = neighbors[n];

      const neighborDepth = ctx.datasets.depth.value[nIndex];
      const neighborHeight = ctx.datasets.height.value[nIndex];
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
          ctx.datasets.unresolvedWater.value[nIndex] = true;
          lastIndex = nIndex;
        }
      }
    }

    if (numberPossibleDonees >= 1) {
      //  There was at least one downward slope that was too great

      const nIndex = neighbors[steepestSlope];
      ctx.datasets.unresolvedWater.value[nIndex] = true;

      //  Can we pass half our height difference
      if (ctx.datasets.depth.value[z] > (steepestSlopeValue / 2)) {
        //  Yes we can
        ctx.datasets.depth.value[z] -= (steepestSlopeValue / 2);
        ctx.datasets.depth.value[nIndex] += (steepestSlopeValue / 2);
      } else {
        //  No we cant give enoguht to level them so we give all instead
        ctx.datasets.depth.value[z] = 0;
        ctx.datasets.depth.value[nIndex] += ctx.datasets.depth.value[z];
      }
    } else {
      //  There was nothing to put out so
      ctx.datasets.unresolvedWater.value[z] = false;
    }
  }
  // If we had more than one possibility than we can try again
  while (numberPossibleDonees > 1 && ctx.datasets.depth.value[z] > 0);

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
      } while (!ctx.datasets.unresolvedWater.value[next]);
    }
  }
}
exports.flushWater = function (ctx) {
  for (let z = 0; z < ctx.area; z++) {
    if (ctx.datasets.depth.value[z] > 0) {
      ctx.datasets.unresolvedWater.value[z] = true;
    }
  }
  resolveWater(ctx);
};
exports.CreateOcean = (ctx, totalWaterRequired) => {
  const numberPillars = ctx.area;

  const startFlat = true;
  if (startFlat) {
    for (let p = 0; p < ctx.area; p++) {
      if (!ctx.datasets.continent.value[p]) {
        createPillarOfWaterAtZ(ctx,
          p,
          totalWaterRequired / numberPillars);
      } else {
        let pillarZ = -1;
        while (pillarZ === -1) {
          const attempt = utility.randomNumberBetween(0, ctx.area);
          if (!ctx.datasets.continent.value[attempt]) {
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
        if (!ctx.datasets.continent.value[attempt]) {
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

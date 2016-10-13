"use strict"
const utility = require('./utility.js');

module.exports = class Context {

  constructor(name, columns, rows, plotsPer, tilt, rotation, rules) {
    this.name = name;

    this.columns = columns;
    this.rows = rows;
    this.area = rows * columns;

    this.tilt = tilt;
    this.rotation = rotation;

    this.rules = rules;

    this.days = 0;

    this.highest = 1;
    this.deepest = 1;

    this.hottest = 1;
    this.highestStress = 1;

    this.brightest = 1;
    this.wettest = 1;

    this.tallest = 1;
    this.richestNutro = 1;
    this.richestNucium = 1;
    this.richestntStore = 1;
    this.richestncStore = 1;
    this.richestWaterStore = 1;
    this.tallestTree = 1;
    this.thirstiest = 0;
    this.heliest = 0;
    this.youngest = 0;

    this.plantColumnsPer = Math.sqrt(plotsPer);
    this.plantColumns = this.columns * this.plantColumnsPer;
    this.plantRowsPer = Math.sqrt(plotsPer);
    this.plantsPer = this.plantRowsPer * this.plantColumnsPer;
    this.plantRows = this.rows * this.plantRowsPer;
    this.plantArea = this.plantColumns * this.plantRows;

    this.tectonic = Array(this.area).fill(0);
    this.heat = Array(this.area).fill(0);
    this.stress = Array(this.area).fill(0);
    this.fracture = Array(this.area).fill(0);

    this.height = Array(this.area).fill(2);
    this.depth = Array(this.area).fill(0);

    this.sunlight = Array(this.area).fill(1);
    this.rainfall = Array(this.area).fill(5);

    this.continent = Array(this.area).fill(false);
    this.unresolvedWater = Array(this.area).fill(false);

    //  PLOT DATA  //
    this.nt = Array(this.area).fill(utility.randomNumberBetween(0, 5) * this.plantsPer);
    this.nc = Array(this.area).fill(utility.randomNumberBetween(0, 5) * this.plantsPer);

    //  Plant data
    this.hasPlant = Array(this.plantArea).fill(false);
    this.ntStore = Array(this.plantArea).fill(null);
    this.ncStore = Array(this.plantArea).fill(null);
    this.waterStore = Array(this.plantArea).fill(null);
    this.growth = Array(this.plantArea).fill(null);
    this.generation = Array(this.plantArea).fill(null);

    this.ntConsumption = Array(this.plantArea).fill(null);
    this.ntMetabolism = Array(this.plantArea).fill(null);
    this.ntEndowment = Array(this.plantArea).fill(null);

    this.ncConsumption = Array(this.plantArea).fill(null);
    this.ncMetabolism = Array(this.plantArea).fill(null);
    this.ncEndowment = Array(this.plantArea).fill(null);

    this.numberSeeds = Array(this.plantArea).fill(null);
    this.seedSpread = Array(this.plantArea).fill(null);
    this.requiredGrowth = Array(this.plantArea).fill(null);

    this.thirst = Array(this.plantArea).fill(null);
    this.heliophilia = Array(this.plantArea).fill(null);

    //  Plant dna
    this.dna = Array(this.plantArea).fill(false);
  }

  wrapCoordinate(coord) {
    while (coord.f < 0) {
      coord.f += this.columns;
    }
    while (coord.f >= this.columns) {
      coord.f -= this.columns;
    }

    while (coord.s < 0) {
      coord.s += this.rows;
    }
    while (coord.s >= this.rows) {
      coord.s -= this.rows;
    }

    return coord;
  }

  convertToZ(coord) {
    this.wrapCoordinate(coord);
    return coord.f + (this.columns * coord.s);
  }
  convertToCoord(z) {
    return {
      f: z % this.columns,
      s: Math.floor(z / this.columns),
    };
  }
  wrapZ(z) {
    return this.convertToZ(this.convertToCoord(z));
  }


  getNeighbors(z, includeDiagonals) {
    const neighbors = [];

    const center = this.convertToCoord(z);

    neighbors.push(this.convertToZ({ f: center.f, s: center.s - 1 }));
    neighbors.push(this.convertToZ({ f: center.f + 1, s: center.s }));
    neighbors.push(this.convertToZ({ f: center.f, s: center.s + 1 }));
    neighbors.push(this.convertToZ({ f: center.f - 1, s: center.s }));


    if (includeDiagonals) {
      neighbors.push(this.convertToZ({ f: center.f + 1, s: center.s - 1 }));
      neighbors.push(this.convertToZ({ f: center.f + 1, s: center.s + 1 }));
      neighbors.push(this.convertToZ({ f: center.f - 1, s: center.s + 1 }));
      neighbors.push(this.convertToZ({ f: center.f - 1, s: center.s - 1 }));
    }

    return neighbors;
  }


  getRingOfCoordinates(z, radius, doGetCenter) {
    const ring = [];

    const center = this.convertToCoord(z);

    //  Handle center
    if (doGetCenter) {
      ring.push(this.convertToZ(center));
    }
    //  Spokes
    for (let r = 1; r <= radius; r += 1) {
      ring.push(this.convertToZ({ f: center.f, s: center.s - r }));
      ring.push(this.convertToZ({ f: center.f + r, s: center.s }));
      ring.push(this.convertToZ({ f: center.f, s: center.s + r }));
      ring.push(this.convertToZ({ f: center.f - r, s: center.s }));
    }

    //  Pie slices
    for (let r = radius; r > 0; r -= 1) {
      let x = center.f + 1;
      let y = center.s - r + 1;

      while (x > center.f) {
        if (y !== center.s) {
          // console.log({f:x, s:y});
          ring.push(this.convertToZ({ f: x, s: y }));
        }

        if (y < center.s) {
          x += 1;
        } else {
          x -= 1;
        }

        y += 1;
      }
      x -= 1;
      y -= 1;

      while (x < center.f) {
        if (y !== center.s) {
          // console.log({f:x, s:y});
          ring.push(this.convertToZ({ f: x, s: y }));
        }

        if (y > center.s) {
          x -= 1;
        } else {
          x += 1;
        }

        y -= 1;
      }
    }
    return ring;
  }

  getPlantNeighbors(p, includeDiagonals) {
    const neighbors = [];

    const center = this.convertToPlantCoord(p);

    neighbors.push(this.convertToP({ f: center.f, s: center.s - 1 }));
    neighbors.push(this.convertToP({ f: center.f + 1, s: center.s }));
    neighbors.push(this.convertToP({ f: center.f, s: center.s + 1 }));
    neighbors.push(this.convertToP({ f: center.f - 1, s: center.s }));

    if (includeDiagonals) {
      neighbors.push(this.convertToP({ f: center.f + 1, s: center.s - 1 }));
      neighbors.push(this.convertToP({ f: center.f + 1, s: center.s + 1 }));
      neighbors.push(this.convertToP({ f: center.f - 1, s: center.s + 1 }));
      neighbors.push(this.convertToP({ f: center.f - 1, s: center.s - 1 }));
    }

    return neighbors;
  }

  getRingOfPlantCoordinates(p, radius, doGetCenter) {
    const ring = [];

    const center = this.convertToPlantCoord(p);

    //  Handle center
    if (doGetCenter) {
      ring.push(this.convertToP(center));
    }
    //  Spokes
    for (let r = 1; r <= radius; r += 1) {
      ring.push(this.convertToP({ f: center.f, s: center.s - r }));
      ring.push(this.convertToP({ f: center.f + r, s: center.s }));
      ring.push(this.convertToP({ f: center.f, s: center.s + r }));
      ring.push(this.convertToP({ f: center.f - r, s: center.s }));
    }

    //  Pie slices
    for (let r = radius; r > 0; r -= 1) {
      let x = center.f + 1;
      let y = center.s - r + 1;

      while (x > center.f) {
        if (y !== center.s) {
          // console.log({f:x, s:y});
          ring.push(this.convertToP({ f: x, s: y }));
        }

        if (y < center.s) {
          x += 1;
        } else {
          x -= 1;
        }

        y += 1;
      }
      x -= 1;
      y -= 1;

      while (x < center.f) {
        if (y !== center.s) {
          // console.log({f:x, s:y});
          ring.push(this.convertToP({ f: x, s: y }));
        }

        if (y > center.s) {
          x -= 1;
        } else {
          x += 1;
        }

        y -= 1;
      }
    }
    return ring;
  }
  wrapPlantCoordinate(coord) {
    while (coord.f < 0) {
      coord.f += this.plantColumns;
    }
    while (coord.f >= this.plantColumns) {
      coord.f -= this.plantColumns;
    }

    while (coord.s < 0) {
      coord.s += this.plantRows;
    }
    while (coord.s >= this.plantRows) {
      coord.s -= this.plantRows;
    }

    return coord;
  }

  convertToP(coord) {
    this.wrapPlantCoordinate(coord);
    return coord.f + (this.plantColumns * coord.s);
  }

  wrapP(p) {
    return this.convertToP(this.convertToPlantCoord(p));
  }
  convertToPlantCoord(p) {
    return {
      f: p % this.plantColumns,
      s: Math.floor(p / this.plantColumns),
    };
  }
  convertPToZ(p) {
    const coord = this.convertToPlantCoord(p);
    // console.log(this.plantColumns + " + " + this.plantRows);
    return this.convertToZ({
      f: Math.floor(coord.f / this.plantColumnsPer),
      s: Math.floor(coord.s / this.plantRowsPer),
    });
  }
  getPlotsOfZ(z) {
    const plots = [];

    const start = {
      f: (z % this.columns) * this.plantColumnsPer,
      s: Math.floor(z / this.columns) * this.plantRowsPer,
    };

    for (let y = 0; y < this.plantRowsPer; y += 1) {
      for (let x = 0; x < this.plantColumnsPer; x += 1) {
        plots.push(this.convertToP({ f: start.f + x, s: start.s + y }));
      }
    }
    return plots;
  }
  calculateHighest() {
    this.highest = 1;
    this.hottest = 0;
    this.highestStress = 0;
    this.deepest = 1;
    this.brightest = 1;
    this.wettest = 1;
    this.tallest = 1;

    this.richestNutro = 1;
    this.richestNucium = 1;

    this.richestNutroStore = 1;
    this.richestNuciumStore = 1;
    this.richestWaterStore = 1;
    this.tallestTree = 1;
    this.thirstiest = 0;
    this.heliest = 0;
    this.youngest = 0;

    for (let z = 0; z < this.area; z += 1) {
      this.highest = Math.max(this.highest, this.height[z]);
      this.hottest = Math.max(this.hottest, this.heat[z]);
      this.highestStress = Math.max(this.highestStress, this.stress[z]);
      this.deepest = Math.max(this.deepest, this.depth[z]);
      this.brightest = Math.max(this.brightest, this.sunlight[z]);
      this.wettest = Math.max(this.wettest, this.rainfall[z]);
      this.tallest = Math.max(this.tallest, this.height[z] + this.depth[z]);

      //  Soil
      this.richestNutro = Math.max(this.richestNutro, this.nt[z]);
      this.richestNucium = Math.max(this.richestNucium, this.nc[z]);
    }
    for (let p = 0; p < this.plantArea; p += 1) {
      //  Stores
      if (this.hasPlant[p]) {
        this.richestNutroStore = Math.max(this.richestNutroStore, this.ntStore[p]);
        this.richestNuciumStore = Math.max(this.richestNuciumStore, this.ncStore[p]);
        this.richestWaterStore = Math.max(this.richestWaterStore, this.waterStore[p]);

        this.tallestTree = Math.max(this.tallestTree, this.growth[p]);
        this.thirstiest = Math.max(this.thirstiest, this.thirst[p]);
        this.heliest = Math.max(this.heliest, this.heliophilia[p]);
        this.youngest = Math.max(this.youngest, this.generation[p]);
      }
    }
  }
};


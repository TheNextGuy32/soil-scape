const utility = require('./utility.js');

module.exports = class Context {

  constructor(specs) {
    this.name = specs.name;

    this.plotsPer = specs.plotsPer;
    this.columns = specs.columns;
    this.rows = specs.rows;
    this.area = specs.rows * specs.columns;

    this.tilt = specs.tilt;
    this.rotation = specs.rotation;

    this.rules = specs.rules;

    this.day = 0;

    this.plantColumnsPer = Math.sqrt(specs.plotsPer);
    this.plantColumns = this.columns * this.plantColumnsPer;
    this.plantRowsPer = Math.sqrt(specs.plotsPer);
    this.plantsPer = this.plantRowsPer * this.plantColumnsPer;
    this.plantRows = this.rows * this.plantRowsPer;
    this.plantArea = this.plantColumns * this.plantRows;

    /*
    this.datasets = [
      {
        name: "height"
        ,max: 2
        ,min: 0
        ,value: Array(this.area).fill(2)
      }
      ,{
        name: "depth"
        ,max: 1
        ,min: 0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "asthenosphere"
        ,max: 1
        ,min: 0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "tectonic"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "fracture"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "rainfall"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "sunlight"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "hasPlant"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      .growth = {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "nt"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "nc"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "ncStore"
        ,max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,{
        name: "ntStore"
        ,max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,{
        name: "waterStore"
        ,max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,{
        name: "heliophilia"
        ,max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,{
        name: "thirst"
        ,max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,{
        name: "generation"
        ,max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,{
        name: "continent"
        ,max: true
        ,min: false
        ,value: Array(this.area).fill(false)
      }
      ,{
        name: "unresolvedWater"
        ,max: true
        ,min: false
        ,value: Array(this.area).fill(false)
      }
      ,{
        name: "ntConsumption"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "ntMetabolism"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "ntEndowment"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "ncConsumption"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "ncMetabolism"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "ncEndowment"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "numberSeeds"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "seedSpread"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
      ,{
        name: "requiredGrowth"
        ,max: null
        ,min: null
        ,value: Array(this.area).fill(null)
      }
    ];
    */
    this.datasets = {
      height: {
        max: 2
        ,min: 0
        ,value: Array(this.area).fill(2)
      }
      ,depth: {
        max: 1
        ,min: 0
        ,value: Array(this.area).fill(0)
      }
      ,asthenosphere: {
        max: 1
        ,min: 0
        ,value: Array(this.area).fill(0)
      }
      ,tectonic: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,fracture: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,rainfall: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,sunlight: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,hasPlant: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,growth: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,nt: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,nc: {
        max:1
        ,min:0
        ,value: Array(this.area).fill(0)
      }
      ,continent: {
        max:true
        ,min:false
        ,value: Array(this.area).fill(false)
      }
      ,unresolvedWater: {
        max:true
        ,min:false
        ,value: Array(this.area).fill(false)
      }
      ,ntConsumption: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,ntMetabolism: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,ntEndowment: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,ntStore: {
        max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,ncConsumption: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,ncMetabolism: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,ncEndowment: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,ncStore: {
        max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,waterStore: {
        max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,heliophilia: {
        max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,thirst: {
        max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,generation: {
        max:1
        ,min:0
        ,value: Array(this.plantArea).fill(0)
      }
      ,numberSeeds: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,seedSpread: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
      ,requiredGrowth: {
        max:null
        ,min:null
        ,value: Array(this.plantArea).fill(0)
      }
    }
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
  resetMaximums(values,min,max) {
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if(this.datasets[value] != null) {
        this.datasets[value].max = 0;
        this.datasets[value].min = 0;  
      }
    }
  }
  calculateHighest() {
    const resetProvinceValues = ["height","depth","asthenosphere","stress","tectonic","rainfall","sunlight","nt","nc"];
    
    const resetPlotValues = ["ntConsumption","ntMetabolism","ntEndowment","ntStore","ncConsumption","ncMetabolism","ncEndowment","ncStore","numberSeeds","seedSpread","requiredGrowth","heliophilia","thirst","waterStore"];
    
    this.resetMaximums(resetProvinceValues,0,0);
    this.resetMaximums(resetPlotValues,0,0);

    //  Determining mins and maxs of province data
    for (let z = 0; z < this.area; z += 1) {
      //  Go through the data that needs min and max
      for(let v = 0; v < resetProvinceValues.length; v++) {
        let dataName = resetProvinceValues[i];
        if(this.datasets[dataName] != null) {
          //  max
          this.datasets[dataName].max = Math.max(this.datasets[dataName].max, this.datasets[dataName].value[z]);
          //  min
          this.datasets[dataName].min = Math.min(this.datasets[dataName].min, this.datasets[dataName].value[z]);
        }
      }
    }
    //  Determining mins and maxs of plant data
    for (let p = 0; p < this.plantArea; p += 1) {
      //  Only if there is a plant here 
      if (this.hasPlant[p]) {
        //  Go through the data that needs min and max
        for(let v = 0; v < resetPlotValues.length; v++) {
          let dataName = resetPlotValues[i];
          if(this.datasets[dataName] != null) {
            //  max
            this.datasets[dataName].max = Math.max(this.datasets[dataName].max, this.datasets[dataName].value[p]);
            //  min
            this.datasets[dataName].min = Math.min(this.datasets[dataName].min, this.datasets[dataName].value[p]);
          }
        }
      }
    }
  }
};


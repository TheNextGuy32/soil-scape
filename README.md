# Soil-Scape

The Soil-Scape is a simulation libary that models Earth-like plate tectonics and plant genetics. 

## Getting Started

### Installing

```
npm install soil-scape
```
### Using

To begin working with Soil-Scape, first we require the module.
```
var soilScape = require('soil-scape');
```
To create a simulation use `createSimulation(specs)` where specs are the creation parameters. This returns a snapshot of the simulation on the first day of creation. 

The specs object expects:
```
size.rows - __int [1,100]__ - The number of province rows
size.columns - __int [1,100]__ - The number of province columns
plantsPer - __int 1, 3, 9, or 16__ - The number of plants per province
tilt - __float[0,1]__ - The tilt of the Earth which determines the sunbelt location, 0 is North, 0.5 is the Equator, and 1 is South
rotation - __int -1 or 1__ - The rotation of the Earth determines macroscopic weather phenomena, -1 is left, 1 is right
rules.maturity - __boolean__ - Whether or not plants must mature to repoduce 
rules.heliophilia - __boolean__ - Whether or not plants need sunlight
rules.thirst - __boolean__ - Whether or not plants need rain
rules.roots - __int [1,8]__ - How many plant neighbors causes death by root competition
rules.mutation - __float [0,1]__ - The plant gene mutation rate
```
Here's an example of world creation:
```
var specs = {
  size: {
    columns: 80
    , rows: 50
  }
  , plantsPer: 9
  , tilt: 0.75
  , rotation: -1
  , rules: {
    maturity: true
    , thrist: true
    , heliophilia: true
    , roots: 8
    , mutation: 0.999
  }
};
var world = soilScape.createSimulation(specs);
```

Then we can pass time by using `simulate(world , days, every)` where `world` is a simulation snapshot, `days` is the number days you'd like simulated, and `every` is the save interval in days. This returns an array of simulation snapshots.
```
var newDates = soilScape.simulate(world, 360, 10); //  A full year with snapshots every week
```
One should note that a week lasts 10 days, a months lasts 30 days, and a years lasts 360 days within the SoilScape. 

If you want to specify the number of days, weeks, months, and years, you can use `toDays(days, weeks, months, years)`.
```
var newDates = soilScape.simulate(world, soilScape.toDays(360, 36, 12, 1), 10); //  4 Years
```

The snapshot files contains arrays of data pertaining to the state of the simulation. Data is broken up into the __province__ and __plot__ level. The `columns` and `rows` provided within the specs determins the number of provinces, and the `plantsPer` determines the number of plots within a single province.

The useful province level data includes:
```
tectonic - __int__ - The tectonic plate this province belongs to, provinces with the same plate number are part of the same plate
heat - __int [0,∞)__ - The amount of built up heat in the asthenosphere, 0 is coolest
stress - __int [0,∞)__ - The amount of tectonic stress, 0 is lowest
height - __int [0,∞)__ - The units of land, 0 is lowest 
depth - __int [0,∞)__ - The units of water, 0 is shallowest
sunlight - __int [0,100)__ - The average sunlight, 0 is lighest and 100 is hardest
rainfall - __int [0,100)__ - The average annual rainfall, 0 is lightest and 100 is hardest
nt - __int [0,100)__ - The amount of nutro in the soil
nc - __int [0,100)__ - The amount of nucium in the soil
```
Each type of data is stored in an array of size `columns*rows` where index `z` is the same province in all arrays. For instance, to get the `height` and `depth` of the province at column `x` and row `y`, we would access it at `world.height[z]` and `world.depth[z]` where `z` is `x + (y * columns)`.

Within each province are several plant plots. Plant plots are similarly stored in arrays of size `columns * rows * plantsPer`.

The useful plant plot data includes:
```
hasPlant - __bool__ - Whether or not there is a living plant here
ntStore - __int [0,∞)__ - The amount of nutro this plant has stored
ncStore - __int [0,∞)__ - The amount of nucium this plant has stored
waterStore - __int [0,∞)__ - The amount of water this plant has stored
growth - __int [0,∞)__ - The size and maturity of the plant
generation - __int [0,∞)__ - The generational distance of this plant from the first plants
```
There is also a series of plant plot DNA data: 
``` 
ntConsumption - __int [0,∞)__ - How much nutro this plant pulls from the soil every tick
ntMetabolism - __int [0,∞)__ - How much nutro this plant consumes from its store every tick
ntEndowment - __int [0,∞)__ - How much nutro this plant places in its seeds
ncConsumption - __int [0,∞)__ - How much nucium this plant pulls from the soil every tick
ncMetabolism - __int [0,∞)__ - How much nucium this plant consumes from its store every tick
ncEndowment - __int [0,∞)__ - How much nucium this plant places in its seeds
numberSeeds - __int [0,∞)__ - How many seeds this plant outputs, plants need nutrients equivalent to `endowment * numberSeeds` to reproduce
seedSpread - __int [0,∞)__ - How far seeds spread
requiredGrowth - __int [0,∞)__ - How much the plant must mature before it can reproduce
```
To access the `growth` of a plant at plant column `j` and plant row `k` we use `world.growth[p]` where `p` is `j + (k * plantColumns)`. The plots associated with a province will appear on several plant rows and columns. You can get an array of indices associated with a single province with `world.GetPlotsOfZ(z)` where `z` is the index of the province.

## Built With

* [Name that Color](http://chir.ag/projects/name-that-color/) 
* [Random Color](https://randomcolor.llllll.li/)

## Author

__[Oliver Barnum](http://oliverbarnum.com/)__ 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
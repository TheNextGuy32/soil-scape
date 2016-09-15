# Soil-Scape

The Soil-Scape is a simulation libary that models Earth-like plate tectonics and plate genetics. 

### Installing

```
npm install soil-scape
```
## Getting Started

To begin working with Soil-Scape, first we require the module.
```
var soilScape = require('soil-scape');
```
To create a simulation use `createSimulation(specs)` where specs are the parameters of the creation algorithm. This returns a snapshot of the simulation on the first day of creation. 

The specs object expects:
* .size.rows - int [1,100] - The number of province rows
* .size.columns - int [1,100] - The number of province columns
* .plantsPer - int 1, 3, 9, or 16 - The number of plants per province
* .tilt - float[0,1] - The tilt of the Earth which determines the sunbelt location, 0 is North, 0.5 is the Equator, and 1 is South
* .rotation - int -1 or 1 - The rotation of the Earth determines macroscopic weather phenomena, -1 is left, 1 is right
* .rules.maturity - boolean - Whether or not plants must mature to repoduce 
* .rules.heliophilia - booealn - Whether or not plants need sunlight
* .rules.thirst - boolean - Whether or not plants need rain
* .rules.roots - int [1,8] - How many plant neighbors causes death by root competition
* .rules.mutation - float [0,1] - The plant gene mutation rate

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

Then we can pass time by using `simulate(ctx, days,every)` where `ctx` is a simulation snapshot, `days` is the number days you'd like simulated, and `every` is the save interval. This returns an array of simulation snapshots.
```
var newDates = soilScape.simulate(world, 360, 10);
```
If you want to specify the number of days, weeks, months, and years, you can use `toDays(days, weeks, months, years)`.
```
var days = soilScape.toDays(360, 4, 12, 1); // 4 Years
```
One should note that a week lasts 10 days, a months lasts 30 days, and a years lasts 360 days within the SoilScape. 

## Built With

* [Name that Color](http://chir.ag/projects/name-that-color/) - Bla bla bla
* [Random Color](https://randomcolor.llllll.li/) - Maybe

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Author

**Oliver Barnum** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
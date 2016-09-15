// 'use strict';

// var utility = require('./utility.js');
// var plants = require('./plant.js');
// var water = require('./water.js');
// var render = require('./render.js');

// exports.CreateTectonicPlates = function(ctx)
// {
//   heat(ctx);
//   stress(ctx);
//   fracture(ctx);
//   continuity(ctx);
// };

// exports.advanceTectonics = function (ctx)
// {
//   heat(ctx);
//   stress(ctx);
//   fracture(ctx);
//   continuity(ctx);

//   // movement(ctx);
// };

// function heatProvince(z, ctx)
// {
// 	ctx.heat[z] = Math.max(0, Math.round(ctx.height[z] - (ctx.depth[z]/2)));//Math.max(0, Math.round(ctx.heat[z] +  ctx.height[z] - (ctx.depth[z]/2)));
// };
// function giveHeat (z, ctx)
// {
// 	var heat = ctx.heat[z];
//   var neighbors = ctx.GetNeighbors(z, false);

//   var numberPossibleDonees = 0;
//   //  Continually give out heat till you can't
//   do
//   {
//     heat = ctx.heat[z];

//     var steepestSlope = 0;
//     var steepestSlopeValue = 0;
//     numberPossibleDonees = 0;

//     //  Find the steepest slope
//     for (var n = 0; n < neighbors.length; n++)
//     {
//       var n_index = neighbors[n];

//       var neighborHeat = ctx.heat[n_index];

//       var slope = heat - neighborHeat;
//       // slope = -slope;  Heat flows to hot spots

//       //  Do we have a downward slow too great?
//       if (slope > 0)
//       {
//         numberPossibleDonees++;

//         if (slope > steepestSlopeValue)
//         {
//           steepestSlope = n;
//           steepestSlopeValue = slope;
//         }
//       }
//     }

//     if (numberPossibleDonees >= 1)
//     {
//       //  There was at least one downward slope that was too great
//       var n_index = neighbors[steepestSlope];

//       //  Can we pass half our height difference
//       if (ctx.heat[z] > (steepestSlopeValue / 2))
//       {
//         //  Yes we can
//         ctx.heat[z] -= (steepestSlopeValue / 2);
//         ctx.heat[n_index] += (steepestSlopeValue / 2);
//       }
//       else
//       {
//         //  No we cant give enoguht to level them so we give all instead
//         ctx.heat[z] = 0;
//         ctx.heat[n_index] += ctx.heat[z];
//       }
//     }
//   }
//   //If we had more than one possibility than we can try again
//   while (false)//(numberPossibleDonees > 1 && ctx.heat[z] > 0);
// };
// function heat(ctx)
// {
// 	for(var z = 0 ; z < ctx.area ; z++) {
// 		heatProvince(z, ctx);
// 	}
		
// 	//  Randomizing flow order for fairness
//   var tectonicOrder = new Array(ctx.area);
//   for (var i = 0; i < ctx.area; ++i) { tectonicOrder[i] = i; }
//   tectonicOrder = utility.shuffle(tectonicOrder);

// 	//  Flow the heat
// 	for(var t = 0 ; t < ctx.area; t++){
// 		var z = tectonicOrder[t];

// 	  giveHeat(z,ctx);
// 	}
// };
// function stress(ctx)
// {
//   for(var z = 0 ; z < ctx.area ; z++) 
//   {
//     ctx.stress[z] = 0;
//   }
// 	for(var z = 0 ; z < ctx.area ; z++) 
// 	{
//     var heat = ctx.heat[z];
//     var plate = ctx.tectonic[z];

// 		var neighbors = ctx.GetNeighbors(z,false);
//     for (var n = 0; n < neighbors.length; n++)
//     {
//     	if(ctx.tectonic[neighbors[n]] == plate) {
//       	ctx.stress[z] += Math.abs(ctx.heat[z] - ctx.heat[neighbors[n]]);
// 	    }
//     }
// 	}
// };

// function fracture(ctx)
// {
//   for(var z = 0 ; z < ctx.area ; z++) 
//   {
//     ctx.fracture[z] = 0;
//   }
//   var hottest = 0;
//   var hottestIndex = 0;
//   for(var z = 0 ; z < ctx.area ; z++)
//   {
//     if(ctx.heat[z] > hottest && !ctx.fracture[z])
//     {
//       hottest = ctx.heat[z];
//       hottestIndex = z;
//     }
//   }
//   // console.log(hottest);
//   var stressIndex = hottestIndex;
//   var plate = ctx.tectonic[stressIndex];
//   while(true)
//   {
//     var neighbors = ctx.GetNeighbors(stressIndex,true);
//     var mostStressedNeighbor = -1;
//     var mostStressedNeighborIndex = -1;
//     for (var n = 0; n < neighbors.length; n++)
//     {
//       if( !ctx.fracture[neighbors[n]] && 
//           ctx.stress[neighbors[n]] > mostStressedNeighbor &&
//           ctx.tectonic[stressIndex] == plate) 
//       {
//         mostStressedNeighbor = ctx.stress[neighbors[n]];
//         mostStressedNeighborIndex = neighbors[n]; 
//       }
//     }

//     if(mostStressedNeighborIndex==-1)
//       break;

//     ctx.fracture[stressIndex] = 1;
//     stressIndex = mostStressedNeighborIndex;
//   }

// };
// function countPlates(counter, ctx)
// {
//   for(var z = 0 ; z < ctx.area ; z++)
//   {
//     if(ctx.fracture[z])
//       continue;
  
//     if(!counter[ctx.tectonic[z]])
//       counter[ctx.tectonic[z]] = 0;
    
//     counter[ctx.tectonic[z]]++;
//   }
// };
// function continuity(ctx)
// {
//   //  Counting the total area of unsplit plates
//   var plateCounts = {};
//   countPlates(plateCounts, ctx);

//   var checkedPlateNumbers = {};
//   for(var z = 0 ; z < ctx.area ; z++)
//   {
//     if(ctx.fracture[z])
//       continue;

//     if(checkedPlateNumbers[ctx.tectonic[z]] == null)
//     {
//       //  We havent checked this plate, consider this block its check
//       var oldNumber = ctx.tectonic[z];

//       var visited = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
//       var pieceSize = checkPlateSize(z, oldNumber, visited, ctx);
//       // console.log("Plate " + oldNumber + " has a piece of size " + pieceSize +" with a full size of " + plateCounts[oldNumber]);
      
//       if(pieceSize == plateCounts[ctx.tectonic[z]] || 
//         Math.abs(pieceSize - plateCounts[oldNumber]) < 6)
//       {
//         //  No dicontinuity
//         //console.log("The " + render.describePlateColor(ctx.tectonic[z]) + " plate is contiguous.");
//         checkedPlateNumbers[ctx.tectonic[z]] = 1;
//         continue;
//       }
      

//       //  This isnt the whole plate, it must have gotten seperated, relabel!
//       var newPlateNumber = oldNumber;

//       //  This isnt stopping tkaing over
//       while(checkedPlateNumbers[newPlateNumber] != null || newPlateNumber == ctx.tectonic[z] || plateCounts[newPlateNumber] != null){
//         newPlateNumber++;
//       }
//       // console.log("The " + render.describePlateColor(ctx.tectonic[z]) + " plate fractured, the new plate is " + 
//       //   render.describePlateColor(newPlateNumber) + " colored.");

//       //  Recolor the new plate wiht the new plate number
//       var count = renumberPlate(z, oldNumber, newPlateNumber, ctx);
      
//       // var cleanupVisited = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
//       // cleanupFracture(z,cleanupVisited, oldNumber, newPlateNumber,ctx);

//       //  The new plate has the full count, while the original plate loses this breakoff, other way around
//       //console.log("Creating Plate " + newPlateNumber + " with size " + count);
//       plateCounts[newPlateNumber] = count;

//       //console.log(plateCounts);

//       //console.log("Subtracting " + count + " from Plate " + oldNumber + " which has a size of " + plateCounts[oldNumber]);
//       plateCounts[oldNumber] -= count;

//       //console.log(plateCounts);


//       //  This new plate is checked, but the plate we started as isnt.
//       checkedPlateNumbers[newPlateNumber] = 1;
//     }
//   }
//   //console.log(checkedPlateNumbers);
//   //console.log("end of month\n\n");
// };
// function cleanupFracture(z, visited, oldNumber, newNumber, ctx)
// {
//   if(visited[z])
//     return 0;

//   visited[z] = true;

//   if(ctx.tectonic[z] == newNumber || (ctx.fracture[z] && ctx.tectonic[z] == oldNumber))
//   {
//     var count = 0;
//     if(ctx.fracture[z] && ctx.tectonic[z] == oldNumber)
//     {
//       ctx.fracture[z] = false;
//       count++;
//     }
//     ctx.tectonic[z] = newNumber;

//     var coord = ctx.ConvertToCoord(z);
//     count += cleanupFracture(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), visited, oldNumber, newNumber, ctx);
//     count += cleanupFracture(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), visited, oldNumber, newNumber, ctx);
//     count += cleanupFracture(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), visited, oldNumber, newNumber, ctx);
//     count += cleanupFracture(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), visited, oldNumber, newNumber, ctx);
//     return count;
//   }
//   return 0;
// };
// function renumberPlate(z, oldNumber, newNumber, ctx)
// {
//   if(ctx.tectonic[z] != oldNumber || ctx.fracture[z])
//     return 0;
  
//   var count = 1;
//   ctx.tectonic[z] = newNumber;

//   var coord = ctx.ConvertToCoord(z);
//   count += renumberPlate(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), oldNumber, newNumber, ctx);
//   count += renumberPlate(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), oldNumber, newNumber, ctx);
//   count += renumberPlate(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), oldNumber, newNumber, ctx);
//   count += renumberPlate(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), oldNumber, newNumber, ctx);
//   return count;
// };
// function checkPlateSize(z, plateNumber, visited, ctx)
// {
//   if(visited[z] || ctx.fracture[z] || ctx.tectonic[z] != plateNumber)
//     return 0;
  
//   visited[z] = 1;
//   var count = 1;

//   var coord = ctx.ConvertToCoord(z);
//   count += checkPlateSize(ctx.ConvertToZ({ f: coord.f+1, s: coord.s }), plateNumber, visited, ctx);
//   count += checkPlateSize(ctx.ConvertToZ({ f: coord.f-1, s: coord.s }), plateNumber, visited, ctx);
//   count += checkPlateSize(ctx.ConvertToZ({ f: coord.f, s: coord.s+1 }), plateNumber, visited, ctx);
//   count += checkPlateSize(ctx.ConvertToZ({ f: coord.f, s: coord.s-1 }), plateNumber, visited, ctx);
//   return count;
// };

// function movement(ctx)
// {
//   var plateXVelocities = {};
//   var plateYVelocities = {};
//   velocity(ctx,plateXVelocities,plateYVelocities);

//   if(Object.keys(plateXVelocities).length == 1)
//     return; //  We only have one plate, no need to move

//   var newPlateLocations = [];

//   for(var z = 0 ; z < ctx.area ; z++)
//   {
//     var plate = ctx.tectonic[z];
//     var currentLocationCoord = ctx.ConvertToCoord(z);

//     var newLocation = ctx.ConvertToZ(
//       { 
//           f: currentLocationCoord.f + (plateXVelocities[plate] >= 0 ? 1 : -1)
//         , s: currentLocationCoord.s + (plateYVelocities[plate] >= 0 ? 1 : -1)
//       });

//     if(newPlateLocations[newLocation] == null)
//       newPlateLocations[newLocation] = [];
     
//     newPlateLocations[newLocation].push({
//       plate: plate
//       , heat: ctx.heat[z]
//       , height: ctx.height[z]
//       , oldLocation: z
//       , plants: {} 
//     });
//   }

//   stackResolution(newPlateLocations, plateXVelocities, plateYVelocities, ctx);
//   water.flushWater(ctx);
// };
// function velocity(ctx, plateXVelocities, plateYVelocities)
// {
//   for(var z = 0 ; z < ctx.area ; z++)
//   {
//     var plate = ctx.tectonic[z];

//     if(plateXVelocities[plate] == null)
//     {
//       plateXVelocities[plate] = 0;
//       plateYVelocities[plate] = 0;
//     }

//     //  Note the coordinates are reversed, tall heat on left pushes you RIGHT.
//     var coord = ctx.ConvertToCoord(z);
//     var rightLean = ctx.heat[ctx.ConvertToZ({ f: coord.f-1, s: coord.s })];
//     var leftLean = ctx.heat[ctx.ConvertToZ({ f: coord.f+1, s: coord.s })];
//     var upLean = ctx.heat[ctx.ConvertToZ({ f: coord.f, s: coord.s+1 })];
//     var downLean = ctx.heat[ctx.ConvertToZ({ f: coord.f, s: coord.s-1 })];

//     plateXVelocities[plate] += Math.round(rightLean - leftLean);
//     plateYVelocities[plate] += Math.round(downLean - upLean);
//   }
//   //console.log(plateXVelocities);
//   // console.log(plateYVelocities);
// };

// function stackResolution(newLocations, plateXVelocities, plateYVelocities, ctx)
// {
//   for(var z = 0 ; z < ctx.area ; z ++)
//   {
//     var conflicts = newLocations[z];

//     if(conflicts == [] || !conflicts)
//     {
//       //  This is a rift from where a plate was
//       ctx.height[z] += utility.randomNumberBetween(2,2);
      
//       var plots = ctx.GetPlotsOfZ(z);
//       for( var q = 0 ; q < plots.length ; q ++)
//       {
//         plants.killPlant(plots[q], z, ctx, "These plants moved", false);
//       }
//       continue;
//     }

//     if(conflicts.length == 1) {
//       ctx.tectonic[z] = conflicts[0].plate;
//     }
//     else {
//       //  Combine heat and and heihgt to see which plate is on top and the resulting mountain
//       var newHeight = 0;
//       var tallestPlateIndex = 0;
//       var tallestPlate = 0;
//       for( var c = 0 ; c < conflicts.length ; c++)
//       {
//         var conflictHeight = conflicts[c].heat + conflicts[c].height;
//         if(conflictHeight > tallestPlate)
//         {
//           tallestPlate = conflictHeight;
//           tallestPlateIndex = c;
//         }

//       }
//       var chosenPlate = conflicts[tallestPlateIndex];

//       ctx.tectonic[z] = chosenPlate.plate;
      
//       if(z != chosenPlate.oldLocation) 
//       {
//         ctx.height[z] = chosenPlate.height + chosenPlate.heat - ctx.height[z];
//         ctx.height[chosenPlate.oldLocation] -= chosenPlate.height;
//       }
//       //  Move plants here
      
//       //  THIS IS A COLLISION CREATE A MOUNTAIN using veolicty and heat
//     }
//   }
// };
onmessage = function(e) {

    importScripts("https://d3js.org/d3.v5.min.js");
    importScripts("https://d3js.org/d3-scale-chromatic.v1.min.js");
    importScripts("https://d3js.org/topojson.v2.min.js");
    importScripts("https://d3js.org/d3-geo-projection.v2.min.js");
    importScripts("design/src/colormap.js");
    importScripts("design/src/colorramp.js");
    importScripts("lib/colorname/c3.js");
    importScripts("lib/colorname/analyzer.js");
    // importScripts("design/lib/d3-color.v1.min.js");

    importScripts("functions.js");
    importScripts("slice2D.js");
    importScripts("colormap.js");
    importScripts("header.js");
    // importScripts("debug.js");

    // Get Values from Worker
    palSize = e.data.args[0];
    minl = e.data.args[1];
    maxl = e.data.args[2];
    datasetDrop = e.data.args[3];
    selLum = e.data.args[4];
    valSal_L = e.data.args[5];
    valPU_L = e.data.args[6];
    valSmo_L = e.data.args[7];
    valSal_D = e.data.args[8];
    valPU_D = e.data.args[9];
    valSmo_D = e.data.args[10];
    colChange = e.data.args[11];

    var scoreArr = [];
    // var normUnif = [];
    // var normSmo = [];
    // var normLD = [];
    // var allUnif = [];
    // var allSmo = [];
    // var allLD = [];

    // Size of the Palette
    var palette_size = palSize;
    // Get Best Colormap
    var best_color = simulatedAnnealing2FindBestPalette(palette_size, evalPalette, minl, maxl);

    var palette = new Array(palette_size);
    for (let i = 0; i < palette.length; i++) {
        palette[i] = best_color.id[i];
    }

    var highestToLowest = scoreArr.sort((a, b) => b[0]-a[0]);

    // Evaluation of Score (constraints so far: NA)
    function evalPalette(palette, col_len, minl, maxl, pen) {
        var sample_sal = col_len;
        var finScore = 0;

        var colorInterpolatorCol = d3.interpolateRgb(
                d3.rgb((palette[0].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[2]), 
                d3.rgb((palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[2])
            );
        var stepsCol = col_len;
        var colorArrayCol = d3.range(0, (1 + 1 / stepsCol), 1 / (stepsCol - 1)).map(function(d) {
            return colorInterpolatorCol(d)
        });

        // Saliency
        var name_sal = 0;
        var dis;
        for (var i = 0; i < stepsCol; i++) {
            dis = d3.color(colorArrayCol[i]);

            var curr_sal = nameSalience(dis);
            name_sal = name_sal + curr_sal;
        }
        var nSalience = name_sal/stepsCol;

        // // Name Difference
        // var name_dist = 0;
        // for (var i = 1; i < sample_sal; i++) {
        //     var name_dist2 = c3.color[index(d3.color(palette[i].fill))];
        //     var name_dist1 = c3.color[index(d3.color(palette[i-1].fill))];

        //     var namediff = nameDifference(name_dist2, name_dist1);
        //     var name_dist = name_dist + namediff;
        // }

        // Perceptual Uniformity
        var cie00_dist = 0;
        var cie00_firstkey = 0;
        var cie00_seckey = 0;
        var cie00_thirdkey = 0;
        var perc_fin = 0;

        for (var i = 1; i < sample_sal; i++) {
            var cie00_dist2 = c3.color[index(d3.color(palette[i].fill))];
            var cie00_dist1 = c3.color[index(d3.color(palette[i-1].fill))];

            var perc_dist = cie00Distance(cie00_dist2, cie00_dist1);
            var cie00_dist = cie00_dist + perc_dist;

            // Mean PU
            var meancie00Dist = cie00_dist/(sample_sal);
            

            // var colorInterpolator = d3.interpolateRgb(d3.rgb((palette[0].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[2]), d3.rgb((palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[2]));
            // var steps = 33;
            // var colorArray = d3.range(0, (1 + 1 / steps), 1 / (steps - 1)).map(function(d) {
            //     return colorInterpolator(d)
            // });

            // // Points between key points
            // if(i < (sample_sal - 1)) {
            //     var d = 4;
            //     // First
            //     var firstkey1 = 1 + d * (i-1);
            //     var firstkey2 = 1 + d * i;
            //     var cie00_firstkey1 = c3.color[index(d3.color(colorArray[firstkey1]))];
            //     var cie00_firstkey2 = c3.color[index(d3.color(colorArray[firstkey2]))];
            //     var perc_firstkey = cie00Distance(cie00_firstkey2, cie00_firstkey1);
            //     var cie00_firstkey = cie00_firstkey + perc_firstkey;
            //     // Mean PU Keys
            //     var meancie00_firstkey = cie00_firstkey/sample_sal;

            //     // Second
            //     var seckey1 = 2 + d * (i-1);
            //     var seckey2 = 2 + d * i;
            //     var cie00_seckey1 = c3.color[index(d3.color(colorArray[seckey1]))];
            //     var cie00_seckey2 = c3.color[index(d3.color(colorArray[seckey2]))];
            //     var perc_seckey = cie00Distance(cie00_seckey2, cie00_seckey1);
            //     var cie00_seckey = cie00_seckey + perc_seckey;
            //     // Mean PU Keys
            //     var meancie00_seckey = cie00_seckey/sample_sal;

            //     // Third
            //     var thirdkey1 = 1 + d * (i-1);
            //     var thirdkey2 = 1 + d * i;
            //     var cie00_thirdkey1 = c3.color[index(d3.color(colorArray[thirdkey1]))];
            //     var cie00_thirdkey2 = c3.color[index(d3.color(colorArray[thirdkey2]))];
            //     var perc_thirdkey = cie00Distance(cie00_thirdkey2, cie00_thirdkey1);
            //     var cie00_thirdkey = cie00_thirdkey + perc_thirdkey;

            //     // Mean PU Keys
            //     var meancie00_thirdkey = cie00_thirdkey/sample_sal;
            // }

            // // Difference PU Keys
            // var perc_unifkey1 = Math.abs(meancie00_firstkey - perc_firstkey);
            // var perc_unifkey2 = Math.abs(meancie00_seckey - perc_seckey);
            // var perc_unifkey3 = Math.abs(meancie00_thirdkey - perc_thirdkey);
            // perc_fin = perc_fin + perc_unifkey1 + perc_unifkey2 + perc_unifkey3;

            // // Difference PU
            // var perc_unif = Math.abs(meancie00Dist - perc_dist);

            // Standard Deviation
            var perc_sd = Math.sqrt(((meancie00Dist - perc_dist)**2)/sample_sal);
            perc_fin = perc_fin + perc_sd;

            // console.log(perc_fin);
            // // Assign score if Nan
            // perc_unif = perc_unif || 100;
            // perc_fin = perc_fin + perc_unif;
            // // Assign score if Nan
            // perc_fin = perc_fin || 500;
        }
        // var percUniformity = perc_fin/sample_sal;

        // // Normalization of Data
        // // MIN: 0, MAX: 67.78429974221515 --> (50,-35,0) & (50,75,0) --> 110 (Calculator)
        // // MIN: 0, MAX: 54.16850041966648 --> (50,0,-50) & (50,0,55) --> 105 (Calculator)
        var minUnif = 0;
        var maxUnif = 67.78429974221515;
        var normUnif = (meancie00Dist - minUnif)/(maxUnif - minUnif);

        // Smoothness
        var ptsSmo = [];                    
        var edgesSmo = [];
        var edgesSmoNew = [];
        var angleDiff = 0;

        // Push points in an array
        for(i = 0; i < stepsCol; i++) {
            // ptsSmo.push(palette[i].LAB);
            ptsSmo.push([d3.lab(colorArrayCol[i]).l, d3.lab(colorArrayCol[i]).a, d3.lab(colorArrayCol[i]).b]);
        }

        // Create edges for points to neighbors
        for(var i = 0; i < ptsSmo.length - 1; i++) {
            edgesSmo.push({ source: ptsSmo[i], target: ptsSmo[i+1]});
            for (const key in edgesSmo) {
                if (edgesSmo[key].target === undefined) {
                    delete edgesSmo[key];
                }
            }
            edgesSmoNew = edgesSmo.filter((a) => a);
        }
        
        // Calculate angle between vectors
        function angle_between(x1, y1, z1, x2, y2, z2) {
            var dot = x1*x2 + y1*y2 + z1*z2;
            var len1 = x1*x1 + y1*y1 + z1*z1;
            var len2 = x2*x2 + y2*y2 + z2*z2;
            // return Math.acos(dot/(Math.sqrt(len1) * Math.sqrt(len2)));
            return Math.cos(dot/(Math.sqrt(len1) * Math.sqrt(len2))) * (Math.PI/180);
        }
        for(var i = 0; i < edgesSmoNew.length - 1; i++) {
            var vectorA = [edgesSmoNew[i].target[0] - edgesSmoNew[i].source[0], edgesSmoNew[i].target[1] - edgesSmoNew[i].source[1], edgesSmoNew[i].target[2] - edgesSmoNew[i].source[2]];
            var vectorB = [edgesSmoNew[i+1].source[0] - edgesSmoNew[i+1].target[0], edgesSmoNew[i+1].source[1] - edgesSmoNew[i+1].target[1], edgesSmoNew[i+1].source[2] - edgesSmoNew[i+1].target[2]];                        
            var angle = angle_between(vectorA[0],vectorA[1],vectorA[2],vectorB[0],vectorB[1],vectorB[2]) * 180 / Math.PI;
            // console.log(angle);
            // // Assign score if Nan
            // angle = angle || -100;
            angleDiff = angleDiff + angle;
        }
        var angleDifference = angleDiff/sample_sal;

        // // Normalization of Data
        // var minSmo = 0;
        // var maxSmo = 180;
        // var normSmo = (angleDifference - minSmo)/(maxSmo - minSmo);

        // console.log("Perc Unif: ",perc_fin);
        // console.log("Angle: ",angleDifference);

        // Luminance Difference
        var lum_min = minl;
        var lum_max = maxl;
        var lum_fin = 0;

        for(var i = 0; i < sample_sal; i++) {
            var samp_lum = i/(sample_sal-1);
            var lum_curr = palette[i].LAB[0];

            if(selLum == 'Linear') {
                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
            }
            else if (selLum == 'Diverging') {
                if(i < sample_sal/2) {
                    var lum_exp = 5 * Math.round((Math.abs(lum_min + (lum_max-lum_min) * 2 * samp_lum))/5);   // For Diverging Profile (Before Midpoint)
                }
                else {
                    // var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-k-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
                    var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (sample_sal-i-1)/(Math.floor(sample_sal/2)))/5);   // For Diverging Profile (After Midpoint)
                }
            }
            var lum_diff = Math.abs(lum_exp - lum_curr);
            lum_fin = lum_fin + lum_diff;
        }
        var lumDifference = lum_fin/sample_sal;


        // Weights
        if(selLum == 'Linear') {
            // Slider weights changes
            var wSal = valSal_L;
            var wPU = valPU_L;
            var wSmo = valSmo_L;
            var wPen = -10000;
            var wLD = -100000;
        }
        // Diverging
        else if (selLum == 'Diverging') {
            // Slider weights changes
            var wSal = valSal_D;
            var wPU = valPU_D;
            var wSmo = valSmo_D;
            var wPen = -10000000;
            var wLD = -100000000;
        }

        // // Removal of NaN values
        // if(isNaN(finScore) || isNaN(nSalience) || isNaN(perc_fin) || isNaN(angleDifference) || isNaN(lumDifference)) {

        // }
        // else {
        //     allUnif.push(percUniformity);
        //     allSmo.push(angleDifference);
        //     allLD.push(lumDifference);
        // }


        // finScore = (wPU * normUnif) + (wSmo * normSmo) + (wPen * pen);
        finScore = (wPU * perc_fin) + (wSmo * angleDifference) + (wPen * pen) + (wLD * lumDifference);
        if(isNaN(finScore) || isNaN(nSalience) || isNaN(perc_fin) || isNaN(angleDifference) || isNaN(lumDifference)) {
            // console.log('NaN');
        }
        else {
            // scoreArr.push([finScore, nSalience, perc_fin, angleDifference, palette]);
            scoreArr.push([finScore, nSalience, normUnif, angleDifference, palette]);
            // scoreArr = [];
            // scoreArr.push([finScore, nSalience, normUnif, normSmo]);
        }

        return finScore;
    }


    // Random Color Disturb
    function randomDisturbColors(palette) {
        // var stackCnt = 0;
        // var iter_count = 0;
        penColors = 0;
        var sel_val = datasetDrop[0].fill;

        // Perturbation Levels
        // For sel: 0 (L -> less perturb, AB -> medium perturb)
        var disturbAB_0 = colChange;
        var disturbL_0 = 0;

        // For sel: 1 (L -> no perturb, AB -> little to none perturb)
        var disturbAB_1 = 0; //5
        var disturbL_1 = 5; //5

        // random disturb one color
        var idx = getRandom(0, palette.length - 1);
        var sel_color = palette[idx];

        // For sel:0
        if(sel_color.sel == 0) {
            var distDisplay = 1000;
            var distColor = [];
            var selColors = [];
            
            var randLum = sel_color.LAB[0] + (5 * Math.round(getRandom(-disturbL_0, disturbL_0)/5));
            while(randLum < 0 || randLum > 100) {
                var randLum = sel_color.LAB[0] + (5 * Math.round(getRandom(-disturbL_0, disturbL_0)/5));                
            }
            // Disturb LAB space
            new_color = d3.lab(randLum, sel_color.LAB[1] + getRandom(-disturbAB_0, disturbAB_0), sel_color.LAB[2] + getRandom(-disturbAB_0, disturbAB_0));

            // Adjusted Color Displayability Test
            if(new_color.displayable() == true) {
                rgb_checked = d3.rgb(new_color);
                new_fill = "rgb(" +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b +
                ")";
                // Check distance from original selection
                var cie00_sel = c3.color[index(d3.color(sel_val))];
                var cie00_new = c3.color[index(d3.color(new_fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);
                // if(user_dist < 0.75) {
                    // Update the color
                    palette[idx] = {
                        name: nameDistribution(d3.lab(new_color.l, new_color.a, new_color.b)),
                        fill: "rgb(" + 
                            d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + 
                            d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + 
                            d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + 
                        ")",
                        RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                        LAB: [new_color.l, new_color.a, new_color.b],
                        sel: 0
                    }
                // }
            }
            else {
                for(i=0; i<colorDict.length; i++) {
                    // console.log(colorDict[i].LAB[0] == 100)
                    if(new_color.l == colorDict[i].LAB[0]) {
                        selColors.push(colorDict[i]);
                        for(j=0; j<selColors.length; j++) {
                            var localDist = Math.sqrt((selColors[j].LAB[0] - new_color.l)**2 + (selColors[j].LAB[1] - new_color.a)**2 + (selColors[j].LAB[2] - new_color.b)**2);
                            if(localDist < distDisplay) {
                                distDisplay = localDist;
                                distColor = selColors[j];
                            }
                        }
                    }
                }
                // Check distance from original selection
                var cie00_sel = c3.color[index(d3.color(sel_val))];
                var cie00_new = c3.color[index(d3.color(distColor.fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);

                // if(user_dist < 0.75) {
                    // Update the color
                    palette[idx] = ({
                        name: distColor.name,
                        fill: distColor.fill,
                        RGB: [
                            Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).r), 
                            Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).g), 
                            Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).b)
                        ],                
                        LAB: [
                            d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).l, 
                            d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).a, 
                            d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).b
                        ],
                        sel: 0
                    });
                // }
            }
        }
        // For sel:1
        else if(sel_color.sel == 1) {
            // console.log('there')
            var distDisplay = 1000;
            var distColor = [];
            var selColors = [];
            // console.log(sel_color)

            var randLum = sel_color.LAB[0] + (5 * Math.round(getRandom(-disturbL_1, disturbL_1)/5));
            while(randLum < 0 || randLum > 100) {
                var randLum = sel_color.LAB[0] + (5 * Math.round(getRandom(-disturbL_0, disturbL_0)/5));                
            }
            // Disturb LAB space
            // console.log(randLum)
            new_color = d3.lab(randLum, sel_color.LAB[1] + getRandom(-disturbAB_0, disturbAB_0), sel_color.LAB[2] + getRandom(-disturbAB_0, disturbAB_0));
            // console.log(new_color)

            // Adjusted Color Displayability Test
            if(new_color.displayable() == true) {
                // console.log("T")
                rgb_checked = d3.rgb(new_color);
                new_fill = "rgb(" +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b +
                ")";
                // Check distance from original selection
                var cie00_sel = c3.color[index(d3.color(sel_val))];
                var cie00_new = c3.color[index(d3.color(new_fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);
                if(user_dist > 0.75) {
                    penColors = penColors + user_dist;
                }
                // if(user_dist < 0.75) {
                    // console.log(new_color);
                // Update the color
                palette[idx] = {
                    RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                    LAB: [new_color.l, new_color.a, new_color.b],
                    name: nameDistribution(d3.lab(new_color.l, new_color.a, new_color.b)),
                    fill: "rgb(" + 
                        d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + 
                        d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + 
                        d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + 
                    ")",
                    sel: 1
                }
            }
            else {
                // console.log("F")
                // console.log(new_color.l)
                for(i=0; i<colorDict.length; i++) {
                    if(new_color.l == colorDict[i].LAB[0]) {
                        selColors.push(colorDict[i]);
                        for(j=0; j<selColors.length; j++) {
                            var localDist = Math.sqrt((selColors[j].LAB[0] - new_color.l)**2 + (selColors[j].LAB[1] - new_color.a)**2 + (selColors[j].LAB[2] - new_color.b)**2);
                            if(localDist < distDisplay) {
                                distDisplay = localDist;
                                distColor = selColors[j];
                            }
                        }
                    }
                }
                // Check distance from original selection
                var cie00_sel = c3.color[index(d3.color(sel_val))];
                var cie00_new = c3.color[index(d3.color(distColor.fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);
                if(user_dist > 0.75) {
                    penColors = penColors + user_dist;
                }
                // if(user_dist < 0.75) {
                    // Update the color
                    palette[idx] = ({
                        name: distColor.name,
                        fill: distColor.fill,
                        RGB: [
                            Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).r), 
                            Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).g), 
                            Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).b)
                        ],                
                        LAB: [
                            d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).l, 
                            d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).a, 
                            d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).b
                        ],
                        sel: 1
                    });
                    penColors = penColors + user_dist;
                }
            // }
         }

        return palette;
    }

    function simulatedAnnealing2FindBestPalette(size, evaluateFunc, minl, maxl) {
        var iterate_times = 0;
        var max_temper = 100000; // initial temperature
        var dec = 0.99; // decrementation
        // var dec = val_algoIter; 
        var max_iteration_times = 10000000; 
        var end_temper = 0.001; // end temperature
        var cur_temper = max_temper;

        // var color_palette = genRandomPalette(size);
        var color_palette = randomDisturbColors(datasetDrop);
        // current palette
        var o = {
                id: color_palette,
                score: evaluateFunc(color_palette, size, minl, maxl, penColors)
            };
        var preferredObj = o;

        while (cur_temper > end_temper) {
            for (var i = 0; i < 1; i++) { //disturb at each temperature
                iterate_times++;
                color_palette = o.id.slice();
                randomDisturbColors(color_palette);
                var color_palette_2 = color_palette.slice();
                var o2 = {
                    id: color_palette_2,
                    score: evaluateFunc(color_palette_2, size, minl, maxl, penColors)
                };
                var delta_score = o.score - o2.score;
                if (delta_score <= 0 || delta_score > 0 && Math.random() <= Math.exp((-delta_score) / cur_temper)) {
                    o = o2;
                    if (preferredObj.score - o.score < 0) {
                        preferredObj = o;
                    }
                }
            }
            cur_temper *= dec;
            if (iterate_times > max_iteration_times) {
                break;
            }
        }
        return preferredObj;
    }
    postMessage([palette, highestToLowest, scoreArr]);
}
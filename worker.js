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
    importScripts("linegraph.js");
    importScripts("plots.js");

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
    mapLength = e.data.args[12];

    var scoreArr = [];
    var testCnt = 0;

    // Size of the Palette
    var palette_size = palSize;
    // Get Best Colormap
    var best_color = simulatedAnnealing2FindBestPalette(palette_size, evalPalette, minl, maxl);

    var palette = new Array(palette_size);
    for (let i = 0; i < palette.length; i++) {
        palette[i] = best_color.id[i];
    }

    var highestToLowest = scoreArr.sort((a, b) => b[0]-a[0]);

    // Evaluation of Score (constraints so far: Perceptual Uniformity, Smoothness, Name Difference, Colorfulness)
    function evalPalette(palette, col_len, minl, maxl, pen) {
        testCnt = testCnt + 1;
        var sample_sal = col_len;
        var finScore = 0;

        // PERCEPTUAL UNIFORMITY
        var cie00_dist = 0;
        for (var i = 1; i < sample_sal; i++) {
            var cie00_dist2 = d3.lab(d3.color(palette[i].fill));
            var cie00_dist1 = d3.lab(d3.color(palette[i-1].fill));            
            // var cie00_dist2 = c3.color[index(d3.color(palette[i].fill))];
            // var cie00_dist1 = c3.color[index(d3.color(palette[i-1].fill))];
            var perc_dist = cie00Distance(cie00_dist2, cie00_dist1);
            var cie00_dist = cie00_dist + perc_dist;
        }        
        // Mean PU
        var meancie00Dist = cie00_dist/(sample_sal);

        // Normalization of PU
        var minUnif = 0;
        var maxUnif = 67.78429974221515;
        var normUnif = (meancie00Dist - minUnif)/(maxUnif - minUnif);


        // SMOOTHNESS
        var ptsSmo = [];                    
        var edgesSmo = [];
        var edgesSmoNew = [];
        var angleDiff = 0;

        // Push points in an array
        for(i = 0; i < sample_sal; i++) {
            ptsSmo.push(palette[i].LAB);
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
            if(len1 == 0) { len1 = 1; }
            if(len2 == 0) { len2 = 1; }
            return Math.acos(dot/(Math.sqrt(len1) * Math.sqrt(len2)));
        }
        for(var i = 0; i < edgesSmoNew.length - 1; i++) {
            var vectorA = [edgesSmoNew[i].target[0] - edgesSmoNew[i].source[0], edgesSmoNew[i].target[1] - edgesSmoNew[i].source[1], edgesSmoNew[i].target[2] - edgesSmoNew[i].source[2]];
            var vectorB = [edgesSmoNew[i+1].source[0] - edgesSmoNew[i+1].target[0], edgesSmoNew[i+1].source[1] - edgesSmoNew[i+1].target[1], edgesSmoNew[i+1].source[2] - edgesSmoNew[i+1].target[2]];
            var angle = angle_between(vectorA[0],vectorA[1],vectorA[2],vectorB[0],vectorB[1],vectorB[2]);
            angleDiff = angleDiff + angle;
        }

        // Normalization of Smo
        var minSmo = 0;
        var maxSmo = 3.142;
        var normSmo = (angleDiff - minSmo)/(maxSmo - minSmo);
        var angleDifference = normSmo/sample_sal;

        // NAME DIFFERENCE
        var name_diff = 0;
        // for (var i = 1; i < sample_sal; i++) {
        //     var name_diff2 = d3.lab(d3.color(palette[i].fill));
        //     var name_diff1 = d3.lab(d3.color(palette[i-1].fill));
        //     var name_unif = nameDifference(name_diff2, name_diff1);
        //     if(isNaN(name_unif)) {
        //         name_unif = 10;
        //     }
        //     var name_diff = name_diff + name_unif;
        // }
        // // Mean ND
        // var meannameDiff = name_diff/(sample_sal);
        // // Normalization of ND --> No normalization needed: ND is normalized between 0 & 1

        for (var i = 0; i < sample_sal-1; i++) {
            for (var j = i + 1; j < sample_sal; j++) {
                var name_diff1 = d3.lab(d3.color(palette[i].fill));
                var name_diff2 = d3.lab(d3.color(palette[j].fill));

                var name_unif = cie00Distance(name_diff1, name_diff2);
                // console.log(name_unif)
                if(selLum == 'Linear') {
                    if (name_unif < 10) {
                        if(Math.abs(i-j) < sample_sal/5) {
                            name_diff = name_diff + 10;
                        }
                        if(Math.abs(i-j) > sample_sal/5) {
                            name_diff = name_diff + 500;

                        }
                    }
                }
                else if(selLum == 'Diverging') {
                    if (name_unif < 10) {
                        if(Math.abs(i-j) < sample_sal/5) {
                            name_diff = name_diff + 10;
                        }
                        if(Math.abs(i-j) > sample_sal/5) {
                            name_diff = name_diff + 500;
                        }
                    }
                }

            }
        }

        // COLORFULNESS: Length of the colormap in LAB space
        var eucl_dist = 0;
        for (var i = 1; i < sample_sal; i++) {
            var eucl_dist2 = d3.lab(d3.color(palette[i].fill));
            var eucl_dist1 = d3.lab(d3.color(palette[i-1].fill));            
            // var cie00_dist2 = c3.color[index(d3.color(palette[i].fill))];
            // var cie00_dist1 = c3.color[index(d3.color(palette[i-1].fill))];
            var cie76_dist = cie76Distance(eucl_dist2, eucl_dist1);
            var eucl_dist = eucl_dist + cie76_dist;
        }        
        // Mean EUCL
        var meancie76Dist = eucl_dist/(sample_sal);

        // Weights
        if(selLum == 'Linear') {
            // Slider weights changes
            var wSal = valSal_L;
            var wPU = valPU_L;
            var wSmo = valSmo_L;
            var wND = -100;
            var wED = mapLength;
            var wPen = -10000;
            var wLD = -100000;
        }
        // Diverging
        else if (selLum == 'Diverging') {
            // Slider weights changes
            var wSal = valSal_D;
            var wPU = valPU_D;
            var wSmo = valSmo_D;
            var wND = -10000;
            var wED = mapLength;
            var wPen = -10000; // -10000000
            var wLD = -100000; // -100000000
        }

        nSalience = 0;
        lumDifference = 0;
        pen = 0;
        meannameDiff = 0;

        finScore = (wPU * normUnif) + (wSmo * angleDifference) + (wPen * pen) + (wLD * lumDifference) + (wND * name_diff) + (wED * meancie76Dist);
        if(isNaN(finScore) || isNaN(nSalience) || isNaN(normUnif) || isNaN(angleDifference) || isNaN(lumDifference) || isNaN(name_diff) || (isNaN(meancie76Dist))) {
        }
        else {
            scoreArr.push([finScore, nSalience, normUnif, angleDifference, palette]);
        }

        //console.log("Actual normUnif: ", normUnif);
        //console.log("Actual angleDifference: ", angleDifference);
        //console.log("Actual meancie76Dist", meancie76Dist);
        //console.log("Actual palette: ", palette);

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
                var cie00_sel = d3.lab(d3.color(sel_val));
                var cie00_new = d3.lab(d3.color(new_fill));
                // var cie00_sel = c3.color[index(d3.color(sel_val))];
                // var cie00_new = c3.color[index(d3.color(new_fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);

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
                var cie00_sel = d3.lab(d3.color(sel_val));
                var cie00_new = d3.lab(d3.color(distColor.fill));
                // var cie00_sel = c3.color[index(d3.color(sel_val))];
                // var cie00_new = c3.color[index(d3.color(distColor.fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);

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
            }
        }
        // For sel:1
        else if(sel_color.sel == 1) {
            var distDisplay = 1000;
            var distColor = [];
            var selColors = [];

            // Disturb LAB space
            new_color = d3.lab(sel_color.LAB[0], sel_color.LAB[1] + getRandom(-disturbAB_0, disturbAB_0), sel_color.LAB[2] + getRandom(-disturbAB_0, disturbAB_0));

            // Adjusted Color Displayability Test
            if(new_color.displayable() == true) {
                rgb_checked = d3.rgb(new_color);
                new_fill = "rgb(" +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " +
                    d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b +
                ")";
                
                // Check distance from original selection
                var cie00_sel = d3.lab(d3.color(sel_val));
                var cie00_new = d3.lab(d3.color(new_fill));
                // var cie00_sel = c3.color[index(d3.color(sel_val))];
                // var cie00_new = c3.color[index(d3.color(new_fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);
                // if(user_dist < 0.4) {
                //     penColors = penColors + user_dist;
                // }

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
                var cie00_sel = d3.lab(d3.color(sel_val));
                var cie00_new = d3.lab(d3.color(distColor.fill));
                // var cie00_sel = c3.color[index(d3.color(sel_val))];
                // var cie00_new = c3.color[index(d3.color(distColor.fill))];
                var user_dist = nameDifference(cie00_sel, cie00_new);
                // if(user_dist < 0.4) {
                //     penColors = penColors + user_dist;
                // }
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
                // penColors = penColors + user_dist;
            }
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
                        postMessage([preferredObj.id])
                        // drawColormap(preferredObj.id);
                    }
                }
            }
            cur_temper *= dec;
            if (iterate_times > max_iteration_times) {
                break;
            }
        }
        console.log(testCnt)
        return preferredObj;
    }
    postMessage([palette, highestToLowest, scoreArr]);
}

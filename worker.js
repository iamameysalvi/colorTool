onmessage = function(e) {

    importScripts("https://d3js.org/d3.v4.min.js");
    importScripts("https://d3js.org/d3-scale-chromatic.v1.min.js");
    importScripts("https://d3js.org/topojson.v2.min.js");
    importScripts("https://d3js.org/d3-geo-projection.v2.min.js");
    importScripts("design/src/colormap.js");
    importScripts("design/src/colorramp.js");
    importScripts("lib/colorname/c3.js");
    importScripts("lib/colorname/analyzer.js");
    importScripts("lib/d3.color.js");

    importScripts("functions.js");
    importScripts("search.js");
    importScripts("slice2D.js");
    importScripts("colormap.js");
    // importScripts("algorithm.js");
    importScripts("sidebar.js");
    importScripts("linegraph.js");

    palSize = e.data.args[0];
    minl = e.data.args[1];
    maxl = e.data.args[2];
    // val_algoIter = e.data.args[3];
    datasetDrop = e.data.args[3];
    lumRadio = e.data.args[4];
    val_salSimL = e.data.args[5];
    val_ldSimL = e.data.args[6];
    val_puSimL = e.data.args[7];
    val_lboSimL = e.data.args[8];
    val_smoSimL = e.data.args[9];
    val_salSimD = e.data.args[10];
    val_ldSimD = e.data.args[11];
    val_puSimD = e.data.args[12];
    val_lboSimD = e.data.args[13];
    val_smoSimD = e.data.args[14];

    // function calcPalette(palSize, minl, maxl) {
    // console.log('calcPalette');
    var scoreArr = [];
    // Size of the Palette
    var palette_size = palSize;
    // Get Best Colormap
    var best_color = simulatedAnnealing2FindBestPalette(palette_size, evalPalette, minl, maxl);

    var palette = new Array(palette_size);
    for (let i = 0; i < palette.length; i++) {
        palette[i] = best_color.id[i];
    }

    var highestToLowest = scoreArr.sort((a, b) => b[0]-a[0]);

// function drawSimCol(data) {
//     // Draw Simulated Colors
//     for(var i=0; i<palette_size; i++) {
//         if(data[i].sel == 0) {
//             var canWd = d3.select('rect.dropCanvas').attr('width')
//             var simX = i * (canWd/palette_size);
//             var simWd = (canWd/palette_size)/2;
//             svg_colormap.append('rect')
//                         .attr('class', 'simCol')
//                         .attr('x', simX + simWd/2)
//                         .attr('y', 27.5)
//                         .attr('width', simWd)
//                         .attr('height', 37.5)
//                         .attr('fill', data[i].fill)
//                         .attr('stroke', '#000');
//         }
//     }
// }
// drawSimCol(palette);

// LAB Color Generator
function generate() {
    // console.log('generate');
    lab_check = d3.lab(5 * Math.round(getRandom(0, 100)/5), 5 * Math.round(getRandom(-110, 110)/5), 5 * Math.round(getRandom(-110, 110)/5));
    rgb_check = d3.rgb(lab_check);
}

// Generate Random Palette 
function genRandomPalette(col_len) {
    // console.log('genRandomPalette');
    // Check if in the RGB Gamut
    // var palette_size = 5; // No of color samples
    palette = datasetDrop;

    // while(palette.length < col_len) {
    for(var len=0; len<col_len; len++) {
        generate();
        if(Math.round(rgb_check.r) >= 0 && Math.round(rgb_check.g) >= 0 && Math.round(rgb_check.b) >= 0 && Math.round(rgb_check.r) <= 255 && Math.round(rgb_check.g) <= 255 && Math.round(rgb_check.b) <= 255) {
            lab = lab_check;
            rgb = d3.rgb(lab); 

            // Push to Dataset - new dataset (add to pre-owned colors)
            if(palette[len].sel == 0) {
                var selRect = ({
                    RGB: [Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)],
                    LAB: [lab.l,lab.a,lab.b],
                    fill: "rgb(" + d3.rgb(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)).r + ", " + d3.rgb(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)).g + ", " + d3.rgb(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)).b + ")",
                    sel: 0
                    // pts: [lab.a, lab.b]
                })
                datasetDrop.splice(len, 1, selRect);
            }
        }
    }
    return palette;
}

// Evaluation of Score (constraints so far: NA)
function evalPalette(palette, col_len, minl, maxl) {
    // drawColormap(palette,null);
    var sample_sal = col_len;
    var finScore = 0;

    var colorInterpolatorCol = d3.interpolateRgb(d3.rgb((palette[0].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[2]), d3.rgb((palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[2]));
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

    // Luminance Difference
    var lum_min = minl;
    var lum_max = maxl;
    var lum_fin = 0;

    for(var i = 0; i < sample_sal; i++) { 
        var samp_lum = i/(sample_sal-1);
        var lum_curr = d3.lab(palette[i].fill).l;

        if(lumRadio == 'linear') {
            var lum_exp = lum_min + (lum_max-lum_min) * samp_lum;       // For Linear Profile
        }
        else if (lumRadio == 'diverging') {
            if(i < sample_sal/2) {
                var lum_exp = Math.abs(lum_min + (lum_max-lum_min) * 2 * samp_lum);   // For Diverging Profile (Before Midpoint)
            }
            else {
                var lum_exp = lum_min + (lum_max-lum_min) * (sample_sal-i-1)/(Math.floor(sample_sal/2))   // For Diverging Profile (After Midpoint)
            }
        }
        var lum_diff = Math.abs(lum_exp - lum_curr);
        lum_fin = lum_fin + lum_diff;
        
    }
    var lumDifference = lum_fin/sample_sal;

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

        var colorInterpolator = d3.interpolateRgb(d3.rgb((palette[0].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[2]), d3.rgb((palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[2]));
        var steps = 33;
        var colorArray = d3.range(0, (1 + 1 / steps), 1 / (steps - 1)).map(function(d) {
          return colorInterpolator(d)
        });

        // Points between key points
        if(i < (sample_sal - 1)) {
            var d = 4;
            // First
            var firstkey1 = 1 + d * (i-1);
            var firstkey2 = 1 + d * i;
            var cie00_firstkey1 = c3.color[index(d3.color(colorArray[firstkey1]))];
            var cie00_firstkey2 = c3.color[index(d3.color(colorArray[firstkey2]))];
            var perc_firstkey = cie00Distance(cie00_firstkey2, cie00_firstkey1);
            var cie00_firstkey = cie00_firstkey + perc_firstkey;
            // Mean PU Keys
            var meancie00_firstkey = cie00_firstkey/sample_sal;

            // Second
            var seckey1 = 2 + d * (i-1);
            var seckey2 = 2 + d * i;
            var cie00_seckey1 = c3.color[index(d3.color(colorArray[seckey1]))];
            var cie00_seckey2 = c3.color[index(d3.color(colorArray[seckey2]))];
            var perc_seckey = cie00Distance(cie00_seckey2, cie00_seckey1);
            var cie00_seckey = cie00_seckey + perc_seckey;
            // Mean PU Keys
            var meancie00_seckey = cie00_seckey/sample_sal;

            // Third
            var thirdkey1 = 1 + d * (i-1);
            var thirdkey2 = 1 + d * i;
            var cie00_thirdkey1 = c3.color[index(d3.color(colorArray[thirdkey1]))];
            var cie00_thirdkey2 = c3.color[index(d3.color(colorArray[thirdkey2]))];
            var perc_thirdkey = cie00Distance(cie00_thirdkey2, cie00_thirdkey1);
            var cie00_thirdkey = cie00_thirdkey + perc_thirdkey;

            // Mean PU Keys
            var meancie00_thirdkey = cie00_thirdkey/sample_sal;
        }

        // Difference PU Keys
        var perc_unifkey1 = Math.abs(meancie00_firstkey - perc_firstkey);
        var perc_unifkey2 = Math.abs(meancie00_seckey - perc_seckey);
        var perc_unifkey3 = Math.abs(meancie00_thirdkey - perc_thirdkey);
        perc_fin = perc_fin + perc_unifkey1 + perc_unifkey2 + perc_unifkey3;

        // Difference PU
        var perc_unif = Math.abs(meancie00Dist - perc_dist);
        // Assign score if Nan
        perc_unif = perc_unif || 100000000;
        perc_fin = perc_fin + perc_unif;
        // Assign score if Nan
        perc_fin = perc_fin || 100000000;
    }

    // Legend Based Order
    var lbo_val = 0;
    var colorInterpolator = d3.interpolateRgb(d3.rgb((palette[0].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[2]), d3.rgb((palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[2]));
    var stepsLBO = 9;
    var colorArrayLBO = d3.range(0, (1 + 1 / stepsLBO), 1 / (stepsLBO - 1)).map(function(d) {
      return colorInterpolator(d)
    });
    for (var i = 0; i < stepsLBO; i++) {
        for (var j = i + 1; j < stepsLBO; j++) {

            var lbo_dist1 = c3.color[index(d3.color(colorArrayLBO[i]))];
            var lbo_dist2 = c3.color[index(d3.color(colorArrayLBO[j]))];

            var lbo_dist = cie00Distance(lbo_dist1, lbo_dist2);
            // if(Math.abs(i-j) > 1) {
            //     if(lbo_dist < 10) {
            //         lbo_val += 1;
            //     }
            // }
            if (lbo_dist < 10) {
                if (Math.abs(i - j) == 1) {
                    lbo_val = lbo_val + 2;
                }
                else if (Math.abs(i - j) == 2) {
                    lbo_val = lbo_val + 2;
                }
                else if (Math.abs(i - j) == 3) {
                    lbo_val = lbo_val + 4;
                }
                else if (Math.abs(i - j) == 4) {
                    lbo_val = lbo_val + 6;
                }
                else if (Math.abs(i - j) == 5) {
                    lbo_val = lbo_val + 8;
                }
                else if (Math.abs(i - j) == 6) {
                    lbo_val = lbo_val + 10;
                }
                else if (Math.abs(i - j) == 7) {
                    lbo_val = lbo_val + 10;
                }
                else if (Math.abs(i - j) == 8) {
                    lbo_val = lbo_val + 10;
                }
            }
        }
    }

    // Smoothness
    // ANGLE METHOD
    // 3D
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
        return Math.acos(dot/(Math.sqrt(len1) * Math.sqrt(len2)));
    }
    for(var i = 0; i < edgesSmoNew.length - 1; i++) {
        var vectorA = [edgesSmoNew[i].target[0] - edgesSmoNew[i].source[0], edgesSmoNew[i].target[1] - edgesSmoNew[i].source[1], edgesSmoNew[i].target[2] - edgesSmoNew[i].source[2]];
        var vectorB = [edgesSmoNew[i+1].source[0] - edgesSmoNew[i+1].target[0], edgesSmoNew[i+1].source[1] - edgesSmoNew[i+1].target[1], edgesSmoNew[i+1].source[2] - edgesSmoNew[i+1].target[2]];                        
        var angle = angle_between(vectorA[0],vectorA[1],vectorA[2],vectorB[0],vectorB[1],vectorB[2]) * 180 / Math.PI;
        // Assign score if Nan
        angle = angle || -100000000;
        angleDiff = angleDiff + angle;
    }
    var angleDifference = angleDiff/sample_sal;

    // // Colorfulness
    // function onlyUnique(value, index, self) {
    //     return self.indexOf(value) === index;
    // }

    // var nameCol = [];
    // var colorInterpolatorCol = d3.interpolateRgb(d3.rgb((palette[0].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[0].fill).slice(4,-1).split(",").map(x=>+x)[2]), d3.rgb((palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[0], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[1], (palette[sample_sal-1].fill).slice(4,-1).split(",").map(x=>+x)[2]));
    // var stepsCol = 100;
    // var colorArrayCol = d3.range(0, (1 + 1 / stepsCol), 1 / (stepsCol - 1)).map(function(d) {
    //     return colorInterpolatorCol(d)
    // });
    // for(i = 0; i < 100; i++) {
    //     nameCol.push(termDistribution(colorArrayCol[i]).slice(0,1)[0].term);
    // }
    // var unique = nameCol.filter(onlyUnique);
    // console.log(unique);


    // Weights
    if(lumRadio == 'linear') {
        // Slider weights changes
        var wSal = val_salSimL;
        var wLD = val_ldSimL;
        var wPU = val_puSimL;
        var wLBO = val_lboSimL;
        var wSmo = val_smoSimL;
        
        // // Manual weights changes
        // var wSal = 100;
        // var wLD = -1000000;
        // var wPU = -5000;
        // var wLBO = -500;
        // var wSmo = 2000;
    }
    // Diverging
    else if (lumRadio == 'diverging') {
        // Slider weights changes
        var wSal = val_salSimD;
        var wLD = val_ldSimD;
        var wPU = val_puSimD;
        var wLBO = val_lboSimD;
        var wSmo = val_smoSimD;

        // // Manual weights changes
        // var wSal = 40;
        // var wLD = -100000;
        // var wPU = -10000;
        // var wLBO = -500;
        // var wSmo = 100;
    }

    // finScore = (wSal * nSalience) + (wLD * lumDifference) + (wPU * perc_fin) + (wSmo * angleDiff);
    finScore = (wLD * lumDifference) + (wPU * perc_fin) + (wSmo * angleDifference);
    // if(lbo_val > 0) {
    //     finScore = -999999999999999;
    // }
    scoreArr.push([finScore, nSalience, lumDifference, perc_fin, angleDifference, lbo_val, palette]);

    return finScore;
}


// Random Color Disturb
function randomDisturbColors(palette) {
    // console.log('randomDisturbColors');
    // console.log(datasetDrop);
    var iter_count = 0;
    // if(colRadio == 'singlehue') {
    //     var disturb_abstep = 0;
    //     var disturb_lstep = 5;
    // }
    var sel_val = datasetDrop[0].fill;
    // var sel_val2
    // else if(colRadio == 'multihue') {
        var disturb_abstep = 10;
        var disturb_lstep = 5;

        var disturb_abstep_1 = 5;
        var disturb_lstep_1 = 0;
    // }

    while(iter_count <= 100) {
        iter_count++;
        // random disturb one color
        var idx = getRandom(0, palette.length - 1);
        var sel_color = palette[idx];

        // For color = 0
        if(sel_color.sel == 0) {
            // var sel_color = palette[idx];
            // Disturb LAB space - large l diff, large a,b diff -> L: (-15,15), a: (-55,25), b: (-55,25)
            var new_color = d3.lab(sel_color.LAB[0] + (5 * Math.round(getRandom(-disturb_lstep, disturb_lstep)/5)), sel_color.LAB[1] + getRandom(-disturb_abstep, disturb_abstep), sel_color.LAB[2] + getRandom(-disturb_abstep, disturb_abstep));

            if(new_color.l >= 0 && new_color.l <= 100 && new_color.a >= -128 && new_color.a <= 127 && new_color.b >= -128 && new_color.b <= 127) {
                var lab_new = d3.rgb(new_color);

                if(Math.round(lab_new.r) >= 0 && Math.round(lab_new.g) >= 0 && Math.round(lab_new.b) >= 0 && Math.round(lab_new.r) <= 255 && Math.round(lab_new.g) <= 255 && Math.round(lab_new.b) <= 255 && Math.round(new_color.l) >= 0 && Math.round(new_color.l) <= 100) {
                    lab_checked = new_color;
                    rgb_checked = d3.rgb(lab_checked); 
                    new_fill = "rgb(" + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + ")";

                    // Check distance from original selection
                    var cie00_sel = c3.color[index(d3.color(sel_val))];
                    var cie00_new = c3.color[index(d3.color(new_fill))];
                    // var user_dist = cie00Distance(cie00_sel, cie00_new);
                    var user_dist = nameDifference(cie00_sel, cie00_new);
                    // console.log(user_dist);
                    if(user_dist < 0.75) {
                        // Update
                        palette[idx] = {
                            RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                            LAB: [lab_checked.l,lab_checked.a,lab_checked.b],
                            name:  nameDistribution(d3.lab(lab_checked.l,lab_checked.a,lab_checked.b)),
                            fill: "rgb(" + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + ")",
                            sel: 0
                            // pts: [lab_checked.a, lab_checked.b]
                        }
                    } 
                }
            }
        }
        // For color = 1
        // Change selected colors: Randomize L, keeping a,b same
        else if(sel_color.sel == 1) {
            // Disturb LAB space - small l diff, small a,b diff -> L: (-5,5), a: (-25,25), b: (-25,25)
            var new_color = d3.lab(sel_color.LAB[0] + (5 * Math.round(getRandom(-disturb_lstep_1, disturb_lstep_1)/5)), sel_color.LAB[1] + getRandom(-disturb_abstep_1, disturb_abstep_1), sel_color.LAB[2] + getRandom(-disturb_abstep_1, disturb_abstep_1));
            // var new_color = d3.lab(sel_color.LAB[0] + (5 * Math.round(getRandom(-disturb_lstep, disturb_lstep)/5)), sel_color.LAB[1], sel_color.LAB[2]);
            
            if(new_color.l >= 0 && new_color.l <= 100 && new_color.a >= -128 && new_color.a <= 127 && new_color.b >= -128 && new_color.b <= 127) {
                var lab_new = d3.rgb(new_color);

                if(Math.round(lab_new.r) >= 0 && Math.round(lab_new.g) >= 0 && Math.round(lab_new.b) >= 0 && Math.round(lab_new.r) <= 255 && Math.round(lab_new.g) <= 255 && Math.round(lab_new.b) <= 255) {
                    lab_checked = new_color;
                    rgb_checked = d3.rgb(lab_checked); 
    
                    // Update
                    palette[idx] = {
                        RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                        LAB: [lab_checked.l,lab_checked.a,lab_checked.b],
                        fill: "rgb(" + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + ")",
                        name:  nameDistribution(d3.lab(lab_checked.l,lab_checked.a,lab_checked.b)),
                        sel: 1
                        // pts: [lab_checked.a, lab_checked.b]
                    }
                }      
            }
        }

        else if(sel_color.sel == 2) {
            lab_check = d3.lab(sel_color.LAB[0], 5 * Math.round(getRandom(-110, 110)/5), 5 * Math.round(getRandom(-110, 110)/5));
            rgb_check = d3.rgb(lab_check);
            if(Math.round(rgb_check.r) >= 0 && Math.round(rgb_check.g) >= 0 && Math.round(rgb_check.b) >= 0 && Math.round(rgb_check.r) <= 255 && Math.round(rgb_check.g) <= 255 && Math.round(rgb_check.b) <= 255) {
                lab = lab_check;
                rgb = d3.rgb(lab);
        
                // Push to Dataset - new dataset (add to pre-owned colors)
                palette[idx] = {
                    RGB: [Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)],
                    LAB: [lab.l,lab.a,lab.b],
                    fill: "rgb(" + d3.rgb(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)).r + ", " + d3.rgb(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)).g + ", " + d3.rgb(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)).b + ")",
                    name:  nameDistribution(d3.lab(lab.l,lab.a,lab.b)),
                    sel: 2
                    // pts: [lab.a, lab.b]
                }
            }
            var new_color = d3.lab(sel_color.LAB[0] + (5 * Math.round(getRandom(-disturb_lstep, disturb_lstep)/5)), sel_color.LAB[1] + getRandom(-disturb_abstep, disturb_abstep), sel_color.LAB[2] + getRandom(-disturb_abstep, disturb_abstep));

            if(new_color.l >= 0 && new_color.l <= 100 && new_color.a >= -128 && new_color.a <= 127 && new_color.b >= -128 && new_color.b <= 127) {
                var lab_new = d3.rgb(new_color);

                if(Math.round(lab_new.r) >= 0 && Math.round(lab_new.g) >= 0 && Math.round(lab_new.b) >= 0 && Math.round(lab_new.r) <= 255 && Math.round(lab_new.g) <= 255 && Math.round(lab_new.b) <= 255 && Math.round(new_color.l) >= 0 && Math.round(new_color.l) <= 100) {
                    lab_checked = new_color;
                    rgb_checked = d3.rgb(lab_checked); 
                    new_fill = "rgb(" + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + ")";

                    // Check distance from original selection
                    var cie00_sel = c3.color[index(d3.color(sel_val))];
                    var cie00_new = c3.color[index(d3.color(new_fill))];
                    // var user_dist = cie00Distance(cie00_sel, cie00_new);
                    var user_dist = nameDifference(cie00_sel, cie00_new);
                    // console.log(user_dist);
                    if(user_dist < 0.75) {
                        // Update
                        palette[idx] = {
                            RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                            LAB: [lab_checked.l,lab_checked.a,lab_checked.b],
                            fill: "rgb(" + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + ")",
                            name:  nameDistribution(d3.lab(lab.l,lab.a,lab.b)),
                            sel: 2
                            // pts: [lab_checked.a, lab_checked.b]
                        }
                    } 
                }
            }
        }
    }
    // console.log(palette);
    return palette;
}

function simulatedAnnealing2FindBestPalette(size, evaluateFunc, minl, maxl) {
    // console.log('simAnnealing');
    var iterate_times = 0;
    var max_temper = 100000; // initial temperature
    var dec = 0.99; // decrementation
    // var dec = val_algoIter; 
    var max_iteration_times = 10000000; 
    var end_temper = 0.001; // end temperature
    var cur_temper = max_temper;
    var datasetTop = []; 

    // var color_palette = genRandomPalette(size);
    var color_palette = randomDisturbColors(datasetDrop);
    // current palette
    console.log(color_palette);
    var o = {
            id: color_palette,
            score: evaluateFunc(color_palette, size, minl, maxl)
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
                score: evaluateFunc(color_palette_2, size, minl, maxl)
            };
            var delta_score = o.score - o2.score;
            if (delta_score <= 0 || delta_score > 0 && Math.random() <= Math.exp((-delta_score) / cur_temper)) {
                o = o2;
                if (preferredObj.score - o.score < 0) {
                    preferredObj = o;
                    datasetTop.push(preferredObj);
                    // console.log(preferredObj);

                    // postMessage(preferredObj);
                }
            }
            // if (iterate_times > max_iteration_times) {
            //     break;
            // }
        }
        cur_temper *= dec;
        if (iterate_times > max_iteration_times) {
            break;
        }
    }
    // // Top 3 Suggestion Colormaps
    // drawSuggestmap(datasetTop.reverse()[1].id, "#sugg1");
    // drawSuggestmap(datasetTop.reverse()[2].id, "#sugg2");
    // drawSuggestmap(datasetTop.reverse()[3].id, "#sugg3");

    return preferredObj;
}

postMessage([palette, highestToLowest]);
}
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
    val_algoIter = e.data.args[3];
    datasetDrop = e.data.args[4];
    lumRadio = e.data.args[5];
    val_salSimL = e.data.args[6];
    val_ldSimL = e.data.args[7];
    val_puSimL = e.data.args[8];
    val_lboSimL = e.data.args[9];
    val_smoSimL = e.data.args[10];
    val_salSimD = e.data.args[11];
    val_ldSimD = e.data.args[12];
    val_puSimD = e.data.args[13];
    val_lboSimD = e.data.args[14];
    val_smoSimD = e.data.args[15];

    // function calcPalette(palSize, minl, maxl) {
    // console.log('calcPalette');
    // Size of the Palette
    var palette_size = palSize;
    // Get Best Colormap
    var best_color = simulatedAnnealing2FindBestPalette(palette_size, evalPalette, minl, maxl);

    var palette = new Array(palette_size);
    for (let i = 0; i < palette.length; i++) {
        palette[i] = best_color.id[i];
    }
//     return palette;
// }
    // drawColormap(palette);
    // drawLinegraph(palette);

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
                    LAB: [lab.L,lab.a,lab.b],
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
    // console.log('evalPalette');
    // drawColormap(palette,null);
    // console.log(palette);
    var sample_sal = col_len;

    // Saliency
    var name_sal = 0;
    var dis;
    for (var i = 0; i < sample_sal; i++) {
        // console.log(d3.color(palette[i].fill));
        // var samp = i/(sample_sal-1);
        dis = d3.color(palette[i].fill);

        var curr_sal = nameSalience(dis);
        name_sal = name_sal + curr_sal;
    }
    var nSalience = name_sal/sample_sal;

    // Luminance Difference
    var lum_min = minl;
    var lum_max = maxl;
    var lum_fin = 0;

    for(var i = 0; i < sample_sal; i++) { 
        var samp_lum = i/(sample_sal-1);
        var lum_curr = d3.lab(palette[i].fill).L;
        // var lum_curr = d3.lab(colormap.mapValue(samp_lum)).L;

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
        var samp_dist2 = i/(sample_sal-1);
        var samp_dist1 = (i-1)/(sample_sal-1);
        var cie00_dist2 = c3.color[index(d3.color(palette[i].fill))];
        var cie00_dist1 = c3.color[index(d3.color(palette[i-1].fill))];

        // var cie00_dist2 = c3.color[index(d3.color(colormap.mapValue(samp_dist2)))];
        // var cie00_dist1 = c3.color[index(d3.color(colormap.mapValue(samp_dist1)))];
    
        var perc_dist = cie00Distance(cie00_dist2, cie00_dist1);
        var cie00_dist = cie00_dist + perc_dist;

        // Mean PU
        var meancie00Dist = cie00_dist/(sample_sal);

        // // Points between key points
        // if(i < (sample_sal - 1)) {
        //     var d = 4;
        //     // First
        //     var firstkey1 = (1 + d * (i-1))/((sample_sal-1) * 4);
        //     var firstkey2 = (1 + d * ((i+1)-1))/((sample_sal-1) * 4);
        //     var cie00_firstkey1 = c3.color[index(d3.color(colormap.mapValue(firstkey1)))];
        //     var cie00_firstkey2 = c3.color[index(d3.color(colormap.mapValue(firstkey2)))];

        //     var perc_firstkey = cie00Distance(cie00_firstkey2, cie00_firstkey1);
        //     var cie00_firstkey = cie00_firstkey + perc_firstkey;
        //     // Mean PU Keys
        //     var meancie00_firstkey = cie00_firstkey/sample_sal;
        //     // Second
        //     var seckey1 = (2 + d * (i-1))/((sample_sal-1) * 4);
        //     var seckey2 = (2 + d * ((i+1)-1))/((sample_sal-1) * 4);
        //     var cie00_seckey1 = c3.color[index(d3.color(colormap.mapValue(seckey1)))];
        //     var cie00_seckey2 = c3.color[index(d3.color(colormap.mapValue(seckey2)))];
        //     var perc_seckey = cie00Distance(cie00_seckey2, cie00_seckey1);
        //     var cie00_seckey = cie00_seckey + perc_seckey;
        //     // Mean PU Keys
        //     var meancie00_seckey = cie00_seckey/sample_sal;
        //     // Third
        //     var thirdkey1 = (3 + d * (i-1))/((sample_sal-1) * 4);
        //     var thirdkey2 = (3 + d * ((i+1)-1))/((sample_sal-1) * 4);
        //     var cie00_thirdkey1 = c3.color[index(d3.color(colormap.mapValue(thirdkey1)))];
        //     var cie00_thirdkey2 = c3.color[index(d3.color(colormap.mapValue(thirdkey2)))];
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

        // Difference PU
        var perc_unif = Math.abs(meancie00Dist - perc_dist);
        perc_fin = perc_fin + perc_unif;
    }

    // Legend Based Order
    var lbo_val = 0;
    for (var i = 0; i < sample_sal; i++) {
        for (var j = i + 1; j < sample_sal; j++) {
            var samp_lbo1 = i/(sample_sal-1);
            var samp_lbo2 = j/(sample_sal-1);
            // var lbo_dist1 = c3.color[index(d3.color(colormap.mapValue(samp_lbo1)))];
            // var lbo_dist2 = c3.color[index(d3.color(colormap.mapValue(samp_lbo2)))];

            var lbo_dist1 = c3.color[index(d3.color(palette[i].fill))];
            var lbo_dist2 = c3.color[index(d3.color(palette[j].fill))];

            var lbo_dist = cie00Distance(lbo_dist1, lbo_dist2);
            // console.log(lbo_dist);
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
    for(i = 0; i < palette.length; i++) {
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
        return Math.acos(dot/(Math.sqrt(len1) * Math.sqrt(len2)));
    }
    for(var i = 0; i < edgesSmoNew.length - 1; i++) {
        var vectorA = [edgesSmoNew[i].target[0] - edgesSmoNew[i].source[0], edgesSmoNew[i].target[1] - edgesSmoNew[i].source[1], edgesSmoNew[i].target[2] - edgesSmoNew[i].source[2]];
        var vectorB = [edgesSmoNew[i+1].source[0] - edgesSmoNew[i+1].target[0], edgesSmoNew[i+1].source[1] - edgesSmoNew[i+1].target[1], edgesSmoNew[i+1].source[2] - edgesSmoNew[i+1].target[2]];                        
        var angle = angle_between(vectorA[0],vectorA[1],vectorA[2],vectorB[0],vectorB[1],vectorB[2]) * 180 / Math.PI;
        // Assign score
        // if(isNaN(angle)) {
        //     return 0;
        // }
        angleDiff = angleDiff + angle;
    }
    // console.log(angleDiff);

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
    // console.log(wSal);
    return (wSal * nSalience) + (wLD * lumDifference) + (wPU * perc_fin) + (wLBO * lbo_val);
}

// Random Color Disturb
function randomDisturbColors(palette) {
    // console.log('randomDisturbColors');
    var iter_count = 0;
    var disturb_abstep = 25;
    var disturb_lstep = 5;

    while(iter_count <= 100) {
        iter_count++;
        // random disturb one color
        var idx = getRandom(0, palette.length - 1);
        var sel_color = palette[idx];

        if(sel_color.sel == 0) {
            // var sel_color = palette[idx];
            // Disturb LAB space - small l diff, large a,b diff -> L: (-5,5), a: (-25,25), b: (-25,25)
            var new_color = d3.lab(sel_color.LAB[0] + (5 * Math.round(getRandom(-disturb_lstep, disturb_lstep)/5)), sel_color.LAB[1] + getRandom(-disturb_abstep, disturb_abstep), sel_color.LAB[2] + getRandom(-disturb_abstep, disturb_abstep));

            if(new_color.L >= 0 && new_color.L <= 100 && new_color.a >= -128 && new_color.a <= 127 && new_color.b >= -128 && new_color.b <= 127) {
                var lab_new = d3.rgb(new_color);

                if(Math.round(lab_new.r) >= 0 && Math.round(lab_new.g) >= 0 && Math.round(lab_new.b) >= 0 && Math.round(lab_new.r) <= 255 && Math.round(lab_new.g) <= 255 && Math.round(lab_new.b) <= 255 && Math.round(new_color.L) >= 0 && Math.round(new_color.L) <= 100) {
                    lab_checked = new_color;
                    rgb_checked = d3.rgb(lab_checked); 
    
                    // Update
                    palette[idx] = {
                        RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                        LAB: [lab_checked.L,lab_checked.a,lab_checked.b],
                        fill: "rgb(" + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + ")",
                        sel: 0
                        // pts: [lab_checked.a, lab_checked.b]
                    }
                }
            }
        }
        // Change selected colors: Randomize L, keeping a,b same
        else if(sel_color.sel == 1) {
            // Disturb LAB space - small l diff, no a,b diff -> L: (-5,5)
            var new_color = d3.lab(sel_color.LAB[0] + (5 * Math.round(getRandom(-disturb_lstep, disturb_lstep)/5)), sel_color.LAB[1], sel_color.LAB[2]);
            
            if(new_color.L >= 0 && new_color.L <= 100 && new_color.a >= -128 && new_color.a <= 127 && new_color.b >= -128 && new_color.b <= 127) {
                var lab_new = d3.rgb(new_color);

                if(Math.round(lab_new.r) >= 0 && Math.round(lab_new.g) >= 0 && Math.round(lab_new.b) >= 0 && Math.round(lab_new.r) <= 255 && Math.round(lab_new.g) <= 255 && Math.round(lab_new.b) <= 255) {
                    lab_checked = new_color;
                    rgb_checked = d3.rgb(lab_checked); 
    
                    // Update
                    palette[idx] = {
                        RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                        LAB: [lab_checked.L,lab_checked.a,lab_checked.b],
                        fill: "rgb(" + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).r + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).g + ", " + d3.rgb(Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)).b + ")",
                        sel: 1
                        // pts: [lab_checked.a, lab_checked.b]
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
    // var dec = 0.99; // decrementation
    var dec = val_algoIter; 
    var max_iteration_times = 10000000; 
    var end_temper = 0.001; // end temperature
    var cur_temper = max_temper;
    var datasetTop = []; 

    var color_palette = genRandomPalette(size);
    // current palette
    // console.log(color_palette);
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
            // console.log(color_palette_2);
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

postMessage(palette);
}
function calcPalette(palSize) {
    // Size of the Palette
    var palette_size = palSize;
    // Get Best Colormap
    var best_color = simulatedAnnealing2FindBestPalette(palette_size, evalPalette);

    var palette = new Array(palette_size);
    for (let i = 0; i < palette.length; i++) {
        palette[i] = best_color.id[i];
    }
}
// LAB Color Generator
function generate() {
    lab_check = d3.lab(5 * Math.round(getRandom(0, 100)/5), 5 * Math.round(getRandom(-110, 110)/5), 5 * Math.round(getRandom(-110, 110)/5));
    rgb_check = d3.rgb(lab_check);
}

// Generate Random Palette 
function genRandomPalette(col_len) {
    // Check if in the RGB Gamut
    // var palette_size = 5; // No of color samples
    palette = datasetDrop;
    // while(palette.length < col_len) {
    for(var len=0; len<col_len; len++) {
        generate();
        if(Math.round(rgb_check.r) >= 0 && Math.round(rgb_check.g) >= 0 && Math.round(rgb_check.b) >= 0 && Math.round(rgb_check.r) <= 255 && Math.round(rgb_check.g) <= 255 && Math.round(rgb_check.b) <= 255) {
            lab = lab_check;
            rgb = d3.rgb(lab); 

            // // Push to Dataset - new dataset (add to pre-owned colors)
            // datasetDrop.push({
            //     RGB: [Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)],
            //     LAB: [lab.L,lab.a,lab.b],
            //     sel: 0
            //     // pts: [lab.a, lab.b]
            // })
            if(palette[len].sel == 0) {
                var selRect = ({
                    RGB: [Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)],
                    LAB: [lab.L,lab.a,lab.b],
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
function evalPalette(palette, col_len) {
    drawColormap(palette,null);

    var sample_sal = col_len;

    // Saliency
    var name_sal = 0;
    var dis;
    for (var i = 0; i < sample_sal; i++) {
            var samp = i/(sample_sal-1);
            dis = d3.color(colormap.mapValue(samp));
            var curr_sal = nameSalience(dis);
            name_sal = name_sal + curr_sal;
    }
    var nSalience = name_sal/sample_sal;

    return nSalience;
}

// Random Color Disturb
function randomDisturbColors(palette) {
    var iter_count = 0;
    var disturb_abstep = 25;
    var disturb_lstep = 5;

    while(iter_count <= 100) {
        iter_count++;
        // random disturb one color
        var idx = getRandom(0, palette.length - 1);

        if(datasetDrop[idx].sel == 0) {
            var sel_color = palette[idx];
            // Disturb LAB space - small l diff, large a,b diff -> L: -(10,10), a: (-25,25), b: (-25,25)
            var new_color = d3.lab(sel_color.LAB[0] + (5 * Math.round(getRandom(-disturb_lstep, disturb_lstep)/5)), sel_color.LAB[1] + getRandom(-disturb_abstep, disturb_abstep), sel_color.LAB[2] + getRandom(-disturb_abstep, disturb_abstep));
            var lab_new = d3.rgb(new_color);

            if(Math.round(lab_new.r) >= 0 && Math.round(lab_new.g) >= 0 && Math.round(lab_new.b) >= 0 && Math.round(lab_new.r) <= 255 && Math.round(lab_new.g) <= 255 && Math.round(lab_new.b) <= 255) {
                lab_checked = new_color;
                rgb_checked = d3.rgb(lab_checked); 
    
                // Update
                palette[idx] = {
                    RGB: [Math.round(rgb_checked.r), Math.round(rgb_checked.g), Math.round(rgb_checked.b)],
                    LAB: [lab_checked.L,lab_checked.a,lab_checked.b]
                    // pts: [lab_checked.a, lab_checked.b]
                }
            }
        }
    }
    return palette;
}

function simulatedAnnealing2FindBestPalette(size, evaluateFunc) {
    var iterate_times = 0;
    //default parameters
    var max_temper = 100000; // initial temperature
    var dec = 0.99; // decrementation
    var max_iteration_times = 10000000; 
    var end_temper = 0.001; // end temperature
    var cur_temper = max_temper;
    var dataset_top = [];

    var color_palette = genRandomPalette(size);
    // current palette
    var o = {
            id: color_palette,
            // score: evaluateFunc(color_palette, size, minl, maxl)
            score: evaluateFunc(color_palette, size)
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
                // score: evaluateFunc(color_palette_2, size, minl, maxl)
                score: evaluateFunc(color_palette_2, size)
            };
            var delta_score = o.score - o2.score;
            if (delta_score <= 0 || delta_score > 0 && Math.random() <= Math.exp((-delta_score) / cur_temper)) {
                o = o2;
                if (preferredObj.score - o.score < 0) {
                    preferredObj = o;
                    dataset_top.push(preferredObj);
                }
            }
            if (iterate_times > max_iteration_times) {
                break;
            }
        }
        cur_temper *= dec;
    }
    // Top 3 Suggestion Colormaps
    drawSuggestmap(dataset_top.reverse()[1].id, "#sugg1");
    drawSuggestmap(dataset_top.reverse()[2].id, "#sugg2");
    drawSuggestmap(dataset_top.reverse()[3].id, "#sugg3");
    console.log(dataset_top);

    return preferredObj;
}
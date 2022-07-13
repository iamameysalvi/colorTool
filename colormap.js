function drawCanvas() {
    // Canvas Slider
    svg_colormap.append('rect')
                .attr('class', 'dropCanvas')
                .attr('x', 0)
                .attr('y', 10)
                .attr('width', 985)
                .attr('height', 75)
                .attr('stroke', '#ABABAB')
                .style('stroke-dasharray', ('5','5'))
                .attr('fill', '#F5F5F5');
    // Canvas Slider Text
    svg_colormap.append('text')
                .attr('class', 'sliderText')
                .attr('x', 395)
                .attr('y', 55)
                .text('Drop Colors Here')
                .style('font-size', '24px')
                .attr('fill', '#808080');
    // Heading
    svg_colormap.append('text')
                .attr('x', 10)
                .attr('y', 125)
                .text('SELECTED COLORS')
                .style('font-size', '24px')
                .attr('font-weight', 600)
                .attr('fill', '#222021');
    // Reset Button
    svg_colormap.append('text')
                .attr('x', 250)
                .attr('y', 125)
                .attr("class", "fa")
                .text("\uf021")
                .attr('fill', '#222021')
                .on('mouseover', function() {
                    d3.select(this).attr('fill', '#800000')
                })
                .on('mouseout', function() {
                    d3.select(this).attr('fill', '#222021')
                })
                .on('click', function() {
                    countCol = 0;
                    svg_colormap.selectAll('rect.addCol').remove();
                    datasetSel = [];
                })
                .append('title').text('Reset Colors');
}

function drawSelected() {
    // Selected Colors
    svg_colormap.append('rect')
                .attr('x', 0)
                .attr('y', 140)
                .attr('width', 985)
                .attr('height', 75)
                .attr('stroke', '#ABABAB')
                .style('stroke-dasharray', ('5','5'))
                .attr('fill', '#F5F5F5');
}

// Point within Element
function contains(container, point) {
    var border = container.node().getBBox();
    var coordinates = {
        left: border.x,
        right: border.x + border.width,
        top: border.y,
        bottom: border.y + border.height
    };
    if (point[0] > coordinates.left && 
        point[0] < coordinates.right && 
        point[1] > coordinates.top && 
        point[1] < coordinates.bottom) {
        return true
    }
    else { 
        return false
    }
}

<<<<<<< Updated upstream
=======
// Define ColorMap Prests
var grayscale = [
    { LAB: [0,0,0], RGB: [0, 0, 0] },
    { LAB: [13,0,0], RGB: [33, 33, 33] },
    { LAB: [25,0,0], RGB: [59,59,59] },
    { LAB: [38,0,0], RGB: [88,88,88] },
    { LAB: [50,0,0], RGB: [119,119,119] },
    { LAB: [63,0,0], RGB: [151,151,151] },
    { LAB: [75,0,0], RGB: [185,185,185] },
    { LAB: [88,0,0], RGB: [219,219,219] },
    { LAB: [100,0,0], RGB: [255,255,255] }
];

var singlehue = [
    { LAB: [20,-10,-20], RGB: [0, 53, 77] },
    { LAB: [30,-15,-20], RGB: [0, 78, 101] },
    { LAB: [40,-20,-20], RGB: [1,104,126] },
    { LAB: [50,-25,-15], RGB: [35,131,144] },
    { LAB: [60,-30,-10], RGB: [57,160,161] },
    { LAB: [70,-40,-5], RGB: [51,191,179] },
    { LAB: [80,-40,5], RGB: [103,219,187] },
    { LAB: [90,-20,5], RGB: [187,238,216] },
    { LAB: [100,-10,5], RGB: [238,255,245] }
];

var turbo = [
    { LAB: [5,30,-35], RGB: [33,0,64] },
    { LAB: [25,30,-50], RGB: [65,43,137] },
    { LAB: [55,-5,-35], RGB: [85,136,192] },
    { LAB: [80,-45,20], RGB: [105,220,159] },
    { LAB: [90,-50,60], RGB: [149,250,101] },
    { LAB: [85,-15,70], RGB: [214,219,66] },
    { LAB: [70,25,60], RGB: [232,152,57] },
    { LAB: [50,55,40], RGB: [208,69,55] },
    { LAB: [25,50,30], RGB: [126,0,18] }
];

var blueorange = [
    { LAB: [20,30,-55], RGB: [43,33,132] },
    { LAB: [40,5,-50], RGB: [39,95,177] },
    { LAB: [60,-15,-40], RGB: [49,155,215] },
    { LAB: [80,-40,-10], RGB: [76,219,215] },
    { LAB: [100,0,0], RGB: [255,255,255] },
    { LAB: [80,5,70], RGB: [233,193,54] },
    { LAB: [60,35,50], RGB: [214,118,56] },
    { LAB: [40,60,25], RGB: [181,26,58] },
    { LAB: [20,45,0], RGB: [102,0,50] }
];

var threewave = [
    { LAB: [100,-10,-5], RGB: [230,255,255] },
    { LAB: [60,-5,-25], RGB: [113,149,188] },
    { LAB: [0,10,-25], RGB: [7,0,47] },
    { LAB: [30,-20,15], RGB: [42,79,46] },
    { LAB: [60,-45,55], RGB: [74,164,28] },
    { LAB: [100,-10,35], RGB: [255,255,185] },
    { LAB: [80,5,65], RGB: [232,193,68] },
    { LAB: [60,45,65], RGB: [229,108,18] },
    { LAB: [20,45,25], RGB: [106,0,15] }
];

var inferno = [
    { LAB: [5,30,-45], RGB: [29,0,86] },
    { LAB: [15,45,-45], RGB: [71,0,111] },
    { LAB: [35,60,-45], RGB: [143,17,156] },
    { LAB: [45,65,-25], RGB: [188,39,150] },
    { LAB: [55,65,0], RGB: [227,69,135] },
    { LAB: [65,55,35], RGB: [254,111,99] },
    { LAB: [75,30,60], RGB: [254,162,71] },
    { LAB: [85,10,65], RGB: [255,204,83] },
    { LAB: [95,-10,55], RGB: [248,245,130] }
];

var viridis = [
    { LAB: [25,35,-40], RGB: [84,36,121], fill: 'rgb(84,36,121)', sel: 1, pos: 0, width: 222.22 },
    { LAB: [25,35,-40], RGB: [84,36,121], fill: 'rgb(84,36,121)', sel: 1, pos: 1, width: 0 },
    // { LAB: [35,15,-35], RGB: [81,76,139], fill: 'rgb(81,76,139)', sel: 1, pos: 1, width: 0 },
    { LAB: [40,-5,-25], RGB: [61,98,135], fill: 'rgb(61,98,135)', sel: 0, pos: 2, width: 0 },
    { LAB: [50,-20,-15], RGB: [57,129,144], fill: 'rgb(57,129,144)', sel: 1, pos: 3, width: 200 },
    { LAB: [50,-20,-15], RGB: [57,129,144], fill: 'rgb(57,129,144)', sel: 1, pos: 4, width: 0 },
    // { LAB: [60,-40,10], RGB: [49,163,125], fill: 'rgb(49,163,125)', sel: 1, pos: 4, width: 0 },
    // { LAB: [65,-50,20], RGB: [25,180,119], fill: 'rgb(25,180,119)', sel: 1, pos: 5, width: 0 },
    { LAB: [75,-50,50], RGB: [100,207,84], fill: 'rgb(100,207,84)', sel: 1, pos: 5, width: 185 },
    { LAB: [75,-50,50], RGB: [100,207,84], fill: 'rgb(100,207,84)', sel: 1, pos: 6, width: 0 },
    { LAB: [85,-35,75], RGB: [176, 229, 44], fill: 'rgb(176,229,44)', sel: 1, pos: 7, width: 111.11 },
    { LAB: [90,-10,90], RGB: [241, 230, 0], fill: 'rgb(241,230,0)', sel: 1, pos: 8, width: 111.11 },
];

// Draw Main Colormap
function drawColormap(data) {
    // console.log("CMAP:",data);
    // RAMP ARRAY
    var color_samples = data.length;
    var new_ramp = [];
    
    for (var i=0; i<color_samples; i++) {
        var v = i/(color_samples-1);
        new_ramp.push({
            value: v,
            rgb: data[i].RGB
        });
    }
    colormap = new ColorMap(new_ramp);

    var canvas = d3.select('#canvasMain');
    var w = +canvas.attr('width');
    var h = +canvas.attr('height');

    colormap.drawColorScale(
        w, h,			// DIMENSIONS
        w,				// NUMBER OF STEPS
        'horizontal',	// DIRECTION 
        canvas.node());
    drawHistCan();
}

// Draw Preset Colormap
function drawPreset(data) {
    // RAMP ARRAY
    var preset_samples = data.length;
    var preset_ramp = [];
    
    for (var i=0; i<preset_samples; i++) {
        var v = i/(preset_samples-1);
        preset_ramp.push({
            value: v,
            rgb: data[i].RGB
        });
    }
    colormap = new ColorMap(preset_ramp);


    var canvas = d3.select('#canvasMain');
    var w = +canvas.attr('width');
    var h = +canvas.attr('height');

    colormap.drawColorScale(
        w, h,			// DIMENSIONS
        w,				// NUMBER OF STEPS
        'horizontal',	// DIRECTION 
        canvas.node());
    drawHistCan();
    drawLinegraph(data);
    // drawPresetCol(data);
}

function drawDropPreset(data) {
    svg_colormap.selectAll('text.sliderText').remove();
    // Draw Added Colors
    for(i=0; i<9; i++) {
        svg_colormap.append('rect')
                    .attr('class', 'dropPreset')
                    .attr('x', data[i].pos * 111.11)
                    .attr('y', 10)
                    .attr('width', data[i].width)
                    .attr('height', 75)
                    .attr('fill', data[i].fill)
                    .attr('stroke', '#000');
    }
    calcPalette(9, 0, 100);
    // drawPreset(data);
}

// function drawPresetCol(data) {
//     for(i=0; i<paletteLen; i++) {
//         var canWd = d3.select('rect.dropCanvas').attr('width');
//         var dropPos = i;
//         var dropX = dropPos * (canWd/paletteLen);
//         var dropWd = (i+1) * (canWd/paletteLen) - dropX;

//         // Draw Added Colors
//         svg_colormap.append('rect')
//                     .attr('class', 'dropCol')
//                     .attr('x', dropX)
//                     .attr('y', 10)
//                     .attr('width', dropWd)
//                     .attr('height', 75)
//                     .attr('fill', d3.rgb(data[i].rgb[0],data[i].rgb[1],data[i].rgb[2]))
//                     .attr('stroke', '#000');
//     }
// }

// Draw Top 3 Colormaps
function drawSuggestmap(data, canNum) {
    // RAMP ARRAY
    var color_samples = data.length;
    var new_ramp = [];
    
    for (var i=0; i<color_samples; i++) {
        var v = i/(color_samples-1);
        new_ramp.push({
            value: v,
            rgb: data[i].RGB
        });
    }
    colormap = new ColorMap(new_ramp);

    var canvas = d3.select(canNum);
    var w = +canvas.attr('width');
    var h = +canvas.attr('height');

    colormap.drawColorScale(
        w, h,			// DIMENSIONS
        w,				// NUMBER OF STEPS
        'horizontal',	// DIRECTION 
        canvas.node());
}

// DRAW NAME DISTRIBUTION HISTOGRAM COLORMAP CANVAS
function drawHistCan() {
    d3.select('#canvasMain')
        .on('mousemove', function() {
            // Color & Distribution
            var m = d3.mouse(this);
            var I = m[0] / +d3.select('#canvasMain').attr('width')
            var c = colormap.mapValue(I);
            var nameDist = termDistribution(c).slice(0, 25);

            // Current Selection Box
            svg_search.append('rect')
                    .attr('fill', c)
                    .attr('x', 20)
                    .attr('y', 50)
                    .attr('width', 150)
                    .attr('height', 150)
                    .attr('stroke', '#000')
                    .attr("stroke-width", 0.05);
            // Histogram Height & Width
            var BAR_W = 3 * 2;
            var BAR_H = 20 * 2;
            // Draw Histogram
            svg_search.selectAll('g.extra').remove();
            var g = svg_search.append('g')
                            .attr('class', 'extra')
                            .attr('transform', 'translate(300, 360)');
            (function(grp, nameDist, maxP) 
            {
                var selection = grp.selectAll('rect.bar')
                                    .data(nameDist)
                                    .enter().append('rect');
                selection.attr('x', function(d, i) { return i * BAR_W * 3.5 })
                            .attr('y', function(d) { return 3.5 * (1-d.p/maxP) * BAR_H })
                            .attr('width', BAR_W * 3.5)
                            .attr('height', function(d) { return 3.5 * (d.p/maxP) * BAR_H; })
                            .attr('transform', 'translate(-50 -300)')
                            .style('fill', function(d, i) { return i==0 ? c : d3.color(c).brighter(1) })
                            .style('stroke', '#000')
                            .attr("stroke-width", 0.25);
        
                grp.append('text')
                    .attr('x', -50).attr('y', -315)
                    .html('Colorname: '+ nameDist[0].term)
                    .style('fill', '#000')
                    .style('font-size', '25')
                    .attr('transform', 'translate(0,-5)')
        
            })(g, nameDist, nameDist[0].p)

            var selLAB = d3.lab(c);
            sliderStepLum.value(selLAB.L);
            
            var sel_allrect = svg_slice2D.selectAll('rect');
            sel_allrect.style('opacity', 0.41);
            sel_allrect.filter(function () { 
                    var sel_text = d3.lab(c);
                    var sel_col = (5 * (Math.round(selLAB.L/5))) + "," + (5 * (Math.round(selLAB.a/5))) + "," + (5 * (Math.round(selLAB.b/5)));
                    return sel_text == sel_col;
            })
            .attr('width', 50)
            .attr('height', 50)
            .style('opacity', 1.01)
            .raise();

            var mLine = d3.mouse(this);
            var xLine = mLine[0] / +d3.select('#canvasMain').attr('width')*1000;
            svg_linegraph.selectAll('line.hoverLine').remove();
            svg_linegraph.append('line')
                        .attr('class', 'hoverLine')
                        .style('stroke', '#000')
                        .style('stroke-dasharray', ('5,5'))
                        .style('stroke-width', 1)
                        .attr('x1',xLine)
                        .attr('y1',25)
                        .attr('x2',xLine)
                        .attr('y2',175);
        });
  }

>>>>>>> Stashed changes
// Add Color to Selected Area
function addColor(selection) {
    if(countCol < 16) {
        datasetSel.push({
            lab: selection.text(),
            name: selection.attr('value'),
            fill: selection.attr('style').slice(6,-51)
        })
        function drawColor() {
            svg_colormap.selectAll('rect.addCol')
                        .data(datasetSel)
                        .enter()
                        .append('rect')
                        .attr('class', 'addCol')
                        .attr('index', function(d, i) { return i; })
                        .attr('x', function(d,i) { return 10 + i * 60; })
                        .attr('y', 150)
                        .attr('width', 50)
                        .attr('height', 55)
                        .attr('fill', function(d) { return d.fill; })
                        .attr('stroke', '#000')
                        .on('mouseover', function() {
                            d3.select(this)
                                .call(drawHistText);
                            var selLAB = selection.text().split(",").map(x=>+x);
                            sliderStepLum.value(selLAB[0]);
                            var sel_allrect = svg_slice2D.selectAll('rect');
                            sel_allrect.style('opacity', 0.41);
                            sel_allrect.filter(function () { 
                                    var sel_text = d3.select(this).text();
                                    var sel_col = (5 * (Math.round(selLAB[0]/5))) + "," + (5 * (Math.round(selLAB[1]/5))) + "," + (5 * (Math.round(selLAB[2]/5)));
                                    return sel_text == sel_col;
                            })
                            .attr('width', 50)
                            .attr('height', 50)
                            .style('opacity', 1.01)
                            .raise();
                        })
                        .on('mousedown', function() {
                            var rectDrop = d3.select(this);
                            // Change Border Thickness
                            rectDrop.attr('stroke-width', 5);
                            
                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                                    // Get Mouse Co-Ordinates
                                                    rectDrop.attr('x', d3.event.x)
                                                            .attr('y', d3.event.y - 85);
                                                    // Add Color to Slider Canvas
                                                    svg_colormap.select('rect.dropCanvas').attr('fill', '#FFD0D0').attr('opacity', 0.5);
                            })

                            d3.select(document).on('mouseup', function() {
<<<<<<< Updated upstream
                                                    // Change Border Thickness
                                                    rectDrop.attr('stroke-width', 1);
                                                    svg_colormap.select('rect.dropCanvas').attr('fill', '#F5F5F5');
                                                    // Get Drop-off Mouse Co-Ordinates
                                                    var xTest = d3.event.x;
                                                    var yTest = d3.event.y - 85;
                                                    var ptTest = [xTest, yTest];
                                                    // Stop Mouse Events
                                                    d3.select(document)
                                                        .on('mousemove', null)
                                                        .on('mouseup', null);
                                                    if(contains(svg_colormap.select('rect.dropCanvas'),ptTest) == true) {
                                                        // Update Selected Color Dataset using Index
                                                        var idDrop = rectDrop.attr('index');
                                                        datasetSel.splice(idDrop,1);
                                                        // Remove Selected Colors
                                                        svg_colormap.selectAll('rect.addCol').remove();
                                                        // Add Color to Dropped Dataset
                                                        datasetDrop.push({
                                                            lab: rectDrop.data()[0].lab,
                                                            name: rectDrop.data()[0].name,
                                                            fill: rectDrop.data()[0].fill
                                                        });
                                                        // Draw Added Colors
                                                        svg_colormap.selectAll('rect.dropCol')
                                                                    .data(datasetDrop)
                                                                    .enter()
                                                                    .append('rect')
                                                                    .attr('class', 'dropCol')
                                                                    .attr('index', function(d, i) { return i; })
                                                                    .attr('x', function(d,i) { return 10 + i * 60; })
                                                                    .attr('y', 20)
                                                                    .attr('width', 50)
                                                                    .attr('height', 55)
                                                                    .attr('fill', function(d) { return d.fill; })
                                                                    .attr('stroke', '#000')
                                                        drawColor();
                                                        svg_colormap.selectAll('text.sliderText').remove();
                                                    }
                                                    else {
                                                        svg_colormap.selectAll('rect.addCol').remove();
                                                        drawColor();
                                                    }
=======
                                svg_colormap.selectAll('rect.dropPreset').remove();
                                svg_colormap.selectAll('rect.hoverCol').remove();
                                // Change Border Thickness
                                rectDrop.attr('stroke-width', 1);
                                svg_colormap.select('rect.dropCanvas').attr('fill', '#F5F5F5');
                                // Get Drop-off Mouse Co-Ordinates
                                var dropMouse = d3.mouse(rectDrop.node());
                                // var xTest = d3.event.x;
                                // var yTest = d3.event.y - 85;
                                // var ptTest = [xTest, yTest];
                                var ptTest = [dropMouse[0], dropMouse[1]];
                                // Stop Mouse Events
                                d3.select(document)
                                    .on('mousemove', null)
                                    .on('mouseup', null);
                                if(contains(svg_colormap.select('rect.dropCanvas'),ptTest) == true) {
                                    // Update Selected Color Dataset using Index
                                    var idDrop = rectDrop.attr('index');
                                    datasetSel.splice(idDrop,1);
                                    // Remove Selected Colors
                                    svg_colormap.selectAll('rect.addCol').remove();
                                    // Add Color to Dropped Dataset
                                    var canWd = d3.select('rect.dropCanvas').attr('width')
                                    var dropPos = Math.floor(paletteLen * ptTest[0]/canWd);
                                    // slidePos = Math.floor(paletteLen * ptTest[0]/canWd);
                                    var dropX = dropPos * (canWd/paletteLen);
                                    var dropWd = Math.ceil(paletteLen * ptTest[0]/canWd) * (canWd/paletteLen) - dropX;
                                    var dropRect = ({
                                        // pos: slidePos,
                                        pos: dropPos,
                                        lab: rectDrop.data()[0].lab,
                                        name: rectDrop.data()[0].name,
                                        fill: rectDrop.data()[0].fill,
                                        RGB: [d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).r, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).g, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).b],
                                        LAB: [d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).L, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).a, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).b],
                                        sel: 1
                                    });
                                    // console.log(dropRect.pos);
                                    function drawDropCol() {
                                        // Draw Added Colors
                                        svg_colormap.append('rect')
                                                    .attr('class', 'dropCol')
                                                    .attr('x', dropX)
                                                    .attr('y', 10)
                                                    .attr('width', dropWd)
                                                    .attr('height', 75)
                                                    .attr('fill', dropRect.fill)
                                                    .attr('stroke', '#000')
                                                    .on('mousemove', function() {
                                                        var rectDrop = d3.select(this);
                                                        var selMouse = d3.mouse(rectDrop.node());
                                                        var leftCoord = parseInt(d3.select(this).attr('x'));   // Start Point (Left Edge)
                                                        var rightCoord = parseInt(leftCoord) + dropWd; // End Point (Right Edge)

                                                        if((selMouse[0] > (rightCoord - 10)) && (selMouse[0] <= rightCoord)) {
                                                            rectDrop.style('cursor', 'w-resize');
                                                        }
                                                        // Left Edge
                                                        else if ((selMouse[0] < (leftCoord + 10)) && (selMouse[0] >= leftCoord)) {
                                                            rectDrop.style('cursor', 'w-resize');
                                                        }
                                                        else {
                                                            rectDrop.style('cursor', 'auto');
                                                        }
                                                    })
                                                    .on('mousedown', function() {
                                                        // flagPos = false;
                                                        // var oldPos = 0;
                                                        // Selected Rectangle
                                                        var rectDrop = d3.select(this);
                                                        var rightWd = 0;
                                                        var leftWd = 0;
                                                        // Change Border Thickness
                                                        rectDrop.attr('stroke-width', 5);
                                                        var selMouse = d3.mouse(rectDrop.node());
                                                        var leftCoord = parseInt(d3.select(this).attr('x'));   // Start Point (Left Edge)
                                                        var rightCoord = parseInt(leftCoord) + dropWd; // End Point (Right Edge)
                                                        
                                                        // Move Rectangle
                                                        d3.select(document).on('mousemove', function() {
                                                            // Get Mouse Co-Ordinates
                                                            var newMouse = d3.mouse(rectDrop.node());
                                                            var delMouse = [
                                                                newMouse[0]-selMouse[0]
                                                            ];
                                                            // Mouse Pointer/ Edges Position
                                                            // Right Edge
                                                            if((selMouse[0] > (rightCoord - 10)) && (selMouse[0] <= rightCoord)) {
                                                                rectDrop.style('cursor', 'w-resize'); 
                                                                rightWd = newMouse[0] - leftCoord;   // Width
                                                                rectDrop.attr('width', rightWd);
                                                            }
                                                            // Left Edge
                                                            else if ((selMouse[0] < (leftCoord + 10)) && (selMouse[0] >= leftCoord)) {
                                                                rectDrop.style('cursor', 'w-resize'); 
                                                                leftWd = rightCoord - Math.abs(newMouse[0]); // Width
                                                                rectDrop.attr('x', Math.abs(newMouse[0]));
                                                                rectDrop.attr('width', leftWd);
                                                            }
                                                            else {
                                                                // Center
                                                                rectDrop.attr('width', dropWd);
                                                            }
                                                        })
                            
                                                        d3.select(document).on('mouseup', function() {
                                                            svg_colormap.selectAll('rect.contCol').remove();
                                                            svg_colormap.selectAll('rect.hoverCol').remove();
                                                            // Change Border Thickness
                                                            rectDrop.attr('stroke-width', 1)
                                                                    .attr('id', 'slideCol');
                                                            // Get Drop-off Mouse Co-Ordinates
                                                            var dropMouse = d3.mouse(rectDrop.node());
                                                            // Mouse Pointer/ Edges Position
                                                            // Right Edge
                                                            if(leftWd == 0) {
                                                                var newWd = rightWd;
                                                            }
                                                            // Left Edge
                                                            else if (rightWd == 0) {
                                                                var newWd = leftWd;
                                                                dropX = dropMouse[0];
                                                            }
                                                            // var newWd = dropMouse[0];
                                                            var ptTest = [dropMouse[0], dropMouse[1]];
                                                            // Stop Mouse Events
                                                            d3.select(document)
                                                                .on('mousemove', null)
                                                                .on('mouseup', null);

                                                            // Remove Selected Colors
                                                            svg_colormap.selectAll('rect.addCol').remove();
                                                            svg_colormap.selectAll('rect#slideCol').remove();
                                                            // Add Color to Dropped Dataset
                                                            canWd = d3.select('rect.dropCanvas').attr('width')
                                                            dropPos = Math.floor(paletteLen * ptTest[0]/canWd);
                                                            // dropX = dropPos * (canWd/paletteLen);
                                                            dropWd = newWd;

                                                            // Left Edge
                                                            if(rightWd == 0) {
                                                                tempLPos = dropRect.pos;

                                                                // console.log(tempLPos);
                                                                // console.log(oldLPos);
                                                                // console.log(dropPos);
                                                                // console.log(dropRect.pos);

                                                                if(flagLPos == false) {
                                                                    oldLPos = dropPos;
                                                                }
                                                                else if (flagLPos == false) {
                                                                    for(i = oldLPos; i < dropPos + 1; i++) {
                                                                        datasetDrop[i].sel = 0;
                                                                    }
                                                                    oldLPos = dropPos;
                                                                }
                                                                if (dropRect.pos > dropPos) {
                                                                    flagLPos = true;
                                                                    for(i = dropPos; i < tempLPos + 1; i++) {
                                                                        dropRect = ({
                                                                            pos: i,
                                                                            lab: 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5),
                                                                            name: termDistribution(rectDrop.attr('fill'))[0].term,
                                                                            fill: rectDrop.attr('fill'),
                                                                            RGB: [rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]],
                                                                            LAB: [5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5)],
                                                                            sel: 1
                                                                        });
                                                                        datasetDrop.splice(i, 1, dropRect);                                                                    
                                                                    }
                                                                }
                                                            }
                                                            // Right Edge
                                                            else if(leftWd == 0) {
                                                                tempRPos = dropRect.pos;

                                                                // console.log(tempRPos);
                                                                // console.log(oldRPos);
                                                                // console.log(dropPos);
                                                                // console.log(dropRect.pos);

                                                                if (flagRPos == true) { 
                                                                    for(i = oldRPos + 1; i < dropPos + 1; i++) {
                                                                        dropRect = ({
                                                                            pos: i,
                                                                            lab: 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5),
                                                                            name: termDistribution(rectDrop.attr('fill'))[0].term,
                                                                            fill: rectDrop.attr('fill'),
                                                                            RGB: [rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]],
                                                                            LAB: [5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5)],
                                                                            sel: 1
                                                                        });
                                                                        datasetDrop.splice(i, 1, dropRect);                                                                    
                                                                    }
                                                                    oldRPos = dropPos;
                                                                }
                                                                if (tempRPos < dropPos) {
                                                                    flagRPos = true;
                                                                    for(i = tempRPos; i < dropPos + 1; i++) {
                                                                        dropRect = ({
                                                                            pos: i,
                                                                            lab: 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5),
                                                                            name: termDistribution(rectDrop.attr('fill'))[0].term,
                                                                            fill: rectDrop.attr('fill'),
                                                                            RGB: [rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]],
                                                                            LAB: [5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5)],
                                                                            sel: 1
                                                                        });
                                                                        datasetDrop.splice(i, 1, dropRect);                                                                    
                                                                    }
                                                                }
                                                                else if (tempRPos > dropPos) {
                                                                    for(i = dropPos + 1; i < tempRPos + 1; i++) {
                                                                        datasetDrop[i].sel = 0;                                                                 
                                                                    }
                                                                }
                                                            }
                                                            // console.log(datasetDrop);
                                                            drawDropCol();
                                                            drawColor();

                                                            // Web Worker
                                                            // Loader icon
                                                            var loader = document.getElementById('loader');
                                                            loader.style.visibility = "visible";
                                                            // Terminate old Worker and run new Worker
                                                            myWorker.terminate();
                                                            myWorker = new Worker('worker.js');
                                                            // Post Message in Worker
                                                            myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], val_algoIter, datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD] });
                                                            myWorker.onmessage = function(e) {
                                                                drawColormap(e.data);
                                                                drawLinegraph(e.data);
                                                                loader.style.visibility = "hidden";
                                                            }

                                                            // calcPalette(paletteLen, val_lum[0], val_lum[1]);
                                                        });
                                                    });
                                    }
                                    drawDropCol();
                                    drawColor();
                                    svg_colormap.selectAll('text.sliderText').remove();

                                    if(countDrop == 0) {
                                        datasetDrop.push(dropRect);
                                        drawColormap(datasetDrop);
                                        countDrop++;
                                        for(var k=0; k<(paletteLen-1);k++) {
                                            datasetDrop.push({
                                                lab: rectDrop.data()[0].lab,
                                                name: rectDrop.data()[0].name,
                                                fill: rectDrop.data()[0].fill,
                                                RGB: [d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).r, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).g, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).b],
                                                LAB: [d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).L, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).a, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).b],
                                                sel: 0
                                            });
                                        }
                                        const element = datasetDrop.splice(0, 1)[0];
                                        datasetDrop.splice(dropPos, 0, element);
                                    }
                                    else {
                                        var tempRect = ({
                                            lab: rectDrop.data()[0].lab,
                                            name: rectDrop.data()[0].name,
                                            fill: rectDrop.data()[0].fill,
                                            RGB: [d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).r, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).g, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).b],
                                            LAB: [d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).L, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).a, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).b],
                                            sel: 1
                                        });
                                        datasetDrop.splice(dropPos, 1, tempRect);
                                    }
                                    
                                    // Web Worker
                                    // Loader icon
                                    var loader = document.getElementById('loader');
                                    loader.style.visibility = "visible";
                                    // Terminate old Worker and run new Worker
                                    myWorker.terminate();
                                    myWorker = new Worker('worker.js');
                                    // Post Message in Worker
                                    myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], val_algoIter, datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD] });
                                    myWorker.onmessage = function(e) {
                                        drawColormap(e.data);
                                        drawLinegraph(e.data);
                                        loader.style.visibility = "hidden";
                                    }
                                    // calcPalette(paletteLen, val_lum[0], val_lum[1]);
                                }
                                else {
                                    svg_colormap.selectAll('rect.addCol').remove();
                                    drawColor();
                                }
>>>>>>> Stashed changes
                            })
                        });
        }
        drawColor();
        countCol++;
    }
    else {
        alert("Maximum Limit Reached!");
    }
}
function drawCanvas() {
    // Canvas Slider
    svg_colormap.append('rect')
                .attr('class', 'dropCanvas')
                .attr('x', 0)
                .attr('y', 140)
                .attr('width', 1000)
                .attr('height', 75)
                .attr('stroke', '#ABABAB')
                .style('stroke-dasharray', ('5','5'))
                .attr('fill', '#F5F5F5');
    // Canvas Slider Text
    svg_colormap.append('text')
                .attr('class', 'sliderText')
                .attr('x', 395)
                .attr('y', 185)
                .text('Drop Colors Here')
                .style('font-size', '24px')
                .attr('fill', '#808080');
    // Heading
    svg_colormap.append('text')
                .attr('x', 10)
                .attr('y', 25)
                .text('SELECTED COLORS')
                .style('font-size', '24px')
                .attr('font-weight', 600)
                .attr('fill', '#222021');
    // Reset Button
    svg_colormap.append('text')
                .attr('x', 250)
                .attr('y', 25)
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
                .attr('y', 45)
                .attr('width', 1000)
                .attr('height', 75)
                .attr('stroke', '#ABABAB')
                .style('stroke-dasharray', ('5','5'))
                .attr('fill', '#F5F5F5');
}

function regenColormap() {
    // Call Web Worker (Algorithm)
    // Terminate old Worker and run new Worker
    myWorker.terminate();
    myWorker = new Worker('worker.js');

    // Post Message in Worker
    myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
    myWorker.onmessage = function(e) {
        drawColormap(e.data[0]);
        // loader.style.visibility = "hidden";
        // debugArr = []
        // debugArr.push(e.data[2]);
        // scatter(e.data[2]);
        // hist1(e.data[2]);
        // hist2(e.data[2]);
    }
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

// Draw Main Colormap
function drawColormap(data) {
    
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
}

// Generate Random Color
function genRandom(lum, endPos) {
    var arrColors = [];
    for(i=0; i<colorDict.length; i++) {
        if(lum == colorDict[i].LAB[0]) {
            arrColors.push(colorDict[i]);
        }
    }
    var randCol = arrColors[getRandom(0, arrColors.length-1)];

    // Adjusted Color Displayability Test
    var testDisplay =  d3.lab(
        d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).l,
        d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).a,
        d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).b,
    );
    var distDisplay = 1000;
    var distColor = [];

    if(testDisplay.displayable() == true) {
        // Update the color
        var endCol = ({
            name:  nameDistribution(d3.lab(
                d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).l,
                d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).a,
                d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).b,
            )),
            fill: "rgb(" +
                Math.round(d3.rgb(d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2])).r) + "," +
                Math.round(d3.rgb(d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2])).g) + "," +
                Math.round(d3.rgb(d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2])).b) +
            ")",
            RGB: [
                Math.round(d3.rgb(d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2])).r), 
                Math.round(d3.rgb(d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2])).g), 
                Math.round(d3.rgb(d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2])).b)
            ],
            LAB: [
                d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).l,
                d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).a,
                d3.lab(randCol.LAB[0], randCol.LAB[1], randCol.LAB[2]).b,
            ],
            sel: 0
        });
        datasetDrop.splice(endPos, 1, endCol);
    }
    else {
        for(i=0; i<arrColors.length; i++) {
            var localDist = Math.sqrt((arrColors[i].lab[0]-testDisplay.l)**2 + (arrColors[i].lab[1]-testDisplay.a)**2 + (arrColors[i].lab[2]-testDisplay.b)**2);
            if(localDist < distDisplay) {
                distDisplay = localDist;
                distColor = arrColors[i];
            }
        }
        // Update the color
        var endCol = ({
            name:  nameDistribution(d3.lab(
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).l,
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).a,
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).b,
            )),
            fill:  fill_color(
                d3.lab(
                    d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).l, 
                    d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).a, 
                    d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).b
                )
            ),
            RGB: [
                Math.round(d3.rgb(d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2])).r),
                Math.round(d3.rgb(d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2])).g), 
                Math.round(d3.rgb(d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2])).b)
            ],                
            LAB: [
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).l, 
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).a, 
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).b
            ],
            sel: 0
        });
        datasetDrop.splice(endPos, 1, endCol);
    }
}

// ADD COLOR ON CLICK
function addColor(selection) {
    if(countCol < 16) {
        // Adjusted Color Displayability Test
        var testDisplay =  d3.lab(
            d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).l, 
            d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).a, 
            d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).b
        );
        var distDisplay = 1000;
        var distColor = [];
        var selColors = [];

        // No change in fill as it is user selected color
        if(testDisplay.displayable() == true) {
            // Update the color
            datasetSel.push({
                name: selection.attr('value'),
                fill: selection.attr('style').slice(6,-50),
                RGB: [
                    Math.round(d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).r), 
                    Math.round(d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).g), 
                    Math.round(d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).b)
                ],
                LAB: [
                    d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).l, 
                    d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).a, 
                    d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).b
                ],
                sel: 1
            });
        }
        else {
            for(i=0; i<colorDict.length; i++) {
                if(testDisplay.l == colorDict[i].LAB[0]) {
                    selColors.push(colorDict[i]);
                    for(j=0; j<selColors.length; j++) {
                        var localDist = Math.sqrt((selColors[j].LAB[0]-testDisplay.l)**2 + (selColors[j].LAB[1]-testDisplay.a)**2 + (selColors[j].LAB[2]-testDisplay.b)**2);
                        if(localDist < distDisplay) {
                            distDisplay = localDist;
                            distColor = selColors[j];
                        }
                    }
                }
            }
            // Update the color
            datasetSel.push({
                name:  nameDistribution(d3.lab(
                    d3.lab(distColor.LAB[0], distColor.LAB[1], distColor.LAB[2]).l,
                    d3.lab(distColor.LAB[0], distColor.LAB[1], distColor.LAB[2]).a,
                    d3.lab(distColor.LAB[0], distColor.LAB[1], distColor.LAB[2]).b,
                )),
                fill:  fill_color(
                    d3.lab(
                        d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).l, 
                        d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).a, 
                        d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).b
                    )
                ),
                RGB: [
                    Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).r),
                    Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).g), 
                    Math.round(d3.rgb(d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2])).b)
                ],                
                LAB: [
                    d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).l, 
                    d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.LAB[2]).a, 
                    d3.lab(distColor.LAB[0],distColor.LAB[1],distColor.lLABab[2]).b
                ],
                sel: 1
            });
        }
        countCol++;
    }
    else {
        alert('Maximum Limit Reached!');
    }
    drawColor(datasetSel, selection);
}

// DRAW COLOR BOXES
function drawColor(data, sel) {
    svg_colormap.selectAll('rect.addCol')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'addCol')
                .attr('index', function(d, i) { return i; })
                .attr('x', function(d,i) { return 10 + i * 60; })
                .attr('y', 55)
                .attr('width', 50)
                .attr('height', 55)
                .attr('fill', function(d) { return d.fill; })
                .attr('stroke', '#000')
                .on('mouseover', function() {
                    var selLAB = sel.text().split(",").map(x=>+x);
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
                    var selMouse = d3.mouse(rectDrop.node());
                    var selCoord = [
                        +d3.select(this).attr('x'), +d3.select(this).attr('y')
                    ];

                    // Select L* values for which color can be added - SUGGESTION
                    //......................................................................................c3.color[index] may get non-displayabel colors (Match with colorDict values for a safer solution)
                    var possL = new Set();
                    var selColor = c3.color[index(d3.color(rectDrop.data()[0].fill))];
                    console.log('###',d3.color(selColor))
                    for(i=0; i<colorDict.length; i++) {
                        var dictColor = c3.color[index(d3.color(colorDict[i].fill))];
                        var selND = nameDifference(selColor, dictColor);
                        if(selND < 0.2) {
                            possL.add(dictColor.l);
                            console.log('line 334',colorDict[i].fill)
                        }
                    }
                    
                    // Move Rectangle
                    d3.select(document).on('mousemove', function() {
                        // Get Mouse Co-Ordinates
                        var newMouse = d3.mouse(rectDrop.node());
                        var delMouse = [
                            newMouse[0]-selMouse[0], newMouse[1]-selMouse[1]
                        ];
                        rectDrop.attr('x', selCoord[0] + delMouse[0])
                                .attr('y', selCoord[1] + delMouse[1]);

                        // Add Color to Slider Canvas
                        svg_colormap.select('rect.dropCanvas').attr('fill', '#FAE6E6').attr('opacity', 0.2);

                        // Add Color to Possible L* values to Slider Canvas
                        var canWd = d3.select('rect.dropCanvas').attr('width');
                        
                        var minPossL = Math.min.apply(this, [...possL]);
                        var maxPossL = Math.max.apply(this, [...possL]);

                        // Linear Profile
                        if(selLum == "Linear") {
                            var minPossX = minPossL * canWd/100;
                            var wdPossL = (maxPossL - minPossL) * canWd/100;
    
                            // Draw Temp Boxes for Possible L* Values (Hover)
                            svg_colormap.append('rect')
                                        .attr('class', 'possCol')
                                        .attr('x', minPossX)
                                        .attr('y', 140)
                                        .attr('width', wdPossL)
                                        .attr('height', 75)
                                        .attr('fill', d3.color(selColor))
                                        .attr('opacity', 0.05)
                                        .attr('stroke', '#000');
                        }
                        // Diverging Profile
                        else if(selLum == "Diverging") {
                            var minPossX = minPossL * canWd/200;
                            var maxPossX = (200-maxPossL) * canWd/200;
                            var wdPossL = (maxPossL - minPossL) * canWd/200;
    
                            // Draw Temp Boxes for Possible L* Values (Hover)
                            svg_colormap.append('rect')
                                        .attr('class', 'possCol')
                                        .attr('x', minPossX)
                                        .attr('y', 140)
                                        .attr('width', wdPossL)
                                        .attr('height', 75)
                                        .attr('fill', '#609078')
                                        .attr('opacity', 0.05)
                                        .attr('stroke', '#000');
                            svg_colormap.append('rect')
                                        .attr('class', 'possCol')
                                        .attr('x', maxPossX)
                                        .attr('y', 140)
                                        .attr('width', wdPossL)
                                        .attr('height', 75)
                                        .attr('fill', '#609078')
                                        .attr('opacity', 0.05)
                                        .attr('stroke', '#000');
                        }


                        if(contains(svg_colormap.select('rect.dropCanvas'), newMouse) == true) {
                            var canWd = d3.select('rect.dropCanvas').attr('width');
                            var dropPos = Math.floor(paletteLen * newMouse[0]/canWd);
                            var dropX = dropPos * (canWd/paletteLen);
                            var dropWd = Math.ceil(paletteLen * newMouse[0]/canWd) * (canWd/paletteLen) - dropX;
                            // Draw Temp Boxes (Hover)
                            svg_colormap.append('rect')
                                        .attr('class', 'contCol')
                                        .attr('x', dropX)
                                        .attr('y', 140)
                                        .attr('width', dropWd)
                                        .attr('height', 75)
                                        .attr('fill', '#FFD0D0')
                                        .attr('opacity', 0.05)
                                        .attr('stroke', '#000');
                            if(contains(svg_colormap.select('rect.contCol'),newMouse) == true) {
                                // Draw Temp Boxes
                                svg_colormap.append('rect')
                                            .attr('class', 'hoverCol')
                                            .attr('x', dropX)
                                            .attr('y', 140)
                                            .attr('width', dropWd)
                                            .attr('height', 75)
                                            .attr('fill', '#FFD0D0')
                                            .attr('opacity', 0.05)
                                            .attr('stroke', '#000');
                            }
                            else {
                                svg_colormap.selectAll('rect.contCol').remove();
                                svg_colormap.selectAll('rect.hoverCol').remove();
                            }
                        }
                        else {
                            svg_colormap.selectAll('rect.contCol').remove();
                            svg_colormap.selectAll('rect.hoverCol').remove();
                        }
                        svg_colormap.select('rect.dropCanvas').attr('opacity', 1);
                    })

                    d3.select(document).on('mouseup', function() {
                        svg_colormap.selectAll('rect.hoverCol').remove();
                        svg_colormap.selectAll('rect.possCol').remove();
                        // Change Border Thickness
                        rectDrop.attr('stroke-width', 1);
                        svg_colormap.select('rect.dropCanvas').attr('fill', '#F5F5F5');
                        // Get Drop-off Mouse Co-Ordinates
                        var dropMouse = d3.mouse(rectDrop.node());
                        var ptTest = [dropMouse[0], dropMouse[1]];
                        // Stop Mouse Events
                        d3.select(document)
                            .on('mousemove', null)
                            .on('mouseup', null);
                        if(contains(svg_colormap.select('rect.dropCanvas'),ptTest) == true) {
                            // countCol = countCol - 1;
                            // Update Selected Color Dataset using Index
                            var idDrop = rectDrop.attr('index');
                            data.splice(idDrop,1);
                            // Remove Selected Colors
                            svg_colormap.selectAll('rect.addCol').remove();
                            // Add Color to Dropped Dataset
                            var canWd = d3.select('rect.dropCanvas').attr('width')
                            var dropPos = Math.floor(paletteLen * ptTest[0]/canWd);
                            var dropX = dropPos * (canWd/paletteLen);
                            var dropWd = Math.ceil(paletteLen * ptTest[0]/canWd) * (canWd/paletteLen) - dropX;

                            // Adjust color L* based on position
                            var lum_min = 0;
                            var lum_max = 100;
                            var samp_lum = dropPos/(paletteLen-1);
                            if(selLum == 'Linear') {
                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
                            }
                            else if (selLum == 'Diverging') {
                                if(dropPos < paletteLen/2) {
                                    var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * 2 * samp_lum)/5);   // For Diverging Profile (Before Midpoint)
                                }
                                else {
                                    var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-dropPos-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
                                }
                            }

                            // Adjusted Color Displayability Test
                            var testDisplay =  d3.lab(
                                d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2]).l, 
                                d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2]).a, 
                                d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2]).b
                            );
                            var distDisplay = 1000;
                            var distColor = [];
                            var selColors = [];

                            if(testDisplay.displayable() == true) {
                                // Update the color
                                var dropRect = ({
                                    pos: dropPos,
                                    name: rectDrop.data()[0].name,
                                    fill:  fill_color(
                                        d3.rgb(
                                            Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2])).r), 
                                            Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2])).g), 
                                            Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2])).b)
                                        )),
                                    RGB: [
                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2])).r), 
                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2])).g), 
                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2])).b)
                                    ],                
                                    LAB: [
                                        d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2]).l, 
                                        d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2]).a, 
                                        d3.lab(lum_exp, rectDrop.data()[0].LAB[1], rectDrop.data()[0].LAB[2]).b
                                    ],
                                    sel: 1
                                });
                            }
                            else {
                                for(i=0; i<colorDict.length; i++) {
                                    if(testDisplay.l == colorDict[i].LAB[0]) {
                                        selColors.push(colorDict[i]);
                                        for(j=0; j<selColors.length; j++) {
                                            var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                            if(localDist < distDisplay) {
                                                distDisplay = localDist;
                                                distColor = selColors[j];
                                            }
                                        }
                                    }
                                }
                                // Update the color
                                var dropRect = ({
                                    pos: dropPos,
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
                            }

                            // Draw the Dropped Color on Slider Canvas (before L* changes (show original color on canvas))
                            drawDropCol(dropX, dropWd, rectDrop, dropRect);

                            drawColor(data, sel);
                            
                            svg_colormap.selectAll('text.sliderText').remove();

                            // Call Initialization
                            initPos(dropPos, dropRect);
                        }
                        else {
                            svg_colormap.selectAll('rect.addCol').remove();
                            drawColor(data, sel);
                        }
                    })
                });
}

// DRAW DROPPED COLOR BOXES
function drawDropCol(pos, wd, rectCol, dropRect) {
    // Draw Added Colors - Actual L*
    svg_colormap.append('rect')
                .attr('class', 'dropCol')
                .attr('x', pos)
                .attr('y', 170) // 140 for full height
                .attr('width', wd)
                .attr('height', 45) // 75 for full height
                // .attr('fill', rectCol.fill) // when dropRect is passed (after L* change)
                .attr('fill', rectCol.attr('fill')) // when rectDrop is passed (before L* change)
                .attr('stroke', '#000')
                .on('mousemove', function() {
                    var rectDrop = d3.select(this);
                    var selMouse = d3.mouse(rectDrop.node());
                    var leftCoord = parseInt(d3.select(this).attr('x'));   // Start Point (Left Edge)
                    var rightCoord = parseInt(leftCoord) + wd; // End Point (Right Edge)

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
                    // Selected Rectangle
                    var rectDrop = d3.select(this);
                    var rightWd = 0;
                    var leftWd = 0;
                    // Change Border Thickness
                    rectDrop.attr('stroke-width', 5);
                    var selMouse = d3.mouse(rectDrop.node());
                    var leftCoord = parseInt(d3.select(this).attr('x'));   // Start Point (Left Edge)
                    var rightCoord = parseInt(leftCoord) + wd; // End Point (Right Edge)

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
                            rectDrop.attr('width', wd);
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
                            dropX = pos;
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
                        svg_colormap.select('rect.dropAdjCol').remove();
                        // Add Color to Dropped Dataset
                        canWd = d3.select('rect.dropCanvas').attr('width')
                        pos = Math.floor(paletteLen * ptTest[0]/canWd);
                        wd = newWd;

                        // Left Edge
                        if(rightWd == 0) {
                            tempLPos = dropRect.pos;

                            if (flagLPos == true) {
                                if(oldLPos > pos) {
                                    for(i = pos; i < oldLPos; i++) {
                                        // Adjust color L* based on position
                                        var lum_min = 0;
                                        var lum_max = 100;
                                        var samp_lum = i/(paletteLen-1);
                                        if(selLum == 'Linear') {
                                            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
                                        }
                                        else if (selLum == 'Diverging') {
                                            if(i < paletteLen/2) {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * 2 * samp_lum)/5);   // For Diverging Profile (Before Midpoint)
                                            }
                                            else {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-i-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
                                            }
                                        }
    
                                        // Adjusted Color Displayability Test
                                        var testDisplay =  d3.lab(
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                        );
                                        
    
                                        var distDisplay = 1000;
                                        var distColor = [];
                                        var selColors = [];
    
                                        if(testDisplay.displayable() == true) {
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
                                                name:  nameDistribution(d3.lab(
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                )),
                                                fill:  fill_color(
                                                    d3.rgb(
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                    )),
                                                RGB: [
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                ],                
                                                LAB: [
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                ],
                                                sel: 1
                                            });
                                        }
                                        else {
                                            for(m=0; m<colorDict.length; m++) {
                                                if(testDisplay.l == colorDict[m].LAB[0]) {
                                                    selColors.push(colorDict[m]);
                                                    for(j=0; j<selColors.length; j++) {
                                                        var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                                        if(localDist < distDisplay) {
                                                            distDisplay = localDist;
                                                            distColor = selColors[j];
                                                        }
                                                    }
                                                }
                                            }
                                            // for(i=0; i<colorDict.length; i++) {
                                            //     if(testDisplay.l == colorDict[i].LAB[0]) {
                                            //         selColors.push(colorDict[i]);
                                            //         for(j=0; j<selColors.length; j++) {
                                            //             var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                            //             if(localDist < distDisplay) {
                                            //                 distDisplay = localDist;
                                            //                 distColor = selColors[j];
                                            //             }
                                            //         }
                                            //     }
                                            // }
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
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
                                        }
                                        datasetDrop.splice(i, 1, newRect);
                                    }
                                    slideInit();
                                    oldLPos = pos;
                                    console.log(datasetDrop)
                                }
                                else if(oldLPos < pos) {
                                    for(i = oldLPos; i < pos + 1; i++) {
                                        datasetDrop[i].sel = 0;
                                    }
                                    slideInit();
                                    oldLPos = pos;
                                    console.log(datasetDrop)
                                }
                            }
                            else if(flagLPos == false) {
                                if (tempLPos > pos) {
                                    flagLPos = true;
                                    for(i = pos; i < tempLPos + 1; i++) {
                                        // Adjust color L* based on position
                                        var lum_min = 0;
                                        var lum_max = 100;
                                        var samp_lum = i/(paletteLen-1);
                                        if(selLum == 'Linear') {
                                            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
                                        }
                                        else if (selLum == 'Diverging') {
                                            if(i < paletteLen/2) {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * 2 * samp_lum)/5);   // For Diverging Profile (Before Midpoint)
                                            }
                                            else {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-i-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
                                            }
                                        }
    
                                        // Adjusted Color Displayability Test
                                        var testDisplay =  d3.lab(
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                        );
    
                                        var distDisplay = 1000;
                                        var distColor = [];
                                        var selColors = [];
    
                                        if(testDisplay.displayable() == true) {
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
                                                name:  nameDistribution(d3.lab(
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                )),
                                                fill:  fill_color(
                                                    d3.rgb(
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                    )),
                                                RGB: [
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                ],                
                                                LAB: [
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                ],
                                                sel: 1
                                            });
                                        }
                                        else {
                                            for(m=0; m<colorDict.length; m++) {
                                                if(testDisplay.l == colorDict[m].LAB[0]) {
                                                    selColors.push(colorDict[m]);
                                                    for(j=0; j<selColors.length; j++) {
                                                        var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                                        if(localDist < distDisplay) {
                                                            distDisplay = localDist;
                                                            distColor = selColors[j];
                                                        }
                                                    }
                                                }
                                            }
                                            // for(i=0; i<colorDict.length; i++) {
                                            //     if(testDisplay.l == colorDict[i].LAB[0]) {
                                            //         selColors.push(colorDict[i]);
                                            //         for(j=0; j<selColors.length; j++) {
                                            //             var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                            //             if(localDist < distDisplay) {
                                            //                 distDisplay = localDist;
                                            //                 distColor = selColors[j];
                                            //             }
                                            //         }
                                            //     }
                                            // }
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
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
                                        }
                                        datasetDrop.splice(i, 1, newRect);
                                    }
                                    slideInit();
                                    oldLPos = pos;
                                    console.log(datasetDrop)
                                }
                                else if (tempLPos < pos) {
                                    for(i = tempLPos; i < pos + 1; i++) {
                                        datasetDrop[i].sel = 0;
                                    }
                                    slideInit();
                                    oldLPos = pos;
                                    console.log(datasetDrop)
                                }
                            }
                        }
                        // Right Edge
                        else if(leftWd == 0) {
                            tempRPos = dropRect.pos;

                            if (flagRPos == true) {
                                if(oldRPos < pos) {
                                    console.log('Flag Switched Forward')
                                    for(i = oldRPos + 1; i < pos + 1; i++) {
                                        // Adjust color L* based on position
                                        var lum_min = 0;
                                        var lum_max = 100;
                                        var samp_lum = i/(paletteLen-1);
                                        if(selLum == 'Linear') {
                                            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
                                        }
                                        else if (selLum == 'Diverging') {
                                            if(i < paletteLen/2) {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * 2 * samp_lum)/5);   // For Diverging Profile (Before Midpoint)
                                            }
                                            else {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-i-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
                                            }
                                        }
    
                                        // Adjusted Color Displayability Test
                                        var testDisplay =  d3.lab(
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                        );
    
                                        var distDisplay = 1000;
                                        var distColor = [];
                                        var selColors = [];
    
                                        if(testDisplay.displayable() == true) {
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
                                                name:  nameDistribution(d3.lab(
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                )),
                                                fill:  fill_color(
                                                    d3.rgb(
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                    )),
                                                RGB: [
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                ],                
                                                LAB: [
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                ],
                                                sel: 1
                                            });
                                        }
                                        else {
                                            for(m=0; m<colorDict.length; m++) {
                                                if(testDisplay.l == colorDict[m].LAB[0]) {
                                                    selColors.push(colorDict[m]);
                                                    for(j=0; j<selColors.length; j++) {
                                                        var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                                        if(localDist < distDisplay) {
                                                            distDisplay = localDist;
                                                            distColor = selColors[j];
                                                        }
                                                    }
                                                }
                                            }
                                            // for(i=0; i<colorDict.length; i++) {
                                            //     if(testDisplay.l == colorDict[i].LAB[0]) {
                                            //         selColors.push(colorDict[i]);
                                            //         for(j=0; j<selColors.length; j++) {
                                            //             var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                            //             if(localDist < distDisplay) {
                                            //                 distDisplay = localDist;
                                            //                 distColor = selColors[j];
                                            //             }
                                            //         }
                                            //     }
                                            // }
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
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
                                        }
                                        datasetDrop.splice(i, 1, newRect);
                                    }
                                    slideInit();
                                    oldRPos = pos;
                                    console.log(datasetDrop)
                                }
                                else if(oldRPos > pos) {
                                    console.log('Flag Switched Taken back')
                                    for(i = pos + 1; i < oldRPos + 1; i++) {
                                        datasetDrop[i].sel = 0;
                                    }
                                    slideInit();
                                    oldRPos = pos;
                                    console.log(datasetDrop)
                                }
                            }
                            else if(flagRPos == false) {
                                if (tempRPos < pos) {
                                    console.log('Taken forward')
                                    flagRPos = true;
                                    for(i = tempRPos; i < pos + 1; i++) {
                                        // Adjust color L* based on position
                                        var lum_min = 0;
                                        var lum_max = 100;
                                        var samp_lum = i/(paletteLen-1);
                                        if(selLum == 'Linear') {
                                            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
                                        }
                                        else if (selLum == 'Diverging') {
                                            if(i < paletteLen/2) {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * 2 * samp_lum)/5);   // For Diverging Profile (Before Midpoint)
                                            }
                                            else {
                                                var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-i-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
                                            }
                                        }
    
                                        // Adjusted Color Displayability Test
                                        var testDisplay =  d3.lab(
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                            d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                        );
    
                                        var distDisplay = 1000;
                                        var distColor = [];
                                        var selColors = [];
    
                                        if(testDisplay.displayable() == true) {
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
                                                name:  nameDistribution(d3.lab(
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                )),
                                                fill:  fill_color(
                                                    d3.rgb(
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                        Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                    )),
                                                RGB: [
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).r),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).g),
                                                    Math.round(d3.rgb(d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)
                                                ],                
                                                LAB: [
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).l, 
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).a,
                                                    d3.lab(lum_exp, rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]).b
                                                ],
                                                sel: 1
                                            });
                                        }
                                        else {
                                            for(m=0; m<colorDict.length; m++) {
                                                if(testDisplay.l == colorDict[m].LAB[0]) {
                                                    selColors.push(colorDict[m]);
                                                    for(j=0; j<selColors.length; j++) {
                                                        var localDist = Math.sqrt((selColors[j].LAB[0] - testDisplay.l)**2 + (selColors[j].LAB[1] - testDisplay.a)**2 + (selColors[j].LAB[2] - testDisplay.b)**2);
                                                        if(localDist < distDisplay) {
                                                            distDisplay = localDist;
                                                            distColor = selColors[j];
                                                        }
                                                    }
                                                }
                                            }
                                            // Update the color
                                            var newRect = ({
                                                pos: i,
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
                                        }
                                        datasetDrop.splice(i, 1, newRect);       
                                    }
                                    slideInit();
                                    console.log(datasetDrop)
                                    oldRPos = pos;
                                }
                                else if (tempRPos > pos) {
                                    console.log('Taken back')
                                    for(i = pos + 1; i < tempRPos + 1; i++) {
                                        datasetDrop[i].sel = 0;                                       
                                    }
                                    slideInit();
                                    console.log(datasetDrop)
                                    oldRPos = pos;
                                }
                            }
                        }
                        drawDropCol(dropX, wd, rectCol, dropRect);
                    });
                });
    
                // const interpolate = d3.interpolateRgb(dropRect.fill,'white');
                var colors = [ dropRect.fill, 'white' ];
                // console.log('$$$$',d3.color(selColor))

    // Draw Added Colors - Adjusted L*
    var svg = d3.select('body')
        .append('svg')
        .attr('width', 100)
        .attr('height', 200);
    var grad = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'grad')
        .attr('x1', '10%')
        .attr('x2', '100%')
        .attr('y1', '0%')
        .attr('y2', '0%');
    grad.selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
            return 100 * (i / (colors.length - 1)) + '%';
    })
    svg_colormap.append('rect')
                .data(colors)

                .attr('class', 'dropAdjCol')
                .attr('x', pos)
                .attr('y', 140) // 140 for full height
                .attr('width', wd)
                .attr('height', 30) // 75 for full height
                .attr('fill', 'url(#grad)' )
                //dropRect.fill when dropRect is passed (after L* change)
                // .attr('fill', rectCol.attr('fill')) // when rectDrop is passed (before L* change)
                .attr('stroke', '#000');
}



// // DRAW COLOR BOXES FROM PLOT CHANGES (LOCAL)
// function drawLocalCol(pos, wd, rectCol) {
//     // countDrop++;
//     // Draw Added Colors
//     svg_colormap.append('rect')
//                 .attr('class', 'dropCol')
//                 .attr('x', pos)
//                 .attr('y', 140)
//                 .attr('width', wd)
//                 .attr('height', 75)
//                 .attr('fill', rectCol.fill) // when dropRect is passed (after L* change)
//                 // .attr('fill', rectCol.attr('fill')) // when rectDrop is passed (before L* change)
//                 .attr('stroke', '#000');
// }

// INITALIZATION FOR ALL COLORS
function slideInit() {
    // dropArr.push(pos);
    // drawColormap(datasetDrop);
    // drawLinegraph(datasetDrop);
    var lum_min = valLum[0];
    var lum_max = valLum[1];

    // Linear
    if(selLum == 'Linear') {
        countDrop++;
        for(var k=0; k<(paletteLen); k++) {
            var samp_lum = k/(paletteLen-1);
            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile

            if(countDrop == 1) {
                genRandom(lum_exp, k);
            }
            else {
                if(datasetDrop[k].sel == 0) {
                    genRandom(lum_exp, k);
                }
            }
        }
    }
    // Diverging
    else if(selLum == 'Diverging') {
        countDrop++;
        for(var k=0; k<(paletteLen/2); k++) {
            var samp_lum = k/(paletteLen-1);
            var lum_exp = 5 * Math.round((Math.abs(lum_min + (lum_max-lum_min) * 2 * samp_lum))/5);   // For Diverging Profile (Before Midpoint)
            if(countDrop == 1) {
                genRandom(lum_exp, k);
            }
            else {
                if(datasetDrop[k].sel == 0) {
                    genRandom(lum_exp, k);
                }
            }
        }
        for(var k=Math.floor(paletteLen/2 + 1); k<(paletteLen); k++) {
            var samp_lum = k/(paletteLen-1);
            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-k-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
            if(countDrop == 1) {
                genRandom(lum_exp, k);
            }
            else {
                if(datasetDrop[k].sel == 0) {
                    genRandom(lum_exp, k);
                }
            }
        }
    }

    // datasetDrop.unshift(rectCol);
    // datasetDrop.splice(pos + 1, 1, rectCol);
    // datasetDrop.splice(0, 1);

    // Call Web Worker (Algorithm)
    // Terminate old Worker and run new Worker
    myWorker.terminate();
    myWorker = new Worker('worker.js');

    // Post Message in Worker
    myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
    myWorker.onmessage = function(e) {
        drawColormap(e.data[0]);
        // loader.style.visibility = "hidden";
        // debugArr = []
        // debugArr.push(e.data[2]);
        // scatter(e.data[2]);
        // hist1(e.data[2]);
        // hist2(e.data[2]);
    }
}

// INITALIZATION FOR ALL COLORS
function initPos(pos, rectCol) {
    dropArr.push(pos);
    // drawColormap(datasetDrop);
    // drawLinegraph(datasetDrop);
    var lum_min = valLum[0];
    var lum_max = valLum[1];

    // Linear
    if(selLum == 'Linear') {
        countDrop++;
        for(var k=0; k<(paletteLen); k++) {
            var samp_lum = k/(paletteLen-1);
            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile

            if(countDrop == 1) {
                genRandom(lum_exp, k);
            }
            else {
                if(datasetDrop[k].sel == 0) {
                    genRandom(lum_exp, k);
                }
            }
        }
    }
    // Diverging
    else if(selLum == 'Diverging') {
        countDrop++;
        for(var k=0; k<(paletteLen/2); k++) {
            var samp_lum = k/(paletteLen-1);
            var lum_exp = 5 * Math.round((Math.abs(lum_min + (lum_max-lum_min) * 2 * samp_lum))/5);   // For Diverging Profile (Before Midpoint)
            if(countDrop == 1) {
                genRandom(lum_exp, k);
            }
            else {
                if(datasetDrop[k].sel == 0) {
                    genRandom(lum_exp, k);
                }
            }
        }
        for(var k=Math.floor(paletteLen/2 + 1); k<(paletteLen); k++) {
            var samp_lum = k/(paletteLen-1);
            var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-k-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
            if(countDrop == 1) {
                genRandom(lum_exp, k);
            }
            else {
                if(datasetDrop[k].sel == 0) {
                    genRandom(lum_exp, k);
                }
            }
        }
    }

    datasetDrop.unshift(rectCol);
    datasetDrop.splice(pos + 1, 1, rectCol);
    datasetDrop.splice(0, 1);

    // Call Web Worker (Algorithm)
    // Terminate old Worker and run new Worker
    myWorker.terminate();
    myWorker = new Worker('worker.js');

    // Post Message in Worker
    myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
    myWorker.onmessage = function(e) {
        drawColormap(e.data[0]);
        // loader.style.visibility = "hidden";
        // debugArr = []
        // debugArr.push(e.data[2]);
        // scatter(e.data[2]);
        // hist1(e.data[2]);
        // hist2(e.data[2]);
    }
}
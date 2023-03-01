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
    drawHistCan();
}

// Draw Main Colormap
function drawSuggmap(data) {
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

    var canvas = d3.select('#sugg2');
    var w = +canvas.attr('width');
    var h = +canvas.attr('height');

    colormap.drawColorScale(
        w, h,			// DIMENSIONS
        w,				// NUMBER OF STEPS
        'horizontal',	// DIRECTION 
        canvas.node());
    drawHistCan();
}

// Draw Helper Colormap
function drawHelpermap(data) {
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

    var canvas = d3.select('#canvasDebug');
    var w = +canvas.attr('width');
    var h = +canvas.attr('height');

    colormap.drawColorScale(
        w, h,			// DIMENSIONS
        w,				// NUMBER OF STEPS
        'horizontal',	// DIRECTION 
        canvas.node());
    drawHistCan();
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
            svg_hist.append('rect')
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
            svg_hist.selectAll('g.extra').remove();
            var g = svg_hist.append('g')
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
            sliderStepLum.value(selLAB.l);
            
            var sel_allrect = svg_slice2D.selectAll('rect');
            sel_allrect.style('opacity', 0.41);
            sel_allrect.filter(function () { 
                    var sel_text = d3.lab(c);
                    var sel_col = (5 * (Math.round(selLAB.l/5))) + "," + (5 * (Math.round(selLAB.a/5))) + "," + (5 * (Math.round(selLAB.b/5)));
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

// Generate Random Color
function genRandom(lum, endPos) {
    // console.log(lum);
    var arrColors = [];
    for(i=0; i<color_dict.length; i++) {
        if(lum == color_dict[i].lab[0]) {
            arrColors.push(color_dict[i]);
        }
    }
    // console.log(arrColors);
    var randCol = arrColors[getRandom(0,arrColors.length)];
    // console.log(randCol);
    
    // Adjusted Color Displayability Test
    var testDisplay =  d3.lab(
        d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).l,
        d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).a,
        d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).b,
    );
    var distDisplay = 1000;
    var distColor = [];

    if(testDisplay.displayable() == true) {
        // console.log('true');
        // Update the color
        var endCol = ({
            lab: randCol.lab,
            name:  nameDistribution(d3.lab(
                d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).l,
                d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).a,
                d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).b,
            )),
            fill: "rgb(" +
                Math.round(d3.rgb(d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2])).r) + "," +
                Math.round(d3.rgb(d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2])).g) + "," +
                Math.round(d3.rgb(d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2])).b) +
            ")",
            RGB: [
                Math.round(d3.rgb(d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2])).r), 
                Math.round(d3.rgb(d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2])).g), 
                Math.round(d3.rgb(d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2])).b)
            ],
            LAB: [
                d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).l,
                d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).a,
                d3.lab(randCol.lab[0], randCol.lab[1], randCol.lab[2]).b,
            ],
            sel: 0
        });
        datasetDrop.splice(endPos, 1, endCol);
    }
    else {
        // console.log('false');
        for(i=0; i<arrColors.length; i++) {
            var localDist = Math.sqrt((arrColors[i].lab[0] - testDisplay.l)**2 + (arrColors[i].lab[1] - testDisplay.a)**2 + (arrColors[i].lab[2] - testDisplay.b)**2);
            if(localDist < distDisplay) {
                distDisplay = localDist;
                distColor = arrColors[i];
            }
        }
        // Update the color
        var endCol = ({
            lab: distColor.lab,
            name:  nameDistribution(d3.lab(
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).l,
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).a,
                d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).b,
            )),
            fill:  fill_color(
                d3.lab(
                    d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
                    d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
                    d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
                )
            ),
            RGB: [
                Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r),
                Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g), 
                Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b)
            ],                
            LAB: [
                d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
                d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
                d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
            ],
            sel: 0
        });

        // console.log((d3.lab(
        //     d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
        //     d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
        //     d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
        // ).toString(16)));
        // console.log(d3.rgb(d3.lab(
        //     d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
        //     d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
        //     d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
        // )));

        // console.log(endCol);
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

        if(testDisplay.displayable() == true) {
            // console.log('true');
            // Update the color
            datasetSel.push({
                name: selection.attr('value'),
                fill: selection.attr('style').slice(6,-51),
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
            for(i=0; i<color_dict.length; i++) {
                if(testDisplay.l == color_dict[i].lab[0]) {
                    selColors.push(color_dict[i]);
                    for(j=0; j<selColors.length; j++) {
                        var localDist = Math.sqrt((selColors[j].lab[0] - testDisplay.l)**2 + (selColors[j].lab[1] - testDisplay.a)**2 + (selColors[j].lab[2] - testDisplay.b)**2);
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
                    d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).l,
                    d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).a,
                    d3.lab(distColor.lab[0], distColor.lab[1], distColor.lab[2]).b,
                )),
                fill:  fill_color(
                    d3.lab(
                        d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
                        d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
                        d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
                    )
                ),
                RGB: [
                    Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r),
                    Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g), 
                    Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b)
                ],                
                LAB: [
                    d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
                    d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
                    d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
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

    // if(countCol < 16) {
    //     datasetSel.push({
    //         lab: selection.text(),
    //         name: selection.attr('value'),
    //         fill: selection.attr('style').slice(6,-51),
    //         RGB: [d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).r, d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).g, d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).b],
    //         LAB: [d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).l, d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).a, d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).b],
    //         sel: 1
    //     })
    //     countCol++;
    // }
    // else {
    //     alert('Maximum Limit Reached!');
    // }
    // drawColor(datasetSel, selection);
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
                    d3.select(this)
                        .call(drawHistText);
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

                        if(contains(svg_colormap.select('rect.dropCanvas'),newMouse) == true) {
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

                            // Draw the Dropped Color on Slider Canvas (before L* changes (show original color on canvas))
                            drawDropCol(dropX, dropWd, rectDrop);

                            // // Adjust color L* based on position
                            // var lum_min = 0;
                            // var lum_max = 100;
                            // var samp_lum = dropPos/(paletteLen-1);
                            // if(selLum == 'Linear') {
                            //     var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
                            // }
                            // else if (selLum == 'Diverging') {
                            //     if(dropPos < paletteLen/2) {
                            //         var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * 2 * samp_lum)/5);   // For Diverging Profile (Before Midpoint)
                            //         // console.log('before ',lum_exp);
                            //     }
                            //     else {
                            //         var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * (paletteLen-dropPos-1)/(Math.floor(paletteLen/2)))/5);   // For Diverging Profile (After Midpoint)
                            //         // console.log('after ',lum_exp);
                            //     }
                            // }

                            // // Adjusted Color Displayability Test
                            // var testDisplay =  d3.lab(
                            //     d3.lab(lum_exp,rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).l, 
                            //     d3.lab(lum_exp,rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).a, 
                            //     d3.lab(lum_exp,rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).b
                            // );
                            // var distDisplay = 1000;
                            // var distColor = [];
                            // var selColors = [];

                            // if(testDisplay.displayable() == true) {
                                // Update the color
                                var dropRect = ({
                                    pos: dropPos,
                                    name: rectDrop.data()[0].name,
                                    fill: rectDrop.data()[0].fill,
                                    RGB: [
                                        Math.round(d3.rgb(d3.lab(rectDrop.data()[0].LAB[0],rectDrop.data()[0].LAB[1],rectDrop.data()[0].LAB[2])).r), 
                                        Math.round(d3.rgb(d3.lab(rectDrop.data()[0].LAB[0],rectDrop.data()[0].LAB[1],rectDrop.data()[0].LAB[2])).g), 
                                        Math.round(d3.rgb(d3.lab(rectDrop.data()[0].LAB[0],rectDrop.data()[0].LAB[1],rectDrop.data()[0].LAB[2])).b)
                                    ],
                                    LAB: [
                                        rectDrop.data()[0].LAB[0],
                                        rectDrop.data()[0].LAB[1],
                                        rectDrop.data()[0].LAB[2]
                                    ],
                                    // RGB: [
                                    //     Math.round(d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).r), 
                                    //     Math.round(d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).g), 
                                    //     Math.round(d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).b)
                                    // ],
                                    // LAB: [
                                    //     d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).l, 
                                    //     d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).a, 
                                    //     d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).b
                                    // ],
                                    sel: 1
                                });
                            // }
                            // else {
                            //     for(i=0; i<color_dict.length; i++) {
                            //         if(testDisplay.l == color_dict[i].lab[0]) {
                            //             // console.log(selColors);
                            //             selColors.push(color_dict[i]);
                            //             for(j=0; j<selColors.length; j++) {
                            //                 var localDist = Math.sqrt((selColors[j].lab[0] - testDisplay.l)**2 + (selColors[j].lab[1] - testDisplay.a)**2 + (selColors[j].lab[2] - testDisplay.b)**2);
                            //                 if(localDist < distDisplay) {
                            //                     distDisplay = localDist;
                            //                     distColor = selColors[j];
                            //                 }
                            //             }
                            //         }
                            //     }
                            //     // for(i=0; i<color_dict.length; i++) {
                            //     //     var localDist = Math.sqrt((color_dict[i].lab[0] - testDisplay.l)**2 + (color_dict[i].lab[1] - testDisplay.a)**2 + (color_dict[i].lab[2] - testDisplay.b)**2);
                            //     //     if(localDist < distDisplay) {
                            //     //         distDisplay = localDist;
                            //     //         distColor = color_dict[i];
                            //     //     }
                            //     // }
                            //     // Update the color
                            //     var dropRect = ({
                            //         pos: dropPos,
                            //         lab: distColor.lab,
                            //         name: distColor.name,
                            //         fill: distColor.fill,
                            //         RGB: [
                            //             Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r), 
                            //             Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g), 
                            //             Math.round(d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b)
                            //         ],                
                            //         LAB: [
                            //             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
                            //             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
                            //             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
                            //         ],
                            //         sel: 1
                            //     });
                            // }

                            // // Draw the Dropped Color on Slider Canvas (after L* changed (show updated color on canvas))
                            // drawDropCol(dropX, dropWd, dropRect);

                            drawColor(data, sel);
                            svg_colormap.selectAll('text.sliderText').remove();

                            // Call Initialization
                            initPos(dropPos, dropRect);

                            // if(countDrop == 1) {
                            //     initSinglePos(dropPos, dropRect);
                            // }
                            // else {
                            //     initMultPos(dropPos, dropRect);
                            // }
                        }
                        else {
                            svg_colormap.selectAll('rect.addCol').remove();
                            drawColor(data, sel);
                        }
                    })
                });
}

// DRAW DROPPED COLOR BOXES
function drawDropCol(pos, wd, rectCol) {
    // countDrop++;
    // Draw Added Colors
    svg_colormap.append('rect')
                .attr('class', 'dropCol')
                .attr('x', pos)
                .attr('y', 140)
                .attr('width', wd)
                .attr('height', 75)
                // .attr('fill', rectCol.fill) // when dropRect is passed (after L* change)
                .attr('fill', rectCol.attr('fill')) // when rectDrop is passed (before L* change)
                .attr('stroke', '#000');
}

// DRAW COLOR BOXES FROM PLOT CHANGES (LOCAL)
function drawLocalCol(pos, wd, rectCol) {
    // countDrop++;
    // Draw Added Colors
    svg_colormap.append('rect')
                .attr('class', 'dropCol')
                .attr('x', pos)
                .attr('y', 140)
                .attr('width', wd)
                .attr('height', 75)
                .attr('fill', rectCol.fill) // when dropRect is passed (after L* change)
                // .attr('fill', rectCol.attr('fill')) // when rectDrop is passed (before L* change)
                .attr('stroke', '#000');
}

// INITALIZATION FOR ALL COLORS
function initPos(pos, rectCol) {
    dropArr.push(pos);
    // drawColormap(datasetDrop);
    // drawLinegraph(datasetDrop);
    // var lum_min = 0;
    // var lum_max = 100;
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

    // console.log(datasetDrop);

    datasetDrop.unshift(rectCol);
    datasetDrop.splice(pos + 1, 1, rectCol);
    datasetDrop.splice(0, 1);

    // // Call Web Worker (Algorithm)
    // // Terminate old Worker and run new Worker
    // myWorker1.terminate();
    // myWorker1 = new Worker('worker.js');
    // myWorker1.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
    // myWorker1.onmessage = function(e) {
    //     drawSuggmap(e.data[0]);
    //     // drawLinegraph(e.data[0]);
    //     // drawScatter(e.data[1]);
    //     // drawPlot(e.data[0]);
    //     // loader.style.visibility = "hidden";
    // }

    // Terminate old Worker and run new Worker
    myWorker.terminate();
    myWorker = new Worker('worker.js');

    // Post Message in Worker
    myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
    myWorker.onmessage = function(e) {
        drawColormap(e.data[0]);
        drawLinegraph(e.data[0]);
        // drawScatter(e.data[1]);
        drawPlot(e.data[0]);
        scatter(e.data[2]);
        hist1(e.data[2]);
        hist2(e.data[2]);
        // loader.style.visibility = "hidden";
    }
}

// INITIALIZATION FOR 1 COLOR
// function initSinglePos(pos, rectCol) {
//     dropArr.push(pos);
//     datasetDrop.push(rectCol);
//     drawColormap(datasetDrop);
//     drawLinegraph(datasetDrop);
//     var lum_min = 0;
//     var lum_max = 100;

//     // 1 color added -> linear
//     if(selLum == 'Linear') {
//         for(var k=0; k<(paletteLen);k++) {
//             var samp_lum = k/(paletteLen-1);
//             var lum_exp = lum_min + (lum_max-lum_min) * samp_lum;       // For Linear Profile

//             // Adjusted Color Displayability Test
//             var testDisplay =  d3.lab(
//                 d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).l, 
//                 d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).a, 
//                 d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).b
//             );

//             var distDisplay = 1000;
//             var distColor = [];

//             if(testDisplay.displayable() == true) {
//                 // Update the color
//                 datasetDrop.push({
//                     lab: rectCol.lab,
//                     name: rectCol.name,
//                     fill: rectCol.fill,
//                     RGB: [
//                         d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).r, 
//                         d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).g, 
//                         d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).b
//                     ],
//                     LAB: [
//                         d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).l, 
//                         d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).a, 
//                         d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).b
//                     ],
//                     sel: 2
//                 });
//             }
//             else {
//                 for(i=0; i<color_dict.length; i++) {
//                     var localDist = Math.sqrt((color_dict[i].lab[0] - testDisplay.l)**2 + (color_dict[i].lab[1] - testDisplay.a)**2 + (color_dict[i].lab[2] - testDisplay.b)**2);
//                     if(localDist < distDisplay) {
//                         distDisplay = localDist;
//                         distColor = color_dict[i];
//                     }
//                 }
//                 // Update the color
//                 datasetDrop.push({
//                     lab: distColor.lab,
//                     name: distColor.name,
//                     fill: distColor.fill,
//                     RGB: [
//                         d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r, 
//                         d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g, 
//                         d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b
//                     ],                
//                     LAB: [
//                         d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
//                         d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
//                         d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
//                     ],
//                     sel: 2
//                 });
//             }
//         }
//         datasetDrop.splice(pos + 1, 1, rectCol);
//         datasetDrop.splice(0, 1);
//     }

//     // 1 color added -> diverging
//     else if (selLum == 'Diverging') {
//         // DropPos @ First Half
//         if(pos < paletteLen/2) {
//             for(var k=0; k<(paletteLen/2);k++) {
//                 var samp_lum = k/(paletteLen-1);
//                 var lum_exp = Math.abs(lum_min + (lum_max-lum_min) * 2 * samp_lum);   // For Diverging Profile (Before Midpoint)

//                 // Adjusted Color Displayability Test
//                 var testDisplay =  d3.lab(
//                     d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).l, 
//                     d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).a, 
//                     d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).b
//                 );
//                 var distDisplay = 1000;
//                 var distColor = [];

//                 if(testDisplay.displayable() == true) {
//                     // Update the color
//                     datasetDrop.push({
//                         lab: rectCol.lab,
//                         name: rectCol.name,
//                         fill: rectCol.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).r, 
//                             d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).g, 
//                             d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).b
//                         ],
//                         LAB: [
//                             d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).l, 
//                             d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).a, 
//                             d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//                 else {
//                     for(i=0; i<color_dict.length; i++) {
//                         var localDist = Math.sqrt((color_dict[i].lab[0] - testDisplay.l)**2 + (color_dict[i].lab[1] - testDisplay.a)**2 + (color_dict[i].lab[2] - testDisplay.b)**2);
//                         if(localDist < distDisplay) {
//                             distDisplay = localDist;
//                             distColor = color_dict[i];
//                         }
//                     }
//                     // Update the color
//                     datasetDrop.push({
//                         lab: distColor.lab,
//                         name: distColor.name,
//                         fill: distColor.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b
//                         ],                
//                         LAB: [
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//             }
//             datasetDrop.splice(pos + 1, 1, rectCol);
//             datasetDrop.splice(0, 1);

//             // Generate Random Color at Second Half
//             var distDiv = 0;
//             while(distDiv < 0.75) {
//                 var randCol = color_dict[getRandom(0,8325)];
//                 var distSel = c3.color[index(d3.color(rectCol.fill))];
//                 var distRand = c3.color[index(d3.color(randCol.fill))];
//                 var distDiv = nameDifference(distSel, distRand);                
//             }
//             for(var k=(Math.floor(paletteLen/2)+1); k<paletteLen; k++) {
//                 var samp_lum = k/(paletteLen-1);
//                 var lum_exp = lum_min + (lum_max-lum_min) * (paletteLen-k-1)/(Math.floor(paletteLen/2))   // For Diverging Profile (After Midpoint)
//                 // Adjusted Color Displayability Test
//                 var testDisplay =  d3.lab(
//                     d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).l, 
//                     d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).a, 
//                     d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).b
//                 );
//                 var distDisplay = 1000;
//                 var distColor = [];

//                 if(testDisplay.displayable() == true) {
//                     // Update the color
//                     datasetDrop.push({
//                         lab: randCol.lab,
//                         name: randCol.name,
//                         fill: randCol.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(lum_exp, randCol.lab[1], randCol.lab[2])).r, 
//                             d3.rgb(d3.lab(lum_exp, randCol.lab[1], randCol.lab[2])).g, 
//                             d3.rgb(d3.lab(lum_exp, randCol.lab[1], randCol.lab[2])).b
//                         ],
//                         LAB: [
//                             d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).l, 
//                             d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).a, 
//                             d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//                 else {
//                     for(i=0; i<color_dict.length; i++) {
//                         var localDist = Math.sqrt((color_dict[i].lab[0] - testDisplay.l)**2 + (color_dict[i].lab[1] - testDisplay.a)**2 + (color_dict[i].lab[2] - testDisplay.b)**2);
//                         if(localDist < distDisplay) {
//                             distDisplay = localDist;
//                             distColor = color_dict[i];
//                         }
//                     }
//                     // Update the color
//                     datasetDrop.push({
//                         lab: distColor.lab,
//                         name: distColor.name,
//                         fill: distColor.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b
//                         ],                
//                         LAB: [
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//                 // var samp_lum = k/(paletteLen-1);
//                 // var lum_exp = lum_min + (lum_max-lum_min) * (paletteLen-k-1)/(Math.floor(paletteLen/2))   // For Diverging Profile (After Midpoint)
//                 // generateDiv(lum_exp, k, rectCol);
//             }
//         }
//         // DropPos @ Second Half
//         else if(pos >= paletteLen/2) {
//             // Generate Random Color at Second Half
//             var distDiv = 0;
//             while(distDiv < 0.75) {
//                 var randCol = color_dict[getRandom(0,8325)];
//                 var distSel = c3.color[index(d3.color(rectCol.fill))];
//                 var distRand = c3.color[index(d3.color(randCol.fill))];
//                 var distDiv = nameDifference(distSel, distRand);                
//             }
//             for(var k=0; k<(paletteLen/2);k++) {
//                 var samp_lum = k/(paletteLen-1);
//                 var lum_exp = Math.abs(lum_min + (lum_max-lum_min) * 2 * samp_lum);   // For Diverging Profile (Before Midpoint)
//                 // Adjusted Color Displayability Test
//                 var testDisplay =  d3.lab(
//                     d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).l, 
//                     d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).a, 
//                     d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).b
//                 );
//                 var distDisplay = 1000;
//                 var distColor = [];

//                 if(testDisplay.displayable() == true) {
//                     // Update the color
//                     datasetDrop.push({
//                         lab: randCol.lab,
//                         name: randCol.name,
//                         fill: randCol.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(lum_exp, randCol.lab[1], randCol.lab[2])).r, 
//                             d3.rgb(d3.lab(lum_exp, randCol.lab[1], randCol.lab[2])).g, 
//                             d3.rgb(d3.lab(lum_exp, randCol.lab[1], randCol.lab[2])).b
//                         ],
//                         LAB: [
//                             d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).l, 
//                             d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).a, 
//                             d3.lab(lum_exp, randCol.lab[1], randCol.lab[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//                 else {
//                     for(i=0; i<color_dict.length; i++) {
//                         var localDist = Math.sqrt((color_dict[i].lab[0] - testDisplay.l)**2 + (color_dict[i].lab[1] - testDisplay.a)**2 + (color_dict[i].lab[2] - testDisplay.b)**2);
//                         if(localDist < distDisplay) {
//                             distDisplay = localDist;
//                             distColor = color_dict[i];
//                         }
//                     }
//                     // Update the color
//                     datasetDrop.push({
//                         lab: distColor.lab,
//                         name: distColor.name,
//                         fill: distColor.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b
//                         ],                
//                         LAB: [
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//             }
//             // for(var k=0; k<(paletteLen/2);k++) {
//             //     var samp_lum = k/(paletteLen-1);
//             //     var lum_exp = Math.abs(lum_min + (lum_max-lum_min) * 2 * samp_lum);   // For Diverging Profile (Before Midpoint)
//             //     generateDiv(lum_exp, k, rectCol);
//             // }

//             for(var k=(Math.floor(paletteLen/2)+1); k<paletteLen; k++) {
//                 var samp_lum = k/(paletteLen-1);
//                 var lum_exp = lum_min + (lum_max-lum_min) * (paletteLen-k-1)/(Math.floor(paletteLen/2))   // For Diverging Profile (After Midpoint)

//                 // Adjusted Color Displayability Test
//                 var testDisplay =  d3.lab(
//                     d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).l, 
//                     d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).a, 
//                     d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).b
//                 );
//                 var distDisplay = 1000;
//                 var distColor = [];
//                 if(testDisplay.displayable() == true) {
//                     // Update the color
//                     datasetDrop.push({
//                         lab: rectCol.lab,
//                         name: rectCol.name,
//                         fill: rectCol.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).r, 
//                             d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).g, 
//                             d3.rgb(d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2])).b
//                         ],
//                         LAB: [
//                             d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).l, 
//                             d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).a, 
//                             d3.lab(lum_exp, rectCol.LAB[1], rectCol.LAB[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//                 else {
//                     for(i=0; i<color_dict.length; i++) {
//                         var localDist = Math.sqrt((color_dict[i].lab[0] - testDisplay.l)**2 + (color_dict[i].lab[1] - testDisplay.a)**2 + (color_dict[i].lab[2] - testDisplay.b)**2);
//                         if(localDist < distDisplay) {
//                             distDisplay = localDist;
//                             distColor = color_dict[i];
//                         }
//                     }
//                     // Update the color
//                     datasetDrop.push({
//                         lab: distColor.lab,
//                         name: distColor.name,
//                         fill: distColor.fill,
//                         RGB: [
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).r, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).g, 
//                             d3.rgb(d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2])).b
//                         ],                
//                         LAB: [
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).l, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).a, 
//                             d3.lab(distColor.lab[0],distColor.lab[1],distColor.lab[2]).b
//                         ],
//                         sel: 2
//                     });
//                 }
//             }
//             datasetDrop.splice(pos + 1, 1, rectCol);
//             datasetDrop.splice(0, 1);
//         }
//     }

//     // Call Web Worker (Algorithm)

//     // Terminate old Worker and run new Worker
//     myWorker.terminate();
//     myWorker = new Worker('worker.js');

//     // Post Message in Worker
//     myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D] });
//     myWorker.onmessage = function(e) {
//         drawColormap(e.data[0]);
//         drawLinegraph(e.data[0]);
//         // drawScatter(e.data[1]);
//         drawPlot(e.data[0]);
//         // loader.style.visibility = "hidden";
//     }
// }
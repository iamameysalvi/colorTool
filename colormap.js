function drawCanvas() {
    // Canvas Slider
    svg_colormap.append('rect')
                .attr('class', 'dropCanvas')
                .attr('x', 0)
                .attr('y', 10)
                .attr('width', 1000)
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

// Add Color to Selected Area
function addColor(selection) {
    if(countCol < 16) {
        datasetSel.push({
            lab: selection.text(),
            name: selection.attr('value'),
            fill: selection.attr('style').slice(6,-51),
            RGB: [d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).r, d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).g, d3.rgb(d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2])).b],
            LAB: [d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).L, d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).a, d3.lab(selection.text().split(",").map(x=>+x)[0],selection.text().split(",").map(x=>+x)[1],selection.text().split(",").map(x=>+x)[2]).b],
            sel: 1
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
                                                .attr('y', 10)
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
                                                    .attr('y', 10)
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
                                    slidePos = Math.floor(paletteLen * ptTest[0]/canWd);
                                    var dropX = dropPos * (canWd/paletteLen);
                                    var dropWd = Math.ceil(paletteLen * ptTest[0]/canWd) * (canWd/paletteLen) - dropX;
                                    var dropRect = ({
                                        pos: slidePos,
                                        lab: rectDrop.data()[0].lab,
                                        name: rectDrop.data()[0].name,
                                        fill: rectDrop.data()[0].fill,
                                        RGB: [d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).r, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).g, d3.rgb(d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2])).b],
                                        LAB: [d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).L, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).a, d3.lab(rectDrop.data()[0].lab.split(",").map(x=>+x)[0],rectDrop.data()[0].lab.split(",").map(x=>+x)[1],rectDrop.data()[0].lab.split(",").map(x=>+x)[2]).b],
                                        sel: 1
                                    });
                                    function drawDropCol() {
                                        // Draw Added Colors
                                        svg_colormap.append('rect')
                                                    .attr('class', 'dropCol')
                                                    .attr('id', 'dropCol')
                                                    .attr('x', dropX)
                                                    .attr('y', 10)
                                                    .attr('width', dropWd)
                                                    .attr('height', 75)
                                                    .attr('fill', dropRect.fill)
                                                    .attr('stroke', '#000')
                                                    .on('mouseup', function() {
                                                        // var currBox = d3.select(this);
                                                        svg_colormap.selectAll('rect.widgBox').remove();
                                                        svg_colormap.selectAll('rect.widgCol').remove();
                                                        svg_colormap.selectAll('text#faClose').remove();
                                                        // Widget Box
                                                        svg_colormap.append('rect')
                                                                    .attr('class', 'widgBox')
                                                                    .attr('x', function() { 
                                                                        if(dropPos < 5) {
                                                                            return dropX;
                                                                        }
                                                                        else {
                                                                            return dropX - 75;
                                                                        }
                                                                    })
                                                                    .attr('y', 95)
                                                                    .attr('width', 175)
                                                                    .attr('height', 115)
                                                                    .attr('fill', "#FFF")
                                                                    .attr('stroke', '#000');

                                                        // Close Widget Button
                                                        svg_colormap.append('text')
                                                                    .attr('x', function() { 
                                                                        if(dropPos < 5) {
                                                                            return dropX + 175;
                                                                        }
                                                                        else {
                                                                            return dropX + 100;
                                                                        }
                                                                    })
                                                                    .attr('y', 95)
                                                                    .attr('class', 'fa')
                                                                    .attr('id', 'faClose')
                                                                    .text('\uf00d')
                                                                    .attr('fill', '#222021')
                                                                    .on('mouseover', function() {
                                                                        d3.select(this).attr('fill', '#800000')
                                                                    })
                                                                    .on('mouseout', function() {
                                                                        d3.select(this).attr('fill', '#222021')
                                                                    })
                                                                    .on('click', function() {
                                                                        svg_colormap.selectAll('rect.widgBox').remove();
                                                                        svg_colormap.selectAll('rect.widgCol').remove();
                                                                        svg_colormap.selectAll('text#faClose').remove();
                                                                    })
                                                                    .append('title').text('Close Widget');

                                                        // Selected Color
                                                        var currDrop = d3.select(this);
                                                        var currHSL = d3.hsl(currDrop.attr('fill'));
                                                        // Widget Colors
                                                        for(i=0; i<1.25; i+=0.25) {
                                                            for(j=0.25; j<1; j+=0.25) {
                                                                currHSL.s = currHSL.s * i;
                                                                currHSL.l = currHSL.l * j;
                                                                svg_colormap.append('rect')
                                                                            .attr('class', 'widgCol')
                                                                            .attr('x', function() { 
                                                                                if(dropPos < 5) {
                                                                                    return (10 + dropX) + i*125;
                                                                                }
                                                                                else {
                                                                                    return (10 + dropX - 75) + i*125;
                                                                                }
                                                                            })
                                                                            .attr('y', 75 + j*125)
                                                                            .attr('width', 25)
                                                                            .attr('height', 25)
                                                                            .attr('fill', currHSL)
                                                                            .attr('stroke', '#000')
                                                                            .attr('stroke-width', 1)
                                                                            .on('mouseover', function() {
                                                                                var moCol = d3.select(this);
                                                                                moCol.attr('stroke-width', 3);
                                                                            })
                                                                            .on('mouseout', function() {
                                                                                var moCol = d3.select(this);
                                                                                moCol.attr('stroke-width', 1);
                                                                            })
                                                                            .on('click', function() {
                                                                                var moCol = d3.select(this);
                                                                                dropRect = ({
                                                                                    pos: slidePos,
                                                                                    lab: 5 * Math.round((d3.lab(d3.rgb(moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5),
                                                                                    name: termDistribution(moCol.attr('fill'))[0].term,
                                                                                    fill: moCol.attr('fill'),
                                                                                    RGB: [moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]],
                                                                                    LAB: [5 * Math.round((d3.lab(d3.rgb(moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5), 5 * Math.round((d3.lab(d3.rgb(moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5), 5 * Math.round((d3.lab(d3.rgb(moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], moCol.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5)],
                                                                                    sel: 1
                                                                                });
                                                                                datasetDrop.splice(dropPos, 1, dropRect);
                                                                                svg_colormap.selectAll('rect.widgBox').remove();
                                                                                svg_colormap.selectAll('rect.widgCol').remove();
                                                                                svg_colormap.selectAll('text#faClose').remove();
                                                                                drawDropCol();
                                                                                calcPalette(paletteLen, val_lum[0], val_lum[1]);
                                                                            });
                                                                currHSL.s = 1;
                                                                currHSL.l = 1;
                                                            }
                                                        }
                                                    })
                                                    .on('mousedown', function() {
                                                    
                                                        var rectDrop = d3.select(this);
                                                        // Change Border Thickness
                                                        rectDrop.attr('stroke-width', 5);
                                                        var selMouse = d3.mouse(rectDrop.node());
                                                        var selCoord = [
                                                            +d3.select(this).attr('x')
                                                        ];
                                                        
                                                        // Move Rectangle
                                                        d3.select(document).on('mousemove', function() {
                                                            // Get Mouse Co-Ordinates
                                                            var newMouse = d3.mouse(rectDrop.node());
                                                            var delMouse = [
                                                                newMouse[0]-selMouse[0]
                                                            ];
                                                            rectDrop.attr('x', selCoord[0] + delMouse[0]);

                                                            if(contains(svg_colormap,newMouse) == true) {
                                                                var canWd = d3.select('rect.dropCanvas').attr('width');
                                                                var dropPos = Math.floor(paletteLen * newMouse[0]/canWd);
                                                                // var slidePos = Math.floor(paletteLen * newMouse[0]/canWd);
                                                                var dropX = dropPos * (canWd/paletteLen);
                                                                var dropWd = Math.ceil(paletteLen * newMouse[0]/canWd) * (canWd/paletteLen) - dropX;
                                                                // Draw Temp Boxes (Hover)
                                                                svg_colormap.append('rect')
                                                                            .attr('class', 'contCol')
                                                                            .attr('x', dropX)
                                                                            .attr('y', 10)
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
                                                                                .attr('y', 10)
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
                                                        })
                            
                                                        d3.select(document).on('mouseup', function() {
                                                            svg_colormap.selectAll('rect.contCol').remove();
                                                            svg_colormap.selectAll('rect.hoverCol').remove();
                                                            // Change Border Thickness
                                                            rectDrop.attr('stroke-width', 1)
                                                                    .attr('id', 'slideCol');
                                                            // Get Drop-off Mouse Co-Ordinates
                                                            var dropMouse = d3.mouse(rectDrop.node());
                                                            var ptTest = [dropMouse[0], dropMouse[1]];
                                                            // Stop Mouse Events
                                                            d3.select(document)
                                                                .on('mousemove', null)
                                                                .on('mouseup', null);

                                                            // if(contains(svg_colormap.select('rect.dropCanvas'),ptTest) == true) {
                                                                // Update Selected Color Dataset using Index
                                                                // idDrop = rectDrop.attr('index');
                                                                // datasetSel.splice(idDrop,1);
                                                                // Remove Selected Colors
                                                                svg_colormap.selectAll('rect.addCol').remove();
                                                                svg_colormap.selectAll('rect#slideCol').remove();
                                                                // Add Color to Dropped Dataset
                                                                canWd = d3.select('rect.dropCanvas').attr('width')
                                                                dropPos = Math.floor(paletteLen * ptTest[0]/canWd);
                                                                dropX = dropPos * (canWd/paletteLen);
                                                                dropWd = Math.ceil(paletteLen * ptTest[0]/canWd) * (canWd/paletteLen) - dropX;
                                                                datasetDrop.splice(dropRect.pos, 1);
                                                                dropRect = ({
                                                                    pos: dropPos,
                                                                    lab: 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5) + "," + 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5),
                                                                    name: termDistribution(rectDrop.attr('fill'))[0].term,
                                                                    fill: rectDrop.attr('fill'),
                                                                    RGB: [rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2]],
                                                                    LAB: [5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).L)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).a)/5), 5 * Math.round((d3.lab(d3.rgb(rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[0], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[1], rectDrop.attr('fill').slice(4,-1).split(",").map(x=>+x)[2])).b)/5)],
                                                                    sel: 1
                                                                });
                                                                datasetDrop.splice(dropRect.pos, 0, dropRect);
                                                                datasetDrop.splice(dropRect.pos, 1);
                                                                datasetDrop.splice(dropRect.pos, 0, dropRect);
                                                                drawDropCol();
                                                                drawColor();
                                                                calcPalette(paletteLen, val_lum[0], val_lum[1]);                                                                
                                                            // }
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
                                    calcPalette(paletteLen, val_lum[0], val_lum[1]);
                                }
                                else {
                                    svg_colormap.selectAll('rect.addCol').remove();
                                    drawColor();
                                }
                            })
                        });
        }
        drawColor();
        countCol++;
    }
    else {
        alert('Maximum Limit Reached!');
    }
}
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
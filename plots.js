function drawPlot(plotData) {
    svg_LABplots.selectAll('line.plotGraph').remove();
    svg_LABplots.selectAll('circle.plotGraph').remove();
    // svg_LABplots.selectAll('text.textGraphAB').remove();
    svg_LABplots.selectAll('text.textGraphLA').remove();
    svg_LABplots.selectAll('text.textGraphLB').remove();
    svg_LABplots.selectAll('image.labImage').remove();
    svg_LABplots.selectAll('g.plotAxes').remove();

    // a vs b
    function drawPlot_ab() {
        for(i = 0; i < plotData.length - 1; i++) {
            svg_LABplots.append('line')
                        .attr('class', 'plotGraph')
                        .attr('index', function() { return i; })
                        .style('stroke', "#000")
                        .style('stroke-width', 1)
                        .attr('x1', plotData[i].LAB[1] + 153)
                        .attr('y1', plotData[i].LAB[2] + 153)
                        .attr('x2', plotData[i+1].LAB[1] + 153)
                        .attr('y2', plotData[i+1].LAB[2] + 153)
                        .raise();
        }
        // Circles
        for(i = 0; i < plotData.length; i++) {
            svg_LABplots.append('circle')
                        .attr('class', 'plotGraph')
                        .attr('index', function() { return i; })
                        .attr('cx', plotData[i].LAB[1] + 153)
                        .attr('cy', plotData[i].LAB[2] + 153)
                        .attr('r', 5)
                        .style('fill', plotData[i].fill)
                        .style('stroke', "black")
                        .style('stroke-width', 1)
                        .on('mouseover', function() {
                            // ColorNames
                            var circHover = d3.select(this);
                            var textHover = circHover.attr('index');
                            svg_LABplots.append('text')
                                        .attr('class', 'textGraphAB')
                                        .attr('index', function() { return textHover; })
                                        .attr('x', plotData[textHover].LAB[1] + 165)
                                        .attr('y', plotData[textHover].LAB[2] + 153)
                                        .text(plotData[textHover].name)
                                        .style('font-size', '15px')
                                        .raise();
                        })
                        .on('mouseout', function() {
                            svg_LABplots.selectAll('text.textGraphAB').remove();
                        })
                        .on('mousedown', function() {
                            var circDrop = d3.select(this);
                            // Change Border Thickness
                            circDrop.style('stroke-width', 5);
                            var circY = 0;
                            var circX = 0;

                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                svg_LABplots.selectAll('text.textGraphAB').remove();
                                svg_LABplots.selectAll('line.plotGraph').remove();

                                circDrop.style('stroke-width', 5);

                                // Get Mouse Co-Ordinates
                                var newMouse = d3.mouse(circDrop.node());
                                // Mouse Pointer/ Edges Position
                                // Top Edge
                                if(newMouse[1] < 25) {
                                    circDrop.attr('cy', 25);
                                    circY = 25;
                                }
                                // Bottom Edge
                                else if(newMouse[1] > 281) {
                                    circDrop.attr('cy', 281);
                                    circY = 281;
                                }
                                else {
                                // Center
                                    circDrop.attr('cy', newMouse[1]);
                                    circY = newMouse[1];
                                }

                                // Left Edge
                                if(newMouse[0] < 25) {
                                    circDrop.attr('cx', 25);
                                    circX = 25;
                                }
                                // Right Edge
                                else if(newMouse[0] > 281) {
                                    circDrop.attr('cx', 281);
                                    circX = 281;
                                }
                                else {
                                    // Center
                                    circDrop.attr('cx', newMouse[0]);
                                    circX = newMouse[0];
                                }

                                // Update Color ND
                                var oldL = 5 * Math.round((plotData[circDrop.attr('index')].LAB[0]/5));
                                var newA = circX - 153;
                                var newB = circY - 153;

                                var distDisplay = 1000;
                                var distColor = [];
                                var selColors = [];

                                // Adjusted Color Displayability Test
                                var testDisplay =  d3.lab(
                                    oldL, newA, newB
                                );

                                if(testDisplay.displayable() == true) {
                                    var colL = ({
                                        pos: circDrop.attr('index'),
                                        fill: "rgb" + "(" + d3.rgb(d3.lab(oldL,newA,newB)).r + "," + d3.rgb(d3.lab(oldL,newA,newB)).g + "," + d3.rgb(d3.lab(oldL,newA,newB)).b + ")",
                                        RGB: [d3.rgb(d3.lab(oldL,newA,newB)).r, d3.rgb(d3.lab(oldL,newA,newB)).g, d3.rgb(d3.lab(oldL,newA,newB)).b],
                                        LAB: [oldL,newA,newB],
                                        name:  nameDistribution(d3.lab(oldL,newA,newB)),
                                        sel: 0
                                    });                                    
                                }
                                else {
                                    for(i=0; i<colorDict.length; i++) {
                                        if(oldL == colorDict[i].LAB[0]) {
                                            selColors.push(colorDict[i]);
                                            for(j=0; j<selColors.length; j++) {
                                                var localDist = Math.sqrt((selColors[j].lab[0] - oldL)**2 + (selColors[j].lab[1] - newA)**2 + (selColors[j].lab[2] - newB)**2);
                                                if(localDist < distDisplay) {
                                                    distDisplay = localDist;
                                                    distColor = selColors[j];
                                                }
                                            }
                                        }
                                    }

                                    // Update the color
                                    var colL = ({
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
                                }
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Draw Slice
                                svg_LABplots.selectAll("circle.slice").remove();
                                // var lumVal = 5 * Math.round((100 - (((circY - 25)/(255)) * 100))/5);
                                for (var c=0; c<colorDict.length; c++) {
                                    var salVal = colorDict[c].saliency;
                                    var LABval = colorDict[c].LAB;
                                    var fillColor = colorDict[c].fill;
                                        if(LABval[0] == oldL) {
                                            svg_LABplots.append("circle")
                                                        .attr('class', 'slice')
                                                        .attr('cx', LABval[1] + 153)
                                                        .attr('cy', LABval[2] + 153)
                                                        .attr("r", salVal * 7)
                                                        .style('fill', fillColor)
                                                        // .style('stroke-width', 0.25)
                                                        // .style('stroke', 'black')
                                                        .attr('opacity', 0.3)
                                                        .lower();
                                        }
                                }

                                // Update Colornames
                                if((d3.lab(colL.LAB[0], colL.LAB[1], colL.LAB[2])).displayable() == true) {
                                    svg_LABplots.append('text')
                                                .attr('class', 'textGraphAB')
                                                .attr('index', function() { return i; })
                                                .attr('x', newA + 165)
                                                .attr('y', newB + 153)
                                                .text(colL.name)
                                                .style('font-size', '15px')
                                                .raise();
                                }
                                else {
                                    svg_LABplots.append('text')
                                                .attr('class', 'textGraphAB')
                                                .attr('index', function() { return i; })
                                                .attr('x', newA + 165)
                                                .attr('y', newB + 153)
                                                .text("N/A")
                                                .style('font-size', '15px')
                                                .raise();
                                }

                                // Update Lines
                                for(i = 0; i < plotData.length - 1; i++) {
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .attr('index', function() { return i; })
                                                .style('stroke', "#000")
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[1] + 153)
                                                .attr('y1', plotData[i].LAB[2] + 153)
                                                .attr('x2', plotData[i+1].LAB[1] + 153)
                                                .attr('y2', plotData[i+1].LAB[2] + 153)
                                                .raise();
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .style('stroke', '#000')
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[1] + 428)
                                                .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                                                .attr('x2', plotData[i+1].LAB[1] + 428)
                                                .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                                                .raise();
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .style('stroke', '#000')
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[2] + 703)
                                                .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                                                .attr('x2', plotData[i+1].LAB[2] + 703)
                                                .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                                                .raise();
                                }

                                // // Update Circles
                                // for(i = 0; i < plotData.length; i++) {
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[1] + 153)
                                //                 .attr('cy', plotData[i].LAB[2] + 153)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1);
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[1] + 428)
                                //                 .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1);
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[2] + 703)
                                //                 .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1)
                                // }

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                // drawPlot(plotData);
                            })

                            d3.select(document).on('mouseup', function() {
                                svg_LABplots.selectAll("rect.plotSearch").remove();
                                svg_LABplots.selectAll("circle.slice").remove();
                                // Change Border Thickness
                                circDrop.style('stroke-width', 1);
                                // Stop Mouse Events
                                d3.select(document)
                                    .on('mousemove', null)
                                    .on('mouseup', null);
                                
                                // Formula for mapping to [0,100]
                                var oldL = 5 * Math.round((plotData[circDrop.attr('index')].LAB[0]/5));
                                var newA = circX - 153;
                                var newB = circY - 153;

                                var distDisplay = 1000;
                                var distColor = [];
                                var selColors = [];

                                // Adjusted Color Displayability Test
                                var testDisplay =  d3.lab(
                                    oldL, newA, newB
                                );

                                if(testDisplay.displayable() == true) {
                                    var colL = ({
                                        pos: circDrop.attr('index'),
                                        fill: "rgb" + 
                                        "(" + 
                                            Math.round(d3.rgb(d3.lab(oldL,newA,newB)).r) + "," + 
                                            Math.round(d3.rgb(d3.lab(oldL,newA,newB)).g) + "," + 
                                            Math.round(d3.rgb(d3.lab(oldL,newA,newB)).b) + 
                                        ")",
                                        RGB: [
                                            Math.round(d3.rgb(d3.lab(oldL,newA,newB)).r), 
                                            Math.round(d3.rgb(d3.lab(oldL,newA,newB)).g), 
                                            Math.round(d3.rgb(d3.lab(oldL,newA,newB)).b)
                                        ],
                                        LAB: [oldL,newA,newB],
                                        name:  nameDistribution(d3.lab(oldL,newA,newB)),
                                        sel: 0
                                    });                                    
                                }
                                else {
                                    for(i=0; i<colorDict.length; i++) {
                                        if(oldL == colorDict[i].LAB[0]) {
                                            selColors.push(colorDict[i]);
                                            for(j=0; j<selColors.length; j++) {
                                                var localDist = Math.sqrt((selColors[j].lab[0] - oldL)**2 + (selColors[j].lab[1] - newA)**2 + (selColors[j].lab[2] - newB)**2);
                                                if(localDist < distDisplay) {
                                                    distDisplay = localDist;
                                                    distColor = selColors[j];
                                                }
                                            }
                                        }
                                    }

                                    // Update the color
                                    var colL = ({
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
                                plotData.splice(circDrop.attr('index'), 1, colL);
                                
                                // Draw Drop Color
                                var canWd = d3.select('rect.dropCanvas').attr('width');
                                var dropPos = circDrop.attr('index');
                                var dropX = dropPos * (canWd/paletteLen);
                                var dropWd = canWd/paletteLen;

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                drawPlot(plotData);
                            })
                        });
                        // .append("title")
                        // .text(function(d) { return "(" + coordmap[i][0] + "," + -coordmap[i][1] + ")"; })
        }
    }

    var x_coord = d3.scaleLinear()
                .domain([-128, 128])
                .range([0, 256]);
    svg_LABplots.append("g")
                .attr('class', 'plotAxes')
                .attr("transform", "translate(25," + (281) + ")") 
                .call(d3.axisBottom(x_coord).tickValues([]));
    svg_LABplots.append("text")
                .attr('class', 'plotAxes')
                .attr("text-anchor", "end")
                .attr("x", 153)
                .attr("y", 301 )
                .text("a");

    var y_coord = d3.scaleLinear()
                .domain([128, -128])        
                .range([0, 256]);  

    svg_LABplots.append("g")
                .attr('class', 'plotAxes')
                .attr("transform", "translate(25," + (25) + ")")
                .call(d3.axisLeft(y_coord).tickValues([]));
    svg_LABplots.append("text")
                .attr('class', 'plotAxes')
                .attr("text-anchor", "end")
                .attr("x", 10)
                .attr("y", 150)
                .text("b");

    drawPlot_ab();

    // L vs a
    function drawPlot_La() {
        for(i = 0; i < plotData.length - 1; i++) {
            svg_LABplots.append('line')
                        .attr('class', 'plotGraph')
                        .style('stroke', '#000')
                        .style('stroke-width', 1)
                        .attr('x1', plotData[i].LAB[1] + 428)
                        .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('x2', plotData[i+1].LAB[1] + 428)
                        .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                        .raise();
        }
        // Circles
        for(i = 0; i < plotData.length; i++) {
            svg_LABplots.append('circle')
                        .attr('class', 'plotGraph')
                        .attr('index', function() { return i; })
                        .attr('cx', plotData[i].LAB[1] + 428)
                        .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('r', 5)
                        .style('fill', plotData[i].fill)
                        .style('stroke', "black")
                        .style('stroke-width', 1)
                        .on('mouseover', function() {
                            // ColorNames
                            var circHover = d3.select(this);
                            var textHover = circHover.attr('index');
                            svg_LABplots.append('text')
                                        .attr('class', 'textGraphLA')
                                        .attr('index', function() { return textHover; })
                                        .attr('x', plotData[textHover].LAB[1] + 440)
                                        .attr('y', -plotData[textHover].LAB[0]*2.56 + 275)
                                        .text(plotData[textHover].name)
                                        .style('font-size', '15px')
                                        .raise();
                        })
                        .on('mouseout', function() {
                            svg_LABplots.selectAll('text.textGraphLA').remove();
                        })
                        .on('mousedown', function() {
                            var circDrop = d3.select(this);
                            // Change Border Thickness
                            circDrop.style('stroke-width', 5);
                            var circY = 0;
                            var circX = 0;

                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                circDrop.style('stroke-width', 5);
                                svg_LABplots.selectAll('text.textGraphLA').remove();
                                svg_LABplots.selectAll('line.plotGraph').remove();
                                // Get Mouse Co-Ordinates
                                var newMouse = d3.mouse(circDrop.node());
                                // Mouse Pointer/ Edges Position
                                // Top Edge
                                if(newMouse[1] < 25) {
                                    circDrop.attr('cy', 25);
                                    circY = 25;
                                }
                                // Bottom Edge
                                else if(newMouse[1] > 281) {
                                    circDrop.attr('cy', 281);
                                    circY = 281;
                                }
                                else {
                                // Center
                                    circDrop.attr('cy', 5 * (Math.round(newMouse[1]/5)));
                                    circDrop.attr('cy', newMouse[1]);
                                    circY = newMouse[1];
                                }

                                // Left Edge
                                if(newMouse[0] < 300) {
                                    circDrop.attr('cx', 300);
                                    circX = 300;
                                }
                                // Right Edge
                                else if(newMouse[0] > 555) {
                                    circDrop.attr('cx', 555);
                                    circX = 555;
                                }
                                else {
                                    // Center
                                    circDrop.attr('cx', newMouse[0]);
                                    circX = newMouse[0];
                                }

                                // Draw Slice
                                svg_LABplots.selectAll("circle.slice").remove();
                                var lumVal = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                for (var c=0; c<colorDict.length; c++) {
                                    var salVal = colorDict[c].saliency;
                                    var LABval = colorDict[c].LAB;
                                    var fillColor = colorDict[c].fill;
                                        if(LABval[0] == lumVal) {
                                            svg_LABplots.append("circle")
                                                        .attr('class', 'slice')
                                                        .attr('cx', LABval[1] + 428)
                                                        .attr('cy', -LABval[0]*2.56 + 281)
                                                        .attr("r", salVal * 5)
                                                        .style('fill', fillColor)
                                                        .style('stroke-width', 0.1)
                                                        .style('stroke', 'black')
                                                        .attr('opacity', 0.3)
                                                        .lower();
                                        }
                                }

                                // Update Color ND
                                var newL = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                var newA = circX - 428;
                                // var oldA = plotData[circDrop.attr('index')].LAB[1];
                                var oldB = plotData[circDrop.attr('index')].LAB[2];

                                var distDisplay = 1000;
                                var distColor = [];
                                var selColors = [];

                                // Adjusted Color Displayability Test
                                var testDisplay =  d3.lab(
                                    newL, newA, oldB
                                );

                                if(testDisplay.displayable() == true) {
                                    var colL = ({
                                        pos: circDrop.attr('index'),
                                        fill: "rgb" + "(" + d3.rgb(d3.lab(newL,newA,oldB)).r + "," + d3.rgb(d3.lab(newL,newA,oldB)).g + "," + d3.rgb(d3.lab(newL,newA,oldB)).b + ")",
                                        RGB: [d3.rgb(d3.lab(newL,newA,oldB)).r, d3.rgb(d3.lab(newL,newA,oldB)).g, d3.rgb(d3.lab(newL,newA,oldB)).b],
                                        LAB: [newL,newA, oldB],
                                        name:  nameDistribution(d3.lab(newL,newA, oldB)),
                                        sel: 0
                                    });                                    
                                }
                                else {
                                    for(i=0; i<colorDict.length; i++) {
                                        if(newL == colorDict[i].LAB[0]) {
                                            selColors.push(colorDict[i]);
                                            for(j=0; j<selColors.length; j++) {
                                                var localDist = Math.sqrt((selColors[j].lab[0] - newL)**2 + (selColors[j].lab[1] - newA)**2 + (selColors[j].lab[2] - oldB)**2);
                                                if(localDist < distDisplay) {
                                                    distDisplay = localDist;
                                                    distColor = selColors[j];
                                                }
                                            }
                                        }
                                    }

                                    // Update the color
                                    var colL = ({
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
                                }
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Update Colornames
                                if((d3.lab(colL.LAB[0], colL.LAB[1], colL.LAB[2])).displayable() == true) {
                                    svg_LABplots.append('text')
                                                .attr('class', 'textGraphLA')
                                                .attr('index', function() { return i; })
                                                .attr('x', newA + 440)
                                                .attr('y', -newL*2.56 + 275)
                                                .text(colL.name)
                                                .style('font-size', '15px')
                                                .raise();
                                }
                                else {
                                    svg_LABplots.append('text')
                                                .attr('class', 'textGraphLA')
                                                .attr('index', function() { return i; })
                                                .attr('x', newA + 440)
                                                .attr('y', -newL*2.56 + 275)
                                                .text("N/A")
                                                .style('font-size', '15px')
                                                .raise();
                                }

                                // Update Lines
                                for(i = 0; i < plotData.length - 1; i++) {
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .attr('index', function() { return i; })
                                                .style('stroke', "#000")
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[1] + 153)
                                                .attr('y1', plotData[i].LAB[2] + 153)
                                                .attr('x2', plotData[i+1].LAB[1] + 153)
                                                .attr('y2', plotData[i+1].LAB[2] + 153)
                                                .raise();
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .style('stroke', '#000')
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[1] + 428)
                                                .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                                                .attr('x2', plotData[i+1].LAB[1] + 428)
                                                .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                                                .raise();
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .style('stroke', '#000')
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[2] + 703)
                                                .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                                                .attr('x2', plotData[i+1].LAB[2] + 703)
                                                .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                                                .raise();
                                }

                                // // Update Circles
                                // for(i = 0; i < plotData.length; i++) {
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[1] + 153)
                                //                 .attr('cy', plotData[i].LAB[2] + 153)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1);
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[1] + 428)
                                //                 .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1);
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[2] + 703)
                                //                 .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1)
                                // }

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                // drawPlot(plotData);
                            })

                            d3.select(document).on('mouseup', function() {
                                svg_LABplots.selectAll("circle.slice").remove();
                                // Change Border Thickness
                                circDrop.style('stroke-width', 1);
                                // Stop Mouse Events
                                d3.select(document)
                                    .on('mousemove', null)
                                    .on('mouseup', null);
                                
                                // Formula for mapping to [0,100]
                                var newL = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                var newA = Math.round(circX - 428);
                                // var oldA = plotData[circDrop.attr('index')].LAB[1];
                                var oldB = Math.round(plotData[circDrop.attr('index')].LAB[2]);

                                var distDisplay = 1000;
                                var distColor = [];
                                var selColors = [];

                                // Adjusted Color Displayability Test
                                var testDisplay =  d3.lab(
                                    newL, newA, oldB
                                );

                                if(testDisplay.displayable() == true) {
                                    var colL = ({
                                        pos: circDrop.attr('index'),
                                        fill: "rgb" + 
                                        "(" + 
                                            Math.round(d3.rgb(d3.lab(newL,newA,oldB)).r) + "," + 
                                            Math.round(d3.rgb(d3.lab(newL,newA,oldB)).g) + "," + 
                                            Math.round(d3.rgb(d3.lab(newL,newA,oldB)).b) + 
                                        ")",
                                        RGB: [
                                            Math.round(d3.rgb(d3.lab(newL,newA,oldB)).r), 
                                            Math.round(d3.rgb(d3.lab(newL,newA,oldB)).g), 
                                            Math.round(d3.rgb(d3.lab(newL,newA,oldB)).b)
                                        ],
                                        LAB: [newL,newA, oldB],
                                        name:  nameDistribution(d3.lab(newL,newA, oldB)),
                                        sel: 0
                                    });                                    
                                }
                                else {
                                    for(i=0; i<colorDict.length; i++) {
                                        if(newL == colorDict[i].LAB[0]) {
                                            selColors.push(colorDict[i]);
                                            for(j=0; j<selColors.length; j++) {
                                                var localDist = Math.sqrt((selColors[j].lab[0] - newL)**2 + (selColors[j].lab[1] - newA)**2 + (selColors[j].lab[2] - oldB)**2);
                                                if(localDist < distDisplay) {
                                                    distDisplay = localDist;
                                                    distColor = selColors[j];
                                                }
                                            }
                                        }
                                    }

                                    // Update the color
                                    var colL = ({
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
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Draw Drop Color
                                var canWd = d3.select('rect.dropCanvas').attr('width');
                                var dropPos = circDrop.attr('index');
                                var dropX = dropPos * (canWd/paletteLen);
                                var dropWd = canWd/paletteLen;


                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                drawPlot(plotData);
                            })
                        });
                        // .append("title")
                        // .text(function(d) { return "(" + coordmap[i][0] + "," + -coordmap[i][1] + ")"; })
        }
    }
    var x_coord_la = d3.scaleLinear()
                .domain([-128, 128])
                .range([0, 256]);
    svg_LABplots.append("g")
                .attr('class', 'plotAxes')
                .attr("transform", "translate(300," + (281) + ")") 
                .call(d3.axisBottom(x_coord_la).tickValues([]));
    svg_LABplots.append("text")
                .attr('class', 'plotAxes')
                .attr("text-anchor", "end")
                .attr("x", 428)
                .attr("y", 301)
                .text("a");

    var y_coord_la = d3.scaleLinear()
                .domain([0, 100])        
                .range([0, 256]);  

    svg_LABplots.append("g")
                .attr('class', 'plotAxes')
                .attr("transform", "translate(300," + (25) + ")")
                .call(d3.axisLeft(y_coord_la).tickValues([]));
    svg_LABplots.append("text")
                .attr('class', 'plotAxes')
                .attr("text-anchor", "end")
                .attr("x", 285)
                .attr("y", 150)
                .text("L");

    drawPlot_La();

    // L vs b
    function drawPlot_Lb() {
        for(i = 0; i < plotData.length - 1; i++) {
            svg_LABplots.append('line')
                        .attr('class', 'plotGraph')
                        .style('stroke', '#000')
                        .style('stroke-width', 1)
                        .attr('x1', plotData[i].LAB[2] + 703)
                        .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('x2', plotData[i+1].LAB[2] + 703)
                        .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                        .raise();
        }
        // Circles
        for(i = 0; i < plotData.length; i++) {
            svg_LABplots.append('circle')
                        .attr('class', 'plotGraph')
                        .attr('index', function() { return i; })
                        .attr('cx', plotData[i].LAB[2] + 703)
                        .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('r', 5)
                        .style('fill', plotData[i].fill)
                        .style('stroke', "black")
                        .style('stroke-width', 1)
                        .on('mouseover', function() {
                            // ColorNames
                            var circHover = d3.select(this);
                            var textHover = circHover.attr('index');
                            svg_LABplots.append('text')
                                        .attr('class', 'textGraphLB')
                                        .attr('index', function() { return textHover; })
                                        .attr('x', plotData[textHover].LAB[2] + 715)
                                        .attr('y', -plotData[textHover].LAB[0]*2.56 + 275)
                                        .text(plotData[textHover].name)
                                        .style('font-size', '15px')
                                        .raise();
                        })
                        .on('mouseout', function() {
                            svg_LABplots.selectAll('text.textGraphLB').remove();
                        })
                        .on('mousedown', function() {
                            var circDrop = d3.select(this);
                            // Change Border Thickness
                            circDrop.style('stroke-width', 5);
                            var circY = 0;
                            var circX = 0;

                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                circDrop.style('stroke-width', 5);
                                svg_LABplots.selectAll('text.textGraphLB').remove();
                                svg_LABplots.selectAll('line.plotGraph').remove();
                                // Get Mouse Co-Ordinates
                                var newMouse = d3.mouse(circDrop.node());
                                // Mouse Pointer/ Edges Position
                                // Top Edge
                                if(newMouse[1] < 25) {
                                    circDrop.attr('cy', 25);
                                    circY = 25;
                                }
                                // Bottom Edge
                                else if(newMouse[1] > 281) {
                                    circDrop.attr('cy', 281);
                                    circY = 281;
                                }
                                else {
                                    // Center
                                    circDrop.attr('cy', 5 * (Math.round(newMouse[1]/5)));
                                    // circDrop.attr('cy', newMouse[1]);
                                    circY = newMouse[1];
                                }

                                // Left Edge
                                if(newMouse[0] < 575) {
                                    circDrop.attr('cx', 575);
                                    circX = 575;
                                }
                                // Right Edge
                                else if(newMouse[0] > 830) {
                                    circDrop.attr('cx', 830);
                                    circX = 830;
                                }
                                else {
                                    // Center
                                    circDrop.attr('cx', newMouse[0]);
                                    circX = newMouse[0];
                                }

                                // Draw Slice
                                svg_LABplots.selectAll("circle.slice").remove();
                                var lumVal = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                for (var c=0; c<colorDict.length; c++) {
                                    var salVal = colorDict[c].saliency;
                                    var LABval = colorDict[c].LAB;
                                    var fillColor = colorDict[c].fill;
                                        if(LABval[0] == lumVal) {
                                            svg_LABplots.append("circle")
                                                        .attr('class', 'slice')
                                                        .attr('cx', LABval[2] + 703)
                                                        .attr('cy', -LABval[0]*2.56 + 281)
                                                        .attr("r", salVal * 5)
                                                        .style('fill', fillColor)
                                                        .style('stroke-width', 0.1)
                                                        .style('stroke', 'black')
                                                        .attr('opacity', 0.3)
                                                        .lower();
                                        }
                                }

                                // Update Color ND
                                var newL = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                var oldA = plotData[circDrop.attr('index')].LAB[1];
                                var newB = circX - 703;
                                // var oldB = plotData[circDrop.attr('index')].LAB[2];

                                var distDisplay = 1000;
                                var distColor = [];
                                var selColors = [];
                                
                                // Adjusted Color Displayability Test
                                var testDisplay =  d3.lab(
                                    newL, oldA, newB
                                );

                                if(testDisplay.displayable() == true) {
                                    var colL = ({
                                        pos: circDrop.attr('index'),
                                        fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,newB)).r + "," + d3.rgb(d3.lab(newL,oldA,newB)).g + "," + d3.rgb(d3.lab(newL,oldA,newB)).b + ")",
                                        RGB: [d3.rgb(d3.lab(newL,oldA,newB)).r, d3.rgb(d3.lab(newL,oldA,newB)).g, d3.rgb(d3.lab(newL,oldA,newB)).b],
                                        LAB: [newL,oldA,newB],
                                        name:  nameDistribution(d3.lab(newL,oldA,newB)),
                                        sel: 0
                                    });                                    
                                }
                                else {
                                    for(i=0; i<colorDict.length; i++) {
                                        if(newL == colorDict[i].LAB[0]) {
                                            selColors.push(colorDict[i]);
                                            for(j=0; j<selColors.length; j++) {
                                                var localDist = Math.sqrt((selColors[j].lab[0] - newL)**2 + (selColors[j].lab[1] - oldA)**2 + (selColors[j].lab[2] - newB)**2);
                                                if(localDist < distDisplay) {
                                                    distDisplay = localDist;
                                                    distColor = selColors[j];
                                                }
                                            }
                                        }
                                    }

                                    // Update the color
                                    var colL = ({
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
                                }
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Update Colornames
                                if((d3.lab(colL.LAB[0], colL.LAB[1], colL.LAB[2])).displayable() == true) {
                                    svg_LABplots.append('text')
                                                .attr('class', 'textGraphLB')
                                                .attr('index', function() { return i; })
                                                .attr('x', newB + 715)
                                                .attr('y', -newL*2.56 + 275)
                                                .text(colL.name)
                                                .style('font-size', '15px')
                                                .raise();
                                }
                                else {
                                    svg_LABplots.append('text')
                                                .attr('class', 'textGraphLB')
                                                .attr('index', function() { return i; })
                                                .attr('x', newB + 715)
                                                .attr('y', -newL*2.56 + 275)
                                                .text("N/A")
                                                .style('font-size', '15px')
                                                .raise();
                                }

                                // Update Lines
                                for(i = 0; i < plotData.length - 1; i++) {
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .attr('index', function() { return i; })
                                                .style('stroke', "#000")
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[1] + 153)
                                                .attr('y1', plotData[i].LAB[2] + 153)
                                                .attr('x2', plotData[i+1].LAB[1] + 153)
                                                .attr('y2', plotData[i+1].LAB[2] + 153)
                                                .raise();
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .style('stroke', '#000')
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[1] + 428)
                                                .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                                                .attr('x2', plotData[i+1].LAB[1] + 428)
                                                .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                                                .raise();
                                    svg_LABplots.append('line')
                                                .attr('class', 'plotGraph')
                                                .style('stroke', '#000')
                                                .style('stroke-width', 1)
                                                .attr('x1', plotData[i].LAB[2] + 703)
                                                .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                                                .attr('x2', plotData[i+1].LAB[2] + 703)
                                                .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                                                .raise();
                                }

                                // // Update Circles
                                // for(i = 0; i < plotData.length; i++) {
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[1] + 153)
                                //                 .attr('cy', plotData[i].LAB[2] + 153)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1);
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[1] + 428)
                                //                 .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1);
                                //     svg_LABplots.append('circle')
                                //                 .attr('class', 'plotGraph')
                                //                 .attr('index', function() { return i; })
                                //                 .attr('cx', plotData[i].LAB[2] + 703)
                                //                 .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                                //                 .attr('r', 5)
                                //                 .style('fill', plotData[i].fill)
                                //                 .style('stroke', "black")
                                //                 .style('stroke-width', 1)
                                // }

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                // drawPlot(plotData);
                            })

                            d3.select(document).on('mouseup', function() {
                                svg_LABplots.selectAll("circle.slice").remove();
                                // Change Border Thickness
                                circDrop.style('stroke-width', 1);
                                // Stop Mouse Events
                                d3.select(document)
                                    .on('mousemove', null)
                                    .on('mouseup', null);
                                
                                // Formula for mapping to [0,100]
                                var newL = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                var oldA = plotData[circDrop.attr('index')].LAB[1];
                                var newB = circX - 703;
                                // var oldB = plotData[circDrop.attr('index')].LAB[2];

                                var distDisplay = 1000;
                                var distColor = [];
                                var selColors = [];

                                // Adjusted Color Displayability Test
                                var testDisplay =  d3.lab(
                                    newL, oldA, newB
                                );

                                if(testDisplay.displayable() == true) {
                                    var colL = ({
                                        pos: circDrop.attr('index'),
                                        fill: "rgb" + 
                                        "(" + 
                                            Math.round(d3.rgb(d3.lab(newL,oldA,newB)).r) + "," + 
                                            Math.round(d3.rgb(d3.lab(newL,oldA,newB)).g) + "," + 
                                            Math.round(d3.rgb(d3.lab(newL,oldA,newB)).b) + 
                                        ")",
                                        RGB: [
                                            Math.round(d3.rgb(d3.lab(newL,oldA,newB)).r), 
                                            Math.round(d3.rgb(d3.lab(newL,oldA,newB)).g), 
                                            Math.round(d3.rgb(d3.lab(newL,oldA,newB)).b)
                                        ],
                                        LAB: [newL,oldA, newB],
                                        name:  nameDistribution(d3.lab(newL,oldA,newB)),
                                        sel: 1
                                    });                                    
                                }
                                else {
                                    for(i=0; i<colorDict.length; i++) {
                                        if(newL == colorDict[i].LAB[0]) {
                                            selColors.push(colorDict[i]);
                                            for(j=0; j<selColors.length; j++) {
                                                var localDist = Math.sqrt((selColors[j].lab[0] - newL)**2 + (selColors[j].lab[1] - oldA)**2 + (selColors[j].lab[2] - newB)**2);
                                                if(localDist < distDisplay) {
                                                    distDisplay = localDist;
                                                    distColor = selColors[j];
                                                }
                                            }
                                        }
                                    }

                                    // Update the color
                                    var colL = ({
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
                                plotData.splice(circDrop.attr('index'), 1, colL);     

                                // Draw Drop Color
                                var canWd = d3.select('rect.dropCanvas').attr('width');
                                var dropPos = circDrop.attr('index');
                                var dropX = dropPos * (canWd/paletteLen);
                                var dropWd = canWd/paletteLen;

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                drawPlot(plotData);
                            })
                        });
                        // .append("title")
                        // .text(function(d) { return "(" + coordmap[i][0] + "," + -coordmap[i][1] + ")"; })
        }
    }
    var x_coord_lb = d3.scaleLinear()
                .domain([0, 256])
                .range([0, 256]);
    svg_LABplots.append("g")
                .attr('class', 'plotAxes')
                .attr("transform", "translate(575," + (281) + ")") 
                .call(d3.axisBottom(x_coord_lb).tickValues([]));
    svg_LABplots.append("text")
                .attr('class', 'plotAxes')
                .attr("text-anchor", "end")
                .attr("x", 703)
                .attr("y", 301)
                .text("b");

    var y_coord_lb = d3.scaleLinear()
            .domain([0, 100])        
            .range([0, 256]);  

    svg_LABplots.append("g")
                .attr('class', 'plotAxes')
                .attr("transform", "translate(575," + (25) + ")")
                .call(d3.axisLeft(y_coord_lb).tickValues([]));
    svg_LABplots.append("text")
                .attr('class', 'plotAxes')
                .attr("text-anchor", "end")
                .attr("x", 560)
                .attr("y", 150)
                .text("L");

    drawPlot_Lb();
}

// COMPARISON AXES
function drawComp() {
    // Draw the X-Axis
    var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 350]);
    svg_linegraph.append('g')
                .attr('transform', 'translate(50,575)') 
                .call(d3.axisBottom(x).tickValues([]));
    svg_linegraph.append('text')
                .attr('text-anchor', 'end')
                .attr('x', 300)
                .attr('y', 600)
                .text('Lum Difference')

    // Draw the Y-Axis
    var y = d3.scaleLinear()
                .domain([0, 100])        
                .range([0, 350]);  
    svg_linegraph.append('g')
                .attr('transform', 'translate(50,225)')   
                .call(d3.axisLeft(y).tickValues([]));
    svg_linegraph.append('text')
                .attr('text-anchor', 'end')
                .attr('x', -350)
                .attr('y', 35)
                .attr('transform', 'rotate(-90)')
                .text('Perc Unif')
}

function scatter(valArr) {
    // CREATE SCATTERPLOT --> PU vs SMOOTHNESS
    svg_scatterPlot.selectAll('circle.scatCirc').remove();
    svg_scatterPlot.selectAll('text.scatText').remove();
    svg_scatterPlot.selectAll('text.finText').remove();

    var MinMaxPU = [];
    var MinMaxSmo = [];
    var MinMaxVal = [];

    for(i = 0; i < valArr.length; i++) {
        // Plotting of Scatterplot
        if(isNaN(valArr[i][0]) || isNaN(valArr[i][1]) || isNaN(valArr[i][2]) || isNaN(valArr[i][3])) {
            delete valArr[i];
        }
        else {
            MinMaxVal.push(valArr[i][0]);
            MinMaxPU.push(valArr[i][2]);
            MinMaxSmo.push(valArr[i][3]);
        }
    }

    // Smoothness v PU
    // Draw the X-Axis
    var x1 = d3.scaleLinear()
            .domain([Math.min(...MinMaxSmo), Math.max(...MinMaxSmo)])
            .range([0, 500]);
    svg_scatterPlot.append('g')
            .attr('transform', 'translate(50,425)') 
            .call(d3.axisBottom(x1).tickValues([]));
    svg_scatterPlot.append('text')
            .attr('class', 'scatText')
            .attr('text-anchor', 'end')
            .attr('x', 350)
            .attr('y', 450)
            .text('Smoothness')

    // Draw the Y-Axis
    var y1 = d3.scaleLinear()
            .domain([Math.min(...MinMaxPU), Math.max(...MinMaxPU)])        
            .range([400, 0]);

    var col1 = d3.scaleSequential()
                .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
                .interpolator(d3.interpolateReds);

    var rad1 = d3.scaleLinear()
                .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
                .range([2, 10]);

    svg_scatterPlot.append('g')
            .attr('transform', 'translate(50,25)')   
            .call(d3.axisLeft(y1).tickValues([]));
    svg_scatterPlot.append('text')
            .attr('class', 'scatText')
            .attr('text-anchor', 'end')
            .attr('x', -185)
            .attr('y', 35)
            .attr('transform', 'rotate(-90)')
            .text('Perc Unif')
    for(i = 0; i < valArr.length; i++) {
        svg_scatterPlot.append('circle')
                    .attr('class', 'scatCirc')
                    .attr('index', function() { return i; })
                    .attr('cx', function(d) { return x1(valArr[i][3]) + 50; } )
                    .attr('cy', function(d) { return y1(valArr[i][2]) + 25; } )
                    // .attr('r', 5)
                    .attr('r', function(d) { return rad1(valArr[i][0]); })
                    .attr('stroke', '#A8A8A8')
                    .attr('fill', function(d) { return col1(valArr[i][0])})
                    .on('mouseover', function() {
                        svg_scatterPlot.selectAll('text.finText').remove();
                        var idMap = d3.select(this).attr('index');
                        drawHelpermap(valArr[idMap][4]);
                        svg_scatterPlot.append('text')
                                    .attr('class', 'finText')
                                    .attr('text-anchor', 'end')
                                    .attr('x', 500)
                                    .attr('y', 475)
                                    .text('Final: ' + d3.format('.2f')(valArr[idMap][0]) + ', P.Uniformity: ' + d3.format('.2f')(valArr[idMap][2]) + ', Smoothness: ' + d3.format('.2f')(valArr[idMap][3]));
                    })
                    .append('title').text(function() { return valArr[i][0]; });
    }
}

function hist1(valArr) {
    // CREATE HISTOGRAM --> PU
    svg_histPlot1.selectAll('rect.hist1Rect').remove();
    svg_histPlot1.selectAll('text.hist1Text').remove();
    svg_histPlot1.selectAll('text.finh1Text').remove();
    svg_histPlot1.selectAll('text.tickh1Text').remove();

    var MinMaxND = [];

    console.log(valArr.length)

    for(i = 0; i < valArr.length; i++) {
        // Plotting of Scatterplot
        MinMaxND.push(valArr[i]);
    }

    // Draw the X-Axis
    var x_h1 = d3.scaleLinear()
                    .domain([Math.min(...MinMaxND), Math.max(...MinMaxND)])
                    .range([0, 500]);
    svg_histPlot1.append('g')
                .attr('transform', 'translate(50,650)') 
                .call(d3.axisBottom(x_h1).tickValues([]));
    svg_histPlot1.append('text')
                .attr('class', 'hist1Text')
                .attr('text-anchor', 'end')
                .attr('x', 350)
                .attr('y', 710)
                .text('ND')

    // Draw the Y-Axis
    var y_h1 = d3.scaleLinear()
                .domain([0, 500])    
                .range([625, 0]);
    svg_histPlot1.append('g')
            .attr('transform', 'translate(50,37.5)')   
            .call(d3.axisLeft(y_h1).tickValues([]));
    svg_histPlot1.append('text')
            .attr('class', 'hist1Text')
            .attr('text-anchor', 'end')
            .attr('x', -350)
            .attr('y', 35)
            .attr('transform', 'rotate(-90)')
            .text('Count')

    var col2 = d3.scaleSequential()
                .domain([Math.min(...MinMaxND) * 10, Math.max(...MinMaxND)])  
                .interpolator(d3.interpolateBlues);

    var hist1_count = {};
    for(i = 0; i < valArr.length; i++) {
        ndVal = Math.round(valArr[i] * 100)/100;
        hist1_count[ndVal] = (hist1_count[ndVal]||0) + 1;
    }

    var lenND = Object.keys(hist1_count).length
    var minND = (Object.keys(hist1_count))[0]
    var maxND = Object.keys(hist1_count)[lenND - 1]

    for(var j=0; j<lenND; j++) {
        svg_histPlot1.append('rect')
                .attr('class', 'hist1Rect')
                .attr('x', 50 + (j*(500/lenND)))
                .attr('y', 650 - Object.values(hist1_count)[j] * 15)
                .attr('width', 500/lenND)
                .attr('height', Object.values(hist1_count)[j] * 15)
                .attr('fill', function() { return col2(Object.values(hist1_count)[j]); })
                .attr('stroke', 'black')
                .attr('stroke-width', 0.15);
        svg_histPlot1.append('text')
                .attr('class', 'finh1Text')
                .attr('x', 50 + (j*(500/lenND)))
                .attr('y', 650 - 10 - Object.values(hist1_count)[j] * 15)
                .style('font-size', '10px')
                .text(Object.values(hist1_count)[j]);
        svg_histPlot1.append('text')
                .attr('class', 'tickh1Text')
                .attr('x', -687.5)
                .attr('y', 60 + (j*(500/lenND)))
                .style('font-size', '10px')
                .attr('transform', 'rotate(-90)')
                .text(Object.keys(hist1_count)[j]);
    }
}

// function hist2(valArr) {
//     // CREATE HISTOGRAM --> SMOOTHNESS
//     svg_histPlot2.selectAll('rect.hist2Rect').remove();
//     svg_histPlot2.selectAll('text.hist2Text').remove();
//     svg_histPlot2.selectAll('text.finh2Text').remove();
//     svg_histPlot2.selectAll('text.tickh2Text').remove();

//     var MinMaxPU = [];
//     var MinMaxSmo = [];
//     var MinMaxVal = [];

//     for(i = 0; i < valArr.length; i++) {
//         // Plotting of Scatterplot
//         if(isNaN(valArr[i][0]) || isNaN(valArr[i][1]) || isNaN(valArr[i][2]) || isNaN(valArr[i][3])) {
//             delete valArr[i];
//         }
//         else {
//             MinMaxVal.push(valArr[i][0]);
//             MinMaxPU.push(valArr[i][2]);
//             MinMaxSmo.push(valArr[i][3]);
//         }
//     }

//     // Draw the X-Axis
//     var x_h2 = d3.scaleLinear()
//                     .domain([Math.min(...MinMaxSmo), Math.max(...MinMaxSmo)])
//                     .range([0, 500]);
//     svg_histPlot2.append('g')
//                 .attr('transform', 'translate(50,650)') 
//                 .call(d3.axisBottom(x_h2).tickValues([]));
//     svg_histPlot2.append('text')
//                 .attr('class', 'hist2Text')
//                 .attr('text-anchor', 'end')
//                 .attr('x', 350)
//                 .attr('y', 710)
//                 .text('Smoothness')

//     // Draw the Y-Axis
//     var y_h2 = d3.scaleLinear()
//                 .domain([0, 500])    
//                 .range([625, 0]);
//     svg_histPlot2.append('g')
//             .attr('transform', 'translate(50,37.5)')   
//             .call(d3.axisLeft(y_h2).tickValues([]));
//     svg_histPlot2.append('text')
//             .attr('class', 'hist2Text')
//             .attr('text-anchor', 'end')
//             .attr('x', -350)
//             .attr('y', 35)
//             .attr('transform', 'rotate(-90)')
//             .text('Count')

//     var col3 = d3.scaleSequential()
//                 .domain([Math.min(...MinMaxSmo) * 250, Math.max(...MinMaxSmo)])  
//                 .interpolator(d3.interpolateGreens);

//     var hist2_temp = {};
//     var sort_hist2 = [];
//     for(i = 0; i < valArr.length; i++) {
//         smoVal = Math.round(valArr[i][3] * 1000)/1000;
//         hist2_temp[smoVal] = (hist2_temp[smoVal]||0) + 1;
//     }

//     for(var key in hist2_temp) {
//         sort_hist2[sort_hist2.length] = key;
//     }
//     sort_hist2.sort();

//     var hist2_count = {};
//     for(var i = 0; i < sort_hist2.length; i++) {
//         hist2_count[sort_hist2[i]] = hist2_temp[sort_hist2[i]];
//     }

//     var lenSmo = Object.keys(hist2_count).length
//     var minSmo = (Object.keys(hist2_count))[0]
//     var maxSmo = Object.keys(hist2_count)[lenSmo - 1]

//     for(var j=0; j<lenSmo; j++) {
//         svg_histPlot2.append('rect')
//                 .attr('class', 'hist2Rect')
//                 .attr('x', 50 + (j*(500/lenSmo)))
//                 .attr('y', 650 - Object.values(hist2_count)[j]/1.5)
//                 .attr('width', 500/lenSmo)
//                 .attr('height', Object.values(hist2_count)[j]/1.5)
//                 .attr('fill', function() { return col3(Object.values(hist2_count)[j]); })
//                 .attr('stroke', 'black')
//                 .attr('stroke-width', 0.15);
//     svg_histPlot2.append('text')
//                 .attr('class', 'finh2Text')
//                 .attr('x', 50 + (j*(500/lenSmo)))
//                 .attr('y', 650 - 10 - Object.values(hist2_count)[j]/1.5)
//                 .style('font-size', '10px')
//                 .text(Object.values(hist2_count)[j]);
//     svg_histPlot2.append('text')
//                 .attr('class', 'tickh2Text')
//                 .attr('x', -687.5)
//                 .attr('y', 60 + (j*(500/lenSmo)))
//                 .style('font-size', '10px')
//                 .attr('transform', 'rotate(-90)')
//                 .text(Object.keys(hist2_count)[j]);
//     }
// }
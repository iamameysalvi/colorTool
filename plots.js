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
        // // Colornames
        // for(i = 0; i < plotData.length ; i++) {
        //     svg_LABplots.append('text')
        //                 .attr('class', 'textGraphAB')
        //                 .attr('index', function() { return i; })
        //                 .attr('x', plotData[i].LAB[1] + 165)
        //                 .attr('y', plotData[i].LAB[2] + 153)
        //                 .text(plotData[i].name)
        //                 .style('font-size', '15px')
        //                 .raise();
        // }
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
                            // // Search Function
                            // svg_LABplots.append('rect')
                            //             .attr('class', 'plotSearch')
                            //             .attr('x', circDrop.attr('cx'))
                            //             .attr('y', circDrop.attr('cy'))
                            //             .attr('width', 150)
                            //             .attr('height', 35)
                            //             .style('fill', 'cyan');

                            // Draw CIELAB Space Image
                            // svg_LABplots.append("image")
                            //             .attr('class', 'labImage')
                            //             .attr('x', 25)
                            //             .attr('y', 25)
                            //             .attr('width', 256)
                            //             .attr('height', 256)
                            //             .attr("xlink:href", "download.png")
                            //             .attr('opacity', 0.3);

                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                svg_LABplots.selectAll('text.textGraphAB').remove();
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

                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    lab: oldL + "," + newA + "," + newB,
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(oldL,newA,newB)).r + "," + d3.rgb(d3.lab(oldL,newA,newB)).g + "," + d3.rgb(d3.lab(oldL,newA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(oldL,newA,newB)).r, d3.rgb(d3.lab(oldL,newA,newB)).g, d3.rgb(d3.lab(oldL,newA,newB)).b],
                                    LAB: [oldL,newA, newB],
                                    name:  nameDistribution(d3.lab(oldL,newA, newB)),
                                    sel: 0
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Draw Slice
                                svg_LABplots.selectAll("circle.slice").remove();
                                // var lumVal = 5 * Math.round((100 - (((circY - 25)/(255)) * 100))/5);
                                for (var c=0; c<color_dict.length; c++) {
                                    var salVal = color_dict[c].saliency;
                                    var LABval = color_dict[c].lab;
                                    var fillColor = color_dict[c].fill;
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

                                // Update Color L*
                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    lab: oldL + "," + newA + "," + newB,
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(oldL,newA,newB)).r + "," + d3.rgb(d3.lab(oldL,newA,newB)).g + "," + d3.rgb(d3.lab(oldL,newA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(oldL,newA,newB)).r, d3.rgb(d3.lab(oldL,newA,newB)).g, d3.rgb(d3.lab(oldL,newA,newB)).b],
                                    LAB: [oldL,newA, newB],
                                    name: nameDistribution(d3.lab(oldL,newA, newB)),
                                    sel: 1
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);
                                
                                // Draw Drop Color
                                var canWd = d3.select('rect.dropCanvas').attr('width');
                                var dropPos = circDrop.attr('index');
                                var dropX = dropPos * (canWd/paletteLen);
                                var dropWd = canWd/paletteLen;

                                drawDropCol(dropX, dropWd, colL);

                                // Call initPos Function
                                initMultPos(circDrop.attr('index'), colL);

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
        // // Colornames
        // for(i = 0; i < plotData.length ; i++) {
        //     svg_LABplots.append('text')
        //                 .attr('class', 'textGraphLA')
        //                 .attr('index', function() { return i; })
        //                 .attr('x', plotData[i].LAB[1] + 440)
        //                 .attr('y', -plotData[i].LAB[0]*2.56 + 275)
        //                 .text(plotData[i].name)
        //                 .style('font-size', '15px')
        //                 .raise();
        // }
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
                                for (var c=0; c<color_dict.length; c++) {
                                    var salVal = color_dict[c].saliency;
                                    var LABval = color_dict[c].lab;
                                    var fillColor = color_dict[c].fill;
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
                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    lab: newL + "," + newA + "," + oldB,
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,newA,oldB)).r + "," + d3.rgb(d3.lab(newL,newA,oldB)).g + "," + d3.rgb(d3.lab(newL,newA,oldB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,newA,oldB)).r, d3.rgb(d3.lab(newL,newA,oldB)).g, d3.rgb(d3.lab(newL,newA,oldB)).b],
                                    LAB: [newL,newA, oldB],
                                    name:  nameDistribution(d3.lab(newL,newA, oldB)),
                                    sel: 0
                                });
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

                                // // Update Colornames
                                // svg_LABplots.append('text')
                                //             .attr('class', 'textGraphLA')
                                //             .attr('index', function() { return i; })
                                //             .attr('x', newA + 440)
                                //             .attr('y', -newL*2.56 + 275)
                                //             .text(colL.name)
                                //             .style('font-size', '15px')
                                //             .raise();

                                // drawColormap(plotData);
                                // drawLinegraph(plotData);
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
                                var newA = circX - 428;
                                // var oldA = plotData[circDrop.attr('index')].LAB[1];
                                var oldB = plotData[circDrop.attr('index')].LAB[2];

                                // Update Color L*
                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    lab: newL + "," + newA + "," + oldB,
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,newA,oldB)).r + "," + d3.rgb(d3.lab(newL,newA,oldB)).g + "," + d3.rgb(d3.lab(newL,newA,oldB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,newA,oldB)).r, d3.rgb(d3.lab(newL,newA,oldB)).g, d3.rgb(d3.lab(newL,newA,oldB)).b],
                                    LAB: [newL,newA, oldB],
                                    name:  nameDistribution(d3.lab(newL,newA, oldB)),
                                    sel: 1
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Draw Drop Color
                                var canWd = d3.select('rect.dropCanvas').attr('width');
                                var dropPos = circDrop.attr('index');
                                var dropX = dropPos * (canWd/paletteLen);
                                var dropWd = canWd/paletteLen;

                                drawDropCol(dropX, dropWd, colL);

                                // Call initPos Function
                                initMultPos(circDrop.attr('index'), colL);

                                // drawColormap(plotData);
                                // drawLinegraph(plotData);
                                // drawPlot(plotData);
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
        // // Colornames
        // for(i = 0; i < plotData.length ; i++) {
        //     svg_LABplots.append('text')
        //                 .attr('class', 'textGraphLB')
        //                 .attr('index', function() { return i; })
        //                 .attr('x', plotData[i].LAB[2] + 715)
        //                 .attr('y', -plotData[i].LAB[0]*2.56 + 275)
        //                 .text(plotData[i].name)
        //                 .style('font-size', '15px')
        //                 .raise();
        // }
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
                                for (var c=0; c<color_dict.length; c++) {
                                    var salVal = color_dict[c].saliency;
                                    var LABval = color_dict[c].lab;
                                    var fillColor = color_dict[c].fill;
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
                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    lab: newL + "," + oldA + "," + newB,
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,newB)).r + "," + d3.rgb(d3.lab(newL,oldA,newB)).g + "," + d3.rgb(d3.lab(newL,oldA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,oldA,newB)).r, d3.rgb(d3.lab(newL,oldA,newB)).g, d3.rgb(d3.lab(newL,oldA,newB)).b],
                                    LAB: [newL,oldA, newB],
                                    name:  nameDistribution(d3.lab(newL,oldA, newB)),
                                    sel: 0
                                });
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

                                // // Update Colornames
                                // svg_LABplots.append('text')
                                //             .attr('class', 'textGraphLB')
                                //             .attr('index', function() { return i; })
                                //             .attr('x', newB + 715)
                                //             .attr('y', -newL*2.56 + 275)
                                //             .text(colL.name)
                                //             .style('font-size', '15px')
                                //             .raise();

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

                                // Update Color L*
                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    lab: newL + "," + oldA + "," + newB,
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,newB)).r + "," + d3.rgb(d3.lab(newL,oldA,newB)).g + "," + d3.rgb(d3.lab(newL,oldA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,oldA,newB)).r, d3.rgb(d3.lab(newL,oldA,newB)).g, d3.rgb(d3.lab(newL,oldA,newB)).b],
                                    LAB: [newL,oldA, newB],
                                    name:  nameDistribution(d3.lab(newL,oldA, newB)),
                                    sel: 1
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);     

                                // Draw Drop Color
                                var canWd = d3.select('rect.dropCanvas').attr('width');
                                var dropPos = circDrop.attr('index');
                                var dropX = dropPos * (canWd/paletteLen);
                                var dropWd = canWd/paletteLen;

                                drawDropCol(dropX, dropWd, colL);

                                // Call initPos Function
                                initMultPos(circDrop.attr('index'), colL);

                                // // Post Message in Worker
                                // myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], plotData, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD, colRadio] });
                                // myWorker.onmessage = function(e) {
                                //     drawColormap(e.data[0]);
                                //     drawLinegraph(e.data[0]);
                                //     // drawScatter(e.data[1]);
                                //     drawPlot(e.data[0]);
                                //     loader.style.visibility = "hidden";
                                // }

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


function drawScatter(scatData) {
    svg_helpgraph.selectAll('circle.scatCirc').remove();
    svg_helpgraph.selectAll('text.scatText').remove();
    svg_helpgraph.selectAll('text.finText').remove();
    svg_helpAllgraph.selectAll('circle.scatCirc').remove();
    svg_helpAllgraph.selectAll('text.scatText').remove();
    svg_helpAllgraph.selectAll('text.finText').remove();

    var MinMaxPU = [];
    var MinMaxSmo = [];
    var MinMaxVal = [];
    var valScat = scatData.slice(0,1834);
    for(i = 0; i < valScat.length; i++) { 
        MinMaxPU.push(valScat[i][2]);
        MinMaxSmo.push(valScat[i][3]);
        MinMaxVal.push(valScat[i][0]);
    }

    // LD v PU
    // Draw the X-Axis
    var x1 = d3.scaleLinear()
            .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])
            .range([0, 900]);
    svg_helpgraph.append('g')
            .attr('transform', 'translate(50,225)') 
            .call(d3.axisBottom(x1).tickValues([]));
    svg_helpgraph.append('text')
            .attr('class', 'scatText')
            .attr('text-anchor', 'end')
            .attr('x', 500)
            .attr('y', 250)
            .text('Final Score')

    // Draw the Y-Axis
    var y1 = d3.scaleLinear()
            .domain([Math.min(...MinMaxPU), Math.max(...MinMaxPU)])        
            .range([200, 0]);

    var col1 = d3.scaleSequential()
                .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
                .interpolator(d3.interpolateBlues);

    svg_helpgraph.append('g')
            .attr('transform', 'translate(50,25)')   
            .call(d3.axisLeft(y1).tickValues([]));
    svg_helpgraph.append('text')
            .attr('class', 'scatText')
            .attr('text-anchor', 'end')
            .attr('x', -75)
            .attr('y', 35)
            .attr('transform', 'rotate(-90)')
            .text('Perc Unif')
    for(i = 0; i < valScat.length; i++) {
        svg_helpgraph.append('circle')
                    .attr('class', 'scatCirc')
                    .attr('index', function() { return i; })
                    .attr('cx', function(d) { return x1(valScat[i][0]) + 50; } )
                    .attr('cy', function(d) { return y1(valScat[i][2]) + 25; } )
                    .attr('r', 5)
                    .attr('stroke', '#A8A8A8')
                    .attr('fill', function(d) { return col1(valScat[i][0])})
                    .on('mouseover', function() {
                        svg_helpgraph.selectAll('text.finText').remove();
                        var idMap = d3.select(this).attr('index');
                        drawHelpermap(valScat[idMap][4]);
                        svg_helpgraph.append('text')
                                    .attr('class', 'finText')
                                    .attr('text-anchor', 'end')
                                    .attr('x', 400)
                                    .attr('y', 20)
                                    .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', P.Uniformity: ' + d3.format('.2f')(valScat[idMap][2]));
                    })
                    .append('title').text(function() { return valScat[i][0]; });
    }


    // LD v SMO
    // Draw the X-Axis
    var x2 = d3.scaleLinear()
            .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])
            .range([0, 900]);
    svg_helpgraph.append('g')
            .attr('transform', 'translate(50,475)') 
            .call(d3.axisBottom(x2).tickValues([]));
    svg_helpgraph.append('text')
            .attr('class', 'scatText')
            .attr('text-anchor', 'end')
            .attr('x', 500)
            .attr('y', 500)
            .text('Final Score')

    // Draw the Y-Axis
    var y2 = d3.scaleLinear()
            .domain([Math.min(...MinMaxSmo), Math.max(...MinMaxSmo)])        
            .range([200, 0]);

    var col2 = d3.scaleSequential()
                .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
                .interpolator(d3.interpolateReds);

    svg_helpgraph.append('g')
            .attr('transform', 'translate(50,275)')   
            .call(d3.axisLeft(y2).tickValues([]));
    svg_helpgraph.append('text')
            .attr('class', 'scatText')
            .attr('text-anchor', 'end')
            .attr('x', -325)
            .attr('y', 35)
            .attr('transform', 'rotate(-90)')
            .text('Smoothness')
    for(i = 0; i < valScat.length; i++) {
        svg_helpgraph.append('circle')
                    .attr('class', 'scatCirc')
                    .attr('index', function() { return i; })
                    .attr('cx', function(d) { return x2(valScat[i][0]) + 50; } )
                    .attr('cy', function(d) { return y2(valScat[i][3]) + 275; } )
                    .attr('r', 5)
                    .attr('stroke', '#A8A8A8')
                    .attr('fill', function(d) { return col2(valScat[i][0])})
                    .on('mouseover', function() {
                        svg_helpgraph.selectAll('text.finText').remove();
                        var idMap = d3.select(this).attr('index');
                        drawHelpermap(valScat[idMap][4]);
                        svg_helpgraph.append('text')
                                    .attr('class', 'finText')
                                    .attr('text-anchor', 'end')
                                    .attr('x', 400)
                                    .attr('y', 20)
                                    .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', Smoothness: ' + d3.format('.2f')(valScat[idMap][3]));
                    })
                    .append('title').text(function() { return valScat[i][0]; });
    }
}
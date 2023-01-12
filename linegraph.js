// LINEGRAPH AXES
function drawAxes() {
    // Draw the X-Axis
    var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 1000]);
    svg_linegraph.append('g')
                .attr('transform', 'translate(0,175)') 
                .call(d3.axisBottom(x).tickValues([]));
    svg_linegraph.append('text')
                .attr('text-anchor', 'end')
                .attr('x', 525)
                .attr('y', 200)
                .text('Color')

    // Draw the Y-Axis
    var y = d3.scaleLinear()
                .domain([100, 0])        
                .range([0, 150]);  
    svg_linegraph.append('g')
                .attr('transform', 'translate(0,25)')   
                .call(d3.axisLeft(y).tickValues([]));
}

// LINE GRAPHS: Luminance, Saliency, Name Difference, Eucledian Distance, CIE00 Distance
function drawLinegraph(data) {
    // // Get Value of Button
    // var valBtn = document.getElementById('lineButton').value;

    // Remove Path on Update
    svg_linegraph.selectAll('path.lineGraph').remove();
    svg_linegraph.selectAll('circle.lineCircle').remove();

    // Initiaization
    var W = 1000;
    var H = 150;
    var samples = data.length;

    // Draw Line Curves
    var lineGen =  d3.line()
                     .x (function(d) { return (d.x * W); })
                     .y (function(d) { return ((1-d.y) * H) + 25; })

    // LUMINANCE
    var lumCurve = [], maxLum = 100.0;
    for (var s = 0; s < samples; s++) {
        var xLum = s/(samples-1);
        var cLum = d3.lab(colormap.mapValue(xLum));
        
        var Lum = 5 * Math.round(cLum.l/5);
        lumCurve.push({
            x: xLum,
            y: Lum/maxLum
        });
        // console.log(lumCurve);
    }
    // LUMINANCE PROFILE OUTLINE
    var lumOutline = [], maxLum = 100.0;
    for (var s = 0; s < 3; s++) {
        var xLum = s/2;
        if(selLum == "Linear") {
            var cLum = [0, 50, 100];
        }
        else if(selLum == "Diverging") {
            var cLum = [0, 100, 0];
        }
        
        var Lum = cLum[s];
        lumOutline.push({
            x: xLum,
            y: Lum/maxLum
        });
    }
    // Draw Luminance Curve
    if(valBtn == 'Luminance') {
        // Luminance Profile Outline
        var lumOutPath;
        lumOutPath = svg_linegraph.append('path')
                                .attr('class', 'lineGraph')
                                .attr('d', lineGen(lumOutline))
                                .style('fill', 'none')
                                .style('stroke', '#3F3F3F')
                                .style('stroke-width', '1px');
        // Luminance
        var lumPath;
        lumPath = svg_linegraph.append('path')
                                .attr('class', 'lineGraph')
                                .attr('d', lineGen(lumCurve))
                                .style('fill', 'none')
                                .style('stroke', '#ED335F')
                                .style('stroke-width', '2px');
        for (var s = 0; s < samples; s++) {
            lumCircle = svg_linegraph.append('circle')
                                    .attr('class', 'lineCircle')
                                    .attr('index', function() { return s; })
                                    .attr('cx', lumCurve[s].x * 1000)
                                    .attr('cy', 175 - (lumCurve[s].y * 150))
                                    .attr('r', 4)
                                    .style('fill', '#FFF')
                                    .style('stroke', '#ED335F')
                                    .style('stroke-width', 1)
                                    .on('mousedown', function() {
                                        var circDrop = d3.select(this);
                                        // Change Border Thickness
                                        circDrop.style('stroke-width', 5);
                                        var circY = 0;

                                        // Move Rectangle
                                        d3.select(document).on('mousemove', function() {
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
                                            else if(newMouse[1] > 175) {
                                                circDrop.attr('cy', 175);
                                                circY = 175;
                                            }
                                            else {
                                                // Center
                                                circDrop.attr('cy', newMouse[1]);
                                                circY = newMouse[1];
                                            }

                                            // Update Color L*
                                            var newL = 5 * Math.round((100 - (((circY - 25)/(150)) * 100))/5);
                                            var oldA = data[circDrop.attr('index')].LAB[1];
                                            var oldB = data[circDrop.attr('index')].LAB[2];
                                            var colL = ({
                                                pos: circDrop.attr('index'),
                                                fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,oldB)).r + "," + d3.rgb(d3.lab(newL,oldA,oldB)).g + "," + d3.rgb(d3.lab(newL,oldA,oldB)).b + ")",
                                                RGB: [d3.rgb(d3.lab(newL,oldA,oldB)).r, d3.rgb(d3.lab(newL,oldA,oldB)).g, d3.rgb(d3.lab(newL,oldA,oldB)).b],
                                                LAB: [newL,oldA, oldB],
                                                sel: 0
                                            });
                                            data.splice(circDrop.attr('index'), 1, colL);

                                            drawColormap(data);
                                            drawPlot(data);
                                        })

                                        d3.select(document).on('mouseup', function() {
                                            // Change Border Thickness
                                            circDrop.style('stroke-width', 1);
                                            // Stop Mouse Events
                                            d3.select(document)
                                                .on('mousemove', null)
                                                .on('mouseup', null);
                                            
                                            // Formula for mapping to [0,100]
                                            var newL = 5 * Math.round((100 - (((circY - 25)/(150)) * 100))/5);
                                            var oldA = data[circDrop.attr('index')].LAB[1];
                                            var oldB = data[circDrop.attr('index')].LAB[2];

                                            // Update Color L*
                                            var colL = ({
                                                pos: circDrop.attr('index'),
                                                fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,oldB)).r + "," + d3.rgb(d3.lab(newL,oldA,oldB)).g + "," + d3.rgb(d3.lab(newL,oldA,oldB)).b + ")",
                                                RGB: [d3.rgb(d3.lab(newL,oldA,oldB)).r, d3.rgb(d3.lab(newL,oldA,oldB)).g, d3.rgb(d3.lab(newL,oldA,oldB)).b],
                                                LAB: [newL,oldA, oldB],
                                                sel: 0
                                            });
                                            data.splice(circDrop.attr('index'), 1, colL);     

                                            drawColormap(data);
                                            drawLinegraph(data);
                                            drawPlot(data);
                                        })
                                    });
        }
    }

    // SALIENCY
    var salCurve = [], maxSal = 1.0;
    var totSal = 0;
    for (var s = 0; s < samples; s++) {
        var xSal = s/(samples-1);
        var cSal = d3.color(colormap.mapValue(xSal));

        var Sal = nameSalience(cSal);
        salCurve.push({
            x: xSal,
            y: Sal/maxSal
        })
        totSal = totSal + Sal;
    }
    // Draw Saliency Curve
    if(valBtn == 'Saliency') {
        var salPath;
        salPath = svg_linegraph.append('path')
                                .attr('class', 'lineGraph')
                                .attr('d', lineGen(salCurve))
                                .style('fill', 'none')
                                .style('stroke', '#ED335F')
                                .style('stroke-width', '2px');
        for (var s = 0; s < samples; s++) {
            salCircle = svg_linegraph.append('circle')
                                    .attr('class', 'lineCircle')
                                    .attr('index', function() { return s; })
                                    .attr('cx', salCurve[s].x * 1000)
                                    .attr('cy', 175 - (salCurve[s].y * 150))
                                    .attr('r', 4)
                                    .style('fill', '#FFF')
                                    .style('stroke', '#ED335F')
                                    .style('stroke-width', 1);
        }
    }

    // NAME DIFFERENCE
    var nameCurve = [], maxName = [];
    var totName = 0;
    for (var s = 1; s < samples; s++) {
        var xName2 = s/(samples-1);
        var xName1 = (s-1)/(samples-1);
        var cName2 = d3.color(colormap.mapValue(xName2));
        var cName1 = d3.color(colormap.mapValue(xName1));

        var Name = nameDifference(cName2, cName1);
        maxName.push(Name);
        var maxNameDiff = maxName.reduce(function(a, b) {
                    return Math.max(a, b);
                }, 0);
        nameCurve.push({
            x: xName2,
            y: Name/maxNameDiff
        });
        totName = totName + Name;
    }
    // Draw Name Difference Curve
    if(valBtn == 'Name Difference') {
        var namePath;
        namePath = svg_linegraph.append('path')
                            .attr('class', 'lineGraph')
                            .attr('d', lineGen(nameCurve))
                            .style('fill', 'none')
                            .style('stroke', '#ED335F')
                            .style('stroke-width', '2px');
        for (var s = 0; s < samples; s++) {
            nameCircle = svg_linegraph.append('circle')
                                    .attr('class', 'lineCircle')
                                    .attr('index', function() { return s; })
                                    .attr('cx', nameCurve[s].x * 1000)
                                    .attr('cy', 175 - (nameCurve[s].y * 150))
                                    .attr('r', 4)
                                    .style('fill', '#FFF')
                                    .style('stroke', '#ED335F')
                                    .style('stroke-width', 1)
                                    .on('mousedown', function() {
                                        var circDrop = d3.select(this);
                                        // Change Border Thickness
                                        circDrop.style('stroke-width', 5);
                                        var circY = 0;

                                        // Move Rectangle
                                        d3.select(document).on('mousemove', function() {
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
                                            else if(newMouse[1] > 175) {
                                                circDrop.attr('cy', 175);
                                                circY = 175;
                                            }
                                            else {
                                                // Center
                                                circDrop.attr('cy', newMouse[1]);
                                                circY = newMouse[1];
                                            }

                                            // Update Color ND
                                            
                                            // var newL = 5 * Math.round((100 - (((circY - 25)/(150)) * 100))/5);
                                            // var oldA = data[circDrop.attr('index')].LAB[1];
                                            // var oldB = data[circDrop.attr('index')].LAB[2];
                                            var colL = ({
                                                pos: circDrop.attr('index'),
                                                fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,oldB)).r + "," + d3.rgb(d3.lab(newL,oldA,oldB)).g + "," + d3.rgb(d3.lab(newL,oldA,oldB)).b + ")",
                                                RGB: [d3.rgb(d3.lab(newL,oldA,oldB)).r, d3.rgb(d3.lab(newL,oldA,oldB)).g, d3.rgb(d3.lab(newL,oldA,oldB)).b],
                                                LAB: [newL,oldA, oldB],
                                                name:  nameDistribution(d3.lab(newL,oldA, oldB)),
                                                sel: 0
                                            });
                                            data.splice(circDrop.attr('index'), 1, colL);

                                            drawColormap(data);
                                        })

                                        d3.select(document).on('mouseup', function() {
                                            // Change Border Thickness
                                            circDrop.style('stroke-width', 1);
                                            // Stop Mouse Events
                                            d3.select(document)
                                                .on('mousemove', null)
                                                .on('mouseup', null);
                                            
                                            // Formula for mapping to [0,100]
                                            var newL = 5 * Math.round((100 - (((circY - 25)/(150)) * 100))/5);
                                            var oldA = data[circDrop.attr('index')].LAB[1];
                                            var oldB = data[circDrop.attr('index')].LAB[2];

                                            // Update Color L*
                                            var colL = ({
                                                pos: circDrop.attr('index'),
                                                fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,oldB)).r + "," + d3.rgb(d3.lab(newL,oldA,oldB)).g + "," + d3.rgb(d3.lab(newL,oldA,oldB)).b + ")",
                                                RGB: [d3.rgb(d3.lab(newL,oldA,oldB)).r, d3.rgb(d3.lab(newL,oldA,oldB)).g, d3.rgb(d3.lab(newL,oldA,oldB)).b],
                                                LAB: [newL,oldA, oldB],
                                                name:  nameDistribution(d3.lab(newL,oldA, oldB)),
                                                sel: 0
                                            });
                                            data.splice(circDrop.attr('index'), 1, colL);     

                                            drawColormap(data);
                                            drawLinegraph(data);
                                        })
                                    });
        }
    }

    // SATURATION
    var satCurve = [], maxSat = 1.0;
    var totSat = 0;
    for (var s = 0; s < samples; s++) {
        var xSat = s/(samples-1);
        var cSat = d3.color(colormap.mapValue(xSal));

        var Sat = d3.hsl(cSat).s;

        satCurve.push({
            x: xSat,
            y: Sat/maxSat
        })
        totSat = totSat + Sat;
    }
    // Draw Saliency Curve
    if(valBtn == 'Saturation') {
        var satPath;
        satPath = svg_linegraph.append('path')
                                .attr('class', 'lineGraph')
                                .attr('d', lineGen(satCurve))
                                .style('fill', 'none')
                                .style('stroke', '#ED335F')
                                .style('stroke-width', '2px');
        for (var s = 0; s < samples; s++) {
            satCircle = svg_linegraph.append('circle')
                                    .attr('class', 'lineCircle')
                                    .attr('index', function() { return s; })
                                    .attr('cx', satCurve[s].x * 1000)
                                    .attr('cy', 175 - (satCurve[s].y * 150))
                                    .attr('r', 4)
                                    .style('fill', '#FFF')
                                    .style('stroke', '#ED335F')
                                    .style('stroke-width', 1)
                                    .on('mousedown', function() {
                                        var circDrop = d3.select(this);
                                        // Change Border Thickness
                                        circDrop.style('stroke-width', 5);
                                        var circY = 0;

                                        // Move Rectangle
                                        d3.select(document).on('mousemove', function() {
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
                                            else if(newMouse[1] > 175) {
                                                circDrop.attr('cy', 175);
                                                circY = 175;
                                            }
                                            else {
                                                // Center
                                                circDrop.attr('cy', newMouse[1]);
                                                circY = newMouse[1];
                                            }

                                            // Update Color Saturation
                                            var newSat = (Math.round((100 - (((circY - 25)/(150)) * 100)))) / 100;
                                            var oldH = d3.hsl(d3.lab(data[circDrop.attr('index')].LAB[0], data[circDrop.attr('index')].LAB[1], data[circDrop.attr('index')].LAB[2])).h;
                                            var oldL = d3.hsl(d3.lab(data[circDrop.attr('index')].LAB[0], data[circDrop.attr('index')].LAB[1], data[circDrop.attr('index')].LAB[2])).l;

                                            // var oldB = d3.hsl(d3.lab(data[circDrop.attr('index')].LAB[0], data[circDrop.attr('index')].LAB[1], data[circDrop.attr('index')].LAB[2]));

                                            // console.log(d3.lab(d3.hsl(oldH,newSat,oldL)));
                                            var colL = ({
                                                pos: circDrop.attr('index'),
                                                fill: "rgb" + "(" + Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).r) + "," + Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).g) + "," + Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).b) + ")",
                                                RGB: [Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).r), Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).g), Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).b)],
                                                LAB: [Math.round(d3.lab(d3.hsl(oldH,newSat,oldL)).l), Math.round(d3.lab(d3.hsl(oldH,newSat,oldL)).a), Math.round(d3.lab(d3.hsl(oldH,newSat,oldL)).b)],
                                                name:  nameDistribution(d3.lab(d3.hsl(oldH,newSat,oldL))),
                                                sel: 0
                                            });
                                            data.splice(circDrop.attr('index'), 1, colL);

                                            drawColormap(data);
                                            drawPlot(data);
                                        })

                                        d3.select(document).on('mouseup', function() {
                                            // Change Border Thickness
                                            circDrop.style('stroke-width', 1);
                                            // Stop Mouse Events
                                            d3.select(document)
                                                .on('mousemove', null)
                                                .on('mouseup', null);
                                            
                                            // Formula for mapping to [0,100]
                                            var newSat = (Math.round((100 - (((circY - 25)/(150)) * 100)))) / 100;
                                            var oldH = d3.hsl(d3.lab(data[circDrop.attr('index')].LAB[0], data[circDrop.attr('index')].LAB[1], data[circDrop.attr('index')].LAB[2])).h;
                                            var oldL = d3.hsl(d3.lab(data[circDrop.attr('index')].LAB[0], data[circDrop.attr('index')].LAB[1], data[circDrop.attr('index')].LAB[2])).l;

                                            // Update Color Saturation
                                            var colL = ({
                                                pos: circDrop.attr('index'),
                                                fill: "rgb" + "(" + Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).r) + "," + Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).g) + "," + Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).b) + ")",
                                                RGB: [Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).r), Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).g), Math.round(d3.rgb(d3.hsl(oldH,newSat,oldL)).b)],
                                                LAB: [Math.round(d3.lab(d3.hsl(oldH,newSat,oldL)).l), Math.round(d3.lab(d3.hsl(oldH,newSat,oldL)).a), Math.round(d3.lab(d3.hsl(oldH,newSat,oldL)).b)],
                                                name:  nameDistribution(d3.lab(d3.hsl(oldH,newSat,oldL))),
                                                sel: 0
                                            });
                                            data.splice(circDrop.attr('index'), 1, colL);     

                                            // console.log(data);

                                            drawColormap(data);
                                            drawLinegraph(data);
                                            drawPlot(data);
                                        })
                                    });
        }
    }

    // // CIE76 DISTANCE CURVE
    // var cie76Curve = [], max76Dist = [];
    // for (var s = 1; s < samples; s++) {
    //     var x76Dist2 = s/(samples-1);
    //     var x76Dist1 = (s-1)/(samples-1);
    //     var c76Dist2 = c3.color[index(d3.color(colormap.mapValue(x76Dist2)))];
    //     var c76Dist1 = c3.color[index(d3.color(colormap.mapValue(x76Dist1)))];

    //     var cie76Dist = cie76Distance(c76Dist2, c76Dist1);
    //     max76Dist.push(cie76Dist);
    //     var maxDist76 = max76Dist.reduce(function(a, b) {
    //                 return Math.max(a, b);
    //             }, 0);
    //     cie76Curve.push({
    //         x: x76Dist2,
    //         y: cie76Dist/maxDist76
    //     });
    // }
    // // Draw CIE76 Distance Curve
    // if(valBtn == 'Eucledian Distance') {
    //     var cie76Path;
    //     cie76Path = svg_linegraph.append('path')
    //                             .attr('class', 'lineGraph')
    //                             .attr('d', lineGen(cie76Curve))
    //                             .style('fill', 'none')
    //                             .style('stroke', '#ED335F')
    //                             .style('stroke-width', '2px');
    //     for (var s = 0; s < samples; s++) {
    //         cie76Circle = svg_linegraph.append('circle')
    //                                 .attr('class', 'lineCircle')
    //                                 .attr('index', function() { return s; })
    //                                 .attr('cx', cie76Curve[s].x * 1000)
    //                                 .attr('cy', 175 - (cie76Curve[s].y * 150))
    //                                 .attr('r', 4)
    //                                 .style('fill', '#FFF')
    //                                 .style('stroke', '#ED335F')
    //                                 .style('stroke-width', 1);
    //     }
    // }

    // CIE00 DISTANCE CURVE
    var cie00Curve = [], max00Dist = [];
    for (var s = 1; s < samples; s++) {
        var x00Dist2 = s/(samples-1);
        var x00Dist1 = (s-1)/(samples-1);
        var c00Dist2 = c3.color[index(d3.color(colormap.mapValue(x00Dist2)))];
        var c00Dist1 = c3.color[index(d3.color(colormap.mapValue(x00Dist1)))];

        var cie00Dist = cie00Distance(c00Dist2, c00Dist1);
        max00Dist.push(cie00Dist);
        var maxDist00 = max00Dist.reduce(function(a, b) {
                    return Math.max(a, b);
                }, 0);
        cie00Curve.push({
            x: x00Dist2,
            y: cie00Dist/maxDist00
        });
    }
    // Draw CIE00 Distance Curve
    if(valBtn == 'CIE00 Distance') {
        var cie00Path;
        cie00Path = svg_linegraph.append('path')
                                .attr('class', 'lineGraph')
                                .attr('d', lineGen(cie00Curve))
                                .style('fill', 'none')
                                .style('stroke', '#ED335F')
                                .style('stroke-width', '2px');
        for (var s = 0; s < samples; s++) {
            cie00Circle = svg_linegraph.append('circle')
                                    .attr('class', 'lineCircle')
                                    .attr('index', function() { return s; })
                                    .attr('cx', cie00Curve[s].x * 1000)
                                    .attr('cy', 175 - (cie00Curve[s].y * 150))
                                    .attr('r', 4)
                                    .style('fill', '#FFF')
                                    .style('stroke', '#ED335F')
                                    .style('stroke-width', 1);
        }
    }
}

// Dropdown Menu
function dropdownLine() {
      // List of Groups
      var allLines = ['Luminance', 'Saliency', 'CIE00 Distance', 'Name Difference', 'Saturation']

      d3.select('#lineButton')
        .selectAll('myOptions')
        .data(allLines)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })
}
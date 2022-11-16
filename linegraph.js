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
    // console.log(data);
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
    }
    // Draw Luminance Curve
    if(valBtn == 'Luminance') {
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
        console.log(satCurve);
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


// // COMPARISON AXES
// function drawComp() {
//     // Draw the X-Axis
//     var x = d3.scaleLinear()
//                 .domain([0, 100])
//                 .range([0, 350]);
//     svg_linegraph.append('g')
//                 .attr('transform', 'translate(50,575)') 
//                 .call(d3.axisBottom(x).tickValues([]));
//     svg_linegraph.append('text')
//                 .attr('text-anchor', 'end')
//                 .attr('x', 300)
//                 .attr('y', 600)
//                 .text('Lum Difference')

//     // Draw the Y-Axis
//     var y = d3.scaleLinear()
//                 .domain([0, 100])        
//                 .range([0, 350]);  
//     svg_linegraph.append('g')
//                 .attr('transform', 'translate(50,225)')   
//                 .call(d3.axisLeft(y).tickValues([]));
//     svg_linegraph.append('text')
//                 .attr('text-anchor', 'end')
//                 .attr('x', -350)
//                 .attr('y', 35)
//                 .attr('transform', 'rotate(-90)')
//                 .text('Perc Unif')
// }


// function drawScatter(scatData) {
//     svg_helpgraph.selectAll('circle.scatCirc').remove();
//     svg_helpgraph.selectAll('text.scatText').remove();
//     svg_helpgraph.selectAll('text.finText').remove();
//     svg_helpAllgraph.selectAll('circle.scatCirc').remove();
//     svg_helpAllgraph.selectAll('text.scatText').remove();
//     svg_helpAllgraph.selectAll('text.finText').remove();

//     var MinMaxSal = [];
//     var MinMaxLD = [];
//     var MinMaxPU = [];
//     var MinMaxSmo = [];
//     var MinMaxVal = [];
//     var MinMaxLBO = []; 
//     var valScat = scatData.slice(0,500);
//     for(i = 0; i < valScat.length; i++) { 
//         MinMaxSal.push(valScat[i][1]);
//         MinMaxLD.push(valScat[i][2]);
//         MinMaxPU.push(valScat[i][3]);
//         MinMaxSmo.push(valScat[i][4]);
//         MinMaxVal.push(valScat[i][0]);
//         MinMaxLBO.push(valScat[i][5]);
//     }

//     // LD v PU
//     // Draw the X-Axis
//     var x1 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxLD), Math.max(...MinMaxLD)])
//             .range([0, 900]);
//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,225)') 
//             .call(d3.axisBottom(x1).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', 500)
//             .attr('y', 250)
//             .text('Lum Difference')

//     // Draw the Y-Axis
//     var y1 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxPU), Math.max(...MinMaxPU)])        
//             .range([200, 0]);

//     var col1 = d3.scaleSequential()
//                 .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
//                 .interpolator(d3.interpolateBlues);

//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,25)')   
//             .call(d3.axisLeft(y1).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', -75)
//             .attr('y', 35)
//             .attr('transform', 'rotate(-90)')
//             .text('Perc Unif')
//     for(i = 0; i < valScat.length; i++) {
//         svg_helpgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x1(valScat[i][2]) + 50; } )
//                     .attr('cy', function(d) { return y1(valScat[i][3]) + 25; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col1(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', P.Uniformity: ' + d3.format('.2f')(valScat[idMap][3]));
//                     })
//                     .append('title').text(function() { return valScat[i][0]; });
//     }


//     // LD v SMO
//     // Draw the X-Axis
//     var x2 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxLD), Math.max(...MinMaxLD)])
//             .range([0, 900]);
//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,475)') 
//             .call(d3.axisBottom(x2).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', 500)
//             .attr('y', 500)
//             .text('Lum Difference')

//     // Draw the Y-Axis
//     var y2 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxSmo), Math.max(...MinMaxSmo)])        
//             .range([200, 0]);

//     var col2 = d3.scaleSequential()
//                 .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
//                 .interpolator(d3.interpolateReds);

//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,275)')   
//             .call(d3.axisLeft(y2).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', -325)
//             .attr('y', 35)
//             .attr('transform', 'rotate(-90)')
//             .text('Smoothness')
//     for(i = 0; i < valScat.length; i++) {
//         svg_helpgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x2(valScat[i][2]) + 50; } )
//                     .attr('cy', function(d) { return y2(valScat[i][4]) + 275; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col2(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', Smoothness: ' + d3.format('.2f')(valScat[idMap][4]));
//                     })
//                     .append('title').text(function() { return valScat[i][0]; });
//     }


//     // LD v Sal
//     // Draw the X-Axis
//     var x3 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxLD), Math.max(...MinMaxLD)])
//             .range([0, 900]);
//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,725)') 
//             .call(d3.axisBottom(x3).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', 500)
//             .attr('y', 750)
//             .text('Lum Difference')

//     // Draw the Y-Axis
//     var y3 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxSal), Math.max(...MinMaxSal)])        
//             .range([200, 0]);

//     var col3 = d3.scaleSequential()
//                 .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
//                 .interpolator(d3.interpolateGreens);

//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,525)')   
//             .call(d3.axisLeft(y3).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', -575)
//             .attr('y', 35)
//             .attr('transform', 'rotate(-90)')
//             .text('Saliency')
//     for(i = 0; i < valScat.length; i++) {
//         svg_helpgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x3(valScat[i][2]) + 50; } )
//                     .attr('cy', function(d) { return y3(valScat[i][1]) + 525; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col3(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', Saliency: ' + d3.format('.2f')(valScat[idMap][1]));
//                     });
//     }


//     // LD v LBO
//     // Draw the X-Axis
//     var x4 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxLD), Math.max(...MinMaxLD)])
//             .range([0, 900]);
//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,975)') 
//             .call(d3.axisBottom(x4).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', 500)
//             .attr('y', 1000)
//             .text('Lum Difference')

//     // Draw the Y-Axis
//     var y4 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxLBO), Math.max(...MinMaxLBO)])        
//             .range([200, 0]);

//     var col4 = d3.scaleSequential()
//                 .domain([Math.min(...MinMaxVal), Math.max(...MinMaxVal)])  
//                 .interpolator(d3.interpolatePurples);

//     svg_helpgraph.append('g')
//             .attr('transform', 'translate(50,775)')   
//             .call(d3.axisLeft(y4).tickValues([]));
//     svg_helpgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', -825)
//             .attr('y', 35)
//             .attr('transform', 'rotate(-90)')
//             .text('LBO')
//     for(i = 0; i < valScat.length; i++) {
//         svg_helpgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x4(valScat[i][2]) + 50; } )
//                     .attr('cy', function(d) { return y4(valScat[i][5]) + 775; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col4(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', LBO: ' + d3.format('.2f')(valScat[idMap][5]));
//                     });
//     }

    
//     // Weights: LD v All
//     // Draw the X-Axis
//     var x5 = d3.scaleLinear()
//             .domain([Math.min(...MinMaxLD), Math.max(...MinMaxLD)])
//             .range([0, 900]);
//     svg_helpAllgraph.append('g')
//             .attr('transform', 'translate(50,625)') 
//             .call(d3.axisBottom(x5).tickValues([]));
//     svg_helpAllgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', 500)
//             .attr('y', 650)
//             .text('Lum Difference')

//     // Draw the Y-Axis
//     var y5 = d3.scaleLinear()
//             .domain([
//                 Math.min(Math.min(...MinMaxLBO), Math.min(...MinMaxPU), Math.min(...MinMaxSal), Math.min(...MinMaxSmo)), 
//                 Math.max(Math.max(...MinMaxLBO), Math.max(...MinMaxPU), Math.max(...MinMaxSal), Math.max(...MinMaxSmo))
//             ])
//             // .domain([
//             //     Math.min(Math.min(...MinMaxLBO) * val_lboSimL, Math.min(...MinMaxPU) * val_puSimL, Math.min(...MinMaxSal) * val_salSimL, Math.min(...MinMaxSmo) * val_smoSimL), 
//             //     Math.max(Math.max(...MinMaxLBO) * val_lboSimL, Math.max(...MinMaxPU) * val_puSimL, Math.max(...MinMaxSal) * val_salSimL, Math.max(...MinMaxSmo) * val_smoSimL)
//             // ])
//             .range([600, 0]);

//     svg_helpAllgraph.append('g')
//             .attr('transform', 'translate(50,25)')   
//             .call(d3.axisLeft(y5).tickValues([]));
//     svg_helpAllgraph.append('text')
//             .attr('class', 'scatText')
//             .attr('text-anchor', 'end')
//             .attr('x', -275)
//             .attr('y', 35)
//             .attr('transform', 'rotate(-90)')
//             .text('Parameters')
//     for(i = 0; i < valScat.length; i++) {
//         // Saliency
//         svg_helpAllgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x5(valScat[i][2]) + 50; } )
//                     // .attr('cy', function(d) { return y5(valScat[i][1] * val_salSimL) + 25; } )
//                     .attr('cy', function(d) { return y5(valScat[i][1]) + 25; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col3(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpAllgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpAllgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', Saliency: ' + d3.format('.2f')(valScat[idMap][1]));
//                     });
//         // Smoothness
//         svg_helpAllgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x5(valScat[i][2]) + 50; } )
//                     // .attr('cy', function(d) { return y5(valScat[i][4] * val_smoSimL) + 25; } )
//                     .attr('cy', function(d) { return y5(valScat[i][4]) + 25; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col2(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpAllgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpAllgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', Smoothness: ' + d3.format('.2f')(valScat[idMap][4]));
//                     });
//         // PU
//         svg_helpAllgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x5(valScat[i][2]) + 50; } )
//                     // .attr('cy', function(d) { return y5(valScat[i][3] * val_puSimL) + 25; } )
//                     .attr('cy', function(d) { return y5(valScat[i][3]) + 25; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col1(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpAllgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpAllgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', P.Uniformity: ' + d3.format('.2f')(valScat[idMap][3]));
//                     });
//         // LBO
//         svg_helpAllgraph.append('circle')
//                     .attr('class', 'scatCirc')
//                     .attr('index', function() { return i; })
//                     .attr('cx', function(d) { return x5(valScat[i][2]) + 50; } )
//                     // .attr('cy', function(d) { return y5(valScat[i][5] * val_lboSimL) + 25; } )
//                     .attr('cy', function(d) { return y5(valScat[i][5]) + 25; } )
//                     .attr('r', 5)
//                     .attr('stroke', '#A8A8A8')
//                     .attr('fill', function(d) { return col4(valScat[i][0])})
//                     .on('mouseover', function() {
//                         svg_helpAllgraph.selectAll('text.finText').remove();
//                         var idMap = d3.select(this).attr('index');
//                         drawHelpermap(valScat[idMap][6]);
//                         svg_helpAllgraph.append('text')
//                                     .attr('class', 'finText')
//                                     .attr('text-anchor', 'end')
//                                     .attr('x', 400)
//                                     .attr('y', 20)
//                                     .text('Final: ' + d3.format('.2f')(valScat[idMap][0]) + ', LBO: ' + d3.format('.2f')(valScat[idMap][5]));
//                     });

//     }
// }

function drawPlot(plotData) {
    svg_helpgraph.selectAll('line.plotGraph').remove();
    svg_helpgraph.selectAll('circle.plotGraph').remove();
    svg_helpgraph.selectAll('text.textGraphAB').remove();
    svg_helpgraph.selectAll('text.textGraphLA').remove();
    svg_helpgraph.selectAll('text.textGraphLB').remove();
    svg_helpgraph.selectAll('image.labImage').remove();
    // a vs b
    function drawPlot_ab() {
        for(i = 0; i < plotData.length - 1; i++) {
            svg_helpgraph.append('line')
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
        // Colornames
        for(i = 0; i < plotData.length ; i++) {
            svg_helpgraph.append('text')
                        .attr('class', 'textGraphAB')
                        .attr('index', function() { return i; })
                        .attr('x', plotData[i].LAB[1] + 165)
                        .attr('y', plotData[i].LAB[2] + 153)
                        .text(plotData[i].name)
                        .style('font-size', '15px')
                        .raise();
        }
        // Circles
        for(i = 0; i < plotData.length; i++) {
            svg_helpgraph.append('circle')
                        .attr('class', 'plotGraph')
                        .attr('index', function() { return i; })
                        .attr('cx', plotData[i].LAB[1] + 153)
                        .attr('cy', plotData[i].LAB[2] + 153)
                        .attr('r', 5)
                        .style('fill', plotData[i].fill)
                        .style('stroke', "black")
                        .style('stroke-width', 1)
                        .on('mousedown', function() {
                            var circDrop = d3.select(this);
                            // Change Border Thickness
                            circDrop.style('stroke-width', 5);
                            var circY = 0;
                            var circX = 0;
                            // var lineX1 = 0;
                            // var lineY1 = 0;
                            // var lineX2 = 0;
                            // var lineY2 = 0;

                            // // Search Function
                            // svg_helpgraph.append('rect')
                            //             .attr('class', 'plotSearch')
                            //             .attr('x', circDrop.attr('cx'))
                            //             .attr('y', circDrop.attr('cy'))
                            //             .attr('width', 150)
                            //             .attr('height', 35)
                            //             .style('fill', 'cyan');

                            // Draw CIELAB Space Image
                            // svg_helpgraph.append("image")
                            //             .attr('class', 'labImage')
                            //             .attr('x', 25)
                            //             .attr('y', 25)
                            //             .attr('width', 256)
                            //             .attr('height', 256)
                            //             .attr("xlink:href", "download.png")
                            //             .attr('opacity', 0.3);

                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                svg_helpgraph.selectAll('text.textGraphAB').remove();
                                circDrop.style('stroke-width', 5);
                                
                                // Lines
                                var circInd = circDrop.attr('index');

                                // Get Mouse Co-Ordinates
                                var newMouse = d3.mouse(circDrop.node());
                                // Mouse Pointer/ Edges Position
                                // Top Edge
                                if(newMouse[1] < 25) {
                                    circDrop.attr('cy', 25);
                                    circY = 25;

                                    // if(circInd == 0) {
                                    //     // lineX1 = 25;
                                    // } 
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
                                var oldL = plotData[circDrop.attr('index')].LAB[0];
                                var newA = circX - 153;
                                var newB = circY - 153;
                                // var oldA = plotData[circDrop.attr('index')].LAB[1];
                                // var oldB = plotData[circDrop.attr('index')].LAB[2];
                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(oldL,newA,newB)).r + "," + d3.rgb(d3.lab(oldL,newA,newB)).g + "," + d3.rgb(d3.lab(oldL,newA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(oldL,newA,newB)).r, d3.rgb(d3.lab(oldL,newA,newB)).g, d3.rgb(d3.lab(oldL,newA,newB)).b],
                                    LAB: [oldL,newA, newB],
                                    name:  nameDistribution(d3.lab(oldL,newA, newB)),
                                    sel: 0
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // var testColor = d3.color(d3.lab((colL.LAB)[0], (colL.LAB)[1], (colL.LAB)[2]));
                                // console.log(testColor.displayable());

                                // Draw Slice
                                svg_helpgraph.selectAll("circle.slice").remove();
                                // var lumVal = 5 * Math.round((100 - (((circY - 25)/(255)) * 100))/5);
                                for (var c=0; c<color_dict.length; c++) {
                                    var salVal = color_dict[c].saliency;
                                    var LABval = color_dict[c].lab;
                                    var fillColor = color_dict[c].fill;
                                        if(LABval[0] == oldL) {
                                            svg_helpgraph.append("circle")
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
                                svg_helpgraph.append('text')
                                            .attr('class', 'textGraphAB')
                                            .attr('index', function() { return i; })
                                            .attr('x', newA + 165)
                                            .attr('y', newB + 153)
                                            .text(colL.name)
                                            .style('font-size', '15px')
                                            .raise();

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                // drawPlot(plotData);
                            })

                            d3.select(document).on('mouseup', function() {
                                svg_helpgraph.selectAll("rect.plotSearch").remove();
                                svg_helpgraph.selectAll("circle.slice").remove();
                                // Change Border Thickness
                                circDrop.style('stroke-width', 1);
                                // Stop Mouse Events
                                d3.select(document)
                                    .on('mousemove', null)
                                    .on('mouseup', null);
                                
                                // Formula for mapping to [0,100]
                                var oldL = plotData[circDrop.attr('index')].LAB[0];
                                var newA = circX - 153;
                                var newB = circY - 153;
                                // var oldA = plotData[circDrop.attr('index')].LAB[1];
                                // var oldB = plotData[circDrop.attr('index')].LAB[2];

                                // Update Color L*
                                var colL = ({
                                    pos: circDrop.attr('index'),
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(oldL,newA,newB)).r + "," + d3.rgb(d3.lab(oldL,newA,newB)).g + "," + d3.rgb(d3.lab(oldL,newA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(oldL,newA,newB)).r, d3.rgb(d3.lab(oldL,newA,newB)).g, d3.rgb(d3.lab(oldL,newA,newB)).b],
                                    LAB: [oldL,newA, newB],
                                    name:  nameDistribution(d3.lab(oldL,newA, newB)),
                                    sel: 1
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);
                                
                                // datasetDrop.splice(circDrop.attr('index'), 1, colL);


                                // // Post Message in Worker
                                // myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD, colRadio] });
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

    var x_coord = d3.scaleLinear()
                .domain([-128, 128])
                .range([0, 256]);
    svg_helpgraph.append("g")
                .attr("transform", "translate(25," + (281) + ")") 
                .call(d3.axisBottom(x_coord).tickValues([]));
    svg_helpgraph.append("text")
                .attr("text-anchor", "end")
                .attr("x", 153)
                .attr("y", 301 )
                .text("a");

    var y_coord = d3.scaleLinear()
                .domain([128, -128])        
                .range([0, 256]);  

    svg_helpgraph.append("g")
                .attr("transform", "translate(25," + (25) + ")")
                .call(d3.axisLeft(y_coord).tickValues([]));
    svg_helpgraph.append("text")
                .attr("text-anchor", "end")
                .attr("x", 10)
                .attr("y", 150)
                .text("b");

    drawPlot_ab();

    // L vs a
    function drawPlot_La() {
        for(i = 0; i < plotData.length - 1; i++) {
            svg_helpgraph.append('line')
                        .attr('class', 'plotGraph')
                        .style('stroke', '#000')
                        .style('stroke-width', 1)
                        .attr('x1', plotData[i].LAB[1] + 428)
                        .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('x2', plotData[i+1].LAB[1] + 428)
                        .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                        .raise();
        }
        // Colornames
        for(i = 0; i < plotData.length ; i++) {
            svg_helpgraph.append('text')
                        .attr('class', 'textGraphLA')
                        .attr('index', function() { return i; })
                        .attr('x', plotData[i].LAB[1] + 440)
                        .attr('y', -plotData[i].LAB[0]*2.56 + 275)
                        .text(plotData[i].name)
                        .style('font-size', '15px')
                        .raise();
        }
        // Circles
        for(i = 0; i < plotData.length; i++) {
            svg_helpgraph.append('circle')
                        .attr('class', 'plotGraph')
                        .attr('index', function() { return i; })
                        .attr('cx', plotData[i].LAB[1] + 428)
                        .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('r', 5)
                        .style('fill', plotData[i].fill)
                        .style('stroke', "black")
                        .style('stroke-width', 1)
                        .on('mousedown', function() {
                            var circDrop = d3.select(this);
                            // Change Border Thickness
                            circDrop.style('stroke-width', 5);
                            var circY = 0;
                            var circX = 0;

                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                circDrop.style('stroke-width', 5);
                                svg_helpgraph.selectAll('text.textGraphLA').remove();
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
                                svg_helpgraph.selectAll("circle.slice").remove();
                                var lumVal = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                for (var c=0; c<color_dict.length; c++) {
                                    var salVal = color_dict[c].saliency;
                                    var LABval = color_dict[c].lab;
                                    var fillColor = color_dict[c].fill;
                                        if(LABval[0] == lumVal) {
                                            svg_helpgraph.append("circle")
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
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,newA,oldB)).r + "," + d3.rgb(d3.lab(newL,newA,oldB)).g + "," + d3.rgb(d3.lab(newL,newA,oldB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,newA,oldB)).r, d3.rgb(d3.lab(newL,newA,oldB)).g, d3.rgb(d3.lab(newL,newA,oldB)).b],
                                    LAB: [newL,newA, oldB],
                                    name:  nameDistribution(d3.lab(newL,newA, oldB)),
                                    sel: 0
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Update Colornames
                                svg_helpgraph.append('text')
                                            .attr('class', 'textGraphLA')
                                            .attr('index', function() { return i; })
                                            .attr('x', newA + 440)
                                            .attr('y', -newL*2.56 + 275)
                                            .text(colL.name)
                                            .style('font-size', '15px')
                                            .raise();

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                // drawPlot(plotData);
                            })

                            d3.select(document).on('mouseup', function() {
                                svg_helpgraph.selectAll("circle.slice").remove();
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
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,newA,oldB)).r + "," + d3.rgb(d3.lab(newL,newA,oldB)).g + "," + d3.rgb(d3.lab(newL,newA,oldB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,newA,oldB)).r, d3.rgb(d3.lab(newL,newA,oldB)).g, d3.rgb(d3.lab(newL,newA,oldB)).b],
                                    LAB: [newL,newA, oldB],
                                    name:  nameDistribution(d3.lab(newL,newA, oldB)),
                                    sel: 1
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);     

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
    var x_coord_la = d3.scaleLinear()
                .domain([-128, 128])
                .range([0, 256]);
    svg_helpgraph.append("g")
                .attr("transform", "translate(300," + (281) + ")") 
                .call(d3.axisBottom(x_coord_la).tickValues([]));
                svg_helpgraph.append("text")
                .attr("text-anchor", "end")
                .attr("x", 428)
                .attr("y", 301)
                .text("a");

    var y_coord_la = d3.scaleLinear()
                .domain([0, 100])        
                .range([0, 256]);  

    svg_helpgraph.append("g")
                .attr("transform", "translate(300," + (25) + ")")
                .call(d3.axisLeft(y_coord_la).tickValues([]));
    svg_helpgraph.append("text")
                .attr("text-anchor", "end")
                .attr("x", 285)
                .attr("y", 150)
                .text("L");

    drawPlot_La();

    // L vs b
    function drawPlot_Lb() {
        for(i = 0; i < plotData.length - 1; i++) {
            svg_helpgraph.append('line')
                        .attr('class', 'plotGraph')
                        .style('stroke', '#000')
                        .style('stroke-width', 1)
                        .attr('x1', plotData[i].LAB[2] + 703)
                        .attr('y1', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('x2', plotData[i+1].LAB[2] + 703)
                        .attr('y2', -plotData[i+1].LAB[0]*2.56 + 281)
                        .raise();
        }
        // Colornames
        for(i = 0; i < plotData.length ; i++) {
            svg_helpgraph.append('text')
                        .attr('class', 'textGraphLB')
                        .attr('index', function() { return i; })
                        .attr('x', plotData[i].LAB[2] + 715)
                        .attr('y', -plotData[i].LAB[0]*2.56 + 275)
                        .text(plotData[i].name)
                        .style('font-size', '15px')
                        .raise();
        }
        // Circles
        for(i = 0; i < plotData.length; i++) {
            svg_helpgraph.append('circle')
                        .attr('class', 'plotGraph')
                        .attr('index', function() { return i; })
                        .attr('cx', plotData[i].LAB[2] + 703)
                        .attr('cy', -plotData[i].LAB[0]*2.56 + 281)
                        .attr('r', 5)
                        .style('fill', plotData[i].fill)
                        .style('stroke', "black")
                        .style('stroke-width', 1)
                        .on('mousedown', function() {
                            var circDrop = d3.select(this);
                            // Change Border Thickness
                            circDrop.style('stroke-width', 5);
                            var circY = 0;
                            var circX = 0;

                            // Move Rectangle
                            d3.select(document).on('mousemove', function() {
                                circDrop.style('stroke-width', 5);
                                svg_helpgraph.selectAll('text.textGraphLB').remove();
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
                                svg_helpgraph.selectAll("circle.slice").remove();
                                var lumVal = 5 * Math.round((100 - (((circY - 25)/(256)) * 100))/5);
                                for (var c=0; c<color_dict.length; c++) {
                                    var salVal = color_dict[c].saliency;
                                    var LABval = color_dict[c].lab;
                                    var fillColor = color_dict[c].fill;
                                        if(LABval[0] == lumVal) {
                                            svg_helpgraph.append("circle")
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
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,newB)).r + "," + d3.rgb(d3.lab(newL,oldA,newB)).g + "," + d3.rgb(d3.lab(newL,oldA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,oldA,newB)).r, d3.rgb(d3.lab(newL,oldA,newB)).g, d3.rgb(d3.lab(newL,oldA,newB)).b],
                                    LAB: [newL,oldA, newB],
                                    name:  nameDistribution(d3.lab(newL,oldA, newB)),
                                    sel: 0
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);

                                // Update Colornames
                                svg_helpgraph.append('text')
                                            .attr('class', 'textGraphLB')
                                            .attr('index', function() { return i; })
                                            .attr('x', newB + 715)
                                            .attr('y', -newL*2.56 + 275)
                                            .text(colL.name)
                                            .style('font-size', '15px')
                                            .raise();

                                drawColormap(plotData);
                                drawLinegraph(plotData);
                                // drawPlot(plotData);
                            })

                            d3.select(document).on('mouseup', function() {
                                svg_helpgraph.selectAll("circle.slice").remove();
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
                                    fill: "rgb" + "(" + d3.rgb(d3.lab(newL,oldA,newB)).r + "," + d3.rgb(d3.lab(newL,oldA,newB)).g + "," + d3.rgb(d3.lab(newL,oldA,newB)).b + ")",
                                    RGB: [d3.rgb(d3.lab(newL,oldA,newB)).r, d3.rgb(d3.lab(newL,oldA,newB)).g, d3.rgb(d3.lab(newL,oldA,newB)).b],
                                    LAB: [newL,oldA, newB],
                                    name:  nameDistribution(d3.lab(newL,oldA, newB)),
                                    sel: 1
                                });
                                plotData.splice(circDrop.attr('index'), 1, colL);     

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
    svg_helpgraph.append("g")
                .attr("transform", "translate(575," + (281) + ")") 
                .call(d3.axisBottom(x_coord_lb).tickValues([]));
    svg_helpgraph.append("text")
                .attr("text-anchor", "end")
                .attr("x", 703)
                .attr("y", 301)
                .text("b");

    var y_coord_lb = d3.scaleLinear()
            .domain([0, 100])        
            .range([0, 256]);  

    svg_helpgraph.append("g")
                .attr("transform", "translate(575," + (25) + ")")
                .call(d3.axisLeft(y_coord_lb).tickValues([]));
    svg_helpgraph.append("text")
                .attr("text-anchor", "end")
                .attr("x", 560)
                .attr("y", 150)
                .text("L");

    drawPlot_Lb();
}
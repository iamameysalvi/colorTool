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
    // Get Value of Button
    var valBtn = document.getElementById('lineButton').value;

    // Remove Path on Update
    svg_linegraph.selectAll('path.lineGraph').remove();

    // Initiaization
    var W = 1000;
    var H = 150;
    var samples = data.length * 2;

    // Draw Line Curves
    var lineGen =  d3.line()
                     .x (function(d) { return (d.x * W); })
                     .y (function(d) { return ((1-d.y) * H) + 25; })

    // LUMINANCE
    var lumCurve = [], maxLum = 100.0;
    for (var s = 0; s < samples; s++) {
        var xLum = s/(samples-1);
        var cLum = d3.lab(colormap.mapValue(xLum));
        
        var Lum = 5 * Math.round(cLum.L/5);
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
    }

    // CIE76 DISTANCE CURVE
    var cie76Curve = [], max76Dist = [];
    for (var s = 1; s < samples; s++) {
        var x76Dist2 = s/(samples-1);
        var x76Dist1 = (s-1)/(samples-1);
        var c76Dist2 = c3.color[index(d3.color(colormap.mapValue(x76Dist2)))];
        var c76Dist1 = c3.color[index(d3.color(colormap.mapValue(x76Dist1)))];

        var cie76Dist = cie76Distance(c76Dist2, c76Dist1);
        max76Dist.push(cie76Dist);
        var maxDist76 = max76Dist.reduce(function(a, b) {
                    return Math.max(a, b);
                }, 0);
        cie76Curve.push({
            x: x76Dist2,
            y: cie76Dist/maxDist76
        });
    }
    // Draw CIE76 Distance Curve
    if(valBtn == 'Eucledian Distance') {
        var cie76Path;
        cie76Path = svg_linegraph.append('path')
                                .attr('class', 'lineGraph')
                                .attr('d', lineGen(cie76Curve))
                                .style('fill', 'none')
                                .style('stroke', '#ED335F')
                                .style('stroke-width', '2px');
    }

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
    }
}

// Dropdown Menu
function dropdownLine() {
      // List of Groups
      var allLines = ['Luminance', 'Saliency', 'CIE00 Distance', 'Name Difference', 'Eucledian Distance']

      d3.select('#lineButton')
        .selectAll('myOptions')
        .data(allLines)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })
}
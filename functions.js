//LOAD JSON
c3.load('lib/colorname/c3_data.json');

// CREATE CMAP: L,a,b:index
var cmap = {};
for (var c=0; c<c3.color.length; ++c) 
{
    var x = c3.color[c];
    cmap[[x.L,x.a,x.b].join(",")] = c;
}

// CMAP IN LAB
function index(c) 
{
    var x = d3.lab(c),
    L = 5 * Math.round(x.L/5),
    a = 5 * Math.round(x.a/5),
    b = 5 * Math.round(x.b/5),
    s = [L,a,b].join(",");
    return cmap[s];
}

// RGB TO HEX
function rgbToHex(r, g, b) 
{
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// CONVERT COLORS TO LAB
function fill_color(c)
{
    var y = d3.lab(c);
    return y.toString(16);
}

// COLOR NAMES AND DISTRIBUTION
function termDistribution(c)
{
    var i = index(c);
    var terms = c3.terms;
    var dist = [];

    for (var w=0; w<terms.length; w++) {
        dist.push({
            term: terms[w],
            p: c3.terms.prob(w, i)
        })
    }
    dist.sort(function(a, b) { return b.p-a.p});
    return dist;
}

// COLOR NAMES
function nameDistribution(c)
{
    var newDist = termDistribution(c).slice(0,25);
    name_d = newDist[0].term;
    return name_d;
}

// SALIENCY
function nameSalience(c) 
{
    var minE = -4.5;
    var maxE = 0.0;
    var i = index(c);
    var ent = c3.color.entropy(i);
    var salience = (ent - minE) / (maxE-minE);
    return salience;
}

// NAME DIFFERENCE
function nameDifference(c1, c2) 
{
    var i1 = index(c1);
    var i2 = index(c2);
    return 1 - c3.color.cosine(i1, i2);
}

// PERCEPTUAL (EUCLEDIAN) DISTANCE -> CIE76 DISTANCE
function cie76Distance(c1, c2) 
{
    var i1 = index(c1);
    var i2 = index(c2);
    var col1 = c3.color[i1];
    var col2 = c3.color[i2];
    return Math.sqrt((col2.l - col1.l)**2 + (col2.a - col1.a)**2 + (col2.b - col1.b)**2);
}

// Create Color Dictionary: LAB, Saliency, (Name)
var color_dict = [];
for (var c=0; c<c3.color.length; c++) {
    var x = c3.color[c];
    color_dict.push({
        lab: [x.L,x.a,x.b],
        saliency: nameSalience(x),
        name: nameDistribution(x),
        fill: fill_color(x)
    });
    // color_dict.sort(function(a,b) { return b.saliency - a.saliency});
}

// Create Name Dict of most Salient: Name, LAB
var name_map = [];
var W = c3.terms.length;
for (var i=0; i<W; ++i) {
    name_map.push({
        name: c3.terms[i],
        LAB: [(c3.terms.center[i].L),(c3.terms.center[i].a),(c3.terms.center[i].b)],
        saliency: nameSalience(d3.lab(c3.terms.center[i].L,c3.terms.center[i].a,c3.terms.center[i].b))
    });
    name_map.sort(function(a,b) { return b.saliency - a.saliency});
}

// PERCEPTUAL DISTANCE -> CIE00 DISTANCE
function cie00Distance(c1, c2) {
    var i1 = index(c1);
    var i2 = index(c2);
    var col1 = c3.color[i1];
    var col2 = c3.color[i2];
    var deg = 180/Math.PI;
    var rad = Math.PI/180;

    var c1 = Math.sqrt(col1.a**2 + col1.b**2);
    var c2 = Math.sqrt(col2.a**2 + col2.b**2);

    var delL = col2.L - col1.L;
    var barL = (col1.L + col2.L)/2;
    var barC = (c1 + c2)/2;

    var dashA1 = col1.a + (col1.a/2) * (1 - Math.sqrt(barC ** 7/(barC ** 7 + 25 ** 7)));
    var dashA2 = col2.a + (col2.a/2) * (1 - Math.sqrt(barC ** 7/(barC ** 7 + 25 ** 7)));

    var dashC1 = Math.sqrt(dashA1 ** 2 + col1.b ** 2);
    var dashC2 = Math.sqrt(dashA2 ** 2 + col2.b ** 2);
    var dashC = (dashC1 + dashC2)/2;
    var delC = dashC2 - dashC1;

    var dashH1 = ((Math.atan2(col1.b,dashA1)) * deg + 360) % 360;
    var dashH2 = ((Math.atan2(col2.b,dashA2)) * deg + 360) % 360;
    var delh = Math.abs(dashH1 - dashH2) <= 180 ? dashH2 - dashH1: dashH2 <= dashH1 ? dashH2 - dashH1 + 360 : dashH2 - dashH1 - 360;
    var delH = 2 * Math.sqrt(dashC1 * dashC2) * Math.sin((delh/2) * rad);
    var barH = Math.abs(dashH1 - dashH2) <= 180 ? (dashH1 + dashH2)/2 : dashH1 + dashH2 < 360 ? (dashH1 + dashH2 + 360)/2 : (dashH1 + dashH2 - 360)/2;
    var T = 1 - 0.17 * Math.cos((barH - 30) * rad) + 0.24 * Math.cos((2 * barH)* rad) + 0.32 * Math.cos((3 * barH + 6) * rad) - 0.20 * Math.cos((4 * barH - 63) * rad);

    var sL = 1 + 0.015 * ((barL - 50) ** 2)/Math.sqrt(20 + (barL - 50) ** 2);
    var sC = 1 + 0.045 * barC;
    var sH = 1 + 0.015 * barC * T;

    var RT = -2 * Math.sqrt((barC ** 7)/(barC ** 7 + 25 ** 7)) * Math.sin((60 * Math.exp(-(((barH - 275)/25) ** 2))) * rad); 
    var delE00 = Math.sqrt(((delL/sL) ** 2) + ((delC/sC) ** 2) + ((delH/sH) ** 2) + (RT * (delC/sC) * (delH/sH)));

    return delE00;
}

// INTERSECTION LINE AND POINT
function intersect(x1, y1, x2, y2, x3, y3, x4, y4, curr_lum) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }
    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    // Lines are parallel
    if (denominator === 0) {
        return false;
    }
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
    // Check if the intersection is along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }
    // Return an object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
    return {curr_lum, x, y}
}

// DRAW NAME DISTRIBUTION HISTOGRAM
function nameHist() {
    // Select Mouse Pointer div
    d3.select('div#slice2D');
    // Color & Distribution
    var selCol = d3.select(this).attr('style').slice(6,-51);
    var nameDist = termDistribution(selCol).slice(0, 25);
    // Histogram Height & Width
    var BAR_W = 3 * 2;
    var BAR_H = 20 * 2;
    // Draw Histogram
    svg_plots.selectAll('g.extra').remove();
    var g = svg_plots.append('g')
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
                    .attr('transform', 'translate(0 -300)')
                    .style('fill', function(d, i) { return i==0 ? selCol : d3.color(selCol).brighter(1) })
                    .style('stroke', 'black')
                    .attr("stroke-width", 0.25);

        grp.append('text')
            .attr('x', 0).attr('y', -305)
            .html('Colorname: '+ nameDist[0].term)
            .style('fill', 'black')
            .style('font-size', '12px')
            .attr('transform', 'translate(0,-5)')

    })(g, nameDist, nameDist[0].p)
}

// GET CURRENT COLORMAP
function getColorMap() {
    return this.colormap;
}

// RANDOM VALUE (INCLUSIVE)
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // Both min and max are inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
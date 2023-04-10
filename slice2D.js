// INITIALIZE VALUES
// 2D Slice
var lum = 0;
var sal_init = 0;
var sal_fin = 100;

//.................................................................................................................................................................................................................//
// SLIDER LUMINANCE
function drawSliderLum() {
    // Data
    var dataLum = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    // Create Slider
    sliderStepLum = d3.sliderBottom()
                       .min(d3.min(dataLum))
                       .max(d3.max(dataLum))
                       .width(300)
                       .tickFormat(d3.format('.2d'))
                       .ticks(0)
                       .step(5)
                       .default(0)
                       .displayValue(false)
                       .fill('#0F52BA')
                       .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(300)()
                        )
                        // Onchange Value
                        .on('onchange', val => {
                            svg_slice2D.selectAll('text.sliderLumText').remove();
                            // For drawSlice2D function
                            lum = val;
                            svg_slice2D.selectAll('rect').remove();
                            drawSlice2D(val, sal_init, sal_fin);
                            // Text Value
                            svg_slice2D.append('text')
                                        .attr('class','sliderLumText')
                                        .attr('x', 20)
                                        .attr('y', 85)
                                        .style('font-size', 50)
                                        .style('fill', '#757575')
                                        .text('Luminance: ' + d3.format('.2d')(val));
                        });
    // Call Slider
    svg_slice2D.append('g').attr('transform', 'translate(15,25)').call(sliderStepLum);
    // Initial Text Value
    svg_slice2D.append('text')
                .attr('class','sliderLumText')
                .attr('x', 20)
                .attr('y', 85)
                .style('font-size', 50)
                .style('fill', '#757575')
                .text('Luminance: 0');
}

//.................................................................................................................................................................................................................//
// SLIDER SALIENCY
function drawSliderSal() {
    // Data
    var dataSal = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    // Create Slider
    var sliderRangeSal = d3.sliderBottom()
                       .min(d3.min(dataSal))
                       .max(d3.max(dataSal))
                       .width(300)
                       .tickFormat(d3.format('.2d'))
                       .ticks(0)
                       .default([0,100])
                       .displayValue(false)
                       .fill('#BF0000')
                       .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(300)()
                        )
                        // Onchange Value
                        .on('onchange', sal => {
                            svg_slice2D.selectAll('text.sliderSalText').remove();
                            // For drawSlice2D function
                            sal_init = sal[0];
                            sal_fin = sal[1];
                            svg_slice2D.selectAll('rect').remove();
                            drawSlice2D(lum, sal_init, sal_fin);
                            // Text Value
                            svg_slice2D.append('text')
                                        .attr('class','sliderSalText')
                                        .attr('x', 600)
                                        .attr('y', 85)
                                        .style('font-size', 50)
                                        .style('fill', '#757575')
                                        .text('Saliency: ' + sal.map(d3.format('.2d')).join('-'));
                        });
    // Call Slider
    svg_slice2D.append('g').attr('transform', 'translate(685,25)').call(sliderRangeSal);
    // Initial Text Value
    svg_slice2D.append('text')
                .attr('class','sliderSalText')
                .attr('x', 600)
                .attr('y', 85)
                .style('font-size', 50)
                .style('fill', '#757575')
                .text('Saliency: 0-100');
}

//.................................................................................................................................................................................................................//
// 2D SLICE
function drawSlice2D(lum, sal_init, sal_fin) {
    for (var c=0; c<colorDict.length; c++) {
        salVal = colorDict[c].saliency;
        var LABval = colorDict[c].LAB;
        var fillColor = colorDict[c].fill;
        var colorName = colorDict[c].name;
        // Draw Slice - Luminance & Saliency Constraint
        if(LABval[0] == lum && (salVal*100) <= sal_fin && (salVal*100) >= sal_init) {
            svg_slice2D.append('rect')
            // svg_slice2D.append('circle')
                    .attr('class', 'slice2D')
                    .attr('value', colorName)
                    .attr('x', LABval[1]*4.5 + 475)
                    .attr('y', -LABval[2]*4.5 + 600)
                    .attr('width', salVal*30)
                    .attr('height', salVal*30)
                    .style('fill', fillColor)
                    .style('stroke-width', 0.5)
                    .style('stroke', 'black')
                    .on('mouseover', function(d) {
                        // Increase Color Size
                        svg_slice2D.selectAll('rect').style('opacity', 0.41);
                        col = d3.select(this);
                        col.attr('width', salVal*200)
                            .attr('height', salVal*200)
                            .style('opacity', 1.01)
                            .raise();
                    })
                    .on('mouseout', function() {
                        svg_slice2D.selectAll('rect').remove();
                        drawSlice2D(lum, sal_init, sal_fin);
                    })
                    .on('click', function() {
                        d3.select(this)
                          .call(addColor);
                    })
                    .append('title').text(function() { return LABval; });
        }
    }
}
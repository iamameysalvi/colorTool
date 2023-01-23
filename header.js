// Header Name
function headerName() {
    svg_topbar.append('text')
            .attr('class', 'headerName')
            .attr('x', 10)
            .attr('y', 25)
            .text('COLORTOOL')
            .style('font-size', '20px')
            .attr('fill', '#DADADA');
}

// Header Dropdown Menu
function dropName() {
    // Dropdown name
    var test = svg_topbar.append('g');
    test.append('text')
            .attr('class', 'dropdownName')
            .attr('x', 850)
            .attr('y', 25)
            .text('Scoring Functions')
            .style('font-size', '12px')
            .attr('fill', '#DADADA')
            .on('mouseover', function() {
                d3.select(this).attr('fill', '#800000')
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#DADADA')
            })
            .on('click', function() {
                d3.select(this)
                  .call(scoreFuncts);
            })
    // Dropdown Button
    test.append('text')
                .attr('x', 960)
                .attr('y', 25)
                .attr("class", "fa")
                .text("\uf078")
                .style('font-size', '10px')
                .attr('fill', '#DADADA')
                .on('mouseover', function() {
                    d3.select(this).attr('fill', '#800000')
                })
                .on('mouseout', function() {
                    d3.select(this).attr('fill', '#DADADA')
                });
}

// SCORING FUNCTIONS DROP DOWN BAR
function scoreFuncts() {
    if(menuFlag == false) {
        menuFlag = true;
        // Draw SVG
        svg_functMenu = d3.select('div#functMenu')
                        .append('svg')
                        .attr('preserveAspectRatio', 'xMinYMin meet')
                        .attr('viewBox', '0 0 1500 150')
                        .style('background', '#222021')
                        .classed('svg-content', true);

        // Draw Sliders
        drawHeaders();
        drawLum();
        // drawSal();
        drawCol();
        drawPU();
        drawSmo();
        // Draw Profile Buttons
        selectOption();
    }
    else {
        // Select Button
        var selOption = document.getElementById('selectButton');
        selOption.style.visibility = "hidden";
        
        menuFlag = false;
        svg_functMenu.remove();
    }
}

// HEADERS
function drawHeaders() {
    // Luminance Heading
    svg_functMenu.append('text')
                .attr('x', 10)
                .attr('y', 30)
                .text('Luminance')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // // Name Salience Heading
    // svg_functMenu.append('text')
    //             .attr('x', 10)
    //             .attr('y', 90)
    //             .text('Name Salience')
    //             .style('font-size', 12)
    //             .attr('fill', '#DADADA');

    // Color Change Heading
    svg_functMenu.append('text')
                .attr('x', 10)
                .attr('y', 90)
                .text('Color Change')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Perceptual Uniformity Heading
    svg_functMenu.append('text')
                .attr('x', 400)
                .attr('y', 30)
                .text('Perceptual Uniformity')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Smoothness Heading
    svg_functMenu.append('text')
                .attr('x', 400)
                .attr('y', 90)
                .text('Smoothness')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Luminance Profile Heading
    svg_functMenu.append('text')
                .attr('x', 790)
                .attr('y', 30)
                .text('Luminance Profile')
                .style('font-size', 16)
                .attr('fill', '#DADADA');
}

// SLIDERS
// Luminance Slider
function drawLum() {
    var dataLum = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    var sliderLum = d3.sliderBottom()
                       .min(d3.min(dataLum))
                       .max(d3.max(dataLum))
                       .width(300)
                       .tickFormat(d3.format('.2d'))
                       .ticks(0)
                       .step(1)
                       .default([0,100])
                       .displayValue(false)
                       .fill('#761137')
                       .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(100)()
                        )
                        // Onchange Value
                        .on('onchange', new_lum => {
                            svg_functMenu.selectAll('text.sliderLumText').remove();
                            // For drawSlice2D function
                            valLum = new_lum;
                            // Text Value
                            svg_functMenu.append('text')
                                        .attr('class','sliderLumText')
                                        .attr('x', 285)
                                        .attr('y', 30)
                                        .style('font-size', 12)
                                        .style('fill', '#DADADA')
                                        .text(valLum.map(d3.format('.2d')).join("-"));

                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                // myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D] });
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    // drawLinegraph(e.data[0]);
                                    // drawScatter(e.data[1]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                }
                            }
                        });
    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(15,45)').call(sliderLum);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderLumText')
                .attr('x', 285)
                .attr('y', 30)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('0-100');
}

// // Name Salience Slider
// function drawSal() {
//     var dataSal = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
//     var sliderSal = d3.sliderBottom()
//                         .min(d3.min(dataSal))
//                         .max(d3.max(dataSal))
//                         .width(300)
//                         .tickFormat(d3.format('.2d'))
//                         .ticks(0)
//                         .default(0)
//                         .displayValue(false)
//                         .fill('#761137')
//                         .handle(
//                             d3.symbol()
//                             .type(d3.symbolCircle)
//                             .size(100)()
//                         )
//                         // Onchange Value
//                         .on('onchange', valSal => {
//                             svg_functMenu.selectAll('text.sliderSalText').remove();
//                             valSal_L = valSal * 100;
//                             valSal_D = valSal * 40;
//                             // Text Value
//                             svg_functMenu.append('text')
//                                         .attr('class','sliderSalText')
//                                         .attr('x', 285)
//                                         .attr('y', 90)
//                                         .style('font-size', 12)
//                                         .style('fill', '#DADADA')
//                                         .text(d3.format('.2f')(valSal));

//                             // Call Web Worker (Algorithm)
//                             if(countCol > 0) {
//                                 // // Loader icon
//                                 // var loader = document.getElementById('loader');
//                                 // loader.style.visibility = "visible";

//                                 // Terminate old Worker and run new Worker
//                                 myWorker.terminate();
//                                 myWorker = new Worker('worker.js');
//                                 // Post Message in Worker
//                                 myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D] });
//                                 myWorker.onmessage = function(e) {
//                                     drawColormap(e.data[0]);
//                                     // drawLinegraph(e.data[0]);
//                                     // drawScatter(e.data[1]);
//                                     drawPlot(e.data[0]);
//                                     // loader.style.visibility = "hidden";
//                                 }
//                             }

//                         });

//     // Call Slider
//     svg_functMenu.append('g').attr('transform', 'translate(15,105)').call(sliderSal);
//     // Initial Text Value
//     svg_functMenu.append('text')
//                 .attr('class','sliderSalText')
//                 .attr('x', 285)
//                 .attr('y', 90)
//                 .style('font-size', 12)
//                 .style('fill', '#DADADA')
//                 .text('0.00');
// }

// Color Change Slider
function drawCol() {
    var dataCol = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    var sliderCol = d3.sliderBottom()
                        .min(d3.min(dataCol))
                        .max(d3.max(dataCol))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(0.5)
                        .displayValue(false)
                        .fill('#761137')
                        .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(100)()
                        )
                        // Onchange Value
                        .on('onchange', valCol => {
                            svg_functMenu.selectAll('text.sliderColText').remove();
                            colChange = valCol * 100;
                            // valCol_D = valSal * 40;
                            // Text Value
                            svg_functMenu.append('text')
                                        .attr('class','sliderColText')
                                        .attr('x', 285)
                                        .attr('y', 90)
                                        .style('font-size', 12)
                                        .style('fill', '#DADADA')
                                        .text(d3.format('.2f')(valCol));

                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                // myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D] });
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawScatter(e.data[1]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(15,105)').call(sliderCol);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderColText')
                .attr('x', 285)
                .attr('y', 90)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('0.50');
}

// Perceptual Uniformity Slider
function drawPU() {
    var dataPU = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    var sliderPU = d3.sliderBottom()
                        .min(d3.min(dataPU))
                        .max(d3.max(dataPU))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(0.5)
                        .displayValue(false)
                        .fill('#761137')
                        .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(100)()
                        )
                        // Onchange Value
                        .on('onchange', valPU => {
                            svg_functMenu.selectAll('text.sliderPUText').remove();
                            valPU_L = valPU * -300;
                            valPU_D = valPU * -200;
                            // Text Value
                            svg_functMenu.append('text')
                                        .attr('class','sliderPUText')
                                        .attr('x', 675)
                                        .attr('y', 30)
                                        .style('font-size', 12)
                                        .style('fill', '#DADADA')
                                        .text(d3.format('.2f')(valPU));

                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                // myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D] });
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawScatter(e.data[1]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(400,45)').call(sliderPU);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderPUText')
                .attr('x', 675)
                .attr('y', 30)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('0.50');
}

// Smoothness Slider
function drawSmo() {
    var dataSmo = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    var sliderSmo = d3.sliderBottom()
                        .min(d3.min(dataSmo))
                        .max(d3.max(dataSmo))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(0.5)
                        .displayValue(false)
                        .fill('#761137')
                        .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(100)()
                        )
                        // Onchange Value
                        .on('onchange', valSmo => {
                            svg_functMenu.selectAll('text.sliderSmoText').remove();
                            valSmo_L = valSmo * 200;
                            valSmo_D = valSmo * 200;
                            // Text Value
                            svg_functMenu.append('text')
                                        .attr('class','sliderSmoText')
                                        .attr('x', 675)
                                        .attr('y', 90)
                                        .style('font-size', 12)
                                        .style('fill', '#DADADA')
                                        .text(d3.format('.2f')(valSmo));

                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                // myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D] });
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawScatter(e.data[1]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(400,105)').call(sliderSmo);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderSmoText')
                .attr('x', 675)
                .attr('y', 90)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('0.50');
}

// Luminance Profile Images
function drawLumImages(lumOpt) {
    svg_functMenu.selectAll('image.lumImage').remove();
    if(lumOpt == 'Linear') {
        // Linear
        svg_functMenu.append('image')
                    .attr('class', 'lumImage')
                    .attr('x', 820)
                    .attr('y', 50)
                    .attr('width', 250)
                    .attr('height', 70)
                    .attr("xlink:href", "img/linear.png")
                    .attr('opacity', 0.8);
    }
    else if(lumOpt == 'Diverging') {
        // Diverging
        svg_functMenu.append('image')
                    .attr('class', 'lumImage')
                    .attr('x', 820)
                    .attr('y', 50)
                    .attr('width', 250)
                    .attr('height', 70)
                    .attr("xlink:href", "img/diverging.png")
                    .attr('opacity', 0.8);
    }
    else if(lumOpt == 'Reverse Linear') {
        // Reverse Linear
        svg_functMenu.append('image')
                    .attr('class', 'lumImage')
                    .attr('x', 820)
                    .attr('y', 50)
                    .attr('width', 250)
                    .attr('height', 70)
                    .attr("xlink:href", "img/revLinear.png")
                    .attr('opacity', 0.8);
    }
    else if(lumOpt == 'Reverse Diverging') {
        // Reverse Diverging
        svg_functMenu.append('image')
                    .attr('class', 'lumImage')
                    .attr('x', 820)
                    .attr('y', 50)
                    .attr('width', 250)
                    .attr('height', 70)
                    .attr("xlink:href", "img/revDiverging.png")
                    .attr('opacity', 0.8);
    }
}

// Drop Down Menu Selected Option
function selectOption() {
    // Select Button
    var selOption = document.getElementById('selectButton');
    selOption.style.visibility = "visible";

    // Remove Duplicates from DropDown Menu
    d3.select("#selectButton").selectAll('option').remove();

    // List of Options
    var lumProfiles = ['Linear', 'Diverging', 'Reverse Linear', 'Reverse Diverging'];

    // Append Select Option
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(lumProfiles).enter()
        .append('option')
        .text(function (d) { return d; })
        .attr('value', function (d) { drawLumImages(selLum); return d; });

    // Update Luminance Profile Image
    d3.select("#selectButton").on("change", function(d) {
        selLum = d3.select(this).property("value");
        drawLumImages(selLum);
    })
}
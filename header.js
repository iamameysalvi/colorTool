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
        drawCol();
        drawPU();
        drawSmo();
        drawKey();
        drawMapLen();
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
    // Smoothness Heading
    svg_functMenu.append('text')
                .attr('x', 10)
                .attr('y', 30)
                .text('Smoothness')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Perceptual Uniformity Heading
    svg_functMenu.append('text')
                .attr('x', 10)
                .attr('y', 90)
                .text('Perceptual Uniformity')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Colorfulness Heading
    svg_functMenu.append('text')
                .attr('x', 400)
                .attr('y', 30)
                .text('Colorfulness/ No. of Colors')
                .style('font-size', 12)
                .attr('fill', '#DADADA');
    svg_functMenu.append('text')
                .attr('x', 400)
                .attr('y', 60)
                .text('High')
                .style('font-size', 12)
                .attr('fill', '#DADADA');
    svg_functMenu.append('text')
                .attr('x', 525)
                .attr('y', 60)
                .text('Medium')
                .style('font-size', 12)
                .attr('fill', '#DADADA');
    svg_functMenu.append('text')
                .attr('x', 675)
                .attr('y', 60)
                .text('Low')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Color Preference Heading
    svg_functMenu.append('text')
                .attr('x', 400)
                .attr('y', 90)
                .text('User Selected Color Preference')
                .style('font-size', 12)
                .attr('fill', '#DADADA');
    svg_functMenu.append('text')
                .attr('x', 400)
                .attr('y', 120)
                .text('High')
                .style('font-size', 12)
                .attr('fill', '#DADADA');
    svg_functMenu.append('text')
                .attr('x', 675)
                .attr('y', 120)
                .text('Low')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Luminance Profile Heading
    svg_functMenu.append('text')
                .attr('x', 790)
                .attr('y', 30)
                .text('Luminance Profile')
                .style('font-size', 16)
                .attr('fill', '#DADADA');

    // Luminance Change Heading
    svg_functMenu.append('text')
                .attr('x', 1150)
                .attr('y', 30)
                .text('Luminance')
                .style('font-size', 12)
                .attr('fill', '#DADADA');

    // Key Points Heading
    svg_functMenu.append('text')
                .attr('x', 1150)
                .attr('y', 90)
                .text('Key Points')
                .style('font-size', 12)
                .attr('fill', '#DADADA');
}

// SLIDERS
// Smoothness Slider
function drawSmo() {
    var dataSmo = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    var sliderSmo = d3.sliderBottom()
                        .min(d3.min(dataSmo))
                        .max(d3.max(dataSmo))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(0.8)
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
                                        .attr('x', 285)
                                        .attr('y', 30)
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
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange, mapLength] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                    // debugArr = []
                                    // debugArr.push(e.data[2]);
                                    // scatter(e.data[2]);
                                    // hist1(e.data[2]);
                                    // hist2(e.data[2]);
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(15,45)').call(sliderSmo);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderSmoText')
                .attr('x', 285)
                .attr('y', 30)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('0.80');
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
                                        .attr('x', 285)
                                        .attr('y', 90)
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
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange, mapLength] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                    // debugArr = []
                                    // debugArr.push(e.data[2]);
                                    // scatter(e.data[2]);
                                    // hist1(e.data[2]);
                                    // hist2(e.data[2]);
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(15,105)').call(sliderPU);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderPUText')
                .attr('x', 285)
                .attr('y', 90)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('0.50');
}


// Colorfulness Slider
function drawMapLen() {
    var dataMapLen = [0, 0.5, 1];
    var sliderMapLen = d3.sliderBottom()
                        .min(d3.min(dataMapLen))
                        .max(d3.max(dataMapLen))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(0.5)
                        .step(0.5)
                        .displayValue(false)
                        .fill('#761137')
                        .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(100)()
                        )
                        // Onchange Value
                        .on('onchange', valMapLen => {
                            svg_functMenu.selectAll('text.sliderMapLenText').remove();
                            mapLength = valMapLen * -20;

                            // // Text Value
                            // svg_functMenu.append('text')
                            //             .attr('class','sliderMapLenText')
                            //             .attr('x', 675)
                            //             .attr('y', 30)
                            //             .style('font-size', 12)
                            //             .style('fill', '#DADADA')
                            //             .text(d3.format('.2f')(valMapLen));

                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange, mapLength] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                    // scatter(e.data[2]);
                                    // hist1(e.data[2]);
                                    // hist2(e.data[2]);
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(400,45)').call(sliderMapLen);
    // // Initial Text Value
    // svg_functMenu.append('text')
    //             .attr('class','sliderMapLenText')
    //             .attr('x', 675)
    //             .attr('y', 30)
    //             .style('font-size', 12)
    //             .style('fill', '#DADADA')
    //             .text('0.50');
}


// Color Change / Tolerance Slider
function drawCol() {
    var dataCol = [0.02, 0.10, 0.18, 0.26];
    var sliderCol = d3.sliderBottom()
                        .min(d3.min(dataCol))
                        .max(d3.max(dataCol))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(0.10)
                        .step(0.08)
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
                            // // Text Value
                            // svg_functMenu.append('text')
                            //             .attr('class','sliderColText')
                            //             .attr('x', 675)
                            //             .attr('y', 90)
                            //             .style('font-size', 12)
                            //             .style('fill', '#DADADA')
                            //             .text(d3.format('.2f')(valCol));

                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange, mapLength] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                    // scatter(e.data[2]);
                                    // hist1(e.data[2]);
                                    // hist2(e.data[2]);
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(400,105)').call(sliderCol);
    // // Initial Text Value
    // svg_functMenu.append('text')
    //             .attr('class','sliderColText')
    //             .attr('x', 675)
    //             .attr('y', 90)
    //             .style('font-size', 12)
    //             .style('fill', '#DADADA')
    //             .text('0.10');
}

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
                                        .attr('x', 1425)
                                        .attr('y', 30)
                                        .style('font-size', 12)
                                        .style('fill', '#DADADA')
                                        .text(valLum.map(d3.format('.2d')).join("-"));
                            console.log(valLum[0], valLum[1])
                            
                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange, mapLength] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                }
                            }
                        });
    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(1150,45)').call(sliderLum);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderLumText')
                .attr('x', 1425)
                .attr('y', 30)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('0-100');
}

// Key Points Slider
function drawKey() {
    var dataKey = [5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
    var sliderKey = d3.sliderBottom()
                        .min(d3.min(dataKey))
                        .max(d3.max(dataKey))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .step(2)
                        .default(17)
                        .displayValue(false)
                        .fill('#761137')
                        .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(100)()
                        )
                        // Onchange Value
                        .on('onchange', valKey => {
                            svg_functMenu.selectAll('text.sliderKeyText').remove();
                            paletteLen = valKey;
                            // Text Value
                            svg_functMenu.append('text')
                                        .attr('class','sliderKeyText')
                                        .attr('x', 1425)
                                        .attr('y', 90)
                                        .style('font-size', 12)
                                        .style('fill', '#DADADA')
                                        .text(d3.format('.2d')(valKey));

                            // Call Web Worker (Algorithm)
                            if(countCol > 0) {
                                // // Loader icon
                                // var loader = document.getElementById('loader');
                                // loader.style.visibility = "visible";

                                // Remove existing color icons from canvas
                                svg_colormap.selectAll('rect.contCol').remove();
                                svg_colormap.selectAll('rect.dropCol').remove();

                                // Generate random colors (k=paletteLen from slider)
                                datasetDrop = [];
                                // var lum_min = 0;
                                // var lum_max = 100;
                                var lum_min = valLum[0];
                                var lum_max = valLum[1];
                                for(var k=0; k<(paletteLen); k++) {
                                    var samp_lum = k/(paletteLen-1);
                                    var lum_exp = 5 * Math.round((lum_min + (lum_max-lum_min) * samp_lum)/5);       // For Linear Profile
                        
                                    genRandom(lum_exp, k);
                                }

                                // Terminate old Worker and run new Worker
                                myWorker.terminate();
                                myWorker = new Worker('worker.js');
                                // Post Message in Worker
                                myWorker.postMessage({ 'args': [paletteLen, valLum[0], valLum[1], datasetDrop, selLum, valSal_L, valPU_L, valSmo_L, valSal_D, valPU_D, valSmo_D, colChange, mapLength] });
                                myWorker.onmessage = function(e) {
                                    drawColormap(e.data[0]);
                                    drawLinegraph(e.data[0]);
                                    drawPlot(e.data[0]);
                                    // loader.style.visibility = "hidden";
                                    // scatter(e.data[2]);
                                    // hist1(e.data[2]);
                                    // hist2(e.data[2]);
                                }
                            }

                        });

    // Call Slider
    svg_functMenu.append('g').attr('transform', 'translate(1150,105)').call(sliderKey);
    // Initial Text Value
    svg_functMenu.append('text')
                .attr('class','sliderKeyText')
                .attr('x', 1425)
                .attr('y', 90)
                .style('font-size', 12)
                .style('fill', '#DADADA')
                .text('17');
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
}

// Drop Down Menu Selected Option
function selectOption() {
    // Select Button
    var selOption = document.getElementById('selectButton');
    selOption.style.visibility = "visible";

    // Remove Duplicates from DropDown Menu
    d3.select("#selectButton").selectAll('option').remove();

    // List of Options
    var lumProfiles = ['Linear', 'Diverging'];

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
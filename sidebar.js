function drawHeaders() {
    // Luminance Difference Heading
    svg_sidebar.append('text')
                .attr('x', 0)
                .attr('y', 100)
                .text('Luminance Difference')
                .style('font-size', '32px')
                .attr('font-weight', 2400)
                .attr('fill', '#222021');

    // Luminance Heading
    svg_sidebar.append('text')
                .attr('x', 0)
                .attr('y', 270)
                .text('Luminance')
                .style('font-size', '32px')
                .attr('font-weight', 2400)
                .attr('fill', '#222021');

    // Perceptual Uniformity Heading
    svg_sidebar.append('text')
                .attr('x', 0)
                .attr('y', 440)
                .text('Perceptual Uniformity')
                .style('font-size', '32px')
                .attr('font-weight', 2400)
                .attr('fill', '#222021');

    // Smoothness Heading
    svg_sidebar.append('text')
                .attr('x', 0)
                .attr('y', 610)
                .text('Smoothness')
                .style('font-size', '32px')
                .attr('font-weight', 2400)
                .attr('fill', '#222021');

    // Name Salience Heading
    svg_sidebar.append('text')
                .attr('x', 0)
                .attr('y', 780)
                .text('Name Salience')
                .style('font-size', '32px')
                .attr('font-weight', 2400)
                .attr('fill', '#222021');

    // // Algorithm Speed Heading
    // svg_sidebar.append('text')
    //             .attr('x', 0)
    //             .attr('y', 950)
    //             .text('Algorithm Speed')
    //             .style('font-size', '32px')
    //             .attr('font-weight', 2400)
    //             .attr('fill', '#222021');
}


// SLIDER LUMINANCE DIFFERENCE
function drawLumDiff() {
    // Data
    var dataLD = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

    // Create Slider
    sliderLD = d3.sliderBottom()
                    .min(d3.min(dataLD))
                    .max(d3.max(dataLD))
                    .width(300)
                    .tickFormat(d3.format('.2d'))
                    .ticks(0)
                    .default(0)
                    .displayValue(false)
                    .fill('#761137')
                    .handle(
                        d3.symbol()
                        .type(d3.symbolCircle)
                        .size(300)()
                    )
                    // Onchange Value
                    .on('onchange', valLD => {
                        svg_sidebar.selectAll('text.sliderLumText').remove();
                            val_ldSimL = valLD * -12500000;
                            val_ldSimD = valLD * -12500000;
                        // Text Value
                        svg_sidebar.append('text')
                                    .attr('class','sliderLumText')
                                    .attr('x', 350)
                                    .attr('y', 150)
                                    .style('font-size', 41)
                                    .style('fill', '#757575')
                                    .text(d3.format('.2f')(valLD));
                        // calcPalette(paletteLen, val_lum[0], val_lum[1]);
                        
                        // Web Worker
                        // Loader icon
                        var loader = document.getElementById('loader');
                        loader.style.visibility = "visible";
                        // Terminate old Worker and run new Worker
                        myWorker.terminate();
                        myWorker = new Worker('worker.js');
                        // Post Message in Worker
                        myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD, colRadio] });
                        myWorker.onmessage = function(e) {
                            drawColormap(e.data[0]);
                            drawLinegraph(e.data[0]);
                            // drawScatter(e.data[1]);
                            drawPlot(e.data[0]);
                            loader.style.visibility = "hidden";
                        }
                    });
    // Call Slider
    svg_sidebar.append('g').attr('transform', 'translate(15,140)').call(sliderLD);
    // Initial Text Value
    svg_sidebar.append('text')
                .attr('class','sliderLumText')
                .attr('x', 350)
                .attr('y', 150)
                .style('font-size', 41)
                .style('fill', '#757575')
                .text('0');
}

function drawSimSal() {
    //SLIDER SALIENCY SIMULATED
    var dataSal = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    var slidersalSim = d3.sliderBottom()
                        .min(d3.min(dataSal))
                        .max(d3.max(dataSal))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(0)
                        .displayValue(false)
                        .fill('#761137')
                        .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(300)()
                        )
                        // Onchange Value
                        .on('onchange', valSal => {
                            svg_sidebar.selectAll('text.sliderSalText').remove();
                                val_salSimL = valSal * 100;
                                val_salSimD = valSal * 40;
                            // Text Value
                            svg_sidebar.append('text')
                                        .attr('class','sliderSalText')
                                        .attr('x', 350)
                                        .attr('y', 830)
                                        .style('font-size', 41)
                                        .style('fill', '#757575')
                                        .text(d3.format('.2f')(valSal));
                            // calcPalette(paletteLen, val_lum[0], val_lum[1]);

                            // Web Worker
                            // Loader icon
                            var loader = document.getElementById('loader');
                            loader.style.visibility = "visible";
                            // Terminate old Worker and run new Worker
                            myWorker.terminate();
                            myWorker = new Worker('worker.js');
                            // Post Message in Worker
                            myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD, colRadio] });
                            myWorker.onmessage = function(e) {
                                drawColormap(e.data[0]);
                                drawLinegraph(e.data[0]);
                                // drawScatter(e.data[1]);
                                drawPlot(e.data[0]);
                                loader.style.visibility = "hidden";
                            }
                        });

    // Call Slider
    svg_sidebar.append('g').attr('transform', 'translate(15,820)').call(slidersalSim);
    // Initial Text Value
    svg_sidebar.append('text')
                .attr('class','sliderSalText')
                .attr('x', 350)
                .attr('y', 830)
                .style('font-size', 41)
                .style('fill', '#757575')
                .text('0.00');
}

function drawPU() {
    //SLIDER PU SIMULATED
    var dataPU = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    var sliderPUSim = d3.sliderBottom()
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
                            .size(300)()
                        )
                        // Onchange Value
                        .on('onchange', valPU => {
                            svg_sidebar.selectAll('text.sliderPUText').remove();
                                val_puSimL = valPU * -10000;
                                val_puSimD = valPU * -20000;
                            // Text Value
                            svg_sidebar.append('text')
                                        .attr('class','sliderPUText')
                                        .attr('x', 350)
                                        .attr('y', 490)
                                        .style('font-size', 41)
                                        .style('fill', '#757575')
                                        .text(d3.format('.2f')(valPU));
                            // calcPalette(paletteLen, val_lum[0], val_lum[1]);

                            // Web Worker
                            // Loader icon
                            var loader = document.getElementById('loader');
                            loader.style.visibility = "visible";
                            // Terminate old Worker and run new Worker
                            myWorker.terminate();
                            myWorker = new Worker('worker.js');
                            // Post Message in Worker
                            myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD, colRadio] });
                            myWorker.onmessage = function(e) {
                                drawColormap(e.data[0]);
                                drawLinegraph(e.data[0]);
                                // drawScatter(e.data[1]);
                                drawPlot(e.data[0]);
                                loader.style.visibility = "hidden";
                            }
                        });

    // Call Slider
    svg_sidebar.append('g').attr('transform', 'translate(15,480)').call(sliderPUSim);
    // Initial Text Value
    svg_sidebar.append('text')
                .attr('class','sliderPUText')
                .attr('x', 350)
                .attr('y', 490)
                .style('font-size', 41)
                .style('fill', '#757575')
                .text('0.5');
}

function drawSmo() {
    //SLIDER SMO SIMULATED
    var dataSmo = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    var sliderSmo = d3.sliderBottom()
                        .min(d3.min(dataSmo))
                        .max(d3.max(dataSmo))
                        .width(300)
                        .tickFormat(d3.format('.2d'))
                        .ticks(0)
                        .default(1)
                        .displayValue(false)
                        .fill('#761137')
                        .handle(
                            d3.symbol()
                            .type(d3.symbolCircle)
                            .size(300)()
                        )
                        // Onchange Value
                        .on('onchange', valSmo => {
                            svg_sidebar.selectAll('text.sliderSmoText').remove();
                                val_smoSimL = valSmo * 2000;
                                val_smoSimD = valSmo * 100;
                            // Text Value
                            svg_sidebar.append('text')
                                        .attr('class','sliderSmoText')
                                        .attr('x', 350)
                                        .attr('y', 660)
                                        .style('font-size', 41)
                                        .style('fill', '#757575')
                                        .text(d3.format('.2f')(valSmo));
                            // calcPalette(paletteLen, val_lum[0], val_lum[1]);

                            // Web Worker
                            // Loader icon
                            var loader = document.getElementById('loader');
                            loader.style.visibility = "visible";
                            // Terminate old Worker and run new Worker
                            myWorker.terminate();
                            myWorker = new Worker('worker.js');
                            // Post Message in Worker
                            myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD, colRadio] });
                            myWorker.onmessage = function(e) {
                                drawColormap(e.data[0]);
                                drawLinegraph(e.data[0]);
                                // drawScatter(e.data[1]);
                                drawPlot(e.data[0]);
                                loader.style.visibility = "hidden";
                            }
                        });

    // Call Slider
    svg_sidebar.append('g').attr('transform', 'translate(15,650)').call(sliderSmo);
    // Initial Text Value
    svg_sidebar.append('text')
                .attr('class','sliderSmoText')
                .attr('x', 350)
                .attr('y', 660)
                .style('font-size', 41)
                .style('fill', '#757575')
                .text('1.00');
}

function drawSLum() {
    //SLIDER LUMINANCE
    var dataSLum = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    var sliderSLum = d3.sliderBottom()
                       .min(d3.min(dataSLum))
                       .max(d3.max(dataSLum))
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
                            .size(300)()
                        )
                        // Onchange Value
                        .on('onchange', new_lum => {
                            svg_sidebar.selectAll('text.sliderSLumText').remove();
                            // For drawSlice2D function
                            val_lum = new_lum;
                            // Text Value
                            svg_sidebar.append('text')
                                        .attr('class','sliderSLumText')
                                        .attr('x', 350)
                                        .attr('y', 320)
                                        .style('font-size', 41)
                                        .style('fill', '#757575')
                                        .text(val_lum.map(d3.format('.2d')).join("-"));
                            // calcPalette(paletteLen, val_lum[0], val_lum[1]);

                            // Web Worker
                            // Loader icon
                            var loader = document.getElementById('loader');
                            loader.style.visibility = "visible";
                            // Terminate old Worker and run new Worker
                            myWorker.terminate();
                            myWorker = new Worker('worker.js');
                            // Post Message in Worker
                            myWorker.postMessage({ 'args': [paletteLen, val_lum[0], val_lum[1], datasetDrop, lumRadio, val_salSimL, val_ldSimL, val_puSimL, val_lboSimL, val_smoSimL, val_salSimD, val_ldSimD, val_puSimD, val_lboSimD, val_smoSimD, colRadio] });
                            myWorker.onmessage = function(e) {
                                drawColormap(e.data[0]);
                                drawLinegraph(e.data[0]);
                                // drawScatter(e.data[1]);
                                drawPlot(e.data[0]);
                                loader.style.visibility = "hidden";
                            }
                        });
    // Call Slider
    svg_sidebar.append('g').attr('transform', 'translate(15,310)').call(sliderSLum);
    // Initial Text Value
    svg_sidebar.append('text')
                .attr('class','sliderSLumText')
                .attr('x', 350)
                .attr('y', 320)
                .style('font-size', 41)
                .style('fill', '#757575')
                .text('0-100');
}

// function drawIter() {
//     //SLIDER ALGORITHM ITERATIONS
//     var dataIter = ['Efficient', 'Medium', 'Quality'];
//     // var dataIter = [0.9,0.99];
//     var sliderIter = d3.sliderBottom()
//                         .min(0.9)
//                         .max(0.99)
//                         .width(300)
//                         .tickFormat(d3.format('.2f'))
//                         // .ticks(5)
//                         // For Steps
//                         .step(0.045)
//                         .ticks(dataIter)
//                         // .marks(dataIter)
//                         .default(0.9)
//                         .displayValue(false)
//                         .fill('#761137')
//                         .handle(
//                             d3.symbol()
//                             .type(d3.symbolCircle)
//                             .size(300)()
//                         )
//                         // Onchange Value
//                         .on('onchange', valIter => {
//                             svg_sidebar.selectAll('text.sliderIterText').remove();
//                                 val_algoIter = valIter;
//                                 if(parseFloat(valIter).toFixed(2) == 0.9) { textIter = dataIter[0]}
//                                 else if (parseFloat(valIter).toFixed(2) == 0.99) { textIter = dataIter[2]}
//                                 else { textIter = dataIter[1]}
//                             // Text Value
//                             svg_sidebar.append('text')
//                                         .attr('class','sliderIterText')
//                                         .attr('x', 350)
//                                         .attr('y', 1000)
//                                         .style('font-size', 35)
//                                         .style('fill', '#757575')
//                                         .text(textIter);
//                         });

//     // Call Slider
//     svg_sidebar.append('g').attr('transform', 'translate(15,1000)').call(sliderIter);
//     // Initial Text Value
//     svg_sidebar.append('text')
//                 .attr('class','sliderIterText')
//                 .attr('x', 350)
//                 .attr('y', 1000)
//                 .style('font-size', 35)
//                 .style('fill', '#757575')
//                 .text('Efficient');
// }
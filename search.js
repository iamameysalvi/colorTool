// CURRENT SELECTION BOX
function drawSearchBox() {
    svg_hist.append('rect')
            .attr('fill', '#000')
            .attr('x', 20)
            .attr('y', 50)
            .attr('width', 150)
            .attr('height', 150)
            .attr('stroke', '#000');
}
  
// DRAW NAME DISTRIBUTION HISTOGRAM
function drawHist(selection) {
    // Color & Distribution
    var selCol = selection.attr('style').slice(6,-51);
    var nameDist = termDistribution(selCol).slice(0, 25);

    // Clear Text and Search
    document.getElementById('search').value = "";
    svg_searchText.selectAll('text').remove();
    svg_searchText.selectAll('rect').remove();
    var currTerm = nameDist[0].term;
    hoverTerm(currTerm);

    // Current Selection Box
    svg_hist.append('rect')
            .attr('fill', d3.color(selCol))
            .attr('x', 20)
            .attr('y', 50)
            .attr('width', 150)
            .attr('height', 150)
            .attr('stroke', '#000')
            .attr("stroke-width", 0.05);

    // Histogram Height & Width
    var BAR_W = 3 * 2;
    var BAR_H = 20 * 2;

    // Draw Histogram
    svg_hist.selectAll('g.extra').remove();
    var g = svg_hist.append('g')
                    .attr('class', 'extra')
                    .attr('transform', 'translate(300, 360)');
    (function(grp, nameDist, maxP) {
        var selection = grp.selectAll('rect.bar')
                            .data(nameDist)
                            .enter().append('rect');
        selection.attr('x', function(d, i) { return i * BAR_W * 3.5 })
                    .attr('y', function(d) { return 3.5 * (1-d.p/maxP) * BAR_H })
                    .attr('width', BAR_W * 3.5)
                    .attr('height', function(d) { return 3.5 * (d.p/maxP) * BAR_H; })
                    .attr('transform', 'translate(-50 -300)')
                    .style('fill', function(d, i) { return i==0 ? selCol : d3.color(selCol).brighter(1) })
                    .style('stroke', '#000')
                    .attr("stroke-width", 0.25);

        grp.append('text')
            .attr('x', -50).attr('y', -315)
            .html('Colorname: '+ nameDist[0].term)
            .style('fill', '#000')
            .style('font-size', '25')
            .attr('transform', 'translate(0,-5)')

    })(g, nameDist, nameDist[0].p)
}
  
// DRAW NAME DISTRIBUTION HISTOGRAM SEARCH TEXT
function drawHistText(selection) {
    // Color & Distribution
    var selCol = selection.attr('fill');
    var nameDist = termDistribution(selCol).slice(0, 25);

    // Current Selection Box
    svg_hist.append('rect')
            .attr('fill', d3.color(selCol))
            .attr('x', 20)
            .attr('y', 50)
            .attr('width', 150)
            .attr('height', 150)
            .attr('stroke', '#000')
            .attr("stroke-width", 0.05);

    // Histogram Height & Width
    var BAR_W = 3 * 2;
    var BAR_H = 20 * 2;

    // Draw Histogram
    svg_hist.selectAll('g.extra').remove();
    var g = svg_hist.append('g')
                    .attr('class', 'extra')
                    .attr('transform', 'translate(300, 360)');
    (function(grp, nameDist, maxP) {
        var selection = grp.selectAll('rect.bar')
                            .data(nameDist)
                            .enter().append('rect');
        selection.attr('x', function(d, i) { return i * BAR_W * 3.5 })
                    .attr('y', function(d) { return 3.5 * (1-d.p/maxP) * BAR_H })
                    .attr('width', BAR_W * 3.5)
                    .attr('height', function(d) { return 3.5 * (d.p/maxP) * BAR_H; })
                    .attr('transform', 'translate(-50 -300)')
                    .style('fill', function(d, i) { return i==0 ? selCol : d3.color(selCol).brighter(1) })
                    .style('stroke', '#000')
                    .attr("stroke-width", 0.25);

        grp.append('text')
            .attr('x', -50).attr('y', -315)
            .html('Colorname: '+ nameDist[0].term)
            .style('fill', '#000')
            .style('font-size', '25')
            .attr('transform', 'translate(0,-5)')

    })(g, nameDist, nameDist[0].p)
}
  
// COLOR NAME SEARCH
function searchFunct() {
    const search = document.getElementById('search');

    const searchCools = async searchText => {
        const cools = name_map;
        let matches = cools.filter(cool => {
        const regex = new RegExp(`${searchText}`, 'gi');
        if(cool.name.match(regex) == null) {
            svg_searchText.selectAll('text').remove();
            svg_searchText.selectAll('rect').remove();
        }
        else {
            return cool.name.match(regex);
        }
        });

        if(searchText.length === 0) {
        matches = [];
        svg_searchText.selectAll('text').remove();
        svg_searchText.selectAll('rect').remove();
        }
        outputHTML(matches);
    };
    // Show results in dropdown
    const outputHTML = matches => {
        if(matches.length > 0) {
            svg_searchText.selectAll('text').remove();
            svg_searchText.selectAll('rect').remove();
            // BG
            svg_searchText.append('rect')
                    .attr("x", 10)
                    .attr("y", 0)
                    .attr('width', 980)
                    .attr('height', matches.length*75 + 10)
                    .attr('fill', '#E6E6E6')
                    .attr('opacity', 0.55)
                    .attr('stroke', '#000');
            for(i=0; i<matches.length; i++) {
                // console.log(matches);
                // Saliency Bar
                svg_searchText.append('rect')
                            .attr("x", 100)
                            .attr("y", 20 + i*75)
                            .attr('width', function() { return matches[i].saliency*800; })
                            .attr('height', 50)
                            .attr('fill', d3.lab(matches[i].LAB[0],matches[i].LAB[1],matches[i].LAB[2]))
                            // .attr('fill', '#B3E0FF')
                            .attr('opacity', 0.25)
                            .attr('stroke', '#000')
                            .attr('index', [matches[i].LAB[0],matches[i].LAB[1],matches[i].LAB[2]])
                            .attr('title', matches[i].name)
                            .on('mouseover', function() {
                                d3.select(this)
                                .call(drawHistText);
                                var selLAB = d3.select(this).attr('index').split(",").map(x=>+x);
                                sliderStepLum.value(selLAB[0]);
                                var sel_allrect = svg_slice2D.selectAll('rect');
                                sel_allrect.style('opacity', 0.41);
                                sel_allrect.filter(function () { 
                                    var sel_text = d3.select(this).text();
                                    var sel_col = (5 * (Math.round(selLAB[0]/5))) + "," + (5 * (Math.round(selLAB[1]/5))) + "," + (5 * (Math.round(selLAB[2]/5)));
                                    return sel_text == sel_col;
                                })
                                .attr('width', 50)
                                .attr('height', 50)
                                .style('opacity', 1.01)
                                .raise();
                            });
                // Color Name
                svg_searchText.append('text')
                            .attr('x', 110)
                            .attr('y', 55 + i*75)
                            .style('font-size', 30)
                            .text(function() { return matches[i].name; });
                // Saliency Text
                svg_searchText.append('text')
                            .attr('x', 920)
                            .attr('y', 55 + i*75)
                            .style('font-size', 30)
                            .text(function() { return (d3.format('.2d')(matches[i].saliency*100) + '%'); });
                // Color Box
                svg_searchText.append('rect')
                            .attr('x', 20)
                            .attr('y', 20 + i*75)
                            .attr('width', 50)
                            .attr('height', 50)
                            .attr('fill', d3.lab(matches[i].LAB[0],matches[i].LAB[1],matches[i].LAB[2]))
                            .attr('stroke', '#000')
                            .attr('index', [matches[i].LAB[0],matches[i].LAB[1],matches[i].LAB[2]])
                            .attr('title', matches[i].name)
                            .on('mouseover', function() {
                                d3.select(this)
                                .call(drawHistText);
                                var selLAB = d3.select(this).attr('index').split(",").map(x=>+x);
                                sliderStepLum.value(selLAB[0]);
                                var sel_allrect = svg_slice2D.selectAll('rect');
                                sel_allrect.style('opacity', 0.41);
                                sel_allrect.filter(function () { 
                                    var sel_text = d3.select(this).text();
                                    var sel_col = (5 * (Math.round(selLAB[0]/5))) + "," + (5 * (Math.round(selLAB[1]/5))) + "," + (5 * (Math.round(selLAB[2]/5)));
                                    return sel_text == sel_col;
                                })
                                .attr('width', 50)
                                .attr('height', 50)
                                .style('opacity', 1.01)
                                .raise();
                            });
            }
        }
    }
    search.addEventListener('input', () => searchCools(search.value));
}
  
// SEARCH ON HOVER
function hoverTerm(term) {
    var hover = term;
    const hoverCools = name_map;
    let hoverMatches = hoverCools.filter(hoverCool => {
        return hoverCool.name.match(hover);
    });

    // Show results in dropdown
    if(hoverMatches.length > 0) {
        document.getElementById("search").value = hover;
        svg_searchText.selectAll('text').remove();
        svg_searchText.selectAll('rect').remove();
        // BG
        svg_searchText.append('rect')
            .attr('x', 10)
            .attr('y', 0)
            .attr('width', 980)
            .attr('height', hoverMatches.length*75 + 10)
            .attr('fill', '#E6E6E6')
            .attr('opacity', 0.55)
            .attr('stroke', '#000');
        for(i=0; i<hoverMatches.length; i++) {
            // Saliency Bar
            svg_searchText.append('rect')
                            .attr('x', 100)
                            .attr('y', 20 + i*75)
                            .attr('width', function() { return hoverMatches[i].saliency*800; })
                            .attr('height', 50)
                            .attr('fill', d3.lab(hoverMatches[i].LAB[0],hoverMatches[i].LAB[1],hoverMatches[i].LAB[2]))
                            .attr('opacity', 0.25)
                            .attr('stroke', '#000')
                            .attr('index', [hoverMatches[i].LAB[0],hoverMatches[i].LAB[1],hoverMatches[i].LAB[2]])
                            .attr('title', hoverMatches[i].name)
                            .on('mouseover', function() {
                            d3.select(this)
                                .call(drawHistText);
                            var selLAB = d3.select(this).attr('index').split(",").map(x=>+x);
                            sliderStepLum.value(selLAB[0]);
                            var sel_allrect = svg_slice2D.selectAll('rect');
                            sel_allrect.style('opacity', 0.41);
                            sel_allrect.filter(function () { 
                                    var sel_text = d3.select(this).text();
                                    var sel_col = (5 * (Math.round(selLAB[0]/5))) + "," + (5 * (Math.round(selLAB[1]/5))) + "," + (5 * (Math.round(selLAB[2]/5)));
                                    return sel_text == sel_col;
                            })
                            .attr('width', 50)
                            .attr('height', 50)
                            .style('opacity', 1.01)
                            .raise();
                            });
            // Color Name
            svg_searchText.append('text')
                            .attr('x', 110)
                            .attr('y', 55 + i*75)
                            .style('font-size', 30)
                            .text(function() { return hoverMatches[i].name; });
            // Saliency Text
            svg_searchText.append('text')
                            .attr('x', 920)
                            .attr('y', 55 + i*75)
                            .style('font-size', 30)
                            .text(function() { return (d3.format('.2d')(hoverMatches[i].saliency*100) + '%'); });
            // Color Box
            svg_searchText.append('rect')
                            .attr('x', 20)
                            .attr('y', 20 + i*75)
                            .attr('width', 50)
                            .attr('height', 50)
                            .attr('fill', d3.lab(hoverMatches[i].LAB[0],hoverMatches[i].LAB[1],hoverMatches[i].LAB[2]))
                            .attr('stroke', '#000')
                            .attr('index', [hoverMatches[i].LAB[0],hoverMatches[i].LAB[1],hoverMatches[i].LAB[2]])
                            .attr('title', hoverMatches[i].name)
                            .on('mouseover', function() {
                            d3.select(this)
                                .call(drawHistText);
                            var selLAB = d3.select(this).attr('index').split(",").map(x=>+x);
                            sliderStepLum.value(selLAB[0]);
                            var sel_allrect = svg_slice2D.selectAll('rect');
                            sel_allrect.style('opacity', 0.41);
                            sel_allrect.filter(function () { 
                                    var sel_text = d3.select(this).text();
                                    var sel_col = (5 * (Math.round(selLAB[0]/5))) + "," + (5 * (Math.round(selLAB[1]/5))) + "," + (5 * (Math.round(selLAB[2]/5)));
                                    return sel_text == sel_col;
                            })
                            .attr('width', 50)
                            .attr('height', 50)
                            .style('opacity', 1.01)
                            .raise();
                            });
        }
    }   
}
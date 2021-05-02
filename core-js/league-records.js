const recordMargin = {top:100, bottom:50, right:50, left:50}
const recordHeightOuter = 500
const recordHeight = recordHeightOuter - recordMargin.top - recordMargin.bottom;

const recordSvgOuter = d3.select("#individual-records")
                    .attr("width", "100%")
                    .attr("height", recordHeightOuter)
                    .style('border', "1px solid black");

    console.log(recordSvgOuter)
             
    
const recordWidth = parseInt(recordSvgOuter.style("height"), 10) - recordMargin.left - recordMargin.right

const recordSvg = recordSvgOuter
                    .append("g").attr("transform", `translate(${recordMargin.left}, ${recordMargin.top})`)

              
let playersTrim = d3.sort(allstars, (x,y) => y.star_goals - x.star_goals).slice(0,10)
//let scoutSeasonTrim = d3.sort(teamSeasons, (x,y) => y.star_goals - x.star_goals).slice(0,10)

const records_scale_y = d3.scaleLinear().domain([0, 9])
                                      .range([0, recordHeight])

const records_scale_x = d3.scaleLinear().domain([1, 8]).range(["30%", "90%"])
console.log(records_scale_y(2))
const recordsAlreadyDrawn=false;

const drawRecordName = (canvas, fullData, filterData, columnName, start, end) => {
    const time = 500;
    const column = canvas.selectAll(`text.${columnName}`)
        .data(filterData, d=>d.star)
        .join(enter => enter.append("text")
            .text(d=>d[columnName])
            .attr("class", columnName)
            .attr("x", "7%")
            .style("opacity", 0)
            .attr("y", (d,i) => records_scale_y(i))
            .call(enter => enter.transition().delay(time).duration(time)
                .style("opacity", 1)),
        update => update
            .text(d=>d[columnName])
            .attr("x", end)
            .call(update => update
                .transition().delay(time).duration(time)
                .attr("y", (d,i) => records_scale_y(i))),
            exit => exit
            .call(exit => exit.transition().duration(time)
                .style("opacity", 0).remove()));
}
const drawRecordColumn = (thisSvg, fullData, filterData, columnName, index) => {
    const time = 500;
    let radius = 18;
    if (columnName=='bruiser') {
        radius = 21
    }
    
    const columnMax = d3.max(fullData, d=>d[columnName])

    console.log(thisSvg)
    const columnCircles = thisSvg.selectAll(`circle.${columnName}`)
        .data(filterData, d=>d.star)
        .join(enter => enter.append("circle")
        .attr("class", columnName)
        .attr("cx", records_scale_x(index))
        .attr("cy", (d,i) => records_scale_y(i) - 0.5*radius)
        .attr("r", radius)
        .style("stroke", "none")
        .style("fill", "none")
        .style("fill", d=>d[columnName] == columnMax ? "maroon" : "none")
        .style("opacity", 0)
            .call(enter => enter.transition().duration(time).delay(time)
                                .style("opacity", 1)), 

        update => update
            .text(d=>d.star_hits)
            .attr("cx", records_scale_x(index))
            .call(update => update
                .transition().delay(time).duration(time)
                .attr("cy", (d,i) => records_scale_y(i) - 0.5*radius)),
        exit => exit
            .call(exit => exit.transition().duration(time)
                .style("opacity", "0").remove()));



    const column = thisSvg.selectAll(`text.${columnName}`)
            .data(filterData, d=>d.star)
            .join(enter => enter.append("text")
                .text(d=>d[columnName])
                .attr("class", columnName)
                .style("opacity", 0)
                .attr("x", records_scale_x(index))
                .attr("y", (d,i) => records_scale_y(i))

                .call(enter => enter.transition().delay(time/2).duration(time)
                    .style("opacity", 1)
                    .style("fill", d=>d[columnName] == columnMax ? "white" : "black")),
            update => update
                .text(d=>d[columnName])
                .attr("x", records_scale_x(index))
                .call(update => update
                    .transition().delay(time).duration(time)
                    .attr("y", (d,i) => records_scale_y(i))),
        exit => exit
                .call(exit => exit.transition().duration(time)
                    .style("opacity", 0).remove()))

    return column
}

const textDy = -28;

const labels = [{column:'star_goals', 'letter':'G'},
                 {column:'star_assists','letter':'A'},
                 {column:'points','letter':'P'},
                 {column:'star_hits','letter':'H'},
                 {column:'hat_trick','letter':'HT'},
                 {column:'goals_in_game','letter':'SGG'},
                 {column:'points_in_game','letter':'SGP'},
                 {column:'bruiser','letter':'BI'}]


const labelText = recordSvg.selectAll("text.record-header")
        .data(labels)
        .join("text")
        .text(d=>d.letter)
        .attr("class", d=>`record-header record-header-${d.column}`)
        .attr("dy", 1.5*textDy)
        .attr("x", (d,i) => records_scale_x(i+1))
        .on("click", function (event, d) {
            labelText.style("fill", "black")
            d3.select(this).style("fill", "blue")
            const filteredData = d3.sort(allstars, (x,y)=>y[d.column] - x[d.column]).slice(0,10);
            drawRecords(filteredData)
        })

console.log(labelText);


recordSvg.select('.record-header-star_goals').style('fill', "blue")
recordSvg.append("text").text("Name")
                .attr("x", "7%")
                .attr("dy", 1.5*textDy)
                .attr("class", "record-header-name")


const drawRecords = (filtered) => {
    
                   const time = 500;
                   const stars = drawRecordName(recordSvg, allstars, filtered, "star");
                   const goals = drawRecordColumn(recordSvg, allstars, filtered, "star_goals", 1)
                   const assists = drawRecordColumn(recordSvg, allstars, filtered, "star_assists",  2)
                   const points = drawRecordColumn(recordSvg, allstars, filtered, "points", 3)
                   const hits = drawRecordColumn(recordSvg, allstars, filtered, "star_hits", 4);
                   const hatTricks = drawRecordColumn(recordSvg, allstars, filtered, "hat_trick",  5);
                   const goalsInGame = drawRecordColumn(recordSvg, allstars, filtered, "goals_in_game", 6);
                   const poinstInGame = drawRecordColumn(recordSvg, allstars, filtered, "points_in_game", 7);
                   const bruiserIndex = drawRecordColumn(recordSvg, allstars, filtered, "bruiser", 8)
                
};



drawRecords(playersTrim)

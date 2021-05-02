const drawTeam = (teamRecord, rivalRecords, rivalDetails, teamPlayers, teamSeasons, colors) => {

svgPath = {'Cheese':'cheese-vect.svg',
            'Neutral Zone Trap':'trap-vect.svg',
            'Russians':'russians-vect.svg',
            'Hat Lookers':'hatlookers-vect.svg',
            "Checking for Striped Arms":"checkers-vect.svg",
            "Shameful Knights":'shame-vect.svg',
            "Petes":"petes-vect.svg",
            "Benchminors":"bench-vect.svg",
            "Coasters":"coasters-vect.svg",
            "Taco Time":"taco-time-vect.svg",
            "Pinguine":"pinguine-vect.svg",
            "Refuse to Lose":"refusetolose-vect.svg",
            'Slappers':"spappers-vect.svg",
            'Scouting for Goals':'scouters-vect.svg',
            'Ireland':'ireland-vect.svg',
            'Montage Moment':'montage-vect.svg'}

const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length==1 ? "0" + hex : hex;
}

const suffix = {
    1:'st',
    2:'nd',
    3:'rd',
    4:'th',
    5:'th',
    6:'th',
    7:'th',
    8:'th',
    9:'th',
    10:'th',
    11:'th',
    12:'th',
    13:'th',
    14:'th',
    15:'th',
    16:'th',
    17:'th',
    18:'th',
    19:'th'
}

    d3.select('.lore').style("border", '1px solid '+colors.secondary)

    const maxSeason = d3.max(teamRecord, d=>d.season)
    const margin = {top:40, bottom:70, left:150, right:140}
    
    const header = d3.select(".team-header")
                    .style("background-color", colors.primary)
    const svgCanvas = d3.select("#season-history")
                    .attr("width", "100%")
                    .attr("height", 400);
    var pixelWidth = parseInt(svgCanvas.style("width"));
    
    //BIG STATS HTML
    const bigStats = d3.select(".big-stats")
                    .style("background-color", colors.primary);
    
    const thisData = team_data.filter(d=>d.team==teamName)[0]
    
    const regSort = d3.sort(team_data, (x,y) => y.regular_rate - x.regular_rate)
    const playSort = d3.sort(team_data, (x,y) => y.playoff_rate - x.playoff_rate)
    

    
    
    const getRank = (dataArray) => {
        var regRank;
        var playRank;
        for (i=0; i<team_data.length; i++) {
            if (regSort[i].team==teamName) {
                regRank = i+1
            }
    
            if(playSort[i].team==teamName) {
                playRank = i+1
            }
        }
        return [regRank, playRank]
    }
    
    const ranks = getRank(team_data)
    const f = d3.format(".1f");
    const tweenText = (newValue) => {
        return function() {
            var currentValue = +this.textContent;
            var i = d3.interpolateNumber(currentValue, newValue);
            return function(t) {
                this.textContent = f(i(t))+"%";
            };
        }
    }
    console.log(ranks)
    d3.selectAll(".n").text(team_data.length)
    
    const regRateRound = Math.round(thisData.regular_rate*1000)/10
    const playRateRound = Math.round(thisData.playoff_rate*1000)/10
    
    const scrollBigStats = () => {
        d3.select("#reg-win").text(thisData.regular_wins);
        d3.select("#reg-loss").text(thisData.regular_games - thisData.regular_wins)
        d3.select("#reg-rate").text(0)
            .transition().duration(regRateRound*50)
            .tween('text', tweenText((regRateRound)))
        
        d3.select("#reg-rank").text(ranks[0]+suffix[ranks[0]])
        
        d3.select("#play-win").text(thisData.playoff_wins);
        d3.select("#play-loss").text(thisData.playoff_games - thisData.playoff_wins);
        d3.select("#play-rate").text(0).transition().duration(playRateRound*50)
            .tween('text', tweenText(playRateRound))
        d3.select("#play-rank").text(ranks[1]+suffix[ranks[1]])
        
    }


    

    //BIG STATS VIS SVG
    
    const bsOuterHeight = 425;
    const bsMargin = {top:20, left:80, right:20, bottom:40}
    
    
    
    const regularSvgOuter = d3.select("#regular-vis-svg")
                            .attr("width", "100%")
                            .attr("height", bsOuterHeight)
    
    const playoffSvgOuter = d3.select("#playoff-vis-svg")
                            .attr("width", "100%")
                            .attr("height", bsOuterHeight);
    
    const bsOuterWidth = parseInt(regularSvgOuter.style("width"));
    
    const bsHeight = bsOuterHeight - bsMargin.top - bsMargin.bottom;
    const bsWidth = bsOuterWidth - bsMargin.left - bsMargin.right;
    
    const regularSvg = regularSvgOuter.append("g")
                        .attr("transform", `translate(${bsMargin.left}, ${bsMargin.top})`)
    
    const playoffSvg = playoffSvgOuter.append("g")
                        .attr("transform", `translate(${bsMargin.left}, ${bsMargin.top})`)
                        
    const bs_scale_x = d3.scaleLinear()
            .domain([0,1])
            .range([0, bsWidth])
    const bs_scale_y = d3.scaleBand()
            .range([bsHeight, 0])
            .paddingInner(0.25)
    
    const regularRateSort = d3.sort(team_data, (x,y) => x.regular_rate - y.regular_rate).map(d=>d.team);
    const playoffRateSort = d3.sort(team_data, (x,y) => x.playoff_rate - y.playoff_rate).map(d=>d.team);
    
    
    const barTransition=500
    const barDelay = 3;

    const transitionInRecordBars = () => {
        bs_scale_y.domain(regularRateSort)
        const regularGroups = regularSvg.selectAll(".regular-group")
            .data(team_data)
            .join("g")
            .attr("class", "regular-group")
            .attr("transform", d=>`translate(0, ${bs_scale_y(d.team)})`)
        const regularBars = regularGroups
                .append("rect")
                .attr("height", bs_scale_y.bandwidth())
                .attr("class", "regular-bar")
                .style("fill", d=>d.team==teamName ? colors.primary : "lightgrey")
                .transition().duration(barTransition).delay(d=>bs_scale_y(d.team)*3)
                .attr("width", d=>bs_scale_x(d.regular_rate))
        const regularTeamName = regularGroups
                .append("text")
                .attr("class", "team-abbrev")
                .text(d=>d.abbrev)
                .style("font-size", bs_scale_y.bandwidth()*0.9)
                .attr("y", bs_scale_y.bandwidth()*0.9)
                .attr("x", 2)
                .style("fill", d=> d.team==teamName ? colors.text : "black")
                .style("opacity", 0)
                .transition().duration(barTransition).delay(d=>bs_scale_y(d.team)*3)
                .style("opacity", 1)
        const regularNumber = regularGroups
            .append("text")
            .attr("class", "number")
            .text(d=>Math.round(d.regular_rate*1000)/10+"%")
            .attr("y", bs_scale_y.bandwidth()*0.9)
            .style("font-size", bs_scale_y.bandwidth()*0.9)
            .attr("x", 5)
            .transition().duration(barTransition).delay(d=>bs_scale_y(d.team)*3)
            .attr("x", d=>bs_scale_x(d.regular_rate) + 5)
        
        
                //Change scale
        bs_scale_y.domain(playoffRateSort)
        const playoffGroups = playoffSvg.selectAll('.playoff-group')
            .data(team_data)
            .join("g")
            .attr("class", "playoff-group")
            .attr("transform", d=>`translate(0, ${bs_scale_y(d.team)})`)
        
        const playoffBars = playoffGroups
            .append("rect")
            .attr("height", bs_scale_y.bandwidth())
            .attr("class", "playoff-bar")
            .style("fill", d=>d.team==teamName ? colors.primary : "lightgrey")
            .transition().duration(barTransition).delay(d=>bs_scale_y(d.team)*3)
            .attr("width", d=>bs_scale_x(d.playoff_rate))
            
        const playoffTeamname = playoffGroups
            .append("text")
            .attr("class", "team-abbrev")
            .text(d=>d.abbrev)
            .style("font-size", bs_scale_y.bandwidth()*0.9)
            .attr("y", bs_scale_y.bandwidth()*0.9)
            .attr("x", 2)
            .style("fill", d=> d.team==teamName ? colors.text : "black")
            .style("opacity", 0)
            .transition().duration(barTransition).delay(d=>bs_scale_y(d.team)*3)
            .style("opacity", 1)
        
        const playoffNumber = playoffGroups
            .append("text")
            .attr("class", "number")
            .text(d=>Math.round(d.playoff_rate*1000)/10+"%")
            .attr("y", bs_scale_y.bandwidth()*0.9)
            .attr("x", d=>bs_scale_x(d.playoff_rate) + 5)
            .style("font-size", bs_scale_y.bandwidth()*0.9)
            .attr("x", 5)
            .transition().duration(barTransition).delay(d=>bs_scale_y(d.team)*3)
            .attr("x", d=>bs_scale_x(d.playoff_rate) + 5)
        
            //Handle event listeners:
        regularGroups.on("mouseover", function(event, d) {
            d3.select(this).select("rect").style("fill", d.primary)
            d3.select(this).select(".team-abbrev").style("fill", d.text)
        })
        
        regularGroups.on("mouseout", function(event, d) {
            if (d.team!=teamName) {
            d3.select(this).select("rect").style("fill", "lightgrey")
            d3.select(this).select("text").style("fill", "black")
            }
        }) 
        
        playoffGroups.on("mouseover", function(event, d) {
            d3.select(this).select("rect").style("fill", d.primary)
            d3.select(this).select(".team-abbrev").style("fill", d.text)
        })
        
        playoffGroups.on("mouseout", function(event, d) {
            if (d.team!=teamName) {
            d3.select(this).select("rect").style("fill", "lightgrey")
            d3.select(this).select("text").style("fill", "black")
            }
        }) 
    }    
    //d3.select("#postseason").style("background-color", colors.secondary).style("color", "white")
    
    
    const svg = svgCanvas
             .append("g")
             .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
    
    
    const xScale = d3.scaleLinear()
                      .domain([1,maxSeason])
                      .range([0 , pixelWidth-margin.left-margin.right]);
    
    
    
    const tipWidth = 250;
    const tipHeight=200;
    const transitionDur=250;
    const tipBump=10;
    
    const drawTip = (season) => {
        const thisNode = d3.select(`#season-${season}-tip-group`)
        console.log(thisNode)
        if (thisNode.select("text").style("fill") != "lightgrey")  {
            thisNode.select("circle").style("fill", colors.primary)
            thisNode.select("text").style("fill", colors.text)
        }
    
        const toolGroup = thisNode.append("g")
                            .attr("class", "toolgroup")
                            .style("pointer-events", "none")
    
        const toolline = toolGroup.append("line");
    
        const toolrect = toolGroup.append("rect")
        .attr("x", -tipWidth/2)
        .attr("width", d=>tipWidth)
        .style("ry", 20)
        .style("rx", 20)
        .attr("stroke", thisNode.select("circle").style("stroke"))
        .style("fill", "white")
        .attr("y", 0)
        .attr("height",d=>d.text.length*0.6+35)
        .style("opacity", 0)
        .transition().delay(transitionDur/2).duration(transitionDur).ease(d3.easeLinear)
        .style("opacity", 1);
    
        toolline
            .attr("x1", 0)
            .attr("x2", 0)
            .style("stroke", thisNode.select("circle").style("stroke"))
            .attr("y2", thisNode.select("circle").attr("cy") - thisNode.select("circle").attr("r"))
            .attr("y1", thisNode.select("circle").attr("cy") - thisNode.select("circle").attr("r"))
            .transition().duration(transitionDur)
            .attr("y1", function() {
                console.log(thisNode)
                const rect = thisNode.select("rect")
                return parseInt(rect.style("height"),10) + parseInt(rect.style("y"),10)
            })
            
    
    
    
       
        const wrap = d3.textwrap()
            .bounds({height:tipHeight, width:tipWidth})
            .padding(20)
            .method("tspans"); 
    
    
    
    
        const tooltext = toolGroup.append("text")
            .attr("x", -tipWidth/2)
            .attr("y", 10)
            .text(d=>d.text)
            .style("font-family",'Helvetica')
            .call(wrap)
            .style('opacity', 0)
            .transition().duration(transitionDur)
            .style("fill", "charcoal")
            .style('opacity', 1)
    }
    
    const groups = svg.selectAll(".circle-group")
        .data(teamRecord)
        .join("g")
        .attr("class", "circle-group")
        .attr("id", d=>`season-${d.season}-tip-group`)
        .attr("transform", d=>`translate(${xScale(d.season)}, 0)`)
    
    
    const dotShiftVert = 300;
    const lines = groups.append("line")
        .attr("y1", dotShiftVert)
        .attr("y2", dotShiftVert)
        .attr("x1", 0)
        .attr("x2", xScale(2))
        .style("stroke", colors.primary)
        .style("stroke-width", 2)
        .style("stroke", (d, i, nodes)=>(d.played==1 && d.season!= maxSeason && d3.select(nodes[i+1]).data()[0].played==1) ? colors.primary : "lightgrey")
        .style("opacity", d => d.season==maxSeason ? 0 : 1 )
        .style("stroke-dasharray", (d, i, nodes) => (d.played==1 && d.season!= maxSeason && d3.select(nodes[i+1]).data()[0].played==1) ? 0 : 5)
        .style("pointer-events", 'none')
        
    const dots = groups.append("circle")
        .attr("r", 25)
        .attr("cy", dotShiftVert)
        .attr("cx", 0)
        .attr("fill", "white")
        .attr("stroke", d=>d.played==1 ? colors.primary : "lightgrey")
        .attr("stroke-width", d=>d.played==1 ? 2 : 1)
    
    const numbers = groups.append("text")
            .attr("x", 0)
            .attr("y", dotShiftVert+7)
            .style("text-anchor", "middle")
            .style("font-family", "Helvetica")
            .style("font-weight", 600)
            .style("font-size", 20)
            .style("fill", d=>d.played==1 ? colors.primary : "lightgrey")
            .text(d=>d.season)
            .style("pointer-events", "none");
    
    groups    
        .on("mouseover", (event, d)=> drawTip(d.season))
        .on("mouseout", function() {
        thisNode = d3.select(this)
        if (thisNode.select("text").style("fill")!= "lightgrey") {
            thisNode.select("circle").style("fill", "white")
            thisNode.select("text").style("fill", colors.primary)
        }
        
        thisNode.selectAll("g.toolgroup").selectAll("rect").remove()
        thisNode.selectAll("g.toolgroup").selectAll("line").remove()
        console.log(thisNode.selectAll("g.toolgroup").selectAll("text").remove())
        thisNode.selectAll("g.toolgroup").selectAll("foreignobject").remove()
    });
    
    const winrateMargin = {top:40, bottom:60, left:40, right:40}
    const winrateHeight = 400 - margin.top - margin.bottom;
    const winrate = d3.select("#season-winrate")
                        .attr("width", pixelWidth)
                        .attr("height", winrateHeight + margin.top + margin.bottom);
    const winrateGroup = winrate
                        .append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const winrateWidth = pixelWidth - margin.left - margin.right;
    
    // const wXscale = d3.scaleBand().domain(scoutRecord.map(d=>d.season))
    //                               .range([0, pixelWidth-margin.right-margin.left])
    const wYscale = d3.scaleLinear().domain([0,1])
                        .range([winrateHeight, 0])
                    
    
    const xAxis = d3.axisBottom(xScale)
                     
    
    const wYaxis = d3.axisLeft(wYscale).tickSize(-winrateWidth)
            .ticks(5)
    
    const winrateX = winrateGroup.append("g")
                        .call(xAxis)
                        .attr('transform', `translate(0, ${winrateHeight})`)
                        .attr("class", "winrate-axis");
    const winrateY = winrateGroup.append("g")
                        .call(wYaxis)
                        .attr("class", "winrate-axis");

    console.log(winrateY)
    winrateY.selectAll(".tick line")
        .style("opacity", 0.1)

    console.log(winrateY.selectAll(".tick text"))
    winrateY.selectAll(".tick text")
        .attr("transform", "translate(-5,0)")

    winrateY.selectAll("path").style("opacity", 0.0)

    
    const winrateLabelY = winrateGroup.append("text")
                            .text("Season win fraction")
                            .attr("class", "axis-label")
                            .attr("transform", "rotate(-90)")
                            .attr("x", -winrateHeight/2)
                            .attr("y", -margin.left/3)
                            

    const winrateLabelX = winrateGroup.append("text")
                .text("Season")
                .attr("class", "axis-label")
                .attr("x", xScale(1 + (maxSeason-1)/2))
                .attr("y", winrateHeight + margin.bottom*0.9)
                        
                        
    const drawLineGraph = (teamData, name, color, rival=false) =>  {
        const teamDots = winrateGroup.selectAll(`circle.${name}`)
                        .data(teamData)
                        .join('circle')
                        .attr("class", `team-dot ${name}-dot`)
                        .attr("r", 7)
                        .attr("cx", d=>xScale(d.season))
                        .attr("cy", d=>wYscale(d.win_pct))
                        .style("fill", color)
                        .style("opacity", 0)
                        .transition().delay((d,i) => i*200).duration(500)
                        .style("opacity", 1)
        const teamlines = winrateGroup.selectAll('.winrate-line')
                        .data(teamData)
                        .join("line")
                        .attr("class", `team-line ${name}-line`)
                        .attr("x1", d=>xScale(d.season))
                        .attr("y1",d=>wYscale(d.win_pct))
                        .attr("x2", d=>xScale(d.season))
                        .attr("y2", d=>wYscale(d.win_pct))
                        .transition().delay((d,i) => i* 200).duration(500)
                        .attr("y2", (d, i, nodes) => {
                                if (d.season==maxSeason) {
                                    return wYscale(d.win_pct)
                                }
                                else if (d.win_pct!=-1 && d3.select(nodes[i+1]).data()[0].win_pct!=-1){
                                   return wYscale(d3.select(nodes[i+1]).data()[0].win_pct)
                                } else {
                                    return wYscale(d.win_pct)
                                }
                        })
                        .attr("x2", (d, i, nodes) => {
                                if (d.season==maxSeason) {
                                    return xScale(d.season)
                                } else if (d.win_pct!=-1 && d3.select(nodes[i+1]).data()[0].win_pct!=-1) {
                                    return xScale(d3.select(nodes[i+1]).data()[0].season)
                                } else {
                                    return xScale(d.season)
                                }
                            })
                        .style("stroke",color)
    
    };
    
const removeLineGraph = (name) => {
        const transition = 500;
        console.log(d3.selectAll(`.${name}-line`))
        d3.selectAll(`.${name}-line`).transition().duration(transition).style("opacity", 0).remove()
        d3.selectAll(`.${name}-dot`).transition().duration(transition).style("opacity", 0).remove()
    }
    
    var rivalsDrawn = false
    const rivalButton = d3.select("#rival-button-container")
                            .style("text-align", "center")
                            .append("button")
                            .text("Display rivals' records")
                            .attr("class", "rival-button")
                            .style("border", "1px solid " + colors.primary)
                            .style("background-color", "white")
                            .style("color", colors.primary)
                            .on('mouseover', function() {
                                d3.select(this).transition().duration(300)
                                            .style("color", colors.text)
                                            .style("background-color", colors.primary)
                            })
                            .on('mouseout', function() {
                                if (!rivalsDrawn) {
                                d3.select(this).transition().duration(300)
                                            .style("color", colors.primary)
                                            .style("background-color", colors.text)
                                }
                            })
                            .on("click", function() {
                                console.log(d3.selectAll(".SPAP-line"))
                                if (rivalsDrawn==true) {
                                    rivalsDrawn=false
                                    console.log("hif rom if!")
                                    d3.select(this).text("Display rivals' records")
                                    for(i=0; i < rivalDetails.length; i++) {
                                        removeLineGraph(rivalDetails[i].abbrev)
                                    }
                                } else {
                                    rivalsDrawn=true
                                    console.log("hi from else")
                                    d3.select(this).text("Hide rivals' records")
                                    for (i=0; i<rivalRecords.length; i++){
                                        const abbrev = rivalDetails[i].abbrev
                                        drawLineGraph(rivalRecords[i], abbrev, rivalDetails[i].primary)
                            
                                    }
                                }});
    
    
    /*-------------------PLAYOFF HIST--------------------*/
    
    const histMargin = {top:150, bottom:50, right:50, left:150}
    const histOuterHeight = 700;
    const histHeight = histOuterHeight - histMargin.top - histMargin.bottom;
    
    const histOuterSvg = d3.select("#playoff-hist")
                       .attr("width", "100%")
                       .attr("height", histOuterHeight);
    
    const histOuterWidth = parseInt(histOuterSvg.style("width"), 10);
    const histWidth = histOuterWidth - histMargin.left - histMargin.right
    const histSvg = histOuterSvg.append("g")
                            .attr("transform", `translate(${histMargin.left}, ${histMargin.top})`);
    
    const playoffCats=   ['Inactive', 'Missed', 'Play-in', 'First Round', 'Semifinals', 'Finals', 'Champion']
    
    const barHeight = 30
    const barGap = 10
    const lineShift = 15;

    const histX = d3.scaleBand().domain(playoffCats)
                                .range([0, histWidth])
                                //.paddingInner(0.1);
    const histY = d3.scaleLinear().domain([1,maxSeason])
                                .range([lineShift*7, histHeight]);

    const seasonsList = []
    for (i=0; i<maxSeason; i++) {
        seasonsList.push("S"+(i+1))
    }

    console.log(seasonsList)

    const histTickSize = 22;
    const histYAxisText = histSvg.selectAll("text.axis")
                        .data(seasonsList)
                        .join("text")
                        .attr("class", "axis")
                        .text(d=>d)
                        .attr("y", (d,i)=>histY(i+1))
                        .style("font-size", histTickSize)
                        .attr("dx", -histTickSize*5)
                        .attr("dy", histTickSize*1);



    const histYAxisLines = histSvg.selectAll("line.axis-dotted")
                        .data(teamRecord)
                        .join("line")
                        .attr("class", "axis-dotted")
                        .attr("y1", (d,i) =>histY(i+1) + barHeight/2)
                        .attr("y2",(d,i) =>histY(i+1) + barHeight/2)
                        .attr("x2",d=>(d.playoffs=="Missed" || d.playoffs=="Inactive") ? histX(d.playoffs) : histX("Play-in"))
                        .attr("x1",-histTickSize*3)
                        .style("stroke", "black")
                        .style("stroke-dasharray", 7)
                        .style("stroke-opacity", 0.3)
    
    
    histSvg.selectAll("line.bottom").data(playoffCats).join("line")
                    .attr("y1", (d,i) =>  i*lineShift)
                    .attr("y2", (d,i) => i*lineShift)
                    .attr("x1", d=>histX(d) -   histX.bandwidth()*histX.paddingInner()/2)
                    .attr("x2", d=>histX(d) + histX.bandwidth() + histX.bandwidth()*histX.paddingInner()/2 )
                    .attr("class", "bottom")
                    .style("stroke", "black")
                    .style("stroke-opacity", d=>d=="Inactive" ? 0 : 1)
                    .style("stroke-dasharray", d=> d=="Missed" ? 6 : 0)
    
    histSvg.selectAll("line.vert").data(playoffCats).join("line")
                    .attr("y1", (d,i) =>  i*lineShift)
                    .attr("y2", (d,i) =>  + (i+1)*lineShift)
                    .attr("x1", d=>histX(d) + histX.bandwidth() + histX.bandwidth()*histX.paddingInner()/2)
                    .attr("x2", d=>histX(d) + histX.bandwidth() + histX.bandwidth()*histX.paddingInner()/2)
                    .attr("stroke", "black")
                    .style("stroke-opacity", d=> (d=="Champion" || d=="Inactive") ? 0 : 1)
    histSvg.selectAll("text.annotation").data(playoffCats).join("text")
                    .attr("x", d=>histX(d) + histX.bandwidth()/2)
                    .attr("y", (d,i) => i*lineShift - 10)
                    .attr("class", "annotation")
                    .text(d=>d)
                    .style("fill", d=> d=="Inactive" ? "#A8A8A8" : "Black")
                    .style("opacity", d=> d=="Missed" ? 0.65 : 1)
                    .style("stroke-dasharray", d=>d=="Missed" ? 6 : 0)
    
    // histSvg.append("line")
    //         .attr("class", "baseline")
    //         .attr("x1", 0)
    //         .attr("x2", histWidth)
    //         .attr("y1", histHeight/2 + barHeight)
    //         .attr("y2", histHeight/2 + barHeight)
    //         .style("stroke", colors.primary)
    //         .style("stroke-width", 3)
        
    const addRect = (ob, property, svg, innerHeight, barHeight, barWidth, gap) => {
        const shift=innerHeight/2;
        svg.append("rect")
            .attr("height", barHeight)
            .attr("width", barWidth)
            .attr("y", histY(ob.season)) //innerHeight - shift -gap*tracker[property]
            .attr("x", histX(property) - 1750)
            .style("fill", property=='Inactive' ?  "#A9A9A9" : colors.primary)
            .style("opacity", 0)
            .transition().duration(1500).delay(histY(ob.season))
            .style("opacity", ob.playoffs==property ? 1 : 0.3)
            .attr("x", histX(property))
;
        
        const getText = (ob) => {
            if (property=="Missed" || property=="Inactive") {
                return property
            } else {
                return ob['playoff-matchups'][property]
            }
        }

        svg.append("text")
            .attr("y", 20 + histY(ob.season)) //innerHeight - shift - gap * tracker[property] + barHeight/1.5 
            .attr("x", histX(property) + barWidth/2 - 1750)          
            .text(getText(ob))
            .attr("class", "hist-text")
            .transition().duration(1500).delay(histY(ob.season))
            .attr("x", histX(property) + barWidth/2)
     
    }
    console.log(histY(3))
    
    


    
    const drawPlayoffHist = () => {
        const height = barHeight;
        const skip = 10;
        const scale = skip + height;
        for (i=0; i<teamRecord.length; i++) {
    
            const ob = teamRecord[i]
            const status = ob.playoffs;
    
            if (status=="Inactive") { 
                addRect(ob, "Inactive", histSvg, histHeight, height, histX.bandwidth(), scale)
                continue }
            if (status=='Missed') {
                addRect(ob, "Missed", histSvg, histHeight, height, histX.bandwidth(), scale)
                continue;
            } 
            addRect(ob, "Play-in", histSvg, histHeight,  height, histX.bandwidth(), scale);
    
            if (status=='Play-in') { continue }
    
            addRect(ob, "First Round", histSvg, histHeight,  height, histX.bandwidth(), scale);
    
            if (status=='First Round') { continue }
    
            addRect(ob, "Semifinals", histSvg, histHeight, height, histX.bandwidth(), scale);
    
            if (status=='Semifinals') { continue }
            
            addRect(ob, "Finals", histSvg, histHeight, height, histX.bandwidth(), scale);
    
            if (status=="Finals") { continue }
    
            addRect(ob, "Champion", histSvg, histHeight, height, histX.bandwidth(), scale);
    
            
    
    
        }
        
    
    }
    
    drawPlayoffHist()


    
    /*-----------------END PLAYOFF HIST--------------------*/
    

    /*----------------BEGIN TROPHY WALL-------------------*/
    
    let activeSeasons = teamRecord.filter(d=>d.played==1).map(data=>data.season)

    const trophyMargin = {top:80, bottom:0, left:200, right:150}

    const trophyHeightOuter = 165*activeSeasons.length;
    
    /*
        Cheese: 750?
        Trap: 1050, maybe more.
    */
    const trophyOuterSvgLeft = d3.select("#trophy-wall-left")
            .attr("width", 1050)
            .attr("height", trophyHeightOuter)
            .style("background-color", "white")
            .style("border", "2px solid "+colors.primary)
            
    
    const trophyOuterSvgRight = d3.select("#trophy-wall-right")
            .attr("width", "100%")
            .attr("height", trophyHeightOuter)
            
            


    const trophyWidthOuter  = parseInt(trophyOuterSvgLeft.style("width"), 10);



    const trophyHeight = trophyHeightOuter - trophyMargin.top - trophyMargin.bottom;
    const trophyWidth = trophyWidthOuter - trophyMargin.left - trophyMargin.right
    const trophyLeft = trophyOuterSvgLeft.append("g")
                    .attr('transform', `translate(${trophyMargin.left}, ${trophyMargin.top})`)
                    

    const trophyRight = trophyOuterSvgRight.append("g")
                    .attr('transform', `translate(${trophyMargin.left}, ${trophyMargin.top})`)
                    

            
            

    console.log(trophyWidthOuter);
    
    let teamAwards = [];
    for (season=1; season<=teamRecord.length; season++) {
        let awardsObject = teamRecord[season-1].awards
        for (const award in awardsObject) {
            teamAwards.push({'season':season, 'award':award, 'winner':awardsObject[award]})
        }
    };





    
    let trophyScaleLeft = d3.scaleBand().domain(activeSeasons)
                                        .range([0, trophyHeight])
    let trophyScaleRight = d3.scaleBand().domain([2,4,6,8,10,12])
                                        .range([0, trophyHeight])

    let svgDeterminer = (num) => {
        return trophyLeft
    }

    let scaleDeterminer = (num) => {
        return trophyScaleLeft(num)
    }

    let star ="M 483 200.7 L 373.4 308.2 l 26.3 150.5 c 0.3 1 0.4 2 0.4 3.1 c 0 7.4 -6.1 13.5 -13.5 13.5 c -2.1 0 -4.2 -0.5 -6.2 -1.5 l -136.1 -71.1 l -135.7 71.9 c -2 1.1 -4.1 1.6 -6.3 1.6 c -2.8 0 -5.6 -0.9 -7.9 -2.6 c -4.2 -3 -6.3 -8.1 -5.4 -13.2 L 114.5 309 L 4.2 202.1 c -3.7 -3.5 -5.1 -8.9 -3.5 -13.8 c 1.6 -4.9 5.8 -8.4 10.9 -9.2 l 152 -22.6 l 67.5 -137.9 c 2.3 -4.7 7 -7.6 12.1 -7.6 c 5.1 0 9.8 2.9 12.1 7.5 L 323.7 156 l 152 21.6 c 5.1 0.8 9.3 4.3 10.9 9.2 C 488.2 191.7 486.9 197.1 483 200.7 Z"
    
    const awardsList = ['Champion', "Lemon",  "All-star", "AMVP"]

    const awardExampleHeightOuter = 150;
    const awardExampleSvg = d3.select(".award-example").append("svg")
                             .attr("width", "100%")

                             .attr("height", awardExampleHeightOuter)

    
    const awardExampleWidthOuter = parseInt(awardExampleSvg.style("width"))
    const exampleMargin = {top:30, bottom:20, left:20, right:20}
    const exWidth = awardExampleWidthOuter - exampleMargin.left - exampleMargin.right;
    const exHeight = awardExampleHeightOuter - exampleMargin.top - exampleMargin.bottom;


    const exampleScaleX = d3.scaleBand().domain(awardsList).range([0, exWidth]).paddingOuter(0.5)                   
    awardExampleSvg.append("g").attr("transform", `translate(${exampleMargin.left}, ${exampleMargin.top})`)
    
    const awardsListIndiv = ["FMVP", "MVP", "DPOTY", "GOTY", "ROTY", "MIPOTY", "COTY"]

    const awardExampleHeightOuterIndiv = 150;
    const awardExampleSvgIndiv = d3.select(".award-example").append("svg")
                             .attr("width", "100%")

                             .attr("height", awardExampleHeightOuterIndiv)

    
    const awardExampleWidthOuterIndiv = parseInt(awardExampleSvgIndiv.style("width"))
    const exampleMarginIndiv = {top:20, bottom:20, left:20, right:20}
    const exWidthIndiv = awardExampleWidthOuterIndiv - exampleMarginIndiv.left - exampleMarginIndiv.right;
    const exHeightIndiv = awardExampleHeightOuterIndiv - exampleMarginIndiv.top - exampleMarginIndiv.bottom;


    const exampleScaleXIndiv = d3.scaleBand().domain(awardsListIndiv).range([0, exWidthIndiv]).paddingOuter(0)                   
    awardExampleSvgIndiv.append("g").attr("transform", `translate(${exampleMarginIndiv.left}, ${exampleMarginIndiv.top})`)

console.log(exampleScaleX("FMVP"))
    const starBump =17;    
    console.log(scaleDeterminer(2))
    let trophyLineHeight=100;
    let trophySkipHeight = 30;
    let logoSize = 50;
    const lemonSize=90;
    const lemonBump = 10;
    let trophyAwardWidth=125;
    const svgBump = 5;
    const vbump = 25 + logoSize;
    const bigTextBump = svgBump + 37

    const exBaseline = exHeight/2

    //Champion
        awardExampleSvg.append("text").text("League")
                .attr("x", exampleScaleX("Champion") + exampleScaleX.bandwidth()/2)
                .attr("y", exBaseline)
                .attr("class", "award champ-award");
        awardExampleSvg.append("text").text("Champion")
                .attr("x", exampleScaleX("Champion") + exampleScaleX.bandwidth()/2)
                .attr("y", exBaseline+vbump)
                .attr("class", "award champ-award")
        awardExampleSvg.append("image").attr("xlink:href", '/logos/' + svgPath[teamName])
            .attr('width', logoSize)
            .attr("height", logoSize)
            .attr("x", exampleScaleX("Champion") - logoSize/2 + exampleScaleX.bandwidth()/2)
            .attr("y", exBaseline+5)

    //Lemon
    awardExampleSvg.append("text").text("Best regular")
        .attr("x", exampleScaleX("Lemon")+ exampleScaleX.bandwidth()/2)
        .attr("y", exBaseline)
        .attr("class", "award champ-award");
    awardExampleSvg.append("text").text("Season record")
        .attr("x", exampleScaleX("Lemon")+ exampleScaleX.bandwidth()/2)
        .attr("y", exBaseline+vbump)
        .attr("class", "award champ-award")

    awardExampleSvg.append("image").attr("xlink:href", "/logos/lemon.svg")
        .attr("x", exampleScaleX("Lemon") - lemonSize/2 + 5+ exampleScaleX.bandwidth()/2)
        .attr("y", exBaseline -10)
        .attr("width", lemonSize*0.9)
        .attr("height", lemonSize*0.9)

    //COTY
    awardExampleSvgIndiv.append("text").text("Coach")
        .attr("x", exampleScaleXIndiv("COTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline)
        .attr("class", "award champ-award");
    awardExampleSvgIndiv.append("text").text("of the year")
        .attr("x", exampleScaleXIndiv("COTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+vbump)
        .attr("class", "award champ-award")
    awardExampleSvgIndiv.append("text").text("COTY")
        .attr("class", "abbrev")
        .attr("x", exampleScaleXIndiv("COTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+ bigTextBump)
        .style("fill", colors.primary)
        //FMVP
        awardExampleSvgIndiv.append("text").text("Finals")
                .attr("x", exampleScaleXIndiv("FMVP") + exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline)
                .attr("class", "award champ-award");
        awardExampleSvgIndiv.append("text").text("MVP")
                .attr("x", exampleScaleXIndiv("FMVP")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline+vbump)
                .attr("class", "award champ-award")
        awardExampleSvgIndiv.append("text").text("FMVP")
                .attr("class", "abbrev")
                .attr("x", exampleScaleXIndiv("FMVP")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline+ bigTextBump)
                .style("fill", colors.primary)
    //MVP
        awardExampleSvgIndiv.append("text").text("Reg. Season")
                .attr("x", exampleScaleXIndiv("MVP")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline)
                .attr("class", "award champ-award");
        awardExampleSvgIndiv.append("text").text("League MVP")
                .attr("x", exampleScaleXIndiv("MVP")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline+vbump)
                .attr("class", "award champ-award")
        awardExampleSvgIndiv.append("text").text("MVP")
                .attr("class", "abbrev")
                .attr("x", exampleScaleXIndiv("MVP")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline+ bigTextBump)
                .style("fill", colors.primary)    
                
    //DPOTY
        awardExampleSvgIndiv.append("text").text("Defenseman")
                .attr("x", exampleScaleXIndiv("DPOTY")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline)
                .attr("class", "award champ-award");
        awardExampleSvgIndiv.append("text").text("Of the year")
                .attr("x", exampleScaleXIndiv("DPOTY")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline+vbump)
                .attr("class", "award champ-award")
        awardExampleSvgIndiv.append("text").text("DOTY")
                .attr("class", "abbrev")
                .attr("x", exampleScaleXIndiv("DPOTY")+ exampleScaleXIndiv.bandwidth()/2)
                .attr("y", exBaseline+ bigTextBump)
                .style("fill", colors.primary)
    //GOTY
    awardExampleSvgIndiv.append("text").text("Goalie")
        .attr("x", exampleScaleXIndiv("GOTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline)
        .attr("class", "award champ-award");
    awardExampleSvgIndiv.append("text").text("of the year")
        .attr("x", exampleScaleXIndiv("GOTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+vbump)
        .attr("class", "award champ-award")
    awardExampleSvgIndiv.append("text").text("GOTY")
        .attr("class", "abbrev")
        .attr("x", exampleScaleXIndiv("GOTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+ bigTextBump)
        .style("fill", colors.primary)

    //ROTY
    awardExampleSvgIndiv.append("text").text("Rookie")
        .attr("x", exampleScaleXIndiv("ROTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline)
        .attr("class", "award champ-award");
    awardExampleSvgIndiv.append("text").text("of the year")
        .attr("x", exampleScaleXIndiv("ROTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+vbump)
        .attr("class", "award champ-award")
    awardExampleSvgIndiv.append("text").text("ROTY")
        .attr("class", "abbrev")
        .attr("x", exampleScaleXIndiv("ROTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+ bigTextBump)
        .style("fill", colors.primary)

    //ROTY
    awardExampleSvgIndiv.append("text").text("Most improved")
        .attr("x", exampleScaleXIndiv("MIPOTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline)
        .attr("class", "award champ-award");
    awardExampleSvgIndiv.append("text").text("Player")
        .attr("x", exampleScaleXIndiv("MIPOTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+vbump)
        .attr("class", "award champ-award")
    awardExampleSvgIndiv.append("text").text("Most")
        .attr("class", "mipoty-abbrev")
        .attr("x", exampleScaleXIndiv("MIPOTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline + bigTextBump*0.66)
        .style("fill", colors.primary)
    awardExampleSvgIndiv.append("text").text("Improved")
        .attr("class", "mipoty-abbrev")
        .attr("x", exampleScaleXIndiv("MIPOTY")+ exampleScaleXIndiv.bandwidth()/2)
        .attr("y", exBaseline+ bigTextBump*1.15)
        .style("fill", colors.primary)

    
    //All-star
    awardExampleSvg.append("path").attr('d', star)
                        .style('fill', colors.primary)
                        .attr("transform", `translate(${exampleScaleX("All-star")-37+ exampleScaleX.bandwidth()/2},${exBaseline-20}) scale(0.15)`)
                            
    awardExampleSvg.append("text")
        .text('All-')
            .attr("x", exampleScaleX("All-star")+ exampleScaleX.bandwidth()/2)
            .attr("y", exBaseline+starBump)
            .attr("class", "allstar")                            
    awardExampleSvg.append("text")
                .text('Star')
              .attr("x", exampleScaleX("All-star")+ exampleScaleX.bandwidth()/2)
               .attr("y", exBaseline+starBump+18)
                .attr("class", "allstar")
    awardExampleSvg.append('text')
                       .text('League All-star')
                       .attr("class", "award allstar-award")
                       .attr("x", exampleScaleX("All-star")+ exampleScaleX.bandwidth()/2)
                       .attr("y", exBaseline+vbump)


        //All-star
    const rad = 38;
    awardExampleSvg.append("circle")
        .style("fill", colors.primary)
        .attr("cx", exampleScaleX("AMVP")+exampleScaleX.bandwidth()/2-1)
        .attr("r", rad)
        .attr("cy", exBaseline + rad/2.2)
    awardExampleSvg.append("path").attr('d', star)
                        .style('fill', "white")
                        .style("stroke", colors.primary)
                        .attr("transform", `translate(${exampleScaleX("AMVP")-35+ exampleScaleX.bandwidth()/2},${exBaseline-20}) scale(0.14)`)
                            
    awardExampleSvg.append("text")
        .text('AMVP')
            .attr("x", exampleScaleX("AMVP")+ exampleScaleX.bandwidth()/2)
            .attr("y", exBaseline+starBump*1.4)
            .style("font-size", "1.3em")
            .attr("class", "allstar-mvp")
            .style("fill", colors.primary)                            

    awardExampleSvg.append('text')
                       .text('All-star game MVP')
                       .attr("class", "award allstar-award")
                       .attr("x", exampleScaleX("AMVP")+ exampleScaleX.bandwidth()/2)
                       .attr("y", exBaseline+vbump)                       


    const drawTrophy = () => {
        let currentY=0;
        for (it=0; it<activeSeasons.length; it++) {
            i = activeSeasons[it]
            console.log(i)

            let currentX=0;
            let trophySvg = svgDeterminer(i)
            const thisSeason = teamAwards.filter(d=>d.season==i);

            if (thisSeason.length==0) {
                trophySvg.append('text')
                .text("No awards this season :(")
                .attr("x", -35)
                .attr("y", scaleDeterminer(i)+40)
                .attr("class", "no-awards")
            }
            
            for (j=0; j<thisSeason.length; j++) {
                const thisOb = thisSeason[j];
                
               // if (!thisOb) { continue };
                console.log(thisOb.award)
                //Handle championship
                if (thisOb.award=='Champion') {
                    trophySvg.append("text").text("Season " + i)
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i))
                            .attr("class", "award champ-award");
                    trophySvg.append("text").text("Champs")
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i) + vbump)
                            .attr("class", "award champ-award")
                    console.log(scaleDeterminer(i))
                    trophySvg.append("image").attr("xlink:href", '/logos/' + svgPath[teamName])
                        .attr('width', logoSize)
                        .attr("height", logoSize)
                        .attr("x", currentX - logoSize/2)
                        .attr("y", scaleDeterminer(i) + svgBump)
                    currentX = currentX+trophyAwardWidth;
                } else if (thisOb.award=='FMVP') {
                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[0])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i))
                            .attr("class", "award fmvp-award");

                    trophySvg.append("text").text("FMVP")
                        .attr("class", "abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump)
                        .style("fill", colors.primary)

                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[1])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i)+vbump)
                            .attr("class", "award fmvp-award");

                    currentX = currentX+trophyAwardWidth;
                } else if (thisOb.award=='Lemon') {
                    trophySvg.append("image").attr("xlink:href", "/logos/lemon.svg")
                        .attr("x", currentX - lemonSize/2)
                        .attr("y", scaleDeterminer(i) - lemonBump)
                        .attr("width", lemonSize)
                        .attr("height", lemonSize)

                    currentX = currentX+trophyAwardWidth;
                } else if (thisOb.award=='MVP') {
                    trophySvg.append("text")
                        .text(thisOb.winner.split(" ")[0])
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i))
                        .attr("class", "award goty-award");

                    trophySvg.append("text").text("MVP")
                        .attr("class", "abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump)
                        .style("fill", colors.primary)

                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[1])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i)+vbump)
                            .attr("class", "award fmvp-award");
                    currentX = currentX+trophyAwardWidth;

                } else if (thisOb.award=='DPOTY') {
                    trophySvg.append("text")
                        .text(thisOb.winner.split(" ")[0])
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i))
                        .attr("class", "award goty-award");

                    trophySvg.append("text").text("DPOTY")
                        .attr("class", "abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump)
                        .style("fill", colors.primary)

                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[1])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i)+vbump)
                            .attr("class", "award fmvp-award");
                    currentX = currentX+trophyAwardWidth;

                } else if (thisOb.award=='GOTY') {
                    trophySvg.append("text")
                        .text(thisOb.winner.split(" ")[0])
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i))
                        .attr("class", "award goty-award");

                    trophySvg.append("text").text("GOTY")
                        .attr("class", "abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump)
                        .style("fill", colors.primary)

                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ").slice(1).join(" "))
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i)+vbump)
                            .attr("class", "award fmvp-award");

                    currentX = currentX+trophyAwardWidth;
                } else if (thisOb.award=='ROTY') {
                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[0])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i))
                            .attr("class", "award fmvp-award");

                    trophySvg.append("text").text("ROTY")
                        .attr("class", "abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump)
                        .style("fill", colors.primary)

                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[1])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i)+vbump)
                            .attr("class", "award fmvp-award");

                    currentX = currentX+trophyAwardWidth;

                } else if (thisOb.award=='MIPOTY') {
                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[0])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i))
                            .attr("class", "award fmvp-award");

                    trophySvg.append("text").text("Most")
                        .attr("class", "mipoty-abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump*0.66)
                        .style("fill", colors.primary)
                    trophySvg.append("text").text("Improved")
                        .attr("class", "mipoty-abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump*1.15)
                        .style("fill", colors.primary)


                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[1])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i)+vbump)
                            .attr("class", "award mipoty-award");

                    currentX = currentX+trophyAwardWidth;

                } else if (thisOb.award=='COTY') {
                    trophySvg.append("text")
                        .text(thisOb.winner.split(" ")[0])
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i))
                        .attr("class", "award fmvp-award");

                    trophySvg.append("text").text("COTY")
                        .attr("class", "abbrev")
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i) + bigTextBump)
                        .style("fill", colors.primary)

                    trophySvg.append("text")
                            .text(thisOb.winner.split(" ")[1])
                            .attr("x", currentX)
                            .attr("y", scaleDeterminer(i)+vbump)
                            .attr("class", "award fmvp-award");

                    currentX = currentX+trophyAwardWidth;
                } else if (thisOb.award=='All-stars') {
    
                    for (star_i=0; star_i<thisOb.winner.length; star_i++) {
                    
                    trophySvg.append("path").attr('d', star)
                            .style('fill', colors.primary)
                            .attr("transform", `translate(${currentX-37},${scaleDeterminer(i)-20}) scale(0.15)`)
                            
                    trophySvg.append("text")
                    .text('All-')
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i)+starBump)
                        .attr("class", "allstar")                            
                    trophySvg.append("text")
                    .text('Star')
                        .attr("x", currentX)
                        .attr("y", scaleDeterminer(i)+starBump+18)
                        .attr("class", "allstar")
                    trophySvg.append('text')
                       .text(thisOb.winner[star_i].split(" ").slice(1).join(" "))
                       .attr("class", "award allstar-award")
                       .attr("x", currentX)
                       .attr("y", scaleDeterminer(i)+vbump)
                    currentX = currentX+trophyAwardWidth
                    }
                    // trophySvg.append("text").text("Allstar")
                    //     .attr('x', currentX)
                    //     .attr("y", scaleDeterminer(i))
                    // currentX = currentX+trophyAwardWidth;
                    // console.log("Hpa")
                } 
        } if (thisSeason.length >0) {
            currentY = currentY+trophyLineHeight;
        }
    }
}

for (it=0; it<activeSeasons.length; it++) {
    i = activeSeasons[it]; 
    svgDeterminer(i).append("text")
            .text("S"+i+":")
            .attr("class", "season-num-label")
            .attr("y", scaleDeterminer(i) + 45)
            .attr("x", -trophyMargin.left*0.7)
}

    drawTrophy();

let currentX=-100






currentX = currentX+trophyAwardWidth;

    /*----------------END TROPHY WALL---------------------*/
    //Team recordholders 
    
    const recordMargin = {top:100, bottom:50, right:50, left:50}
    const recordHeightOuter = 500
    const recordHeight = recordHeightOuter - recordMargin.top - recordMargin.bottom;
    
    const recordSvgOuter = d3.select("#individual-records")
                        .attr("width", "100%")
                        .attr("height", recordHeightOuter)
                 
        
    const recordWidth = parseInt(recordSvgOuter.style("height"), 10) - recordMargin.left - recordMargin.right
    
    const recordSvg = recordSvgOuter
                        .append("g").attr("transform", `translate(${recordMargin.left}, ${recordMargin.top})`)
    
                  
    let scoutPlayersTrim = d3.sort(teamPlayers, (x,y) => y.star_goals - x.star_goals).slice(0,10)
    let scoutSeasonTrim = d3.sort(teamSeasons, (x,y) => y.star_goals - x.star_goals).slice(0,10)
    
    const records_scale_y = d3.scaleLinear().domain([0, 9])
                                          .range([0, recordHeight])
    
    const records_scale_x = d3.scaleLinear().domain([1, 8]).range(["20%", "90%"])
    console.log(records_scale_y(2))
    const recordsAlreadyDrawn=false;
    
    const drawRecordName = (canvas, fullData, filterData, columnName, start, end) => {
        const time = 500;
        const column = canvas.selectAll(`text.${columnName}`)
            .data(filterData, d=>d.star)
            .join(enter => enter.append("text")
                .text(d=>d[columnName])
                .attr("class", columnName)
                .attr("x", 0)
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
            .style("fill", d=>d[columnName] == columnMax ? colors.primary : "none")
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
                        .style("fill", d=>d[columnName] == columnMax ? colors.text : "black")),
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
    
    const textDy = -margin.top;
    
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
                d3.select(this).style("fill", colors.secondary)
                const filteredData = d3.sort(teamPlayers, (x,y)=>y[d.column] - x[d.column]).slice(0,10);
                drawRecords(filteredData)
            })
    
    
    
    recordSvg.select('.record-header-star_goals').style('fill', colors.secondary)
    recordSvg.append("text").text("Name")
                    .attr("dy", 1.5*textDy)
                    .attr("class", "record-header-name")
    
    //Record gridlines? Another day...nope. today. 

    for (i=0; i<11; i++) {
        recordSvg.append("line")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1")
    }

    const drawRecords = (filtered) => {
    
        const time = 500;
        const stars = drawRecordName(recordSvg, teamPlayers, filtered, "star");
        const goals = drawRecordColumn(recordSvg, teamPlayers, filtered, "star_goals", 1)
        const assists = drawRecordColumn(recordSvg, teamPlayers, filtered, "star_assists",  2)
        const points = drawRecordColumn(recordSvg, teamPlayers, filtered, "points", 3)
        const hits = drawRecordColumn(recordSvg, teamPlayers, filtered, "star_hits", 4);
        const hatTricks = drawRecordColumn(recordSvg, teamPlayers, filtered, "hat_trick",  5);
        const goalsInGame = drawRecordColumn(recordSvg, teamPlayers, filtered, "goals_in_game", 6);
        const poinstInGame = drawRecordColumn(recordSvg, teamPlayers, filtered, "points_in_game", 7);
        const bruiserIndex = drawRecordColumn(recordSvg, teamPlayers, filtered, "bruiser", 8)
    
    };
    
    
    const seasonSvgOuter = d3.select("#season-records")
                        .attr("width", "100%")
                        .attr("height", recordHeightOuter)
                 
    const seasonSvg = seasonSvgOuter
                        .append("g").attr("transform", `translate(${recordMargin.left}, ${recordMargin.top})`)
    
    const labelTextSeason = seasonSvg.selectAll("text.record-header")
                        .data(labels)
                        .join("text")
                        .text(d=>d.letter)
                        .attr("class", d=>`record-header record-header-${d.column}`)
                        .attr("dy", 1.5*textDy)
                        .attr("x", (d,i) => records_scale_x(i+1))
                        .on("click", function (event, d) {
                            labelTextSeason.style("fill", "black")
                            d3.select(this).style("fill", colors.secondary)
                            const filteredData = d3.sort(teamSeasons, (x,y)=>y[d.column] - x[d.column]).slice(0,10);
                            drawSeasonRecords(filteredData)
                        })
    seasonSvg.select(".record-header-star_goals").style("fill", colors.secondary)
                    
    
    
    const drawSeasonRecords = (filtered) => {
        const time = 500;
        const stars = drawRecordName(seasonSvg, teamSeasons, filtered, "star");
        const goals = drawRecordColumn(seasonSvg, teamSeasons, filtered, "star_goals", 1)
        const assists = drawRecordColumn(seasonSvg, teamSeasons, filtered, "star_assists",  2)
        const points = drawRecordColumn(seasonSvg, teamSeasons, filtered, "points", 3)
        const hits = drawRecordColumn(seasonSvg, teamSeasons, filtered, "star_hits", 4);
        const hatTricks = drawRecordColumn(seasonSvg, teamSeasons, filtered, "hat_trick",  5);
        const goalsInGame = drawRecordColumn(seasonSvg, teamSeasons, filtered, "goals_in_game", 6);
        const poinstInGame = drawRecordColumn(seasonSvg, teamSeasons, filtered, "points_in_game", 7);
        const bruiserIndex = drawRecordColumn(seasonSvg, teamSeasons, filtered, "bruiser", 8)
    
    }
    
    
    
    
    
    //const seasonRecord
                          
    drawLineGraph(teamRecord, colors.name, colors.primary)
    
    
    
    drawRecords(scoutPlayersTrim)
    console.log(d3.select("#season-records"))
    drawSeasonRecords(scoutSeasonTrim)
    
    
    
                      
    
    const drawOnResize = () => {
        pixelWidth = parseInt(svgCanvas.style("width"), 10);
    


        console.log(pixelWidth)
        console.log(xScale.range())
        xScale.range([0, pixelWidth-margin.left - margin.right])
    
        wYaxis.tickSize(-(pixelWidth-margin.left-margin.right))
        winrateY.call(wYaxis)
        winrateX.call(xAxis)
        winrateGroup.selectAll('.team-dot').attr("cx", d=>xScale(d.season))    
        //Fix groups
    
        groups.attr("transform", d=>`translate(${xScale(d.season)} ,0)`)
        lines.attr("x2", xScale(2))
    
        console.log(winrate.attr("width"))
        winrate.attr("width", pixelWidth)
        winrate.selectAll(".team-dot")
            .attr("cx", d=>xScale(d.season))
    
        winrate.selectAll('.team-line')
            .attr("x1", d=>xScale(d.season))
            .attr("x2", (d, i, nodes) => {
                if (d.season==maxSeason) {
                    return xScale(d.season)
                } else if (d.win_pct!=-1 && d3.select(nodes[i+1]).data()[0].win_pct!=-1) {
                    return xScale(d3.select(nodes[i+1]).data()[0].season)
                } else {
                    return xScale(d.season)
                }
            })
        winrateLabelX.attr("x", xScale(1 + (maxSeason-1)/2))
        
        const histWidth = pixelWidth - histMargin.left - histMargin.right;
        histX.range([0, histWidth])
        
    
    }
    let scrollBigStatsFlag = false;
    let transitionInRecordBarsFlag = false;
    let drawFirstTipFlag=false;
    window.addEventListener('scroll', function() {
        if(bigStats.node().getBoundingClientRect().top <600 && !scrollBigStatsFlag) {
            scrollBigStatsFlag=true;
            scrollBigStats();
        }

        if(document.querySelector(".big-stats-vis").getBoundingClientRect().top < 600 && !transitionInRecordBarsFlag) {
            transitionInRecordBarsFlag=true;
            transitionInRecordBars();
        }

        if (document.querySelector("#team-history").getBoundingClientRect().top < 300 && !drawFirstTipFlag) {
            drawFirstTipFlag = true;
            drawTip(1)
        }
        

    })
    
    window.addEventListener('resize', drawOnResize)
    
    }
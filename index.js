const data = [
    {name:'Cheese',
    url:'cheese',
    home:'Central',
    primary:'#fff899',
    text:'Black'},

    {name:'Neutral Zone Trap',
    url:'trap',
    home:'Puerto Rico',
    primary:'#FF10F0',
    text:'White'},
    
    {name:'Coasters',
    url:'coasters',
    home:'Mesa',
    primary:'#2160CC',
    text:'White'},

    {name:"Russians",
    home:"Russia", 
    primary:"#BE0E10", 
    url:"russians",
    text:"white"},  

    {name:'Taco Time',
    url:'taco-time',
    home:'Tucson',
    primary:'Orange',
    text:'White'},

    {name:'Hat Lookers',
    url:'hat-lookers',
    home:'Trinidad and Tobago',
    primary:"White", 
    text:"black"},

    

    {name:'Pinguine',
    url:'pinguine',
    home:'Pennsylvania',
    primary:'#420E5F',
    text:'White'},


    {name:'Refuse to Lose',
    url:'r2l',
    home:'Baie Comeau',
    primary:'#00DBFF',
    text:'White'},


    {name:'Slot Spappers',
    url:'spappers',
    home:'Salmon Arm',
    primary:'#FA8173',
    text:'White'},

    {name:'Scouters',
    url:'scouters',
    home:'Ceske Budejovice',
    primary:'Maroon',
    text:'White'},

    {name:'Checkers',
    url:"checkers",
    home:'Chilliwack',
    primary:'Black',
    text:'White'},


    {name:'Ireland',
    url:'ireland',
    home:'Dublin',
    primary:'Green',
    text:'White'},

    {name:'Montage Moment',
    url:'montage-moment',
    home:'Media',
    primary:'#B19CD9',
    text:'White'},

    {name:'Benchminors',
    url:'benchminors',
    home:'Quebec City',
    primary:'#FFD700',
    text:'White'},



    {name:'Shame Knights',
    url:'shame-knights',
    home:'St. John\'s',
    primary:'#B1560F',
    text:'White'},

    {name:'Petes',
    url:'petes',
    home:'Peg City',
    primary:'#9CD49C',
    text:'White'},

 

]

const body = d3.select('body')

const push = 100;
const dur = 0;

const teamgroups = body.selectAll('g.team-group')
    .data(data)
    .join("g")
    .attr("transform", (d,i) => `translate(0,${i*push})`)
    .on("mouseover", function(event, d) {
        const filterGroups = teamgroups.filter(x => x.name!=d.name);

        d3.select(this).select("h1").style("text-align", "left")

 
        
        filterGroups.selectAll("div")
            .transition().duration(dur)
            .style("background-color", "lightgrey")
        filterGroups.selectAll("h1")
            .transition().duration(dur)
            .style("color", "white")
            .style("text-align", "center")
    })
    .on("mouseout", function(event, d) {

        d3.select(this).select("div img").remove()
        d3.select(this).select("h1")
                .style("text-align", "center")
        teamgroups.selectAll('div')
            .transition().duration(dur)
            .style("background-color", d=>d.primary)
        teamgroups.selectAll('h1')
            .transition().duration(dur)
            .style("color", d=>d.text)

    })
    .on("click", (event, d) => {
        window.location.href=`./team-pages/${d.url}.html`
    });




const teamDivs = teamgroups.append("div")
        .attr("class", 'team')
        .style("background-color", d=>d.primary);


teamDivs.append("h1")
    .attr("class", "name-and-city")
    .text(d=>d.home + " " + d.name)
    .style("color", d=>d.text)

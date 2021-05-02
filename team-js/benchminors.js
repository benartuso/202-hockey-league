const teamName = "Benchminors"

const ireland = team_data.filter(d=>d.team=='Ireland')[0]

const russians = team_data.filter(d=>d.team=='Russians')[0]
const benchminors = team_data.filter(d=>d.team=="Benchminors")[0]
const pinguine = team_data.filter(d=>d.team=="Pinguine")[0]



const rivalRecords = [russiansRecord, pinguineRecord, irelandRecord];
const rivalColors = [russians, pinguine, ireland];

drawTeam(benchminorsRecord, rivalRecords, rivalColors, benchminorsPlayers, benchminorsSeason, benchminors)
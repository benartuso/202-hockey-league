const teamName = "Pinguine"

const ireland = team_data.filter(d=>d.team=='Ireland')[0]

const russians = team_data.filter(d=>d.team=='Russians')[0]
const benchminors = team_data.filter(d=>d.team=="Benchminors")[0]
const pinguine = team_data.filter(d=>d.team=="Pinguine")[0]



const rivalRecords = [russiansRecord, benchminorsRecord, irelandRecord];
const rivalColors = [russians, benchminors, ireland];

drawTeam(pinguineRecord, rivalRecords, rivalColors, pinguinePlayers, pinguineSeason, pinguine)
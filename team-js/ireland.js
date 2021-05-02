const teamName = "Ireland"

const ireland = team_data.filter(d=>d.team=='Ireland')[0]

const russians = team_data.filter(d=>d.team=='Russians')[0]
const benchminors = team_data.filter(d=>d.team=="Benchminors")[0]
const pinguine = team_data.filter(d=>d.team=="Pinguine")[0]



const rivalRecords = [russiansRecord, benchminorsRecord, pinguineRecord];
const rivalColors = [russians, benchminors, pinguine];

drawTeam(irelandRecord, rivalRecords, rivalColors, irelandPlayers, irelandSeason, ireland)
const teamName = "Neutral Zone Trap"

const cheese = team_data.filter(d=>d.team=='Cheese')[0]

const trap = team_data.filter(d=>d.team=='Neutral Zone Trap')[0]
const coasters = team_data.filter(d=>d.team=="Coasters")[0]



const rivalRecords = [coastersRecord, cheeseRecord];
const rivalColors = [coasters,cheese];

drawTeam(trapRecord, rivalRecords, rivalColors, trapPlayers, trapSeason, trap)
const teamName = "Coasters"

const cheese = team_data.filter(d=>d.team=='Cheese')[0]

const trap = team_data.filter(d=>d.team=='Neutral Zone Trap')[0]
const coasters = team_data.filter(d=>d.team=="Coasters")[0]



const rivalRecords = [trapRecord, cheeseRecord];
const rivalColors = [trap,cheese];

drawTeam(coastersRecord, rivalRecords, rivalColors, coastersPlayers, coastersSeason, coasters)
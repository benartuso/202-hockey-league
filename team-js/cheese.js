const teamName = "Cheese"

const cheese = team_data.filter(d=>d.team=='Cheese')[0]

const trap = team_data.filter(d=>d.team=='Neutral Zone Trap')[0]
const coasters = team_data.filter(d=>d.team=="Coasters")[0]



const rivalRecords = [trapRecord, coastersRecord];
const rivalColors = [trap,coasters];

drawTeam(cheeseRecord, rivalRecords, rivalColors, cheesePlayers, cheeseSeason, cheese)
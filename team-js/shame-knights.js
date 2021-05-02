const teamName = "Shameful Knights"

const scout = team_data.filter(d=>d.team=='Scouting for Goals')[0]

const shameKnights = team_data.filter(d=>d.team=='Shameful Knights')[0]
const checkers = team_data.filter(d=>d.team=="Checking for Striped Arms")[0]
const hatLookers = team_data.filter(d=>d.team=="Hat Lookers")[0]


const rivalRecords = [scoutersRecord, checkersRecord, hatLookersRecord];
const rivalColors = [scout, checkers, hatLookers];

drawTeam(shameKnightsRecord, rivalRecords, rivalColors, shamePlayers, shameSeason, shameKnights)
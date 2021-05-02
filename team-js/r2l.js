const teamName = "Refuse to Lose"

const montage = team_data.filter(d=>d.team=='Montage Moment')[0]

const petes = team_data.filter(d=>d.team=='Petes')[0]
const r2l = team_data.filter(d=>d.team=="Refuse to Lose")[0]
const tacoTime = team_data.filter(d=>d.team=="Taco Time")[0]
const spappers = team_data.filter(d=>d.team=="Slappers")[0]



const rivalRecords = [montageMomentRecord, petesRecord, tacoTime, spappersRecord];
const rivalColors = [montage, petes, tacoTime, spappers];

drawTeam(r2lRecord, rivalRecords, rivalColors, r2lPlayers, r2lSeason, r2l)
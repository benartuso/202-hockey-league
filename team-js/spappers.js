const teamName = "Slappers"

const montage = team_data.filter(d=>d.team=='Montage Moment')[0]

const petes = team_data.filter(d=>d.team=='Petes')[0]
const r2l = team_data.filter(d=>d.team=="Refuse to Lose")[0]
const tacoTime = team_data.filter(d=>d.team=="Taco Time")[0]
const spappers = team_data.filter(d=>d.team=="Slappers")[0]



const rivalRecords = [montageMomentRecord, petesRecord, r2lRecord, tacoTimeRecord];
const rivalColors = [montage, petes, r2l, tacoTime];

drawTeam(spappersRecord, rivalRecords, rivalColors, spappersPlayers, spappersSeason, spappers)
const prefixes = [
  'AshKetchum',
  'Misty',
  'Brock',
  'TeamRocket',
  'Giovanni',
  'NurseJoy',
  'ProfessorOak',
  'GaryOak',
  'EliteFour',
]

export default (userId) => {
  var suffix = 0;
  userId.split('').forEach((char) => suffix += char.charCodeAt(0));

  return `${prefixes[suffix % prefixes.length]}${suffix}`
}

import {values} from 'lodash';

export const pokemonDictionary = {
  '1': {name: 'Bulbasaur', pokedexNumber: 1},
  '2': {name: 'Ivysaur', pokedexNumber: 2},
  '3': {name: 'Venusaur', pokedexNumber: 3},
  '4': {name: 'Charmander', pokedexNumber: 4},
  '5': {name: 'Charmeleon', pokedexNumber: 5},
  '6': {name: 'Charizard', pokedexNumber: 6},
  '7': {name: 'Squirtle', pokedexNumber: 7},
  '8': {name: 'Wartortle', pokedexNumber: 8},
  '9': {name: 'Blastoise', pokedexNumber: 9},
  '10': {name: 'Caterpie', pokedexNumber: 10},
  '11': {name: 'Metapod', pokedexNumber: 11},
  '12': {name: 'Butterfree', pokedexNumber: 12},
  '13': {name: 'Weedle', pokedexNumber: 13},
  '14': {name: 'Kakuna', pokedexNumber: 14},
  '15': {name: 'Beedrill', pokedexNumber: 15},
  '16': {name: 'Pidgey', pokedexNumber: 16},
  '17': {name: 'Pidgeotto', pokedexNumber: 17},
  '18': {name: 'Pidgeot', pokedexNumber: 18},
  '19': {name: 'Rattata', pokedexNumber: 19},
  '20': {name: 'Raticate', pokedexNumber: 20},
  '21': {name: 'Spearow', pokedexNumber: 21},
  '22': {name: 'Fearow', pokedexNumber: 22},
  '23': {name: 'Ekans', pokedexNumber: 23},
  '24': {name: 'Arbok', pokedexNumber: 24},
  '25': {name: 'Pikachu', pokedexNumber: 25},
  '26': {name: 'Raichu', pokedexNumber: 26},
  '27': {name: 'Sandshrew', pokedexNumber: 27},
  '28': {name: 'Sandslash', pokedexNumber: 28},
  '29': {name: 'Nidoran (Female)', pokedexNumber: 29},
  '30': {name: 'Nidorina', pokedexNumber: 30},
  '31': {name: 'Nidoqueen', pokedexNumber: 31},
  '32': {name: 'Nidoran (Male)', pokedexNumber: 32},
  '33': {name: 'Nidorino', pokedexNumber: 33},
  '34': {name: 'Nidoking', pokedexNumber: 34},
  '35': {name: 'Clefairy', pokedexNumber: 35},
  '36': {name: 'Clefable', pokedexNumber: 36},
  '37': {name: 'Vulpix', pokedexNumber: 37},
  '38': {name: 'Ninetales', pokedexNumber: 38},
  '39': {name: 'Jigglypuff', pokedexNumber: 39},
  '40': {name: 'Wigglytuff', pokedexNumber: 40},
  '41': {name: 'Zubat', pokedexNumber: 41},
  '42': {name: 'Golbat', pokedexNumber: 42},
  '43': {name: 'Oddish', pokedexNumber: 43},
  '44': {name: 'Gloom', pokedexNumber: 44},
  '45': {name: 'Vileplume', pokedexNumber: 45},
  '46': {name: 'Paras', pokedexNumber: 46},
  '47': {name: 'Parasect', pokedexNumber: 47},
  '48': {name: 'Venonat', pokedexNumber: 48},
  '49': {name: 'Venomoth', pokedexNumber: 49},
  '50': {name: 'Diglett', pokedexNumber: 50},
  '51': {name: 'Dugtrio', pokedexNumber: 51},
  '52': {name: 'Meowth', pokedexNumber: 52},
  '53': {name: 'Persian', pokedexNumber: 53},
  '54': {name: 'Psyduck', pokedexNumber: 54},
  '55': {name: 'Golduck', pokedexNumber: 55},
  '56': {name: 'Mankey', pokedexNumber: 56},
  '57': {name: 'Primeape', pokedexNumber: 57},
  '58': {name: 'Growlithe', pokedexNumber: 58},
  '59': {name: 'Arcanine', pokedexNumber: 59},
  '60': {name: 'Poliwag', pokedexNumber: 60},
  '61': {name: 'Poliwhirl', pokedexNumber: 61},
  '62': {name: 'Poliwrath', pokedexNumber: 62},
  '63': {name: 'Abra', pokedexNumber: 63},
  '64': {name: 'Kadabra', pokedexNumber: 64},
  '65': {name: 'Alakazam', pokedexNumber: 65},
  '66': {name: 'Machop', pokedexNumber: 66},
  '67': {name: 'Machoke', pokedexNumber: 67},
  '68': {name: 'Machamp', pokedexNumber: 68},
  '69': {name: 'Bellsprout', pokedexNumber: 69},
  '70': {name: 'Weepinbell', pokedexNumber: 70},
  '71': {name: 'Victreebel', pokedexNumber: 71},
  '72': {name: 'Tentacool', pokedexNumber: 72},
  '73': {name: 'Tentacruel', pokedexNumber: 73},
  '74': {name: 'Geodude', pokedexNumber: 74},
  '75': {name: 'Graveler', pokedexNumber: 75},
  '76': {name: 'Golem', pokedexNumber: 76},
  '77': {name: 'Ponyta', pokedexNumber: 77},
  '78': {name: 'Rapidash', pokedexNumber: 78},
  '79': {name: 'Slowpoke', pokedexNumber: 79},
  '80': {name: 'Slowbro', pokedexNumber: 80},
  '81': {name: 'Magnemite', pokedexNumber: 81},
  '82': {name: 'Magneton', pokedexNumber: 82},
  '83': {name: 'Farfetchd', pokedexNumber: 83},
  '84': {name: 'Doduo', pokedexNumber: 84},
  '85': {name: 'Dodrio', pokedexNumber: 85},
  '86': {name: 'Seel', pokedexNumber: 86},
  '87': {name: 'Dewgong', pokedexNumber: 87},
  '88': {name: 'Grimer', pokedexNumber: 88},
  '89': {name: 'Muk', pokedexNumber: 89},
  '90': {name: 'Shellder', pokedexNumber: 90},
  '91': {name: 'Cloyster', pokedexNumber: 91},
  '92': {name: 'Gastly', pokedexNumber: 92},
  '93': {name: 'Haunter', pokedexNumber: 93},
  '94': {name: 'Gengar', pokedexNumber: 94},
  '95': {name: 'Onix', pokedexNumber: 95},
  '96': {name: 'Drowzee', pokedexNumber: 96},
  '97': {name: 'Hypno', pokedexNumber: 97},
  '98': {name: 'Krabby', pokedexNumber: 98},
  '99': {name: 'Kingler', pokedexNumber: 99},
  '100': {name: 'Voltorb', pokedexNumber: 100},
  '101': {name: 'Electrode', pokedexNumber: 101},
  '102': {name: 'Exeggcute', pokedexNumber: 102},
  '103': {name: 'Exeggutor', pokedexNumber: 103},
  '104': {name: 'Cubone', pokedexNumber: 104},
  '105': {name: 'Marowak', pokedexNumber: 105},
  '106': {name: 'Hitmonlee', pokedexNumber: 106},
  '107': {name: 'Hitmonchan', pokedexNumber: 107},
  '108': {name: 'Lickitung', pokedexNumber: 108},
  '109': {name: 'Koffing', pokedexNumber: 109},
  '110': {name: 'Weezing', pokedexNumber: 110},
  '111': {name: 'Rhyhorn', pokedexNumber: 111},
  '112': {name: 'Rhydon', pokedexNumber: 112},
  '113': {name: 'Chansey', pokedexNumber: 113},
  '114': {name: 'Tangela', pokedexNumber: 114},
  '115': {name: 'Kangaskhan', pokedexNumber: 115},
  '116': {name: 'Horsea', pokedexNumber: 116},
  '117': {name: 'Seadra', pokedexNumber: 117},
  '118': {name: 'Goldeen', pokedexNumber: 118},
  '119': {name: 'Seaking', pokedexNumber: 119},
  '120': {name: 'Staryu', pokedexNumber: 120},
  '121': {name: 'Starmie', pokedexNumber: 121},
  '122': {name: 'Mr Mime', pokedexNumber: 122},
  '123': {name: 'Scyther', pokedexNumber: 123},
  '124': {name: 'Jynx', pokedexNumber: 124},
  '125': {name: 'Electabuzz', pokedexNumber: 125},
  '126': {name: 'Magmar', pokedexNumber: 126},
  '127': {name: 'Pinsir', pokedexNumber: 127},
  '128': {name: 'Tauros', pokedexNumber: 128},
  '129': {name: 'Magikarp', pokedexNumber: 129},
  '130': {name: 'Gyarados', pokedexNumber: 130},
  '131': {name: 'Lapras', pokedexNumber: 131},
  '132': {name: 'Ditto', pokedexNumber: 132},
  '133': {name: 'Eevee', pokedexNumber: 133},
  '134': {name: 'Vaporeon', pokedexNumber: 134},
  '135': {name: 'Jolteon', pokedexNumber: 135},
  '136': {name: 'Flareon', pokedexNumber: 136},
  '137': {name: 'Porygon', pokedexNumber: 137},
  '138': {name: 'Omanyte', pokedexNumber: 138},
  '139': {name: 'Omastar', pokedexNumber: 139},
  '140': {name: 'Kabuto', pokedexNumber: 140},
  '141': {name: 'Kabutops', pokedexNumber: 141},
  '142': {name: 'Aerodactyl', pokedexNumber: 142},
  '143': {name: 'Snorlax', pokedexNumber: 143},
  // '144': {name: 'Articuno', pokedexNumber: 144},
  // '145': {name: 'Zapdos', pokedexNumber: 145},
  // '146': {name: 'Moltres', pokedexNumber: 146},
  '147': {name: 'Dratini', pokedexNumber: 147},
  '148': {name: 'Dragonair', pokedexNumber: 148},
  '149': {name: 'Dragonite', pokedexNumber: 149},
  // '150': {name: 'Mewtwo', pokedexNumber: 150},
  // '151': {name: 'Mew', pokedexNumber: 151},
}

export const pokemonList = values(pokemonDictionary).map(value => value.name);

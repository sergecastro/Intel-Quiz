export const chemistryMatches = [
  {
    element: 'Oxygen',
    atomicSymbol: 'O',
    atomicNumber: '8',
    periodicGroup: 'Nonmetal',
    roomState: 'Gas',
    commonUses: 'Breathing and oxidation'
  },
  {
    element: 'Carbon',
    atomicSymbol: 'C',
    atomicNumber: '6',
    periodicGroup: 'Nonmetal',
    roomState: 'Solid',
    commonUses: 'Diamonds, graphite, organic life'
  },
  {
    element: 'Hydrogen',
    atomicSymbol: 'H',
    atomicNumber: '1',
    periodicGroup: 'Nonmetal',
    roomState: 'Gas',
    commonUses: 'Fuel and rocket propellant'
  },
  {
    element: 'Nitrogen',
    atomicSymbol: 'N',
    atomicNumber: '7',
    periodicGroup: 'Nonmetal',
    roomState: 'Gas',
    commonUses: 'Fertilizers and atmosphere'
  },
  {
    element: 'Sodium',
    atomicSymbol: 'Na',
    atomicNumber: '11',
    periodicGroup: 'Alkali metal',
    roomState: 'Solid',
    commonUses: 'Table salt (NaCl)'
  },
  {
    element: 'Iron',
    atomicSymbol: 'Fe',
    atomicNumber: '26',
    periodicGroup: 'Transition metal',
    roomState: 'Solid',
    commonUses: 'Construction and steel alloys'
  },
  {
    element: 'Gold',
    atomicSymbol: 'Au',
    atomicNumber: '79',
    periodicGroup: 'Transition metal',
    roomState: 'Solid',
    commonUses: 'Jewelry and electronics'
  },
  {
    element: 'Helium',
    atomicSymbol: 'He',
    atomicNumber: '2',
    periodicGroup: 'Noble gas',
    roomState: 'Gas',
    commonUses: 'Balloons and cooling'
  },
  {
    element: 'Mercury',
    atomicSymbol: 'Hg',
    atomicNumber: '80',
    periodicGroup: 'Transition metal',
    roomState: 'Liquid',
    commonUses: 'Thermometers (old) and switches'
  },
  {
    element: 'Chlorine',
    atomicSymbol: 'Cl',
    atomicNumber: '17',
    periodicGroup: 'Halogen',
    roomState: 'Gas',
    commonUses: 'Disinfectant and bleach'
  }
];

export const chemistryCategories = {
  element: [
    // Leading items - real chemical elements
    'Oxygen', 'Carbon', 'Hydrogen', 'Nitrogen', 'Sodium', 'Iron', 'Gold', 'Helium', 'Mercury', 'Chlorine'
  ],
  atomicSymbol: [
    // Correct answers
    'O','C','H','N','Na','Fe','Au','He','Hg','Cl',
    // Plausible distractors (3+ realistic)
    'K','Ag','Si','Pb','Ne','Al','Zn',
    // Funny options (2 clearly wrong)
    '??','💥'
  ],
  atomicNumber: [
    // Correct answers (as strings)
    '8','6','1','7','11','26','79','2','80','17',
    // Plausible distractors (nearby or real numbers)
    '10','12','3','15','18','25','78','9','16',
    // Funny
    '42','Infinity','007'
  ],
  periodicGroup: [
    // Correct categories
    'Nonmetal','Alkali metal','Transition metal','Noble gas','Halogen',
    // Plausible
    'Alkaline earth metal','Metalloid','Lanthanide','Actinide',
    // Funny
    'Superhero League','Breakfast Club'
  ],
  roomState: [
    // Correct states
    'Gas','Solid','Liquid',
    // Plausible
    'Plasma',
    // Funny
    'Gaseous giggles','Liquid gold'
  ],
  commonUses: [
    // Correct examples
    'Breathing and oxidation','Diamonds, graphite, organic life','Fuel and rocket propellant',
    'Fertilizers and atmosphere','Table salt (NaCl)','Construction and steel alloys','Jewelry and electronics',
    'Balloons and cooling','Thermometers (old) and switches','Disinfectant and bleach',
    // Plausible
    'Semiconductors','Batteries','Coins','Fireworks','Water purification',
    // Funny
    'Powering lightsabers','Making invisibility cloaks'
  ]
};

export const chemistryCategoryNames = {
  element: 'Element',
  atomicSymbol: 'Atomic Symbol',
  atomicNumber: 'Atomic Number',
  periodicGroup: 'Periodic Group',
  roomState: 'State at Room Temp',
  commonUses: 'Common Uses'
};

export type ChemistryCategoryKey = keyof typeof chemistryCategories;

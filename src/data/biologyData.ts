export const biologyMatches = [
  {
    organism: 'Elephant',
    scientificClassification: 'Mammal',
    habitat: 'African savanna',
    diet: 'Herbivore (grass, bark, fruits)',
    uniqueTrait: 'Largest land animal',
    lifespan: '60-70 years',
    conservationStatus: 'Endangered'
  },
  {
    organism: 'Penguin',
    scientificClassification: 'Bird',
    habitat: 'Antarctica',
    diet: 'Fish and krill',
    uniqueTrait: "Can't fly but swims expertly",
    lifespan: '15-20 years',
    conservationStatus: 'Vulnerable for some species'
  },
  {
    organism: 'Tiger',
    scientificClassification: 'Mammal',
    habitat: 'Asian forests',
    diet: 'Carnivore (deer, wild boar)',
    uniqueTrait: 'Distinctive orange and black stripes',
    lifespan: '10-15 years',
    conservationStatus: 'Endangered'
  },
  {
    organism: 'Dolphin',
    scientificClassification: 'Mammal',
    habitat: 'Ocean waters',
    diet: 'Fish, squid, shrimp',
    uniqueTrait: 'Highly intelligent with echolocation',
    lifespan: '20-45 years',
    conservationStatus: 'Least concern'
  },
  {
    organism: 'Oak Tree',
    scientificClassification: 'Plant',
    habitat: 'Temperate forests',
    diet: 'Photosynthesis (sunlight, CO2)',
    uniqueTrait: 'Produces acorns',
    lifespan: '200-300 years',
    conservationStatus: 'Least concern'
  },
  {
    organism: 'Butterfly',
    scientificClassification: 'Insect',
    habitat: 'Gardens and meadows',
    diet: 'Nectar from flowers',
    uniqueTrait: 'Complete metamorphosis',
    lifespan: '2-5 weeks',
    conservationStatus: 'Varies by species'
  },
  {
    organism: 'Shark',
    scientificClassification: 'Fish',
    habitat: 'Ocean waters',
    diet: 'Fish, seals, plankton',
    uniqueTrait: 'Cartilaginous skeleton',
    lifespan: '20-100 years',
    conservationStatus: 'Vulnerable'
  },
  {
    organism: 'Honey Bee',
    scientificClassification: 'Insect',
    habitat: 'Hives in various environments',
    diet: 'Nectar and pollen',
    uniqueTrait: 'Creates honey and beeswax',
    lifespan: '6 weeks (worker)',
    conservationStatus: 'Declining populations'
  },
  {
    organism: 'Kangaroo',
    scientificClassification: 'Mammal',
    habitat: 'Australian grasslands',
    diet: 'Herbivore (grass, leaves)',
    uniqueTrait: 'Hops on powerful hind legs',
    lifespan: '12-18 years',
    conservationStatus: 'Least concern'
  },
  {
    organism: 'Eagle',
    scientificClassification: 'Bird',
    habitat: 'Mountains and forests',
    diet: 'Fish, small mammals, birds',
    uniqueTrait: 'Exceptional eyesight',
    lifespan: '20-30 years',
    conservationStatus: 'Least concern'
  }
];

export const biologyCategories = {
  organism: [
    // Leading items - ONLY real organisms
    'Elephant', 'Penguin', 'Tiger', 'Dolphin', 'Oak Tree', 'Butterfly', 'Shark', 'Honey Bee', 'Kangaroo', 'Eagle'
  ],
  scientificClassification: [
    // Correct answers
    'Mammal', 'Bird', 'Fish', 'Insect', 'Plant',
    // Plausible distractors (3+ realistic options)
    'Reptile', 'Amphibian', 'Invertebrate', 'Vertebrate', 'Arthropod',
    // Funny options (2 clearly wrong/silly)
    'Superhero species', 'Alien visitor'
  ],
  habitat: [
    // Correct answers
    'African savanna', 'Antarctica', 'Asian forests', 'Ocean waters', 'Temperate forests',
    'Gardens and meadows', 'Hives in various environments', 'Australian grasslands', 'Mountains and forests',
    // Plausible distractors (3+ realistic options)
    'Tropical rainforest', 'Desert regions', 'Arctic tundra', 'Coral reefs', 'Wetlands',
    // Funny options (2 clearly wrong/silly)
    'Your refrigerator', 'Shopping malls'
  ],
  diet: [
    // Correct answers
    'Herbivore (grass, bark, fruits)', 'Fish and krill', 'Carnivore (deer, wild boar)', 
    'Fish, squid, shrimp', 'Photosynthesis (sunlight, CO2)', 'Nectar from flowers',
    'Fish, seals, plankton', 'Nectar and pollen', 'Herbivore (grass, leaves)', 'Fish, small mammals, birds',
    // Plausible distractors (3+ realistic options)
    'Omnivore (mixed diet)', 'Insects and worms', 'Seeds and nuts', 'Algae and microorganisms',
    // Funny options (2 clearly wrong/silly)
    'Popcorn at movie nights', 'Social media likes'
  ],
  uniqueTrait: [
    // Correct answers
    'Largest land animal', "Can't fly but swims expertly", 'Distinctive orange and black stripes',
    'Highly intelligent with echolocation', 'Produces acorns', 'Complete metamorphosis',
    'Cartilaginous skeleton', 'Creates honey and beeswax', 'Hops on powerful hind legs', 'Exceptional eyesight',
    // Plausible distractors (3+ realistic options)
    'Hibernates in winter', 'Changes color for camouflage', 'Migrates seasonally', 'Pack hunting behavior',
    // Funny options (2 clearly wrong/silly)
    'Wears a tuxedo to parties', 'Uses smartphones'
  ],
  lifespan: [
    // Correct answers
    '60-70 years', '15-20 years', '10-15 years', '20-45 years', '200-300 years',
    '2-5 weeks', '20-100 years', '6 weeks (worker)', '12-18 years', '20-30 years',
    // Plausible distractors (3+ realistic options)
    '5-10 years', '1-3 years', '50-80 years', '100-150 years',
    // Funny options (2 clearly wrong/silly)
    'Eternal youth', '9 lives like cats'
  ],
  conservationStatus: [
    // Correct answers
    'Endangered', 'Vulnerable for some species', 'Least concern', 'Declining populations', 'Varies by species',
    // Plausible distractors (3+ realistic options)
    'Near threatened', 'Critically endangered', 'Extinct in wild', 'Stable populations',
    // Funny options (2 clearly wrong/silly)
    'Protected by superheroes', 'Celebrity status'
  ]
};

export const biologyCategoryNames = {
  organism: 'Organism',
  scientificClassification: 'Scientific Classification',
  habitat: 'Habitat',
  diet: 'Diet',
  uniqueTrait: 'Unique Trait',
  lifespan: 'Lifespan',
  conservationStatus: 'Conservation Status'
};

export type BiologyCategoryKey = keyof typeof biologyCategories;
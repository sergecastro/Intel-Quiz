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
  scientificClassification: [
    'Mammal', 'Bird', 'Fish', 'Insect', 'Plant', 'Reptile', 'Amphibian',
    // Plausible distractors
    'Invertebrate', 'Vertebrate', 'Arthropod',
    // Funny options
    'Superhero species', 'Alien visitor', 'Mythical creature', 'Robot in disguise', 'Time traveler'
  ],
  habitat: [
    'African savanna', 'Antarctica', 'Asian forests', 'Ocean waters', 'Temperate forests',
    'Gardens and meadows', 'Hives in various environments', 'Australian grasslands', 'Mountains and forests',
    // Plausible distractors
    'Tropical rainforest', 'Desert regions', 'Arctic tundra', 'Coral reefs', 'Wetlands',
    // Funny options
    'Your refrigerator', 'The moon\'s icy side', 'A fancy ballroom', 'Shopping malls', 'Video game worlds', 'Netflix documentaries'
  ],
  diet: [
    'Herbivore (grass, bark, fruits)', 'Fish and krill', 'Carnivore (deer, wild boar)', 
    'Fish, squid, shrimp', 'Photosynthesis (sunlight, CO2)', 'Nectar from flowers',
    'Fish, seals, plankton', 'Nectar and pollen', 'Herbivore (grass, leaves)', 'Fish, small mammals, birds',
    // Plausible distractors
    'Omnivore (mixed diet)', 'Insects and worms', 'Seeds and nuts', 'Algae and microorganisms',
    // Funny options
    'Popcorn at movie nights', 'Magical potions', 'Invisible plankton', 'Fast food delivery', 'Energy drinks', 'Social media likes'
  ],
  uniqueTrait: [
    'Largest land animal', "Can't fly but swims expertly", 'Distinctive orange and black stripes',
    'Highly intelligent with echolocation', 'Produces acorns', 'Complete metamorphosis',
    'Cartilaginous skeleton', 'Creates honey and beeswax', 'Hops on powerful hind legs', 'Exceptional eyesight',
    // Plausible distractors
    'Hibernates in winter', 'Changes color for camouflage', 'Migrates seasonally', 'Pack hunting behavior',
    // Funny options
    'Wears a tuxedo to parties', 'Speaks fluent human', 'Dances like in movies', 'Has superpowers', 'Tells dad jokes', 'Uses smartphones'
  ],
  lifespan: [
    '60-70 years', '15-20 years', '10-15 years', '20-45 years', '200-300 years',
    '2-5 weeks', '20-100 years', '6 weeks (worker)', '12-18 years', '20-30 years',
    // Plausible distractors
    '5-10 years', '1-3 years', '50-80 years', '100-150 years',
    // Funny options
    'Eternal youth', 'As long as a good joke', 'Until the next software update', 'Forever and a day', '9 lives like cats'
  ],
  conservationStatus: [
    'Endangered', 'Vulnerable for some species', 'Least concern', 'Declining populations', 'Varies by species',
    // Plausible distractors
    'Near threatened', 'Critically endangered', 'Extinct in wild', 'Stable populations',
    // Funny options
    'Mythical creature', 'Protected by superheroes', 'Overpopulated in cartoons', 'Celebrity status', 'Under witness protection'
  ]
};

export const biologyCategoryNames = {
  scientificClassification: 'Scientific Classification',
  habitat: 'Habitat',
  diet: 'Diet',
  uniqueTrait: 'Unique Trait',
  lifespan: 'Lifespan',
  conservationStatus: 'Conservation Status'
};

export type BiologyCategoryKey = keyof typeof biologyCategories;
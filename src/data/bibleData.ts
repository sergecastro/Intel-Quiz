// Bible Studies data with Old Testament focus
// Categories: story, location, family, quote, theme, era, miracle
export const bibleMatches = [
  {
    story: "Abraham",
    location: "Ur, Haran, Canaan", 
    family: "Wife Sarah, son Isaac",
    quote: "Go from your country... to the land I will show you.",
    theme: "Faith, covenant, and promise of descendants",
    era: "Around 2000-1800 BCE",
    miracle: "Birth of Isaac in old age"
  },
  {
    story: "Creation Story",
    location: "Formless void, then Earth",
    family: "God creates Adam and Eve", 
    quote: "Let there be light.",
    theme: "Order from chaos, rest on Sabbath",
    era: "Beginning of time",
    miracle: "Speaking creation into existence"
  },
  {
    story: "Moses",
    location: "Egypt, Mount Sinai, Wilderness",
    family: "Brother Aaron, sister Miriam",
    quote: "Let my people go.",
    theme: "Liberation, law, and faith", 
    era: "Around 13th century BCE",
    miracle: "Parting the Red Sea"
  },
  {
    story: "David",
    location: "Bethlehem, Jerusalem",
    family: "Father Jesse, son Solomon",
    quote: "The Lord is my shepherd; I shall not want.",
    theme: "Rise from shepherd to king, repentance",
    era: "Around 1000 BCE", 
    miracle: "Defeating Goliath with a sling"
  },
  {
    story: "Noah",
    location: "Mount Ararat",
    family: "Wife and three sons",
    quote: "I set my bow in the cloud.",
    theme: "Judgment and renewal through faith",
    era: "Pre-flood era",
    miracle: "Surviving the great flood"
  },
  {
    story: "Joseph",
    location: "Egypt, Canaan",
    family: "Father Jacob, eleven brothers",
    quote: "You meant evil against me, but God meant it for good.",
    theme: "Providence and forgiveness",
    era: "Around 1700-1600 BCE",
    miracle: "Interpreting Pharaoh's dreams"
  },
  {
    story: "Jonah",
    location: "Nineveh, inside a great fish",
    family: "Prophet called by God",
    quote: "Should I not pity Nineveh, that great city?",
    theme: "Obedience and God's mercy",
    era: "8th century BCE",
    miracle: "Three days inside a great fish"
  },
  {
    story: "Daniel",
    location: "Babylon, lion's den",
    family: "Friends Shadrach, Meshach, Abednego",
    quote: "My God sent his angel and shut the lions' mouths.",
    theme: "Faith under persecution",
    era: "6th century BCE",
    miracle: "Protected in the lion's den"
  },
  {
    story: "Ruth",
    location: "Moab, Bethlehem",
    family: "Mother-in-law Naomi, husband Boaz",
    quote: "Where you go I will go, where you lodge I will lodge.",
    theme: "Loyalty and redemption",
    era: "Time of the Judges",
    miracle: "Provision through gleaning"
  },
  {
    story: "Solomon",
    location: "Jerusalem, Temple",
    family: "Father David, mother Bathsheba", 
    quote: "Give your servant a discerning heart.",
    theme: "Wisdom and the consequences of compromise",
    era: "Around 970-930 BCE",
    miracle: "Wisdom to judge between two mothers"
  }
];

export const bibleCategories = {
  story: [
    // Correct answers
    "Abraham", "Creation Story", "Moses", "David", "Noah", 
    "Joseph", "Jonah", "Daniel", "Ruth", "Solomon",
    // Plausible distractors  
    "Isaac", "Jacob", "Joshua", "Samuel", "Elijah",
    "Esther", "Job", "Jeremiah", "Ezekiel", "Isaiah",
    "Gideon", "Saul", "Elisha", "Nehemiah", "Esau",
    // Funny options
    "Abraham's GPS Adventure", "Moses' Wilderness Hiking Guide",
    "David's Giant-Slaying Tutorial", "Noah's Ark Animal Reviews",
    "Joseph's Dreamland Chronicles", "Jonah's Fish Tale",
    "Daniel's Lion Taming Course", "Ruth's Loyalty Program",
    "Solomon's Wisdom App", "Creation: The Director's Cut"
  ],
  
  location: [
    // Correct answers
    "Ur, Haran, Canaan", "Formless void, then Earth", "Egypt, Mount Sinai, Wilderness",
    "Bethlehem, Jerusalem", "Mount Ararat", "Egypt, Canaan", 
    "Nineveh, inside a great fish", "Babylon, lion's den", "Moab, Bethlehem", "Jerusalem, Temple",
    // Plausible distractors
    "Garden of Eden", "Red Sea", "Jordan River", "Mount Moriah",
    "Promised Land", "Valley of Elah", "Hebron", "Jericho",
    "Mount Horeb", "Wilderness of Paran", "Sodom and Gomorrah", "Tower of Babel",
    // Funny options  
    "Abraham's Backyard BBQ", "The Promised Land Mall", "Moses' Desert Disco",
    "David's Palace Spa", "Noah's Floating Zoo", "Joseph's Pyramid Office",
    "Jonah's Underwater Hotel", "Daniel's Lion Safari", "Ruth's Grain Market",
    "Solomon's Temple Gift Shop", "Eden's Vacation Resort", "Sinai Ski Resort"
  ],

  family: [
    // Correct answers
    "Wife Sarah, son Isaac", "God creates Adam and Eve", "Brother Aaron, sister Miriam",
    "Father Jesse, son Solomon", "Wife and three sons", "Father Jacob, eleven brothers",
    "Prophet called by God", "Friends Shadrach, Meshach, Abednego", "Mother-in-law Naomi, husband Boaz", "Father David, mother Bathsheba",
    // Plausible distractors
    "Son Ishmael", "Daughter-in-law Rebecca", "Adopted by Pharaoh's daughter",
    "Wife Michal", "Sons Shem, Ham, Japheth", "Brothers Benjamin and Judah",
    "Father Amittai", "King Nebuchadnezzar", "Sister-in-law Orpah", "Multiple wives",
    // Funny options
    "Pet camel named Abe", "Uncle who tells dad jokes", "Pet snake staff",
    "Pet sheep flock", "Family of rainbow covenant keepers", "Egyptian adopted family",
    "Fish family reunion", "Lion adoption program", "Gleaning support group", "Wise guys club"
  ],

  quote: [
    // Correct answers
    "Go from your country... to the land I will show you.", "Let there be light.",
    "Let my people go.", "The Lord is my shepherd; I shall not want.",
    "I set my bow in the cloud.", "You meant evil against me, but God meant it for good.",
    "Should I not pity Nineveh, that great city?", "My God sent his angel and shut the lions' mouths.",
    "Where you go I will go, where you lodge I will lodge.", "Give your servant a discerning heart.",
    // Plausible distractors
    "Build an ark.", "You shall not eat of the tree.", "I am who I am.",
    "You come to me with a sword... but I come in the name of the Lord.", "Behold, the rainbow of my covenant.",
    "Am I my brother's keeper?", "Here am I! Send me.", "The writing is on the wall.",
    "Your people shall be my people.", "Vanity of vanities, all is vanity.",
    // Funny options
    "May the odds be ever in your favor.", "To infinity and beyond, Abraham!",
    "Beam me up, God!", "Giant problems require small stones.",
    "Where's the beef?", "To create or not to create?",
    "Let there be WiFi.", "Where's the promised WiFi?",
    "Show me the shekel!", "Wisdom loading... please wait."
  ],

  theme: [
    // Correct answers
    "Faith, covenant, and promise of descendants", "Order from chaos, rest on Sabbath",
    "Liberation, law, and faith", "Rise from shepherd to king, repentance",
    "Judgment and renewal through faith", "Providence and forgiveness",
    "Obedience and God's mercy", "Faith under persecution", "Loyalty and redemption", "Wisdom and the consequences of compromise",
    // Plausible distractors
    "Human fall and sin", "Miraculous provision", "Victory over giants",
    "Unity vs. division", "Divine protection", "God's sovereignty over nations",
    "Consequences of disobedience", "Faithfulness rewarded", "Justice and mercy", "Temple worship",
    // Funny options
    "Ultimate family road trip", "Abraham's guide to stargazing", "World's longest hike",
    "Underdog stories for the ages", "World's first floating zoo", "Joseph's dreamland adventures",
    "Jonah's fish tale survival guide", "Daniel's lion taming manual", "Ruth's loyalty program benefits",
    "Solomon's wisdom app tutorial"
  ],

  era: [
    // Correct answers  
    "Around 2000-1800 BCE", "Beginning of time", "Around 13th century BCE",
    "Around 1000 BCE", "Pre-flood era", "Around 1700-1600 BCE",
    "8th century BCE", "6th century BCE", "Time of the Judges", "Around 970-930 BCE",
    // Plausible distractors
    "Patriarchal age", "Mosaic era", "United monarchy period", "Wilderness wanderings",
    "Before the flood", "Entry to Canaan", "Saul's reign", "Babylonian exile",
    "Post-exile period", "Solomon's temple building", "Divided kingdom",
    // Funny options
    "Last week", "Dinosaur times", "Day zero", "Pre-Instagram fame era", 
    "Before GPS was invented", "Pharaoh's bad day era", "When harps were hits",
    "Before calendars were invented", "When fish were taxis", "Pre-smartphone era"
  ],

  miracle: [
    // Correct answers
    "Birth of Isaac in old age", "Speaking creation into existence", "Parting the Red Sea",
    "Defeating Goliath with a sling", "Surviving the great flood", "Interpreting Pharaoh's dreams",
    "Three days inside a great fish", "Protected in the lion's den", "Provision through gleaning", "Wisdom to judge between two mothers",
    // Plausible distractors
    "Rainbow covenant", "Manna from heaven", "Water from rock", "Burning bush",
    "Anointing oil miracle", "Multiplying oil and grain", "Raising the dead",
    "Healing the sick", "Fire from heaven", "Writing on the wall",
    // Funny options
    "Turning sand into gold", "Instant tent setup", "Turning staffs into smartphones",
    "Instant harp mastery", "Animal boarding services", "Dream interpretation hotline",
    "Underwater breathing lessons", "Lion whispering skills", "Grain GPS tracking",
    "Instant wisdom downloads"
  ]
};

export const bibleCategoryNames = {
  story: "Biblical Story/Character",
  location: "Associated Location", 
  family: "Family/Relations",
  quote: "Famous Quote/Command",
  theme: "Theme/Meaning",
  era: "Time Period/Era", 
  miracle: "Related Miracle/Teaching"
};

export type BibleStudiesCategoryKey = keyof typeof bibleCategories;
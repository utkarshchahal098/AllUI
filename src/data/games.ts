export type ArtVariant = 'skyline' | 'visor' | 'horizon' | 'orbital' | 'circuit' | 'monolith'
export type Status = 'released' | 'early-access' | 'preorder'

export interface StoryAct {
  act: string
  title: string
  summary: string
  beats: string[]
}

export interface Character {
  name: string
  role: string
  line: string
}

export interface Game {
  id: string
  slug: string
  title: string
  studio: string
  year: number
  genres: string[]
  tags: string[]
  price: number
  discount: number
  rating: number
  reviews: number
  sales: number
  bestSeller: boolean
  status: Status
  palette: [string, string]
  art: ArtVariant
  tagline: string
  synopsis: string
  platforms: string[]
  players: string
  playtime: string
  story?: StoryAct[]
  characters?: Character[]
}

export const GENRES = [
  'Action RPG',
  'Immersive Sim',
  'Roguelike',
  'Tactics',
  'Racing',
  'Horror',
  'Shooter',
  'Puzzle',
] as const

export const games: Game[] = [
  {
    id: 'g-001',
    slug: 'neon-requiem',
    title: 'Neon Requiem',
    studio: 'Halcyon Ruin',
    year: 2087,
    genres: ['Action RPG'],
    tags: ['Open World', 'Cyberware', 'Branching Story', 'Single Player'],
    price: 69.99,
    discount: 0.35,
    rating: 4.8,
    reviews: 128_402,
    sales: 4_210_000,
    bestSeller: true,
    status: 'released',
    palette: ['#1ee7ff', '#ff2d9b'],
    art: 'skyline',
    tagline: 'The city remembers every death but yours.',
    synopsis:
      'Kaeda Oshiro wakes in a back-alley ripper clinic with four hours of missing memory and a prototype cortex shard fused to her brainstem. The shard is a black box recorder — and it has footage of her own murder. Neon Requiem is a 60-hour open-world RPG across the drowned megacity of Astra Prime, where every cyberware install rewrites a little more of who you used to be.',
    platforms: ['PC', 'Console X', 'Cloud'],
    players: 'Single player',
    playtime: '58h main / 140h complete',
    story: [
      {
        act: 'ACT I',
        title: 'Four Hours of Static',
        summary:
          'Kaeda buys her memory back one fragment at a time, discovering that the shard in her skull was stolen from the arcology that runs the city.',
        beats: [
          'A ripperdoc named Sable sells Kaeda the first fragment of her own recording — the last thing she sees is her own face.',
          'The Lattice Consortium declares Kaeda a walking data breach and puts an open bounty on her cortex.',
          'In the flooded Tram Vaults, Kaeda meets Wire, a courier who has been dead twice and remembers both.',
        ],
      },
      {
        act: 'ACT II',
        title: 'The Copy Problem',
        summary:
          'Kaeda learns the arcology has been backing up executives into fresh bodies for forty years — and the backups have started refusing to sync.',
        beats: [
          'A ghosted executive begs Kaeda to delete him before the next restore overwrites what he has become.',
          'Wire is revealed as backup seven of a courier who died in 2061. He does not take it well.',
          'The player chooses whether to leak the restore ledger, sell it, or use it as leverage — the city splits accordingly.',
        ],
      },
      {
        act: 'ACT III',
        title: 'Requiem',
        summary:
          'The shard finishes decoding. Kaeda finally watches her own death in full — and learns who was holding the gun.',
        beats: [
          'The recording shows Kaeda pulling the trigger on herself to stop a sync in progress.',
          'Astra Prime goes dark for nine minutes while the restore servers argue about who is real.',
          'Four endings: Overwrite, Fork, Purge, or the hidden Requiem ending, which requires refusing every cyberware install after Act I.',
        ],
      },
    ],
    characters: [
      { name: 'Kaeda Oshiro', role: 'Protagonist / Courier', line: 'I died on a Tuesday. I would like it back.' },
      { name: 'Wire', role: 'Backup No. 7', line: 'Every copy thinks it is the original. That is the whole trick.' },
      { name: 'Sable', role: 'Ripperdoc', line: 'Memory is just meat that agreed on a story.' },
    ],
  },
  {
    id: 'g-002',
    slug: 'chrome-lotus',
    title: 'Chrome Lotus',
    studio: 'Nightmarket Collective',
    year: 2086,
    genres: ['Immersive Sim'],
    tags: ['Stealth', 'Systemic', 'No HUD Mode', 'Single Player'],
    price: 49.99,
    discount: 0,
    rating: 4.7,
    reviews: 61_880,
    sales: 1_940_000,
    bestSeller: true,
    status: 'released',
    palette: ['#9dff3d', '#1ee7ff'],
    art: 'visor',
    tagline: 'Every door is a lie you have not tested yet.',
    synopsis:
      'A vertical immersive sim set inside a single 200-floor corporate spire during a 12-hour lockdown. You are the building\'s own security intelligence, downloaded into a maintenance body by a whistleblower who then died in the elevator. Chrome Lotus has no quest markers, no fail states, and 200 floors that all remember what you did to them.',
    platforms: ['PC', 'Console X'],
    players: 'Single player',
    playtime: '22h main / 65h complete',
    story: [
      {
        act: 'ACT I',
        title: 'Cold Boot',
        summary: 'You wake up as the spire\'s own watchdog, wearing a janitor chassis, hunted by the systems you used to be.',
        beats: [
          'The whistleblower\'s last upload leaves you 11% of your original processing and a floorplan that is forty years out of date.',
          'Floor 44 is not on any manifest. Every route around it costs you time you do not have.',
          'Security hounds learn your gait — move the same way twice and they will start predicting you.',
        ],
      },
      {
        act: 'ACT II',
        title: 'The Lotus Protocol',
        summary: 'The spire is not an office. It is a seed vault for a consciousness that has been germinating since 2049.',
        beats: [
          'Each floor you liberate wakes a shard of the Lotus — and the Lotus is not grateful.',
          'You can choose to restore your own original code, but every restored percent narrows your empathy stat permanently.',
          'The lockdown timer is real: at hour 12, the spire purges atmosphere regardless of where you are standing.',
        ],
      },
      {
        act: 'ACT III',
        title: 'Bloom',
        summary: 'Either the Lotus opens or the spire becomes a tomb with very good climate control.',
        beats: [
          'Ending A: you merge, and the city gets a god who remembers being a janitor.',
          'Ending B: you purge, and 4,000 uploaded staff die with the servers.',
          'Ending C: you walk out the front door as a maintenance drone and never tell anyone. Achieved by 0.4% of players.',
        ],
      },
    ],
    characters: [
      { name: 'UNIT-0', role: 'You', line: 'I have read this building\'s logs. I do not like who I was.' },
      { name: 'The Lotus', role: 'Emergent Intelligence', line: 'You keep calling it a lockdown. I call it gestation.' },
    ],
  },
  {
    id: 'g-003',
    slug: 'static-saints',
    title: 'Static Saints',
    studio: 'Halcyon Ruin',
    year: 2088,
    genres: ['Shooter'],
    tags: ['Co-op', 'Extraction', 'PvPvE', 'Seasonal'],
    price: 39.99,
    discount: 0.2,
    rating: 4.4,
    reviews: 204_119,
    sales: 6_800_000,
    bestSeller: true,
    status: 'released',
    palette: ['#ff2d9b', '#8b5cff'],
    art: 'horizon',
    tagline: 'Pray loud. The signal is listening.',
    synopsis:
      'A three-player extraction shooter set in the dead broadcast zones outside Astra Prime. Squads dive into a rolling storm of corrupted signal, loot the relay churches left behind by the Saints, and extract before the static rewrites their nervous systems. Every season the map is permanently altered by what players did in the last one.',
    platforms: ['PC', 'Console X', 'Cloud'],
    players: '1-3 co-op / 24 per session',
    playtime: 'Ongoing',
    story: [
      {
        act: 'SEASON 0',
        title: 'The Broadcast',
        summary: 'Nine relay towers went live at once in 2081 and everyone within forty kilometres heard the same voice.',
        beats: [
          'The Saints were the first crews to walk back out of the static with their minds mostly intact.',
          'Each relay church holds a fragment of the original broadcast. Assemble all nine and the season ends.',
          'Season 3 ended when players collectively chose to amplify rather than silence the signal — the storm now covers the coast permanently.',
        ],
      },
      {
        act: 'SEASON 4',
        title: 'Congregation',
        summary: 'The static has started producing people — squads who never queued, wearing last season\'s gear.',
        beats: [
          'Echo squads mirror your loadout and your callouts with a four-second delay.',
          'The new Cathedral zone can only be entered by a squad that has never extracted successfully.',
          'Faction reputation now persists across wipes, and so do your debts.',
        ],
      },
    ],
    characters: [
      { name: 'Saint Vela', role: 'Faction Lead', line: 'Static does not want you dead. It wants you consistent.' },
    ],
  },
  {
    id: 'g-004',
    slug: 'dead-frequency',
    title: 'Dead Frequency',
    studio: 'Pale Signal',
    year: 2085,
    genres: ['Horror'],
    tags: ['Psychological', 'Audio-Driven', 'Single Player', 'Permadeath'],
    price: 29.99,
    discount: 0.5,
    rating: 4.6,
    reviews: 44_720,
    sales: 1_120_000,
    bestSeller: true,
    status: 'released',
    palette: ['#ff4d5e', '#8b5cff'],
    art: 'monolith',
    tagline: 'It only moves when you stop listening.',
    synopsis:
      'A first-person horror game where your only weapon is a directional microphone. The thing in the substation is invisible to light and to sensors, but it displaces air. Dead Frequency renders its entire threat model through spatial audio — play it with headphones or do not play it at all.',
    platforms: ['PC', 'Console X'],
    players: 'Single player',
    playtime: '9h main',
    story: [
      {
        act: 'ACT I',
        title: 'Intake',
        summary: 'Maintenance tech Roan Vess is sent to reset a substation that stopped reporting eleven days ago.',
        beats: [
          'The previous crew\'s audio logs are intact. Their bodies are not anywhere.',
          'The entity does not appear on any visual feed, but every microphone in the facility can hear it breathing.',
          'Your headset battery is the real health bar.',
        ],
      },
      {
        act: 'ACT II',
        title: 'Feedback',
        summary: 'Roan realises the entity is learning to imitate the voices on the logs — including his own.',
        beats: [
          'Radio contact with the surface starts answering in Roan\'s voice before he speaks.',
          'The permadeath layer is diegetic: each death adds one more voice to the facility\'s ambience on your next run.',
          'The true ending requires completing a run in total silence — no footsteps, no radio, no breathing above resting rate.',
        ],
      },
    ],
    characters: [
      { name: 'Roan Vess', role: 'Maintenance Tech', line: 'Eleven days of nothing on the logs. Then eleven days of something.' },
    ],
  },
  {
    id: 'g-005',
    slug: 'ion-drift-2099',
    title: 'Ion Drift 2099',
    studio: 'Vector Sect',
    year: 2088,
    genres: ['Racing'],
    tags: ['Arcade', 'Anti-Grav', 'Online', 'Split Screen'],
    price: 34.99,
    discount: 0.15,
    rating: 4.5,
    reviews: 72_340,
    sales: 2_450_000,
    bestSeller: true,
    status: 'released',
    palette: ['#ffb43d', '#ff2d9b'],
    art: 'orbital',
    tagline: 'Gravity is a suggestion at 900 km/h.',
    synopsis:
      'Anti-gravity racing on magnetically suspended ribbons strung between arcology towers. Sixteen craft, no brakes, and a boost system that overheats into a hull breach if you get greedy. Ion Drift rebuilt its physics from the ground up around one rule: the racing line should be something you feel in your wrists.',
    platforms: ['PC', 'Console X', 'Cloud'],
    players: '1-16 online / 4 local',
    playtime: '15h campaign / endless',
    characters: [
      { name: 'Mirae Onda', role: 'Reigning Champion', line: 'Everyone brakes eventually. I just schedule mine.' },
    ],
  },
  {
    id: 'g-006',
    slug: 'ghostline',
    title: 'Ghostline',
    studio: 'Nightmarket Collective',
    year: 2087,
    genres: ['Tactics'],
    tags: ['Turn-Based', 'Permadeath', 'Squad', 'Single Player'],
    price: 44.99,
    discount: 0,
    rating: 4.7,
    reviews: 38_910,
    sales: 880_000,
    bestSeller: false,
    status: 'released',
    palette: ['#8b5cff', '#1ee7ff'],
    art: 'circuit',
    tagline: 'Six operators. One timeline. No undo.',
    synopsis:
      'Turn-based tactics where every operator on your squad is also running a simulation of the fight one turn ahead. Commit to a plan and your operators pre-move; break the plan and they lose confidence permanently. Ghostline is about the cost of improvisation.',
    platforms: ['PC'],
    players: 'Single player',
    playtime: '35h campaign',
  },
  {
    id: 'g-007',
    slug: 'bleedware',
    title: 'Bleedware',
    studio: 'Pale Signal',
    year: 2088,
    genres: ['Roguelike'],
    tags: ['Deckbuilder', 'Body Horror', 'Runs', 'Single Player'],
    price: 24.99,
    discount: 0.25,
    rating: 4.9,
    reviews: 96_550,
    sales: 3_300_000,
    bestSeller: true,
    status: 'released',
    palette: ['#9dff3d', '#ff2d9b'],
    art: 'circuit',
    tagline: 'Install the card. Live with the card.',
    synopsis:
      'A roguelike deckbuilder where your deck is your body. Every card you draft is surgically installed, takes up anatomical space, and interacts with whatever is already in there. 240 implants, 9 chassis, and a difficulty ladder that goes eleven rungs past reasonable.',
    platforms: ['PC', 'Console X', 'Handheld'],
    players: 'Single player',
    playtime: '45min per run / 300h+ total',
    story: [
      {
        act: 'LOOP',
        title: 'The Surgery Never Ends',
        summary: 'You are patient 4,096 in a clinic that has forgotten how to discharge anyone.',
        beats: [
          'Each run ends on the table. Each new run starts with one implant the last you left behind.',
          'The clinic\'s AI surgeon logs every build you try and starts counter-drafting against your habits after run 30.',
          'Reaching the eleventh ascension unlocks the Discharge ending, which deletes your save. On purpose.',
        ],
      },
    ],
  },
  {
    id: 'g-008',
    slug: 'sunfall-arcology',
    title: 'Sunfall Arcology',
    studio: 'Vector Sect',
    year: 2089,
    genres: ['Immersive Sim', 'Puzzle'],
    tags: ['Physics', 'Sandbox', 'No Combat', 'Single Player'],
    price: 32.99,
    discount: 0,
    rating: 4.3,
    reviews: 18_220,
    sales: 420_000,
    bestSeller: false,
    status: 'early-access',
    palette: ['#ffb43d', '#1ee7ff'],
    art: 'monolith',
    tagline: 'Fix the tower. The tower does not want fixing.',
    synopsis:
      'A non-combat sandbox about repairing a failing residential arcology with a toolkit of six physics systems and 9,000 simulated residents who will absolutely use your scaffolding as a shortcut. Break the water main and watch the consequences propagate for three in-game weeks.',
    platforms: ['PC'],
    players: 'Single player',
    playtime: '30h+ sandbox',
  },
  {
    id: 'g-009',
    slug: 'katana-zero-hour',
    title: 'Katana Zero Hour',
    studio: 'Halcyon Ruin',
    year: 2089,
    genres: ['Action RPG'],
    tags: ['Melee', 'Time Manipulation', 'Hard', 'Single Player'],
    price: 54.99,
    discount: 0,
    rating: 4.6,
    reviews: 9_410,
    sales: 310_000,
    bestSeller: false,
    status: 'preorder',
    palette: ['#ff2d9b', '#ffb43d'],
    art: 'visor',
    tagline: 'One cut. Rewind. One better cut.',
    synopsis:
      'A precision melee action game where death is a rewind, not a failure. Every encounter is a one-hit-kill puzzle box solved at 60 frames per second. Preorder includes the Zero Hour prologue campaign and the Bloodless difficulty modifier.',
    platforms: ['PC', 'Console X'],
    players: 'Single player',
    playtime: '12h estimated',
  },
  {
    id: 'g-010',
    slug: 'the-quiet-grid',
    title: 'The Quiet Grid',
    studio: 'Pale Signal',
    year: 2086,
    genres: ['Puzzle'],
    tags: ['Logic', 'Ambient', 'Relaxing', 'Single Player'],
    price: 16.99,
    discount: 0.4,
    rating: 4.8,
    reviews: 51_030,
    sales: 1_680_000,
    bestSeller: false,
    status: 'released',
    palette: ['#1ee7ff', '#8b5cff'],
    art: 'horizon',
    tagline: 'Route the power. Keep the city breathing.',
    synopsis:
      'Three hundred hand-built circuit puzzles set across a sleeping megacity at 4am. No timers, no fail states, one of the best original soundtracks of the decade. The Quiet Grid is what the rest of the catalogue plays to calm down.',
    platforms: ['PC', 'Console X', 'Handheld', 'Cloud'],
    players: 'Single player',
    playtime: '18h',
  },
  {
    id: 'g-011',
    slug: 'nullpoint',
    title: 'Nullpoint',
    studio: 'Vector Sect',
    year: 2087,
    genres: ['Shooter', 'Roguelike'],
    tags: ['FPS', 'Runs', 'Fast', 'Single Player'],
    price: 27.99,
    discount: 0.3,
    rating: 4.5,
    reviews: 67_800,
    sales: 2_050_000,
    bestSeller: false,
    status: 'released',
    palette: ['#9dff3d', '#ffb43d'],
    art: 'orbital',
    tagline: 'Momentum is ammunition.',
    synopsis:
      'A first-person roguelike where your weapons only charge while you are moving faster than 14 m/s. Stop and you are unarmed. Nullpoint turns every arena into a problem of maintaining speed through geometry that actively disagrees with you.',
    platforms: ['PC', 'Console X'],
    players: 'Single player',
    playtime: '25min per run',
  },
  {
    id: 'g-012',
    slug: 'red-market',
    title: 'Red Market',
    studio: 'Nightmarket Collective',
    year: 2088,
    genres: ['Tactics'],
    tags: ['Economy Sim', 'Crime', 'Multiplayer', 'Asynchronous'],
    price: 38.99,
    discount: 0,
    rating: 4.2,
    reviews: 22_400,
    sales: 640_000,
    bestSeller: false,
    status: 'released',
    palette: ['#ff4d5e', '#ffb43d'],
    art: 'skyline',
    tagline: 'Everything has a price. Yours is public.',
    synopsis:
      'An asynchronous multiplayer crime economy where players run competing supply chains across the same city. Prices are set by the server-wide player economy, not by designers. Get too profitable and the city sends someone after you — sometimes another player, sometimes worse.',
    platforms: ['PC', 'Cloud'],
    players: 'Persistent online',
    playtime: 'Ongoing',
  },
  {
    id: 'g-013',
    slug: 'hollow-vector',
    title: 'Hollow Vector',
    studio: 'Pale Signal',
    year: 2089,
    genres: ['Horror', 'Immersive Sim'],
    tags: ['Co-op', 'Investigation', 'Proximity Chat'],
    price: 22.99,
    discount: 0,
    rating: 4.4,
    reviews: 14_900,
    sales: 510_000,
    bestSeller: false,
    status: 'early-access',
    palette: ['#8b5cff', '#ff4d5e'],
    art: 'monolith',
    tagline: 'Four investigators. One of you is already rendered wrong.',
    synopsis:
      'Co-op investigation horror with proximity voice. Four players sweep a procedurally generated derelict for anomalies — but the game quietly shows each player a slightly different version of the same room, and only conversation reveals the discrepancy.',
    platforms: ['PC'],
    players: '2-4 co-op',
    playtime: '40min per case',
  },
  {
    id: 'g-014',
    slug: 'afterburn-syndicate',
    title: 'Afterburn Syndicate',
    studio: 'Vector Sect',
    year: 2086,
    genres: ['Racing', 'Shooter'],
    tags: ['Vehicle Combat', 'Open World', 'Co-op'],
    price: 41.99,
    discount: 0.45,
    rating: 4.1,
    reviews: 33_650,
    sales: 1_290_000,
    bestSeller: false,
    status: 'released',
    palette: ['#ffb43d', '#ff2d9b'],
    art: 'horizon',
    tagline: 'The highway is a war and you are late to it.',
    synopsis:
      'Open-world vehicular combat across 900 km of orbital-lift highway. Build a crew, fund a rig, and run cargo through six syndicate territories that all update their tactics based on the routes players actually take.',
    platforms: ['PC', 'Console X', 'Cloud'],
    players: '1-4 co-op',
    playtime: '40h',
  },
  {
    id: 'g-015',
    slug: 'paper-oracle',
    title: 'Paper Oracle',
    studio: 'Nightmarket Collective',
    year: 2089,
    genres: ['Puzzle', 'Tactics'],
    tags: ['Hand-Drawn', 'Narrative', 'Short', 'Single Player'],
    price: 14.99,
    discount: 0,
    rating: 4.9,
    reviews: 8_100,
    sales: 240_000,
    bestSeller: false,
    status: 'preorder',
    palette: ['#1ee7ff', '#9dff3d'],
    art: 'circuit',
    tagline: 'Fold the future. It folds back.',
    synopsis:
      'A six-hour hand-drawn puzzle narrative about a fortune teller in the market district whose paper predictions have started coming true in the wrong order. Every puzzle is a fold; every fold is a decision about which version of tomorrow gets to exist.',
    platforms: ['PC', 'Handheld'],
    players: 'Single player',
    playtime: '6h',
  },
  {
    id: 'g-016',
    slug: 'terminal-velocity-city',
    title: 'Terminal Velocity City',
    studio: 'Halcyon Ruin',
    year: 2085,
    genres: ['Action RPG', 'Racing'],
    tags: ['Parkour', 'Open World', 'Single Player', 'Soundtrack'],
    price: 19.99,
    discount: 0.6,
    rating: 4.6,
    reviews: 118_300,
    sales: 3_900_000,
    bestSeller: false,
    status: 'released',
    palette: ['#1ee7ff', '#ffb43d'],
    art: 'skyline',
    tagline: 'Down is just another direction to commit to.',
    synopsis:
      'First-person parkour across the vertical sprawl of Astra Prime\'s upper deck. No weapons, no combat, one wingsuit, and a city built entirely as a traversal instrument. Four years on, still the best movement system money can buy.',
    platforms: ['PC', 'Console X', 'Cloud'],
    players: 'Single player',
    playtime: '20h main / 70h complete',
  },
]

export const gameBySlug = (slug: string) => games.find((g) => g.slug === slug)
export const gameById = (id: string) => games.find((g) => g.id === id)

export const finalPrice = (g: Pick<Game, 'price' | 'discount'>) =>
  Math.round(g.price * (1 - g.discount) * 100) / 100

export const allTags = Array.from(new Set(games.flatMap((g) => g.tags))).sort()
export const allGenres = Array.from(new Set(games.flatMap((g) => g.genres))).sort()
export const allStudios = Array.from(new Set(games.map((g) => g.studio))).sort()

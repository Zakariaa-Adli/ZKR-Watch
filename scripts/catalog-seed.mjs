/**
 * Curated catalog seed for ZKR Watch.
 *
 * Every entry is a real, released (or officially scheduled) film or series.
 * The refresh script resolves each IMDb id against Cinemeta/IMDb metadata,
 * TVMaze, Wikipedia and YouTube, then writes src/data/catalog.json.
 *
 * `aliases` only help the trailer verifier match alternate release titles.
 * `trailer` is an optional, manually verified YouTube id override.
 */

export const MOVIES = [
  { id: "tt0111161", query: "The Shawshank Redemption 1994 official trailer" }, // The Shawshank Redemption
  { id: "tt0068646" }, // The Godfather
  { id: "tt0468569" }, // The Dark Knight
  { id: "tt0110912" }, // Pulp Fiction
  { id: "tt0137523" }, // Fight Club
  { id: "tt1375666" }, // Inception
  { id: "tt0816692" }, // Interstellar
  { id: "tt0133093" }, // The Matrix
  { id: "tt6751668", originalTitle: "기생충", aliases: ["Gisaengchung"], query: "Parasite 2019 official trailer" }, // Parasite
  { id: "tt0245429", originalTitle: "千と千尋の神隠し", aliases: ["Sen to Chihiro no Kamikakushi"], query: "Spirited Away official trailer" }, // Spirited Away
  { id: "tt5311514", originalTitle: "君の名は。", aliases: ["Kimi no Na wa"], query: "Your Name 2016 official trailer" }, // Your Name
  { id: "tt4633694" }, // Spider-Man: Into the Spider-Verse
  { id: "tt6710474" }, // Everything Everywhere All at Once
  { id: "tt15398776" }, // Oppenheimer
  { id: "tt15239678" }, // Dune: Part Two
  { id: "tt1392190", query: "Mad Max Fury Road 2015 official trailer" }, // Mad Max: Fury Road
  { id: "tt0172495" }, // Gladiator
  { id: "tt0120737", aliases: ["The Fellowship of the Ring"], query: "The Lord of the Rings The Fellowship of the Ring 2001 official trailer" }, // The Lord of the Rings: The Fellowship of the Ring
  { id: "tt0241527", aliases: ["Harry Potter and the Philosopher's Stone"], query: "Harry Potter and the Sorcerer's Stone 2001 official trailer" }, // Harry Potter and the Sorcerer's Stone
  { id: "tt0102926" }, // The Silence of the Lambs
  { id: "tt0114369", titleOverride: "Se7en", aliases: ["Seven"], query: "Seven 1995 official trailer" }, // Se7en
  { id: "tt2267998" }, // Gone Girl
  { id: "tt5052448" }, // Get Out
  { id: "tt7784604" }, // Hereditary
  { id: "tt1457767" }, // The Conjuring
  { id: "tt6644200" }, // A Quiet Place
  { id: "tt3783958" }, // La La Land
  { id: "tt0338013" }, // Eternal Sunshine of the Spotless Mind
  { id: "tt2278388" }, // The Grand Budapest Hotel
  { id: "tt8946378" }, // Knives Out
  { id: "tt1285016" }, // The Social Network
  { id: "tt2582802" }, // Whiplash
  { id: "tt0993846" }, // The Wolf of Wall Street
  { id: "tt1745960" }, // Top Gun: Maverick
  { id: "tt2911666" }, // John Wick
  { id: "tt3397884" }, // Sicario
  { id: "tt1856101" }, // Blade Runner 2049
  { id: "tt2543164" }, // Arrival
  { id: "tt0120382" }, // The Truman Show
  { id: "tt0482571" }, // The Prestige
  { id: "tt0407887" }, // The Departed
  { id: "tt2380307" }, // Coco
  { id: "tt0114709" }, // Toy Story
  { id: "tt0910970", aliases: ["WALL-E", "Wall E"], query: "WALL-E 2008 official trailer" }, // WALL·E
  { id: "tt2096673" }, // Inside Out
  { id: "tt0110357", query: "The Lion King 1994 official trailer" }, // The Lion King
  { id: "tt0050083", query: "12 Angry Men 1957 official trailer" }, // 12 Angry Men
  { id: "tt0047478", originalTitle: "七人の侍", aliases: ["Shichinin no Samurai"], query: "Seven Samurai 1954 official trailer" }, // Seven Samurai
  { id: "tt0034583", query: "Casablanca 1942 official trailer" }, // Casablanca
  { id: "tt0317248", originalTitle: "Cidade de Deus", query: "City of God 2002 official trailer" }, // City of God
  { id: "tt4016934", originalTitle: "아가씨", aliases: ["Agassi"], query: "The Handmaiden 2016 official trailer" }, // The Handmaiden
  { id: "tt0364569", originalTitle: "올드보이", aliases: ["Oldeuboi"], query: "Oldboy 2003 official trailer" }, // Oldboy
  { id: "tt0457430", originalTitle: "El laberinto del fauno", query: "Pan's Labyrinth 2006 official trailer" }, // Pan's Labyrinth
  { id: "tt0211915", originalTitle: "Le Fabuleux Destin d'Amélie Poulain", aliases: ["Amelie"], query: "Amelie 2001 official trailer" }, // Amélie
  { id: "tt1675434", originalTitle: "Intouchables", aliases: ["The Intouchables"], query: "The Intouchables 2011 official trailer" }, // The Intouchables
  { id: "tt8613070", originalTitle: "Portrait de la jeune fille en feu" }, // Portrait of a Lady on Fire
  { id: "tt5700672", originalTitle: "부산행", aliases: ["Busanhaeng"], query: "Train to Busan 2016 official trailer" }, // Train to Busan
  { id: "tt0113247", titleOverride: "La Haine" }, // La Haine
  { id: "tt31193180" }, // Sinners
  { id: "tt16311594", aliases: ["F1 The Movie"], query: "F1 The Movie 2025 official trailer" }, // F1: The Movie
  { id: "tt17526714" }, // The Substance
  { id: "tt28607951" }, // Anora
  { id: "tt20215234" }, // Conclave
  { id: "tt26581740" }, // Weapons
  { id: "tt12042730" }, // Project Hail Mary
  { id: "tt22084616" }, // Spider-Man: Brand New Day
  { id: "tt31378509" }, // Dune: Part Three
  { id: "tt21357150" }, // Avengers: Doomsday
  { id: "tt32558705" }, // The Hunger Games: Sunrise on the Reaping
];

export const SERIES = [
  { id: "tt0903747" }, // Breaking Bad
  { id: "tt3032476" }, // Better Call Saul
  { id: "tt0141842" }, // The Sopranos
  { id: "tt0306414" }, // The Wire
  { id: "tt0944947" }, // Game of Thrones
  { id: "tt11198330" }, // House of the Dragon
  { id: "tt7660850" }, // Succession
  { id: "tt4786824" }, // The Crown
  { id: "tt7366338" }, // Chernobyl
  { id: "tt2356777" }, // True Detective
  { id: "tt2802850", query: "Fargo FX series official trailer" }, // Fargo
  { id: "tt5290382" }, // Mindhunter
  { id: "tt5753856", query: "Dark 2017 Netflix series official trailer" }, // Dark
  { id: "tt4574334" }, // Stranger Things
  { id: "tt11280740" }, // Severance
  { id: "tt14688458" }, // Silo
  { id: "tt3581920" }, // The Last of Us
  { id: "tt14452776" }, // The Bear
  { id: "tt10986410" }, // Ted Lasso
  { id: "tt5687612", query: "Fleabag official trailer BBC" }, // Fleabag
  { id: "tt2467372" }, // Brooklyn Nine-Nine
  { id: "tt0386676", aliases: ["The Office US"], query: "The Office US 2005 official trailer" }, // The Office
  { id: "tt1266020" }, // Parks and Recreation
  { id: "tt0108778" }, // Friends
  { id: "tt2861424" }, // Rick and Morty
  { id: "tt11126994" }, // Arcane
  { id: "tt2560140", originalTitle: "進撃の巨人", aliases: ["Shingeki no Kyojin"] }, // Attack on Titan
  { id: "tt1355642", originalTitle: "鋼の錬金術師 FULLMETAL ALCHEMIST", aliases: ["Fullmetal Alchemist Brotherhood"], query: "Fullmetal Alchemist Brotherhood official trailer" }, // Fullmetal Alchemist: Brotherhood
  { id: "tt0877057", originalTitle: "デスノート", aliases: ["Death Note 2006"], query: "Death Note 2006 anime official trailer" }, // Death Note
  { id: "tt10919420", originalTitle: "오징어 게임", aliases: ["Ojing-eo Geim"], query: "Squid Game Netflix official trailer" }, // Squid Game
  { id: "tt6468322", originalTitle: "La casa de papel", query: "Money Heist Netflix official trailer" }, // Money Heist
  { id: "tt2531336", query: "Lupin Netflix 2021 official trailer" }, // Lupin
  { id: "tt10795658", originalTitle: "今際の国のアリス", aliases: ["Imawa no Kuni no Arisu"], query: "Alice in Borderland Netflix official trailer" }, // Alice in Borderland
  { id: "tt10048342" }, // The Queen's Gambit
  { id: "tt2442560" }, // Peaky Blinders
  { id: "tt1475582" }, // Sherlock
  { id: "tt2085059" }, // Black Mirror
  { id: "tt1190634" }, // The Boys
  { id: "tt9253284" }, // Andor
  { id: "tt8111088" }, // The Mandalorian
  { id: "tt13406094" }, // The White Lotus
  { id: "tt2788316", aliases: ["Shogun FX"], query: "Shogun 2024 FX official trailer" }, // Shogun
  { id: "tt5875444" }, // Slow Horses
  { id: "tt31510819" }, // MobLand
  { id: "tt0098936", query: "Twin Peaks 1990 official trailer" }, // Twin Peaks
  { id: "tt0318871", originalTitle: "ベルセルク", aliases: ["Berserk 1997"], query: "Berserk 1997 anime official trailer" }, // Berserk
  { id: "tt0804503" }, // Mad Men
  { id: "tt31806037" }, // Adolescence
  { id: "tt31938062" }, // The Pitt
  { id: "tt23649128" }, // The Studio
  { id: "tt3230854" }, // The Expanse
  { id: "tt0475784" }, // Westworld
];

/** Manually checked id overrides, used only when automatic ranking needs help. */
export const TRAILER_OVERRIDES = {
  // Attack on Titan — Crunchyroll Store Australia, official home-video trailer
  "tt2560140": "nk2BHu3Mbes",
  // Berserk — Discotek Media, official 1997 series Blu-ray trailer
  "tt0318871": "odIwkGztmcc",
  // Brooklyn Nine-Nine — official channel, final-season trailer
  "tt2467372": { id: "faJAT35j5Ss", force: true },
  // Death Note — Crunchyroll
  "tt0877057": "NlJZ-YgAt-c",
  // Fargo — FX Networks, installment 3 official trailer
  "tt2802850": "bR2i8-z_fvc",
  // Breaking Bad — Sony Pictures at Home UK
  "tt0903747": "XZ8daibM3AE",
  // La Haine — BFI 30th anniversary trailer
  "tt0113247": "FKwcXt3JIaU",
  // Mad Men — Stan Australia official trailer
  "tt0804503": "KdoUCkPw92g",
  // Sicario — Rotten Tomatoes, 2015 film trailer
  "tt3397884": "G8tlEcnrGnU",
  // The Lion King — Disney+ original 1994 trailer
  "tt0110357": "lFzVJEksoDY",
  // The Prestige — Rotten Tomatoes Classic
  "tt0482571": "RLtaA9fFNXU",
  // The Queen's Gambit — Rotten Tomatoes TV
  "tt10048342": "oZn3qSgmLqI",
  // The Wire — HBO UK, season 5 official trailer
  "tt0306414": "lUeOCo0HeJo",
  // Twin Peaks — MUBI, seasons 1 & 2 official teaser
  "tt0098936": "rFuKtJjhBCQ",
  // Your Name. — GKIDS Films
  "tt5311514": "TYku4P7MHdo",
  // Toy Story — Disney+ original trailer
  "tt0114709": "CxwTLktovTU",
  // Harry Potter and the Sorcerer's Stone — official Harry Potter channel
  "tt0241527": "l91Km49W9qI",
  // Arcane — Netflix
  "tt11126994": "fXmAurh012s",
  // Black Mirror — Netflix, season 7 official trailer
  "tt2085059": "1iqra1ojEvM",
  // City of God — Rotten Tomatoes Classic
  "tt0317248": "dcUOO4Itgmw",
  // Get Out — Universal Pictures UK
  "tt5052448": "K9su2d0WM2I",
  // Gladiator — Paramount Movies
  "tt0172495": "P5ieIbInFpg",
  // Hereditary — A24
  "tt7784604": "V6wWKNij_1M",
  // Peaky Blinders — BBC series launch trailer
  "tt2442560": "EM12mcTEI88",
  // Rick and Morty — Adult Swim, season 8 official trailer
  "tt2861424": "ySYnTO7leqI",
  // Seven Samurai — BFI 4K restoration trailer
  // (automatic fallback selects Rotten Tomatoes Classic; kept out of overrides)
  // Sherlock — Hulu official trailer
  "tt1475582": "gGqWqGOSTGQ",
  // The Handmaiden — Curzon official trailer
  "tt4016934": "wYsdzNIcJNc",
  // The Lord of the Rings: The Fellowship of the Ring — Movieclips
  "tt0120737": "V75dMMIW2B4",
  // The Sopranos — HBO UK, season 6 official trailer
  "tt0141842": "faRl5Bea-Go",
  // Westworld — HBO UK, season 1 official trailer
  "tt0475784": "kEkZdgWu7mM",
  // 12 Angry Men — Amazon MGM Studios
  "tt0050083": "TEN-2uTi2c0",
  // Fullmetal Alchemist: Brotherhood — DYNIT official trailer
  "tt1355642": "g_pR8e-SCnE",
};

/** Channels considered official studio, network or distributor channels. */
export const OFFICIAL_CHANNELS = [
  "20th century studios",
  "a24",
  "adult swim",
  "amazon mgm studios",
  "amc",
  "amc+",
  "annapurna pictures",
  "apple tv",
  "bbc",
  "bbc studios",
  "bfi",
  "breaking bad and beyond",
  "channel 4",
  "criterion collection",
  "crunchyroll",
  "curzon",
  "dc",
  "disney",
  "discotek media",
  "dreamworks",
  "dynit",
  "focus features",
  "fx networks",
  "gkids",
  "harry potter",
  "hbo",
  "hbo max",
  "hulu",
  "illumination",
  "itv",
  "janus films",
  "lionsgate movies",
  "lionsgate tv",
  "madman anime",
  "marvel entertainment",
  "marvel studios",
  "max",
  "miramax",
  "mubi",
  "neon",
  "netflix",
  "orion pictures",
  "paramount movies",
  "paramount pictures",
  "paramount plus",
  "park circus",
  "peacock",
  "pixar",
  "prime video",
  "searchlight pictures",
  "showtime",
  "sky",
  "sony pics at home",
  "sony pictures classics",
  "sony pictures entertainment",
  "sony pictures releasing",
  "stan",
  "star wars",
  "starz",
  "still watching netflix",
  "studiocanal",
  "the criterion collection",
  "toei animation",
  "universal pictures",
  "viz media",
  "walt disney studios",
  "warner bros",
  "warner on demand",
  "well go usa",
];

/** Reputable trailer channels that are not the studio itself. */
export const TRUSTED_TRAILER_CHANNELS = [
  "rottentomatoes",
  "rotten tomatoes",
  "rotten tomatoes classic trailers",
  "movieclips",
  "movieclips trailers",
  "ign",
  "joblo",
  "joblo trailers",
  "fandango",
  "letterboxd",
  "entertainment weekly",
  "variety",
  "the hollywood reporter",
  "firstshowing",
  "collider",
];

export const REJECTED_TRAILER_TERMS = [
  "fan made",
  "fan-made",
  "fan edit",
  "fan trailer",
  "concept trailer",
  "ai trailer",
  "ai generated",
  "reaction",
  "reacts",
  "review",
  "recap",
  "explained",
  "ending explained",
  "behind the scenes",
  "making of",
  "interview",
  "parody",
  "honest trailer",
  "breakdown",
  "easter egg",
  "gameplay",
  "music video",
  "commentary",
  "compilation",
  "all trailers",
  "trailer mashup",
];

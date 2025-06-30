import { ThemeDictionary, ThemeType } from './types';

export const themeDictionaries: Record<ThemeType, ThemeDictionary & { icon: string }> = {
  space: {
    theme: 'space',
    name: { en: 'Space Adventure', de: 'Weltraum-Abenteuer' },
    icon: '🚀',
    colors: {
      primary: '#1e3a8a',
      secondary: '#7c3aed',
      accent: '#fbbf24',
      background: '#0f172a',
      gradient: 'from-blue-900 via-purple-900 to-black'
    },
    locations: [
      { en: 'Space Station Alpha', de: 'Raumstation Alpha' },
      { en: 'Asteroid Belt', de: 'Asteroidengürtel' },
      { en: 'Moon Base', de: 'Mondbasis' },
      { en: 'Mars Colony', de: 'Mars-Kolonie' },
      { en: 'Jupiter Orbit', de: 'Jupiter-Orbit' },
      { en: 'Saturn Rings', de: 'Saturnringe' },
      { en: 'Deep Space Outpost', de: 'Tiefraum-Außenposten' },
      { en: 'Nebula Cloud', de: 'Nebelwolke' }
    ],
    actions: [
      { en: 'Explore', de: 'Erkunde' },
      { en: 'Defend', de: 'Verteidige' },
      { en: 'Navigate through', de: 'Navigiere durch' },
      { en: 'Repair', de: 'Repariere' },
      { en: 'Launch from', de: 'Starte von' },
      { en: 'Discover', de: 'Entdecke' },
      { en: 'Escape from', de: 'Entkomme aus' }
    ],
    challenges: [
      {
        id: 'meteor-math',
        name: { en: 'Meteor Math Storm', de: 'Meteor-Mathe-Sturm' },
        description: { en: 'Calculate quickly to dodge meteors!', de: 'Rechne schnell um Meteoren auszuweichen!' },
        problemCount: 10,
        difficultyModifier: 1.2,
        specialRules: { timeBonus: true }
      },
      {
        id: 'zero-gravity',
        name: { en: 'Zero Gravity Equations', de: 'Schwerelosigkeits-Gleichungen' },
        description: { en: 'Solve upside-down problems!', de: 'Löse umgedrehte Aufgaben!' },
        problemCount: 15,
        difficultyModifier: 1.0,
        specialRules: { reverseOrder: true }
      },
      {
        id: 'fuel-calculation',
        name: { en: 'Fuel Calculation Crisis', de: 'Treibstoff-Berechnungs-Krise' },
        description: { en: 'Perfect accuracy needed!', de: 'Perfekte Genauigkeit erforderlich!' },
        problemCount: 12,
        difficultyModifier: 1.1,
        specialRules: { noMistakes: true }
      }
    ],
    miniBosses: [
      {
        id: 'space-pirate',
        name: { en: 'Space Pirate Captain', de: 'Weltraumpiraten-Kapitän' },
        health: 3,
        timeLimit: 30,
        difficulty: 1.5,
        sprite: '🏴‍☠️'
      },
      {
        id: 'robot-guardian',
        name: { en: 'Robot Guardian', de: 'Roboter-Wächter' },
        health: 4,
        timeLimit: 25,
        difficulty: 1.6,
        specialMechanics: { shieldPhase: true },
        sprite: '🤖'
      },
      {
        id: 'alien-scout',
        name: { en: 'Alien Scout Leader', de: 'Alien-Späher-Anführer' },
        health: 3,
        timeLimit: 20,
        difficulty: 1.7,
        specialMechanics: { movingTarget: true },
        sprite: '👽'
      }
    ],
    finalBosses: [
      {
        id: 'galaxy-emperor',
        name: { en: 'Galaxy Emperor', de: 'Galaxie-Imperator' },
        health: 5,
        timeLimit: 45,
        difficulty: 2.0,
        specialMechanics: { doubleDigits: true, mixedOperations: true },
        sprite: '👾'
      },
      {
        id: 'black-hole',
        name: { en: 'Black Hole Master', de: 'Schwarzes-Loch-Meister' },
        health: 6,
        timeLimit: 40,
        difficulty: 2.2,
        specialMechanics: { movingTarget: true, shieldPhase: true },
        sprite: '🌌'
      },
      {
        id: 'quantum-ai',
        name: { en: 'Quantum AI Core', de: 'Quanten-KI-Kern' },
        health: 5,
        timeLimit: 35,
        difficulty: 2.3,
        specialMechanics: { doubleDigits: true, movingTarget: true },
        sprite: '🧠'
      }
    ],
    rewards: [
      {
        id: 'rocket-boost',
        name: { en: 'Rocket Boost', de: 'Raketen-Boost' },
        description: { en: '+10% speed bonus', de: '+10% Geschwindigkeitsbonus' },
        icon: '🚀',
        rarity: 'common'
      },
      {
        id: 'star-shield',
        name: { en: 'Star Shield', de: 'Sternenschild' },
        description: { en: 'One free mistake', de: 'Ein kostenloser Fehler' },
        icon: '⭐',
        rarity: 'rare'
      },
      {
        id: 'cosmic-calculator',
        name: { en: 'Cosmic Calculator', de: 'Kosmischer Rechner' },
        description: { en: 'Show hints for 5 problems', de: 'Zeige Hinweise für 5 Aufgaben' },
        icon: '🌟',
        rarity: 'epic'
      }
    ],
    ambientEmojis: ['🌟', '✨', '🌙', '🪐', '☄️', '🛸', '🌠']
  },

  dino: {
    theme: 'dino',
    name: { en: 'Dino Discovery', de: 'Dino-Entdeckung' },
    icon: '🦕',
    colors: {
      primary: '#059669',
      secondary: '#84cc16',
      accent: '#f59e0b',
      background: '#14532d',
      gradient: 'from-green-900 via-emerald-800 to-lime-700'
    },
    locations: [
      { en: 'Jungle Valley', de: 'Dschungeltal' },
      { en: 'Volcano Crater', de: 'Vulkankrater' },
      { en: 'Ancient Cave', de: 'Uralte Höhle' },
      { en: 'Fossil Site', de: 'Fossilienstätte' },
      { en: 'Tar Pits', de: 'Teergruben' },
      { en: 'Crystal Cavern', de: 'Kristallhöhle' },
      { en: 'Prehistoric Lake', de: 'Prähistorischer See' }
    ],
    actions: [
      { en: 'Excavate', de: 'Grabe aus' },
      { en: 'Track', de: 'Verfolge' },
      { en: 'Study', de: 'Erforsche' },
      { en: 'Tame', de: 'Zähme' },
      { en: 'Escape from', de: 'Fliehe vor' },
      { en: 'Discover', de: 'Entdecke' },
      { en: 'Protect', de: 'Beschütze' }
    ],
    challenges: [
      {
        id: 'fossil-hunt',
        name: { en: 'Fossil Hunt', de: 'Fossilien-Jagd' },
        description: { en: 'Dig up ancient math problems!', de: 'Grabe uralte Matheaufgaben aus!' },
        problemCount: 12,
        difficultyModifier: 1.0
      },
      {
        id: 'stampede-escape',
        name: { en: 'Stampede Escape', de: 'Stampeden-Flucht' },
        description: { en: 'Calculate fast to outrun the herd!', de: 'Rechne schnell um der Herde zu entkommen!' },
        problemCount: 10,
        difficultyModifier: 1.3,
        specialRules: { timeBonus: true }
      },
      {
        id: 'egg-protection',
        name: { en: 'Egg Protection', de: 'Eier-Schutz' },
        description: { en: 'No mistakes allowed!', de: 'Keine Fehler erlaubt!' },
        problemCount: 8,
        difficultyModifier: 1.2,
        specialRules: { noMistakes: true }
      }
    ],
    miniBosses: [
      {
        id: 'raptor-pack',
        name: { en: 'Raptor Pack Leader', de: 'Raptor-Rudel-Anführer' },
        health: 3,
        timeLimit: 25,
        difficulty: 1.5,
        sprite: '🦖'
      },
      {
        id: 'pterodactyl',
        name: { en: 'Giant Pterodactyl', de: 'Riesen-Pterodaktylus' },
        health: 4,
        timeLimit: 30,
        difficulty: 1.6,
        specialMechanics: { movingTarget: true },
        sprite: '🦅'
      }
    ],
    finalBosses: [
      {
        id: 't-rex',
        name: { en: 'Tyrannosaurus Rex', de: 'Tyrannosaurus Rex' },
        health: 5,
        timeLimit: 40,
        difficulty: 2.0,
        specialMechanics: { doubleDigits: true },
        sprite: '🦕'
      },
      {
        id: 'mega-raptor',
        name: { en: 'Mega Raptor', de: 'Mega-Raptor' },
        health: 6,
        timeLimit: 35,
        difficulty: 2.2,
        specialMechanics: { movingTarget: true, mixedOperations: true },
        sprite: '🦖'
      }
    ],
    rewards: [
      {
        id: 'dino-egg',
        name: { en: 'Dino Egg', de: 'Dino-Ei' },
        description: { en: 'Hatch for bonus points', de: 'Schlüpfe für Bonuspunkte' },
        icon: '🥚',
        rarity: 'common'
      },
      {
        id: 'fossil-armor',
        name: { en: 'Fossil Armor', de: 'Fossilien-Rüstung' },
        description: { en: 'Protection from one mistake', de: 'Schutz vor einem Fehler' },
        icon: '🦴',
        rarity: 'rare'
      }
    ],
    ambientEmojis: ['🌿', '🌴', '🦕', '🦖', '🌺', '🍃', '🦴']
  },

  medieval: {
    theme: 'medieval',
    name: { en: 'Medieval Quest', de: 'Mittelalter-Quest' },
    icon: '🏰',
    colors: {
      primary: '#991b1b',
      secondary: '#6b7280',
      accent: '#eab308',
      background: '#450a0a',
      gradient: 'from-red-900 via-gray-800 to-yellow-700'
    },
    locations: [
      { en: 'Castle Keep', de: 'Burgfried' },
      { en: 'Dragon\'s Lair', de: 'Drachenhöhle' },
      { en: 'Enchanted Forest', de: 'Verwunschener Wald' },
      { en: 'Knight\'s Tournament', de: 'Ritterturnier' },
      { en: 'Wizard Tower', de: 'Zaubererturm' },
      { en: 'Royal Treasury', de: 'Königliche Schatzkammer' }
    ],
    actions: [
      { en: 'Storm', de: 'Erstürme' },
      { en: 'Defend', de: 'Verteidige' },
      { en: 'Quest through', de: 'Durchquere' },
      { en: 'Conquer', de: 'Erobere' },
      { en: 'Rescue from', de: 'Rette aus' },
      { en: 'Battle in', de: 'Kämpfe in' }
    ],
    challenges: [
      {
        id: 'sword-training',
        name: { en: 'Sword Training', de: 'Schwerttraining' },
        description: { en: 'Quick reflexes needed!', de: 'Schnelle Reflexe nötig!' },
        problemCount: 10,
        difficultyModifier: 1.1,
        specialRules: { timeBonus: true }
      },
      {
        id: 'spell-casting',
        name: { en: 'Spell Casting', de: 'Zaubersprüche' },
        description: { en: 'Perfect accuracy for magic!', de: 'Perfekte Genauigkeit für Magie!' },
        problemCount: 12,
        difficultyModifier: 1.2,
        specialRules: { noMistakes: true }
      }
    ],
    miniBosses: [
      {
        id: 'black-knight',
        name: { en: 'Black Knight', de: 'Schwarzer Ritter' },
        health: 4,
        timeLimit: 30,
        difficulty: 1.6,
        sprite: '⚔️'
      },
      {
        id: 'evil-wizard',
        name: { en: 'Evil Wizard', de: 'Böser Zauberer' },
        health: 3,
        timeLimit: 25,
        difficulty: 1.7,
        specialMechanics: { movingTarget: true },
        sprite: '🧙‍♂️'
      }
    ],
    finalBosses: [
      {
        id: 'dragon-king',
        name: { en: 'Dragon King', de: 'Drachenkönig' },
        health: 6,
        timeLimit: 45,
        difficulty: 2.2,
        specialMechanics: { doubleDigits: true, shieldPhase: true },
        sprite: '🐉'
      },
      {
        id: 'dark-sorcerer',
        name: { en: 'Dark Sorcerer', de: 'Dunkler Zauberer' },
        health: 5,
        timeLimit: 40,
        difficulty: 2.0,
        specialMechanics: { mixedOperations: true, movingTarget: true },
        sprite: '🧙‍♂️'
      }
    ],
    rewards: [
      {
        id: 'knights-honor',
        name: { en: 'Knight\'s Honor', de: 'Ritterehre' },
        description: { en: '+15% score bonus', de: '+15% Punktebonus' },
        icon: '🛡️',
        rarity: 'rare'
      },
      {
        id: 'magic-scroll',
        name: { en: 'Magic Scroll', de: 'Magische Schriftrolle' },
        description: { en: 'Skip one problem', de: 'Überspringe eine Aufgabe' },
        icon: '📜',
        rarity: 'epic'
      }
    ],
    ambientEmojis: ['⚔️', '🛡️', '🏰', '👑', '🗡️', '🏹', '🎯']
  },

  ocean: {
    theme: 'ocean',
    name: { en: 'Ocean Explorer', de: 'Ozean-Erforscher' },
    icon: '🌊',
    colors: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      background: '#083344',
      gradient: 'from-cyan-900 via-blue-800 to-teal-700'
    },
    locations: [
      { en: 'Coral Reef', de: 'Korallenriff' },
      { en: 'Sunken Ship', de: 'Versunkenes Schiff' },
      { en: 'Deep Trench', de: 'Tiefseegraben' },
      { en: 'Kelp Forest', de: 'Tangwald' },
      { en: 'Underwater Cave', de: 'Unterwasserhöhle' },
      { en: 'Atlantis Ruins', de: 'Atlantis-Ruinen' }
    ],
    actions: [
      { en: 'Dive into', de: 'Tauche in' },
      { en: 'Explore', de: 'Erforsche' },
      { en: 'Navigate', de: 'Navigiere' },
      { en: 'Discover', de: 'Entdecke' },
      { en: 'Swim through', de: 'Schwimme durch' },
      { en: 'Search', de: 'Durchsuche' }
    ],
    challenges: [
      {
        id: 'current-navigation',
        name: { en: 'Current Navigation', de: 'Strömungs-Navigation' },
        description: { en: 'Calculate against the flow!', de: 'Rechne gegen die Strömung!' },
        problemCount: 12,
        difficultyModifier: 1.2,
        specialRules: { reverseOrder: true }
      },
      {
        id: 'treasure-hunt',
        name: { en: 'Treasure Hunt', de: 'Schatzsuche' },
        description: { en: 'Find hidden math treasures!', de: 'Finde versteckte Mathe-Schätze!' },
        problemCount: 15,
        difficultyModifier: 1.0
      }
    ],
    miniBosses: [
      {
        id: 'shark-leader',
        name: { en: 'Hammerhead Leader', de: 'Hammerhai-Anführer' },
        health: 4,
        timeLimit: 30,
        difficulty: 1.6,
        sprite: '🦈'
      },
      {
        id: 'octopus-guardian',
        name: { en: 'Giant Octopus', de: 'Riesenkrake' },
        health: 3,
        timeLimit: 25,
        difficulty: 1.7,
        specialMechanics: { movingTarget: true },
        sprite: '🐙'
      }
    ],
    finalBosses: [
      {
        id: 'kraken',
        name: { en: 'The Kraken', de: 'Der Kraken' },
        health: 6,
        timeLimit: 45,
        difficulty: 2.3,
        specialMechanics: { doubleDigits: true, movingTarget: true },
        sprite: '🦑'
      },
      {
        id: 'poseidon',
        name: { en: 'Poseidon\'s Guardian', de: 'Poseidons Wächter' },
        health: 5,
        timeLimit: 40,
        difficulty: 2.1,
        specialMechanics: { mixedOperations: true, shieldPhase: true },
        sprite: '🔱'
      }
    ],
    rewards: [
      {
        id: 'bubble-shield',
        name: { en: 'Bubble Shield', de: 'Blasenschild' },
        description: { en: 'Extra time for problems', de: 'Extra Zeit für Aufgaben' },
        icon: '🫧',
        rarity: 'common'
      },
      {
        id: 'pearls-wisdom',
        name: { en: 'Pearl of Wisdom', de: 'Perle der Weisheit' },
        description: { en: 'Double points for perfect streak', de: 'Doppelte Punkte für perfekte Serie' },
        icon: '🦪',
        rarity: 'legendary'
      }
    ],
    ambientEmojis: ['🐠', '🐟', '🐡', '🦀', '🌊', '🐚', '🏊']
  },

  circus: {
    theme: 'circus',
    name: { en: 'Circus Spectacular', de: 'Zirkus-Spektakel' },
    icon: '🎪',
    colors: {
      primary: '#dc2626',
      secondary: '#facc15',
      accent: '#a855f7',
      background: '#7c2d12',
      gradient: 'from-red-700 via-yellow-500 to-purple-700'
    },
    locations: [
      { en: 'Big Top Tent', de: 'Zirkuszelt' },
      { en: 'Tightrope', de: 'Hochseil' },
      { en: 'Lion\'s Ring', de: 'Löwenmanege' },
      { en: 'Clown Car', de: 'Clownauto' },
      { en: 'Trapeze Platform', de: 'Trapez-Plattform' },
      { en: 'Magic Stage', de: 'Zauberbühne' }
    ],
    actions: [
      { en: 'Perform at', de: 'Tritt auf in' },
      { en: 'Balance on', de: 'Balanciere auf' },
      { en: 'Jump through', de: 'Springe durch' },
      { en: 'Juggle at', de: 'Jongliere bei' },
      { en: 'Entertain in', de: 'Unterhalte in' },
      { en: 'Master', de: 'Meistere' }
    ],
    challenges: [
      {
        id: 'juggling-numbers',
        name: { en: 'Juggling Numbers', de: 'Zahlen-Jonglage' },
        description: { en: 'Keep all balls in the air!', de: 'Halte alle Bälle in der Luft!' },
        problemCount: 10,
        difficultyModifier: 1.3,
        specialRules: { timeBonus: true }
      },
      {
        id: 'tightrope-balance',
        name: { en: 'Tightrope Balance', de: 'Hochseil-Balance' },
        description: { en: 'Perfect balance needed!', de: 'Perfekte Balance nötig!' },
        problemCount: 8,
        difficultyModifier: 1.4,
        specialRules: { noMistakes: true }
      }
    ],
    miniBosses: [
      {
        id: 'ringmaster',
        name: { en: 'Strict Ringmaster', de: 'Strenger Zirkusdirektor' },
        health: 3,
        timeLimit: 25,
        difficulty: 1.6,
        sprite: '🎩'
      },
      {
        id: 'strongman',
        name: { en: 'Circus Strongman', de: 'Zirkus-Kraftmensch' },
        health: 4,
        timeLimit: 30,
        difficulty: 1.5,
        specialMechanics: { doubleDigits: true },
        sprite: '💪'
      }
    ],
    finalBosses: [
      {
        id: 'grand-illusionist',
        name: { en: 'Grand Illusionist', de: 'Großer Illusionist' },
        health: 5,
        timeLimit: 40,
        difficulty: 2.2,
        specialMechanics: { movingTarget: true, mixedOperations: true },
        sprite: '🎭'
      },
      {
        id: 'circus-master',
        name: { en: 'Circus Master', de: 'Zirkusmeister' },
        health: 6,
        timeLimit: 45,
        difficulty: 2.0,
        specialMechanics: { doubleDigits: true, shieldPhase: true },
        sprite: '🤹'
      }
    ],
    rewards: [
      {
        id: 'golden-ticket',
        name: { en: 'Golden Ticket', de: 'Goldenes Ticket' },
        description: { en: 'Skip to next checkpoint', de: 'Springe zum nächsten Checkpoint' },
        icon: '🎫',
        rarity: 'epic'
      },
      {
        id: 'spotlight',
        name: { en: 'Spotlight', de: 'Rampenlicht' },
        description: { en: '+20% score for next quest', de: '+20% Punkte für nächste Quest' },
        icon: '✨',
        rarity: 'rare'
      }
    ],
    ambientEmojis: ['🎪', '🎭', '🤹', '🎨', '🎯', '🎠', '🎡']
  }
};
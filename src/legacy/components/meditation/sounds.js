export const sounds = [
  {
    id: 'birds-forest',
    name: 'O\'rmon qushlari',
    src: '/times/mp3/o\'rmon_qushlari.mp3',
    category: 'qushlar',
    season: 'spring',
    emoji: '🐦'
  },
  {
    id: 'birds-bedana',
    name: 'Bedana',
    src: '/times/mp3/bedana.mp3',
    category: 'qushlar',
    season: 'spring',
    emoji: '🕊️'
  },
  {
    id: 'birds-amadinka',
    name: 'To\'tiqush',
    src: '/times/mp3/to\'tiqush.mp3',
    category: 'qushlar',
    season: 'spring',
    emoji: '🐤'
  },
  {
    id: 'rain-light',
    name: 'Yengil yomg\'ir',
    src: '/times/mp3/Yengil_yomg\'ir.mp3',
    category: 'obohovo',
    season: 'autumn',
    emoji: '🌧️'
  },
  {
    id: 'rain-heavy',
    name: 'Kuchli yomg\'ir',
    src: '/times/mp3/Kuchli_yomg\'ir.m4a',
    category: 'obohovo',
    season: 'autumn',
    emoji: '⛈️'
  },
  {
    id: 'storm',
    name: 'Bo\'ron',
    src: '/times/mp3/Bo\'ron.mp3',
    category: 'obohovo',
    season: 'winter',
    emoji: '🌪️'
  },
  {
    id: 'ocean',
    name: 'Okean to\'lqinlari',
    src: '/times/mp3/Okean_to\'lqinlari.mp3',
    category: 'tabiat',
    season: 'summer',
    emoji: '🌊'
  },
  {
    id: 'wind',
    name: 'Shamol',
    src: '/times/mp3/Shamol.mp3',
    category: 'tabiat',
    season: 'winter',
    emoji: '💨'
  },
  {
    id: 'fire',
    name: 'Olov',
    src: '/times/mp3/Olov.mp3',
    category: 'tabiat',
    season: 'winter',
    emoji: '🔥'
  },
];

export const soundCategories = [
  {
    id: 'qushlar',
    name: 'Qushlar',
    emoji: '🐦',
    color: '#86efac'
  },
  {
    id: 'obohovo',
    name: 'Ob-havo',
    emoji: '🌧️',
    color: '#4cc9f0'
  },
  {
    id: 'tabiat',
    name: 'Tabiat',
    emoji: '🌿', 
    color: '#2d5016'
  },
];

export const getSoundsBySeason = (seasonId) => {
  const seasonSounds = {
    spring: ['birds-forest', 'birds-bedana', 'birds-amadinka'],
    summer: ['ocean'],
    autumn: ['rain-light', 'rain-heavy'],
    winter: ['wind', 'fire']
  };

  return sounds.filter(sound =>
    seasonSounds[seasonId]?.includes(sound.id)
  );
};

export const getSoundsByCategory = (category) => {
  return sounds.filter(sound => sound.category === category);
};

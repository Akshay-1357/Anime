import { Anime, DanmakuComment, EpisodeComment } from '../types/anime';

// Import local generated image assets
import heroBannerImg from '../assets/images/anime_hero_cinematic_1791194533090.jpg';
import actionCoverImg from '../assets/images/anime_action_shonen_1791194545508.jpg';
import fantasyCoverImg from '../assets/images/anime_fantasy_adventure_1791194592619.jpg';
import cyberpunkCoverImg from '../assets/images/anime_cyberpunk_sci_fi_1791194606915.jpg';
import romanceCoverImg from '../assets/images/anime_romance_slice_of_life_1791194618046.jpg';

export const INITIAL_ANIME_CATALOG: Anime[] = [
  {
    id: 'chronicles-of-astralis',
    title: 'Chronicles of Astralis: Twilight Horizon',
    titleJapanese: '星界の黄昏クロニクル',
    romajiTitle: 'Seikai no Tasogare Chronicle',
    coverImage: heroBannerImg,
    bannerImage: heroBannerImg,
    score: 9.38,
    popularityRank: 1,
    totalEpisodes: 24,
    currentEpisodeAiring: 12,
    season: 'Fall',
    releaseYear: 2026,
    status: 'Airing',
    studio: 'Ufotable & KuroNami Studios',
    format: 'TV',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    synopsis:
      'In a shattered Tokyo suspended between mortal reality and celestial auroras, Ren Tachibana discovers an ancient spirit blade capable of cutting through cosmic rifts. Alongside the enigmatic star priestess Kanna, he must navigate an escalating astral war before the Celestial Comet resets the fabric of modern existence.',
    subAvailable: true,
    dubAvailable: true,
    featured: true,
    trending: true,
    cast: [
      { characterName: 'Ren Tachibana', japaneseVoice: 'Hiroshi Kamiya', englishVoice: 'Bryce Papenbrook', role: 'Main' },
      { characterName: 'Kanna Hoshizora', japaneseVoice: 'Saori Hayami', englishVoice: 'Cherami Leigh', role: 'Main' },
      { characterName: 'Ryuji Kurogane', japaneseVoice: 'Kenjiro Tsuda', englishVoice: 'Matthew Mercer', role: 'Supporting' },
      { characterName: 'Aria Vesper', japaneseVoice: 'Aoi Yuuki', englishVoice: 'Erika Harlacher', role: 'Supporting' }
    ],
    episodes: [
      {
        id: 'astralis-ep-1',
        episodeNumber: 1,
        title: 'The Sky Shatters at Twilight',
        duration: 734,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: heroBannerImg,
        synopsis: 'Ren witnesses a celestial fracture above the Shibuya skyline and is pursued by astral Phantoms until a mysterious maiden intervenes.',
        introStart: 10,
        introEnd: 95
      },
      {
        id: 'astralis-ep-2',
        episodeNumber: 2,
        title: 'Awakening of the Obsidian Katana',
        duration: 653,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: actionCoverImg,
        synopsis: 'Cornered in an ethereal memory realm, Ren awakens his lineage legacy blade, severing the barrier between dimension threads.',
        introStart: 8,
        introEnd: 92
      },
      {
        id: 'astralis-ep-3',
        episodeNumber: 3,
        title: 'The Sanctuary of Forgotten Dragons',
        duration: 888,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        thumbnail: fantasyCoverImg,
        synopsis: 'Traveling deep into the floating sanctuary, Ren and Kanna encounter an ancient guardian dragon testing their resolve.',
        introStart: 12,
        introEnd: 97
      },
      {
        id: 'astralis-ep-4',
        episodeNumber: 4,
        title: 'Neon Shadows and Cybernetic Curses',
        duration: 596,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: cyberpunkCoverImg,
        synopsis: 'In underground Akihabara, cyber-enhancers attempt to harness astral energy, triggering a catastrophic resonance wave.',
        introStart: 15,
        introEnd: 100
      }
    ]
  },
  {
    id: 'soul-ignite-valkyrie',
    title: 'Soul Ignite: Crimson Valkyrie',
    titleJapanese: '紅蓮のヴァルキリー',
    romajiTitle: 'Guren no Valkyrie: Soul Ignite',
    coverImage: actionCoverImg,
    bannerImage: actionCoverImg,
    score: 9.15,
    popularityRank: 2,
    totalEpisodes: 12,
    currentEpisodeAiring: 12,
    season: 'Summer',
    releaseYear: 2026,
    status: 'Completed',
    studio: 'MAPPA',
    format: 'TV',
    genres: ['Action', 'Fantasy', 'Adventure'],
    synopsis:
      'Born without the inherent mana required to wield imperial relics, Kai trains his physical body to hypersonic limits. When the demonic Nether Legion breaches the northern barricade, he unleashes a forbidden spiritual aura that burns his own life essence into pure combat fury.',
    subAvailable: true,
    dubAvailable: true,
    featured: false,
    trending: true,
    cast: [
      { characterName: 'Kai Vance', japaneseVoice: 'Yuki Kaji', englishVoice: 'Johnny Yong Bosch', role: 'Main' },
      { characterName: 'Serafina Frost', japaneseVoice: 'Yoko Hikasa', englishVoice: 'Laura Bailey', role: 'Main' },
      { characterName: 'Commander Vane', japaneseVoice: 'Takehito Koyasu', englishVoice: 'Patrick Seitz', role: 'Supporting' }
    ],
    episodes: [
      {
        id: 'valkyrie-ep-1',
        episodeNumber: 1,
        title: 'Ignition: The Zero-Rank Vanguard',
        duration: 888,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        thumbnail: actionCoverImg,
        synopsis: 'Kai faces execution for challenging an imperial noble, until an unexpected horde invasion gives him a final trial by blood.',
        introStart: 15,
        introEnd: 98
      },
      {
        id: 'valkyrie-ep-2',
        episodeNumber: 2,
        title: 'Crimson Tempest',
        duration: 734,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: heroBannerImg,
        synopsis: 'Unleashing the first limiter seal, Kai battles the three Nether Commanders atop the howling Iron Bridge.',
        introStart: 10,
        introEnd: 94
      }
    ]
  },
  {
    id: 'floating-isles-of-elendia',
    title: 'Floating Isles of Elendia',
    titleJapanese: 'エレンディアの浮島紀行',
    romajiTitle: 'Elendia no Ukishima Kikou',
    coverImage: fantasyCoverImg,
    bannerImage: fantasyCoverImg,
    score: 9.02,
    popularityRank: 5,
    totalEpisodes: 13,
    currentEpisodeAiring: 8,
    season: 'Spring',
    releaseYear: 2026,
    status: 'Airing',
    studio: 'Wit Studio',
    format: 'TV',
    genres: ['Fantasy', 'Adventure', 'Mystery'],
    synopsis:
      'High above the toxic storm clouds of the lower lands lies Elendia, an archipelago of floating continents powered by dormant leviathans. A young cartographer and his spirit lynx embark on an expedition to map the mythical edge where heaven touches the eternal void.',
    subAvailable: true,
    dubAvailable: true,
    featured: false,
    trending: true,
    cast: [
      { characterName: 'Lian Arkwright', japaneseVoice: 'Daiki Yamashita', englishVoice: 'Justin Briner', role: 'Main' },
      { characterName: 'Freya Zephyr', japaneseVoice: 'Inori Minase', englishVoice: 'Kira Buckland', role: 'Main' }
    ],
    episodes: [
      {
        id: 'elendia-ep-1',
        episodeNumber: 1,
        title: 'The Wind Whispers Old Songs',
        duration: 653,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: fantasyCoverImg,
        synopsis: 'Lian launches his handmade glidewing glider into uncharted sky currents, guided by an ancient nautical star chart.',
        introStart: 12,
        introEnd: 96
      },
      {
        id: 'elendia-ep-2',
        episodeNumber: 2,
        title: 'Ruins of the Cloud Temple',
        duration: 596,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: heroBannerImg,
        synopsis: 'Exploring a moss-covered floating shrine reveals carvings depicting the ancient collapse of the old world.',
        introStart: 14,
        introEnd: 99
      }
    ]
  },
  {
    id: 'neo-shibuya-protocol-2099',
    title: 'Neo Shibuya: Protocol 2099',
    titleJapanese: 'ネオ渋谷：プロトコル2099',
    romajiTitle: 'Neo Shibuya Protocol 2099',
    coverImage: cyberpunkCoverImg,
    bannerImage: cyberpunkCoverImg,
    score: 8.94,
    popularityRank: 8,
    totalEpisodes: 10,
    currentEpisodeAiring: 10,
    season: 'Winter',
    releaseYear: 2026,
    status: 'Completed',
    studio: 'Production I.G & Science SARU',
    format: 'TV',
    genres: ['Cyberpunk', 'Sci-Fi', 'Mystery'],
    synopsis:
      'In a perpetual rain-drenched Neo Shibuya ruled by algorithmic conglomerates, rogue cyber-diver Shiki hunts digital phantoms inside human neural links. When a syndicate AI develops emotional autonomy, Shiki becomes both hunter and target in an existential virtual cataclysm.',
    subAvailable: true,
    dubAvailable: false,
    featured: false,
    trending: false,
    cast: [
      { characterName: 'Shiki Kisaragi', japaneseVoice: 'Maaya Sakamoto', englishVoice: 'Mary Elizabeth McGlynn', role: 'Main' },
      { characterName: 'Ghost AI Echo', japaneseVoice: 'Rie Takahashi', englishVoice: 'Felecia Angelle', role: 'Main' }
    ],
    episodes: [
      {
        id: 'neo-ep-1',
        episodeNumber: 1,
        title: 'Rain on Hologram Streets',
        duration: 734,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: cyberpunkCoverImg,
        synopsis: 'Shiki receives an untraceable bounty to extract memories from a deceased megacorp cyber-executive before the neural core degrades.',
        introStart: 20,
        introEnd: 105
      }
    ]
  },
  {
    id: 'sakura-station-memories',
    title: 'Sakura Station Memories',
    titleJapanese: '桜駅の追憶',
    romajiTitle: 'Sakura Eki no Tsuioku',
    coverImage: romanceCoverImg,
    bannerImage: romanceCoverImg,
    score: 8.87,
    popularityRank: 12,
    totalEpisodes: 12,
    currentEpisodeAiring: 12,
    season: 'Spring',
    releaseYear: 2026,
    status: 'Completed',
    studio: 'Kyoto Animation',
    format: 'TV',
    genres: ['Romance', 'Slice of Life', 'Drama'],
    synopsis:
      'A quiet countryside train platform bordered by cherry blossom trees brings two estranged childhood friends back together after six years in different cities. Through shared afternoon commutes, unspoken letters, and quiet seasonal beauty, they confront the choices that drift people apart.',
    subAvailable: true,
    dubAvailable: true,
    featured: false,
    trending: false,
    cast: [
      { characterName: 'Souta Morikawa', japaneseVoice: 'Natsuki Hanae', englishVoice: 'Aleks Le', role: 'Main' },
      { characterName: 'Hina Tachibana', japaneseVoice: 'Kana Hanazawa', englishVoice: 'Stephanie Sheh', role: 'Main' }
    ],
    episodes: [
      {
        id: 'sakura-ep-1',
        episodeNumber: 1,
        title: 'The 4:15 PM Local Train',
        duration: 596,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: romanceCoverImg,
        synopsis: 'Souta returns to his hometown after high school entrance exams and unexpectedly spots Hina waiting by the old rusted bicycle shed.',
        introStart: 10,
        introEnd: 90
      }
    ]
  }
];

export const INITIAL_DANMAKU_COMMENTS: DanmakuComment[] = [
  { id: 'd-1', episodeId: 'astralis-ep-1', time: 5, text: 'HERE WE GO! Hype season begins! 🔥', color: '#ff4d4f', topOffsetPercent: 12 },
  { id: 'd-2', episodeId: 'astralis-ep-1', time: 14, text: 'Opening song is an absolute masterpiece 🎵', color: '#40a9ff', topOffsetPercent: 28 },
  { id: 'd-3', episodeId: 'astralis-ep-1', time: 35, text: 'The background animation budget is insane 🤯', color: '#52c41a', topOffsetPercent: 45 },
  { id: 'd-4', episodeId: 'astralis-ep-1', time: 60, text: 'Ufotable visual quality strikes again!!', color: '#faad14', topOffsetPercent: 20 },
  { id: 'd-5', episodeId: 'astralis-ep-1', time: 110, text: 'Wait watch his right hand closely!!', color: '#f759ab', topOffsetPercent: 65 },
  { id: 'd-6', episodeId: 'astralis-ep-1', time: 140, text: 'Bro got that main character energy immediately', color: '#13c2c2', topOffsetPercent: 32 },
  { id: 'd-7', episodeId: 'astralis-ep-1', time: 220, text: 'THE OST DROP AT THIS EXACT SECOND OMGGG', color: '#ffec3d', topOffsetPercent: 18 },
  { id: 'd-8', episodeId: 'astralis-ep-1', time: 340, text: '10/10 choreography right here', color: '#ffffff', topOffsetPercent: 55 },
  { id: 'd-9', episodeId: 'astralis-ep-2', time: 12, text: 'Ep 2 lets goooo!! ⚔️', color: '#ff4d4f', topOffsetPercent: 22 },
  { id: 'd-10', episodeId: 'astralis-ep-2', time: 48, text: 'That blade resonance sound effect is so crisp', color: '#40a9ff', topOffsetPercent: 40 }
];

export const INITIAL_EPISODE_COMMENTS: EpisodeComment[] = [
  {
    id: 'c-1',
    episodeId: 'astralis-ep-1',
    userName: 'KuroNamiFan99',
    avatarColor: 'bg-rose-500',
    timestamp: '2 hours ago',
    videoTimecode: '05:42',
    text: 'That sword summon animation at 5:42 gave me chills! The way the runes illuminated along the blade before the strike was peak animation direction.',
    upvotes: 42,
    isSpoiler: false
  },
  {
    id: 'c-2',
    episodeId: 'astralis-ep-1',
    userName: 'SenpaiObserves',
    avatarColor: 'bg-indigo-500',
    timestamp: '5 hours ago',
    videoTimecode: '11:15',
    text: 'If you read chapter 3 of the manga, you know who the silhouette on the rooftop was. Prepare your tissues for episode 4, guys.',
    upvotes: 27,
    isSpoiler: true
  },
  {
    id: 'c-3',
    episodeId: 'astralis-ep-1',
    userName: 'AoiYukari',
    avatarColor: 'bg-emerald-500',
    timestamp: 'Yesterday',
    text: 'Voice acting in Japanese is flawless, but I also tested the English dub and Bryce did an incredible job with Ren. Love having both options!',
    upvotes: 19,
    isSpoiler: false
  }
];

export const DEMO_PRESET_STREAMS = [
  {
    name: 'Astralis: Twilight Battle (1080p)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    format: 'MP4 HD'
  },
  {
    name: 'Crimson Valkyrie Action (1080p)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    format: 'MP4 HD'
  },
  {
    name: 'Floating Isles Adventure (720p)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    format: 'MP4 HD'
  },
  {
    name: 'Sakura Embankment Pace (1080p)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    format: 'MP4 HD'
  }
];

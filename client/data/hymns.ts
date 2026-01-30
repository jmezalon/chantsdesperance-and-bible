export interface Hymn {
  id: string;
  number: number;
  title: string;
  titleKreyol?: string;
  section: string;
  sectionId: number;
  language: "french" | "kreyol" | "both";
  verses: {
    number: number;
    text: string;
    textKreyol?: string;
  }[];
  chorus?: {
    text: string;
    textKreyol?: string;
  };
}

export interface HymnSection {
  id: number;
  name: string;
  nameKreyol?: string;
  description: string;
  hymnCount: number;
  languages: ("french" | "kreyol")[];
}

export const hymnSections: HymnSection[] = [
  {
    id: 1,
    name: "Chants d'Espérance",
    description: "Hymnes traditionnels d'espérance et de foi",
    hymnCount: 360,
    languages: ["french", "kreyol"],
  },
  {
    id: 2,
    name: "Sur les Ailes de la Foi",
    description: "Cantiques de louange et d'adoration",
    hymnCount: 150,
    languages: ["french"],
  },
  {
    id: 3,
    name: "Mélodies Joyeuses",
    nameKreyol: "Melodi Jwayal",
    description: "Chants joyeux de célébration",
    hymnCount: 100,
    languages: ["french", "kreyol"],
  },
  {
    id: 4,
    name: "La Voix du Réveil",
    description: "Chants de réveil spirituel",
    hymnCount: 80,
    languages: ["french"],
  },
  {
    id: 5,
    name: "Réveillons-Nous",
    description: "Appels au réveil et à la consécration",
    hymnCount: 60,
    languages: ["french"],
  },
  {
    id: 6,
    name: "Échos des Élus",
    description: "Échos spirituels et témoignages",
    hymnCount: 50,
    languages: ["french"],
  },
  {
    id: 7,
    name: "Haïti Chante avec Radio Lumière",
    description: "Chants haïtiens populaires",
    hymnCount: 40,
    languages: ["french", "kreyol"],
  },
  {
    id: 8,
    name: "Gloire à l'Agneau",
    description: "Louanges à l'Agneau de Dieu",
    hymnCount: 45,
    languages: ["french"],
  },
  {
    id: 9,
    name: "Alléluia",
    description: "Chants d'alléluia et de victoire",
    hymnCount: 35,
    languages: ["french", "kreyol"],
  },
];

export const hymns: Hymn[] = [
  {
    id: "ce-1",
    number: 1,
    title: "Ô jour heureux!",
    titleKreyol: "O jou byen-ne!",
    section: "Chants d'Espérance",
    sectionId: 1,
    language: "both",
    verses: [
      {
        number: 1,
        text: "Ô jour heureux, jour béni,\nOù Jésus me prit pour lui!\nDe cette paix qui m'inonde,\nRien ne pourra tarir la source féconde.",
        textKreyol: "O jou byen-ne, jou beni,\nKote Jezi pran m pou li!\nLapè sa a ki anvayi m,\nAnyen pa ka fè sous li seche.",
      },
      {
        number: 2,
        text: "Quelle gloire d'être à Christ,\nDe compter sur son amour!\nMon cœur joyeux, en tout temps,\nChante ses louanges nuit et jour.",
        textKreyol: "Ki bèl bagay se pou Kris,\nPou konte sou lanmou li!\nKè m kontan, tout tan,\nChante lwanj li lajounen kou lannwit.",
      },
    ],
    chorus: {
      text: "Heureux jour! Heureux jour!\nQuand Jésus lava mes péchés!\nIl m'apprit à veiller, prier,\nEt à vivre en me confiant.",
      textKreyol: "Jou byen-ne! Jou byen-ne!\nLè Jezi lave peche m yo!\nLi montre m veye, priye,\nE viv nan konfyans.",
    },
  },
  {
    id: "ce-5",
    number: 5,
    title: "Quel repos céleste",
    titleKreyol: "Ki repo nan syèl la",
    section: "Chants d'Espérance",
    sectionId: 1,
    language: "both",
    verses: [
      {
        number: 1,
        text: "Quel repos céleste, Jésus, d'être à toi!\nDe goûter sans cesse ta présence et ta joie!\nDans ton cœur je trouve un refuge assuré;\nPar ton sang j'obtiens une paix consacrée.",
        textKreyol: "Ki repo nan syèl la, Jezi, se pou ou!\nPou goute san rete prezans ou ak jwa ou!\nNan kè ou mwen jwenn yon refij ki asire;\nPa san ou mwen jwenn yon lapè konsakre.",
      },
      {
        number: 2,
        text: "Parfaite soumission, parfait abandon,\nDans ta douce étreinte, je trouve le pardon.\nDans tes bras d'amour, Seigneur, je suis béni,\nJe goûte les joies du repos infini.",
        textKreyol: "Soumisyon pafè, abandone nèt,\nNan anbrase dous ou, mwen jwenn padon.\nNan bra lanmou ou, Senyè, mwen beni,\nMwen goute jwa repo ki pa janm fini.",
      },
    ],
    chorus: {
      text: "Parfait repos en Jésus!\nBonheur suprême en mon roi!\nDans ses bras d'amour, plus de soucis,\nPlus de trouble, plus d'effroi.",
      textKreyol: "Repo pafè nan Jezi!\nBonè siprèm nan wa mwen!\nNan bra lanmou li, pa gen souci,\nPa gen twoub, pa gen laperèz.",
    },
  },
  {
    id: "ce-28",
    number: 28,
    title: "Prends ma vie dans tes bras",
    section: "Échos des Élus",
    sectionId: 6,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Prends ma vie dans tes bras,\nSauveur de mon âme;\nQue ta grâce et ton amour\nSoient ma seule flamme.",
      },
      {
        number: 2,
        text: "Que mon cœur soit tout à toi,\nDans la joie ou la peine;\nQue ta volonté soit faite,\nComme au ciel sur terre.",
      },
      {
        number: 3,
        text: "Garde-moi près de ton cœur,\nDans les jours de tempête;\nQue ta paix soit mon refuge,\nMa joie la plus parfaite.",
      },
    ],
    chorus: {
      text: "Prends ma vie, Seigneur,\nPrends-la tout entière;\nConsacre-la à ta gloire,\nChaque jour, chaque heure.",
    },
  },
  {
    id: "saf-12",
    number: 12,
    title: "Gloire à Dieu au plus haut des cieux",
    section: "Sur les Ailes de la Foi",
    sectionId: 2,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Gloire à Dieu au plus haut des cieux!\nPaix sur la terre, bonne volonté!\nLes anges chantent dans les cieux,\nCélébrant l'amour du Roi des rois.",
      },
      {
        number: 2,
        text: "Que toute la terre s'incline,\nDevant le Roi de l'univers;\nSa majesté est divine,\nSon règne dure à jamais.",
      },
    ],
    chorus: {
      text: "Gloire! Gloire! Alléluia!\nGloire à l'Éternel des armées!\nSon amour remplit nos cœurs,\nSa grâce couvre nos péchés.",
    },
  },
  {
    id: "mj-8",
    number: 8,
    title: "Jésus est ma lumière",
    titleKreyol: "Jezi se limyè mwen",
    section: "Mélodies Joyeuses",
    sectionId: 3,
    language: "both",
    verses: [
      {
        number: 1,
        text: "Jésus est ma lumière,\nDans l'obscurité il brille;\nSon amour est ma prière,\nSa grâce est ma famille.",
        textKreyol: "Jezi se limyè mwen,\nNan fènwa a li klere;\nLanmou li se lapriyè m,\nGras li se fanmi mwen.",
      },
      {
        number: 2,
        text: "Quand le chemin est sombre,\nIl éclaire tous mes pas;\nJe ne crains pas les ombres,\nCar Jésus est avec moi.",
        textKreyol: "Lè chemen an fè nwa,\nLi klere tout pa mwen yo;\nMwen pa pè lonbraj yo,\nPaske Jezi avèk mwen.",
      },
    ],
  },
  {
    id: "vr-15",
    number: 15,
    title: "Réveille-toi, mon âme",
    section: "La Voix du Réveil",
    sectionId: 4,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Réveille-toi, mon âme,\nLève-toi de ton sommeil;\nLe Seigneur t'appelle,\nIl est ton soleil.",
      },
      {
        number: 2,
        text: "Secoue ta torpeur,\nMarche dans la lumière;\nLe jour de gloire arrive,\nC'est l'heure de la prière.",
      },
    ],
    chorus: {
      text: "Réveille-toi! Réveille-toi!\nLe Seigneur t'attend;\nOuvre ton cœur à sa voix,\nIl t'aime tendrement.",
    },
  },
  {
    id: "rn-7",
    number: 7,
    title: "Debout, soldats de Christ",
    section: "Réveillons-Nous",
    sectionId: 5,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Debout, soldats de Christ,\nPrenez vos armes de lumière;\nLe combat est décisif,\nL'ennemi est en arrière.",
      },
      {
        number: 2,
        text: "Avancez avec courage,\nLe Seigneur est votre force;\nDans la bataille, gardez l'espoir,\nCar la victoire est nôtre.",
      },
    ],
  },
  {
    id: "hcrl-3",
    number: 3,
    title: "Haïti pour Christ",
    titleKreyol: "Ayiti pou Kris",
    section: "Haïti Chante avec Radio Lumière",
    sectionId: 7,
    language: "both",
    verses: [
      {
        number: 1,
        text: "Haïti, terre bénie,\nLève-toi pour le Seigneur;\nQue sa gloire soit ta vie,\nQue son amour soit ta valeur.",
        textKreyol: "Ayiti, tè beni,\nLeve pou Senyè a;\nKe glwa li se lavi ou,\nKe lanmou li se valè ou.",
      },
      {
        number: 2,
        text: "Du nord au sud, d'est en ouest,\nQue son nom soit proclamé;\nDans nos montagnes et nos plaines,\nQue Jésus soit adoré.",
        textKreyol: "Depi nò rive sid, lès rive lwès,\nKe non li pwoclame;\nNan mòn nou yo ak plèn nou yo,\nKe Jezi adore.",
      },
    ],
    chorus: {
      text: "Haïti pour Christ! Haïti pour Christ!\nNotre nation se lève pour toi;\nAvec foi et espérance,\nNous marchons vers ta présence.",
      textKreyol: "Ayiti pou Kris! Ayiti pou Kris!\nNasyon nou leve pou ou;\nAvèk lafwa ak esperans,\nNou mache nan prezans ou.",
    },
  },
  {
    id: "ga-20",
    number: 20,
    title: "L'Agneau de Dieu",
    section: "Gloire à l'Agneau",
    sectionId: 8,
    language: "french",
    verses: [
      {
        number: 1,
        text: "L'Agneau de Dieu, pur et sans tache,\nA donné sa vie pour nous;\nSon sang précieux nous rachète,\nNous libère de tout péché.",
      },
      {
        number: 2,
        text: "Digne est l'Agneau qui fut immolé,\nDe recevoir honneur et gloire;\nToute créature proclame,\nSon règne éternel.",
      },
    ],
    chorus: {
      text: "Gloire à l'Agneau! Gloire à l'Agneau!\nQui nous a lavés par son sang;\nSaint, saint, saint est le Seigneur,\nDigne de toute louange.",
    },
  },
  {
    id: "al-11",
    number: 11,
    title: "Alléluia, louez l'Éternel",
    titleKreyol: "Alelouya, louwe Bondye",
    section: "Alléluia",
    sectionId: 9,
    language: "both",
    verses: [
      {
        number: 1,
        text: "Alléluia, louez l'Éternel,\nDans son sanctuaire céleste;\nLouez-le pour ses hauts faits,\nLouez-le selon sa grandeur immense.",
        textKreyol: "Alelouya, louwe Bondye,\nNan sanktyè li nan syèl la;\nLouwe l pou gwo zèv li yo,\nLouwe l selon grandè li san limit.",
      },
      {
        number: 2,
        text: "Louez-le au son de la trompette,\nLouez-le avec le luth et la harpe;\nLouez-le avec tambourin et danse,\nLouez-le avec les instruments à cordes.",
        textKreyol: "Louwe l ak son twonpèt la,\nLouwe l ak gita ak ap;\nLouwe l ak tanbou ak dans,\nLouwe l ak enstriman akòd.",
      },
    ],
    chorus: {
      text: "Alléluia! Alléluia!\nQue tout ce qui respire loue l'Éternel!\nAlléluia! Alléluia!\nLouez l'Éternel!",
      textKreyol: "Alelouya! Alelouya!\nKe tout sa k respire louwe Bondye!\nAlelouya! Alelouya!\nLouwe Bondye!",
    },
  },
  {
    id: "ce-100",
    number: 100,
    title: "À toi la gloire",
    titleKreyol: "Pou ou glwa a",
    section: "Chants d'Espérance",
    sectionId: 1,
    language: "both",
    verses: [
      {
        number: 1,
        text: "À toi la gloire, ô Ressuscité!\nÀ toi la victoire pour l'éternité!\nBrillant de lumière, l'ange est descendu,\nIl roule la pierre du tombeau vaincu.",
        textKreyol: "Pou ou glwa a, O Resisite!\nPou ou viktwa a pou tout tan!\nLimyè klere, zanj lan desann,\nLi woule wòch tonm nan ki pèdi.",
      },
      {
        number: 2,
        text: "Vois-le paraître: c'est lui, c'est Jésus,\nTon Sauveur, ton Maître! Oh! ne doute plus!\nSois dans l'allégresse, peuple du Seigneur,\nEt redis sans cesse: le Christ est vainqueur!",
        textKreyol: "Gade l parèt: se li, se Jezi,\nSovè ou, Mèt ou! O! pa doute ankò!\nRete nan lajwa, pèp Senyè a,\nE repete san rete: Kris la genyen!",
      },
    ],
    chorus: {
      text: "À toi la gloire, ô Ressuscité!\nÀ toi la victoire pour l'éternité!",
      textKreyol: "Pou ou glwa a, O Resisite!\nPou ou viktwa a pou tout tan!",
    },
  },
  {
    id: "ce-150",
    number: 150,
    title: "Reste avec nous, Seigneur",
    section: "Chants d'Espérance",
    sectionId: 1,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Reste avec nous, Seigneur,\nLe jour décline;\nQue ta présence demeure,\nQue ton amour nous illumine.",
      },
      {
        number: 2,
        text: "Dans les ténèbres de la nuit,\nSois notre lumière;\nGuide nos pas sur le chemin,\nVers ta demeure céleste.",
      },
    ],
    chorus: {
      text: "Reste avec nous, Seigneur,\nCar le soir approche;\nNe nous laisse pas seuls,\nDans l'ombre qui s'avance.",
    },
  },
  {
    id: "ce-200",
    number: 200,
    title: "Quel ami fidèle",
    titleKreyol: "Ki zanmi fidèl",
    section: "Chants d'Espérance",
    sectionId: 1,
    language: "both",
    verses: [
      {
        number: 1,
        text: "Quel ami fidèle et tendre\nNous avons en Jésus-Christ,\nToujours prêt à nous entendre,\nÀ répondre à notre cri!",
        textKreyol: "Ki zanmi fidèl e dou\nNou genyen nan Jezikri,\nToujou pare pou tande nou,\nPou reponn lè n rele li!",
      },
      {
        number: 2,
        text: "Il connaît nos défaillances,\nNos chutes de chaque jour,\nSévère en ses exigences,\nIl est riche en son amour.",
        textKreyol: "Li konnen feblès nou yo,\nChit nou fè chak jou,\nSeryez nan sa l mande yo,\nLi rich nan lanmou.",
      },
    ],
    chorus: {
      text: "Quel ami fidèle et tendre\nNous avons en Jésus-Christ!\nTout, au Seigneur, on peut rendre:\nCar il est notre appui.",
      textKreyol: "Ki zanmi fidèl e dou\nNou genyen nan Jezikri!\nTou sa, bay Senyè a, nou ka fè l:\nPaske li se soutyen nou.",
    },
  },
];

export function searchHymns(query: string): Hymn[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return hymns;

  return hymns.filter((hymn) => {
    const numberMatch = hymn.number.toString().includes(lowerQuery);
    const titleMatch = hymn.title.toLowerCase().includes(lowerQuery);
    const titleKreyolMatch = hymn.titleKreyol?.toLowerCase().includes(lowerQuery);
    const sectionMatch = hymn.section.toLowerCase().includes(lowerQuery);
    
    return numberMatch || titleMatch || titleKreyolMatch || sectionMatch;
  });
}

export function getHymnsBySection(sectionId: number): Hymn[] {
  return hymns.filter((hymn) => hymn.sectionId === sectionId);
}

export function getHymnById(id: string): Hymn | undefined {
  return hymns.find((hymn) => hymn.id === id);
}

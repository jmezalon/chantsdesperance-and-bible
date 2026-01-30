export interface Hymn {
  id: string;
  number: number;
  title: string;
  section: string;
  sectionId: number;
  language: "french" | "kreyol";
  verses: {
    number: number;
    text: string;
  }[];
  chorus?: {
    text: string;
  };
}

export interface HymnSection {
  id: number;
  name: string;
  nameFull: string;
  description: string;
  hymnCount: number;
  language: "french" | "kreyol";
  parentSection?: string;
}

// Each section is a separate collection - French and Kreyol are different songs, not translations
export const hymnSections: HymnSection[] = [
  // Chants d'Espérance - has both French and Kreyol (separate collections)
  {
    id: 1,
    name: "Chants d'Espérance",
    nameFull: "Chants d'Espérance (Français)",
    description: "Hymnes traditionnels d'espérance - Version française",
    hymnCount: 360,
    language: "french",
    parentSection: "Chants d'Espérance",
  },
  {
    id: 2,
    name: "Chants d'Espérance",
    nameFull: "Chants d'Espérance (Kreyòl)",
    description: "Hymnes traditionnels d'espérance - Vèsyon kreyòl",
    hymnCount: 360,
    language: "kreyol",
    parentSection: "Chants d'Espérance",
  },
  // Sur les Ailes de la Foi - French only
  {
    id: 3,
    name: "Sur les Ailes de la Foi",
    nameFull: "Sur les Ailes de la Foi",
    description: "Cantiques de louange et d'adoration",
    hymnCount: 150,
    language: "french",
  },
  // Mélodies Joyeuses - has both French and Kreyol (separate collections)
  {
    id: 4,
    name: "Mélodies Joyeuses",
    nameFull: "Mélodies Joyeuses (Français)",
    description: "Chants joyeux de célébration - Version française",
    hymnCount: 100,
    language: "french",
    parentSection: "Mélodies Joyeuses",
  },
  {
    id: 5,
    name: "Melodi Jwayal",
    nameFull: "Melodi Jwayal (Kreyòl)",
    description: "Chante jwa pou selebre - Vèsyon kreyòl",
    hymnCount: 100,
    language: "kreyol",
    parentSection: "Mélodies Joyeuses",
  },
  // La Voix du Réveil - French only
  {
    id: 6,
    name: "La Voix du Réveil",
    nameFull: "La Voix du Réveil",
    description: "Chants de réveil spirituel",
    hymnCount: 80,
    language: "french",
  },
  // Réveillons-Nous - French only
  {
    id: 7,
    name: "Réveillons-Nous",
    nameFull: "Réveillons-Nous",
    description: "Appels au réveil et à la consécration",
    hymnCount: 60,
    language: "french",
  },
  // Échos des Élus - French only
  {
    id: 8,
    name: "Échos des Élus",
    nameFull: "Échos des Élus",
    description: "Échos spirituels et témoignages",
    hymnCount: 50,
    language: "french",
  },
  // Haïti Chante avec Radio Lumière - has both
  {
    id: 9,
    name: "Haïti Chante",
    nameFull: "Haïti Chante avec Radio Lumière (Français)",
    description: "Chants haïtiens populaires - Version française",
    hymnCount: 40,
    language: "french",
    parentSection: "Haïti Chante avec Radio Lumière",
  },
  {
    id: 10,
    name: "Ayiti Chante",
    nameFull: "Ayiti Chante ak Radyo Limyè (Kreyòl)",
    description: "Chante ayisyen popilè - Vèsyon kreyòl",
    hymnCount: 40,
    language: "kreyol",
    parentSection: "Haïti Chante avec Radio Lumière",
  },
  // Gloire à l'Agneau - French only
  {
    id: 11,
    name: "Gloire à l'Agneau",
    nameFull: "Gloire à l'Agneau",
    description: "Louanges à l'Agneau de Dieu",
    hymnCount: 45,
    language: "french",
  },
  // Alléluia - has both
  {
    id: 12,
    name: "Alléluia",
    nameFull: "Alléluia (Français)",
    description: "Chants d'alléluia et de victoire - Version française",
    hymnCount: 35,
    language: "french",
    parentSection: "Alléluia",
  },
  {
    id: 13,
    name: "Alelouya",
    nameFull: "Alelouya (Kreyòl)",
    description: "Chante alelouya ak viktwa - Vèsyon kreyòl",
    hymnCount: 35,
    language: "kreyol",
    parentSection: "Alléluia",
  },
];

// Sample hymns - note that French and Kreyol with same number are DIFFERENT songs
export const hymns: Hymn[] = [
  // Chants d'Espérance - FRENCH
  {
    id: "ce-fr-1",
    number: 1,
    title: "Ô jour heureux!",
    section: "Chants d'Espérance (Français)",
    sectionId: 1,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Ô jour heureux, jour béni,\nOù Jésus me prit pour lui!\nDe cette paix qui m'inonde,\nRien ne pourra tarir la source féconde.",
      },
      {
        number: 2,
        text: "Quelle gloire d'être à Christ,\nDe compter sur son amour!\nMon cœur joyeux, en tout temps,\nChante ses louanges nuit et jour.",
      },
    ],
    chorus: {
      text: "Heureux jour! Heureux jour!\nQuand Jésus lava mes péchés!\nIl m'apprit à veiller, prier,\nEt à vivre en me confiant.",
    },
  },
  {
    id: "ce-fr-5",
    number: 5,
    title: "Quel repos céleste",
    section: "Chants d'Espérance (Français)",
    sectionId: 1,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Quel repos céleste, Jésus, d'être à toi!\nDe goûter sans cesse ta présence et ta joie!\nDans ton cœur je trouve un refuge assuré;\nPar ton sang j'obtiens une paix consacrée.",
      },
      {
        number: 2,
        text: "Parfaite soumission, parfait abandon,\nDans ta douce étreinte, je trouve le pardon.\nDans tes bras d'amour, Seigneur, je suis béni,\nJe goûte les joies du repos infini.",
      },
    ],
    chorus: {
      text: "Parfait repos en Jésus!\nBonheur suprême en mon roi!\nDans ses bras d'amour, plus de soucis,\nPlus de trouble, plus d'effroi.",
    },
  },
  {
    id: "ce-fr-28",
    number: 28,
    title: "Mon seul appui, c'est l'ami céleste",
    section: "Chants d'Espérance (Français)",
    sectionId: 1,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Mon seul appui, c'est l'ami céleste,\nQui m'a sauvé de tous mes péchés;\nSa main puissante à jamais me reste,\nJe suis à lui pour l'éternité.",
      },
      {
        number: 2,
        text: "Dans les combats, il est ma victoire,\nDans les douleurs, il est mon soutien;\nJe chanterai sans cesse sa gloire,\nCar Jésus-Christ est mon seul bien.",
      },
      {
        number: 3,
        text: "Quand je faiblis, sa grâce m'élève,\nQuand je doute, il me prend la main;\nSon amour pur jamais ne s'achève,\nIl guide mes pas sur le chemin.",
      },
    ],
    chorus: {
      text: "Mon seul appui, mon seul refuge,\nC'est Jésus, mon Sauveur;\nDans la tempête comme dans le calme,\nIl demeure dans mon cœur.",
    },
  },
  {
    id: "ce-fr-100",
    number: 100,
    title: "À toi la gloire",
    section: "Chants d'Espérance (Français)",
    sectionId: 1,
    language: "french",
    verses: [
      {
        number: 1,
        text: "À toi la gloire, ô Ressuscité!\nÀ toi la victoire pour l'éternité!\nBrillant de lumière, l'ange est descendu,\nIl roule la pierre du tombeau vaincu.",
      },
      {
        number: 2,
        text: "Vois-le paraître: c'est lui, c'est Jésus,\nTon Sauveur, ton Maître! Oh! ne doute plus!\nSois dans l'allégresse, peuple du Seigneur,\nEt redis sans cesse: le Christ est vainqueur!",
      },
    ],
    chorus: {
      text: "À toi la gloire, ô Ressuscité!\nÀ toi la victoire pour l'éternité!",
    },
  },
  {
    id: "ce-fr-150",
    number: 150,
    title: "Reste avec nous, Seigneur",
    section: "Chants d'Espérance (Français)",
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
    id: "ce-fr-200",
    number: 200,
    title: "Quel ami fidèle",
    section: "Chants d'Espérance (Français)",
    sectionId: 1,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Quel ami fidèle et tendre\nNous avons en Jésus-Christ,\nToujours prêt à nous entendre,\nÀ répondre à notre cri!",
      },
      {
        number: 2,
        text: "Il connaît nos défaillances,\nNos chutes de chaque jour,\nSévère en ses exigences,\nIl est riche en son amour.",
      },
    ],
    chorus: {
      text: "Quel ami fidèle et tendre\nNous avons en Jésus-Christ!\nTout, au Seigneur, on peut rendre:\nCar il est notre appui.",
    },
  },
  // Chants d'Espérance - KREYOL (completely different songs with same numbers!)
  {
    id: "ce-kr-1",
    number: 1,
    title: "Jezi se sèl espwa m",
    section: "Chants d'Espérance (Kreyòl)",
    sectionId: 2,
    language: "kreyol",
    verses: [
      {
        number: 1,
        text: "Jezi se sèl espwa m,\nLi se limyè nan lavi m;\nNan tout sa m ap travèse,\nLi kenbe m nan men li.",
      },
      {
        number: 2,
        text: "Lè m santi m pèdi,\nLè m pa wè chemen an,\nJezi vin ban m kouraj,\nLi mennen m pi devan.",
      },
    ],
    chorus: {
      text: "Jezi, Jezi, sèl espwa m!\nNan ou m mete konfyans mwen;\nJezi, Jezi, ou se tout pou mwen,\nM ap sèvi ou tout tan.",
    },
  },
  {
    id: "ce-kr-5",
    number: 5,
    title: "Nan men Bondye m ap rete",
    section: "Chants d'Espérance (Kreyòl)",
    sectionId: 2,
    language: "kreyol",
    verses: [
      {
        number: 1,
        text: "Nan men Bondye m ap rete,\nKote ki gen lapè;\nLi pwoteje m chak jou,\nLi ban m tout sa m bezwen.",
      },
      {
        number: 2,
        text: "Lè lènmi yo atake,\nMwen pa gen pou m pè;\nBondye se defansè m,\nLi goumen pou mwen.",
      },
    ],
    chorus: {
      text: "Nan men Bondye, m an sekirite,\nAnyen pa ka fè m pè;\nNan men Bondye, m gen viktwa,\nPou tout letènite.",
    },
  },
  {
    id: "ce-kr-28",
    number: 28,
    title: "Lanmou Bondye pi gran pase",
    section: "Chants d'Espérance (Kreyòl)",
    sectionId: 2,
    language: "kreyol",
    verses: [
      {
        number: 1,
        text: "Lanmou Bondye pi gran pase\nTout sa lèzòm ka imajine;\nLi ban nou Pitit li renmen an,\nPou sove tout moun ki kwè nan li.",
      },
      {
        number: 2,
        text: "Nan lanmou sa a nou jwenn lavi,\nNan lanmou sa a nou jwenn espwa;\nSe yon lanmou ki pa janm fini,\nLi dire pou tout letènite.",
      },
      {
        number: 3,
        text: "Anyen pa ka separe nou\nDe lanmou Bondye genyen pou nou;\nNi lanmò, ni lavi, ni okenn bagay,\nPa ka retire nou nan men li.",
      },
    ],
    chorus: {
      text: "Lanmou, lanmou, lanmou Bondye!\nSe li ki fè syèl la ak tè a;\nLanmou, lanmou, lanmou Bondye!\nL ap dire pou tout tan.",
    },
  },
  // Sur les Ailes de la Foi
  {
    id: "saf-1",
    number: 1,
    title: "Sur les ailes de la foi",
    section: "Sur les Ailes de la Foi",
    sectionId: 3,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Sur les ailes de la foi,\nJe m'élève vers mon Roi;\nDans les cieux je vois sa face,\nRadieuse de sa grâce.",
      },
      {
        number: 2,
        text: "Mon âme prend son essor,\nVers les régions d'or;\nOù le Christ m'attend là-haut,\nDans son royaume si beau.",
      },
    ],
    chorus: {
      text: "Sur les ailes, sur les ailes,\nDe la foi je monterai;\nVers les demeures éternelles,\nOù toujours je resterai.",
    },
  },
  {
    id: "saf-12",
    number: 12,
    title: "Gloire à Dieu au plus haut des cieux",
    section: "Sur les Ailes de la Foi",
    sectionId: 3,
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
  // Mélodies Joyeuses - French
  {
    id: "mj-fr-8",
    number: 8,
    title: "Jésus est ma lumière",
    section: "Mélodies Joyeuses (Français)",
    sectionId: 4,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Jésus est ma lumière,\nDans l'obscurité il brille;\nSon amour est ma prière,\nSa grâce est ma famille.",
      },
      {
        number: 2,
        text: "Quand le chemin est sombre,\nIl éclaire tous mes pas;\nJe ne crains pas les ombres,\nCar Jésus est avec moi.",
      },
    ],
  },
  // Melodi Jwayal - Kreyol (different songs from Mélodies Joyeuses French!)
  {
    id: "mj-kr-8",
    number: 8,
    title: "Bondye renmen m anpil",
    section: "Melodi Jwayal (Kreyòl)",
    sectionId: 5,
    language: "kreyol",
    verses: [
      {
        number: 1,
        text: "Bondye renmen m anpil,\nPlis pase tout bagay;\nLi bay lavi l pou mwen,\nSou kwa Kalvè a.",
      },
      {
        number: 2,
        text: "M pa merite lanmou sa a,\nMen li ban mwen li kanmenm;\nGras Bondye fè m viv ankò,\nM ap sèvi l tout tan m.",
      },
    ],
    chorus: {
      text: "Li renmen m, li renmen m,\nBondye renmen m anpil;\nPou sa m ap chante lwanj li,\nJiskaske m rive nan syèl.",
    },
  },
  // La Voix du Réveil
  {
    id: "vr-15",
    number: 15,
    title: "Réveille-toi, mon âme",
    section: "La Voix du Réveil",
    sectionId: 6,
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
  // Réveillons-Nous
  {
    id: "rn-7",
    number: 7,
    title: "Debout, soldats de Christ",
    section: "Réveillons-Nous",
    sectionId: 7,
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
  // Échos des Élus
  {
    id: "ee-28",
    number: 28,
    title: "Prends ma vie dans tes bras",
    section: "Échos des Élus",
    sectionId: 8,
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
  // Haïti Chante - French
  {
    id: "hc-fr-3",
    number: 3,
    title: "Haïti pour Christ",
    section: "Haïti Chante avec Radio Lumière (Français)",
    sectionId: 9,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Haïti, terre bénie,\nLève-toi pour le Seigneur;\nQue sa gloire soit ta vie,\nQue son amour soit ta valeur.",
      },
      {
        number: 2,
        text: "Du nord au sud, d'est en ouest,\nQue son nom soit proclamé;\nDans nos montagnes et nos plaines,\nQue Jésus soit adoré.",
      },
    ],
    chorus: {
      text: "Haïti pour Christ! Haïti pour Christ!\nNotre nation se lève pour toi;\nAvec foi et espérance,\nNous marchons vers ta présence.",
    },
  },
  // Ayiti Chante - Kreyol (different song!)
  {
    id: "hc-kr-3",
    number: 3,
    title: "Senyè beni peyi nou",
    section: "Ayiti Chante ak Radyo Limyè (Kreyòl)",
    sectionId: 10,
    language: "kreyol",
    verses: [
      {
        number: 1,
        text: "Senyè beni peyi nou,\nAyiti, tè nou renmen;\nVoye lapè sou nou,\nFè jistis rete ladan l.",
      },
      {
        number: 2,
        text: "Nan mitan tout difikilte,\nNou leve je nou sou ou;\nOu se espwa pèp ayisyen,\nNou mete konfyans nan ou.",
      },
    ],
    chorus: {
      text: "Ayiti, Ayiti,\nBondye renmen ou anpil;\nLeve kanpe pou Kris la,\nSe li ki sèl delivrans.",
    },
  },
  // Gloire à l'Agneau
  {
    id: "ga-20",
    number: 20,
    title: "L'Agneau de Dieu",
    section: "Gloire à l'Agneau",
    sectionId: 11,
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
  // Alléluia - French
  {
    id: "al-fr-11",
    number: 11,
    title: "Alléluia, louez l'Éternel",
    section: "Alléluia (Français)",
    sectionId: 12,
    language: "french",
    verses: [
      {
        number: 1,
        text: "Alléluia, louez l'Éternel,\nDans son sanctuaire céleste;\nLouez-le pour ses hauts faits,\nLouez-le selon sa grandeur immense.",
      },
      {
        number: 2,
        text: "Louez-le au son de la trompette,\nLouez-le avec le luth et la harpe;\nLouez-le avec tambourin et danse,\nLouez-le avec les instruments à cordes.",
      },
    ],
    chorus: {
      text: "Alléluia! Alléluia!\nQue tout ce qui respire loue l'Éternel!\nAlléluia! Alléluia!\nLouez l'Éternel!",
    },
  },
  // Alelouya - Kreyol (different song!)
  {
    id: "al-kr-11",
    number: 11,
    title: "Alelouya, nou glorifye Bondye",
    section: "Alelouya (Kreyòl)",
    sectionId: 13,
    language: "kreyol",
    verses: [
      {
        number: 1,
        text: "Alelouya, nou glorifye Bondye,\nLi merite tout lwanj nou;\nNan syèl la ak sou tè a,\nNon li wo anpil.",
      },
      {
        number: 2,
        text: "Tout nasyon yo ap adore l,\nTout lang yo ap fè lwanj li;\nWa dè wa yo ak Senyè dè senyè yo,\nSe li menm ki gen tout pouvwa.",
      },
    ],
    chorus: {
      text: "Alelouya! Alelouya!\nGlwa pou Bondye nan syèl la!\nAlelouya! Alelouya!\nLwanj pou non li!",
    },
  },
];

export function searchHymns(query: string): Hymn[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return hymns;

  // Check if query contains language indicator
  const hasFrench = lowerQuery.includes("français") || lowerQuery.includes("francais") || lowerQuery.includes("fr ");
  const hasKreyol = lowerQuery.includes("kreyol") || lowerQuery.includes("kreyòl") || lowerQuery.includes("kr ");
  
  // Clean query for number/title search
  const cleanQuery = lowerQuery
    .replace(/français|francais|kreyol|kreyòl|fr |kr /gi, "")
    .trim();

  return hymns.filter((hymn) => {
    // Language filter
    if (hasFrench && hymn.language !== "french") return false;
    if (hasKreyol && hymn.language !== "kreyol") return false;

    const numberMatch = hymn.number.toString().includes(cleanQuery);
    const titleMatch = hymn.title.toLowerCase().includes(cleanQuery);
    const sectionMatch = hymn.section.toLowerCase().includes(cleanQuery);
    
    // Also match on the full query if no language specified
    if (!hasFrench && !hasKreyol) {
      return numberMatch || titleMatch || sectionMatch || 
             hymn.title.toLowerCase().includes(lowerQuery) ||
             hymn.section.toLowerCase().includes(lowerQuery);
    }
    
    return numberMatch || titleMatch || sectionMatch;
  });
}

export function getHymnsBySection(sectionId: number): Hymn[] {
  return hymns.filter((hymn) => hymn.sectionId === sectionId);
}

export function getHymnById(id: string): Hymn | undefined {
  return hymns.find((hymn) => hymn.id === id);
}

export function getSectionById(sectionId: number): HymnSection | undefined {
  return hymnSections.find((section) => section.id === sectionId);
}

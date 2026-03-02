export interface Hymn {
  id: string;
  number: number;
  title: string;
  section: string;
  sectionId: number;
  language: "french" | "kreyol" | "english";
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
  language: "french" | "kreyol" | "english";
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
    hymnCount: 145,
    language: "kreyol",
    parentSection: "Chants d'Espérance",
  },
  // Haiti Chante avec Radio Lumière Français
  {
    id: 3,
    name: "Haiti Chante avec Radio Lumière Français",
    nameFull: "Haiti Chante avec Radio Lumière Français",
    description: "Cantiques de louange et d'adoration",
    hymnCount: 7,
    language: "french",
    parentSection: "Haiti Chante avec Radio Lumière",
  },
  // Haiti Chante avec Radio Lumière Kreyol
  {
    id: 14,
    name: "Haiti Chante avec Radio Lumière Kreyol",
    nameFull: "Haiti Chante avec Radio Lumière Kreyol",
    description: "Cantiques de louange et d'adoration",
    hymnCount: 86,
    language: "kreyol",
    parentSection: "Haiti Chante avec Radio Lumière",
  },
  // Mélodies Joyeuses - has both French and Kreyol (separate collections)
  {
    id: 4,
    name: "Mélodies Joyeuses",
    nameFull: "Mélodies Joyeuses (Français)",
    description: "Chants joyeux de célébration - Version française",
    hymnCount: 182,
    language: "french",
    parentSection: "Mélodies Joyeuses",
  },
  {
    id: 5,
    name: "Mélodies Joyeuses",
    nameFull: "Mélodies Joyeuses (Kreyòl)",
    description: "Chante jwa pou selebre - Vèsyon kreyòl",
    hymnCount: 85,
    language: "kreyol",
    parentSection: "Mélodies Joyeuses",
  },
  // La Voix du Réveil - French
  {
    id: 6,
    name: "La Voix du Réveil",
    nameFull: "La Voix du Réveil",
    description: "Chants de réveil spirituel",
    hymnCount: 47,
    language: "french",
    parentSection: "La Voix du Réveil",
  },
  // La Voix du Réveil - Kreyol
  {
    id: 15,
    name: "La Voix du Réveil",
    nameFull: "La Voix du Réveil",
    description: "Chants de réveil spirituel",
    hymnCount: 17,
    language: "kreyol",
    parentSection: "La Voix du Réveil",
  },
  // Réveillons-Nous - French
  {
    id: 7,
    name: "Réveillons-Nous",
    nameFull: "Réveillons-Nous",
    description: "Appels au réveil et à la consécration",
    hymnCount: 95,
    language: "french",
    parentSection: "Réveillons-Nous",
  },
  // Réveillons-Nous - Kreyol
  {
    id: 16,
    name: "Réveillons-Nous",
    nameFull: "Réveillons-Nous",
    description: "Appels au réveil et à la consécration",
    hymnCount: 82,
    language: "kreyol",
    parentSection: "Réveillons-Nous",
  },
  // Réveillons-Nous Chretiens - French
  {
    id: 27,
    name: "Réveillons-Nous Chretiens",
    nameFull: "Réveillons-Nous Chretiens",
    description: "Appels au réveil et à la consécration",
    hymnCount: 6,
    language: "french",
    parentSection: "Réveillons-Nous Chretiens",
  },
  // Réveillons-Nous Chretiens - Kreyol
  {
    id: 26,
    name: "Réveillons-Nous Chretiens",
    nameFull: "Réveillons-Nous Chretiens",
    description: "Appels au réveil et à la consécration",
    hymnCount: 21,
    language: "kreyol",
    parentSection: "Réveillons-Nous Chretiens",
  },
  // Échos des Élus - French
  {
    id: 8,
    name: "Échos des Élus",
    nameFull: "Échos des Élus",
    description: "Échos spirituels et témoignages",
    hymnCount: 17,
    language: "french",
    parentSection: "Échos des Élus",
  },
  // Écho des Élus - Kreyol
  {
    id: 17,
    name: "Écho des Élus",
    nameFull: "Écho des Élus",
    description: "Échos spirituels et témoignages",
    hymnCount: 66,
    language: "kreyol",
    parentSection: "Échos des Élus",
  },
  // Gloire à l'Agneau - French
  {
    id: 11,
    name: "Gloire à l'Agneau",
    nameFull: "Gloire à l'Agneau",
    description: "Louanges à l'Agneau de Dieu",
    hymnCount: 39,
    language: "french",
    parentSection: "Gloire à l'Agneau",
  },
  // Gloire à l'Agneau - Kreyol
  {
    id: 18,
    name: "Gloire à l'Agneau",
    nameFull: "Gloire à l'Agneau",
    description: "Louanges à l'Agneau de Dieu",
    hymnCount: 28,
    language: "kreyol",
    parentSection: "Gloire à l'Agneau",
  },
  // L'Ombre du Réveil Français  - has both
  {
    id: 12,
    name: "L'Ombre du Réveil Français",
    nameFull: "L'Ombre du Réveil Français (Français)",
    description: "Chants d'L'Ombre du Réveil Français et de victoire - Version française",
    hymnCount: 40,
    language: "french",
    parentSection: "L'Ombre du Réveil Français",
  },
  // L'Ombre du Réveil Kreyol
  {
    id: 19,
    name: "L'Ombre du Réveil",
    nameFull: "L'Ombre du Réveil",
    description: "Chants d'L'Ombre du Réveil et de victoire",
    hymnCount: 94,
    language: "kreyol",
    parentSection: "L'Ombre du Réveil",
  },
  // Popular Cantiques French
  {
    id: 70,
    name: "Popular French Songs",
    nameFull: "Popular French Songs",
    description: "Popular French Songs",
    hymnCount: 1,
    language: "french",
    parentSection: "Popular Songs",
  },
  // Popular Cantiques Kreyol
  {
    id: 71,
    name: "Chante Popilè",
    nameFull: "Chante Popilè",
    description: "Chante Popilè",
    hymnCount: 1,
    language: "kreyol",
    parentSection: "Popular Songs",
  },
  // Popular songs English
  {
    id: 72,
    name: "Popular English Songs",
    nameFull: "Popular English Songs",
    description: "Popular English Songs",
    hymnCount: 1,
    language: "english",
    parentSection: "Popular Songs",
  },
];

// Sample hymns - note that French and Kreyol with same number are DIFFERENT songs
export const hymns: Hymn[] = [
  {
    id: "ce-fr-68",
    number: 68,
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
      {
        number: 3,
        text: "Craindrais-je encore?\nIl vit à jamais,\nCelui que j'adore, Le Prince de paix;\nIl est ma victoire, Mon puissant soutien,\nMa vie et ma gloire: Non, je ne crains rien!",
      },
    ],
    chorus: {
      text: "À toi la gloire, ô Ressuscité!\nÀ toi la victoire pour l'éternité!",
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
    
    // Search through lyrics (verses and chorus)
    const lyricsMatch = hymn.verses.some((verse) =>
      verse.text.toLowerCase().includes(cleanQuery)
    );
    const chorusMatch = hymn.chorus
      ? hymn.chorus.text.toLowerCase().includes(cleanQuery)
      : false;
    
    // Also match on the full query if no language specified
    if (!hasFrench && !hasKreyol) {
      return numberMatch || titleMatch || sectionMatch || lyricsMatch || chorusMatch ||
             hymn.title.toLowerCase().includes(lowerQuery) ||
             hymn.section.toLowerCase().includes(lowerQuery) ||
             hymn.verses.some((verse) => verse.text.toLowerCase().includes(lowerQuery)) ||
             (hymn.chorus && hymn.chorus.text.toLowerCase().includes(lowerQuery));
    }
    
    return numberMatch || titleMatch || sectionMatch || lyricsMatch || chorusMatch;
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

# Chants d'Espérance & Bible App - Design Guidelines

## Brand Identity

**Purpose**: A sacred companion for Haitian Christian worship - enabling seamless hymn lookup and scripture reading during services without distracting ads.

**Aesthetic Direction**: **Reverent Minimalism** - Clean, spacious, and purposeful. Like a beautifully bound hymnal, the app prioritizes content clarity and instant access. The design is calm and unobtrusive, allowing worshippers to focus on lyrics and scripture without visual noise.

**Memorable Element**: A distinctive warm sepia tone reminiscent of aged hymnal pages, paired with crisp typography that's readable even in dimly-lit sanctuaries.

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- **Hymns** (Home) - Search and browse Chants d'Espérance
- **Bible** - Read scripture across multiple versions
- **Favorites** - Saved hymns and verses

No authentication required (local storage for favorites and preferences).

**Settings**: Accessible via header button on each tab. Includes theme toggle, default Bible version, text size controls.

## Screen Specifications

### 1. Hymns Tab
- **Purpose**: Quick search and browsing of hymn lyrics
- **Header**: Transparent, title "Chants d'Espérance", settings icon (right)
- **Layout**:
  - Search bar (pinned at top, below header)
  - Scrollable content with safe area inset: top = headerHeight + Spacing.xl
  - List of 9 hymn parts as expandable cards
  - Each part shows bilingual sections where applicable
- **Search**: Real-time filtering by number, title, or keyword
- **Empty State**: When no search results, show empty-hymns.png illustration
- **Components**: Search bar, expandable section cards, hymn list items

### 2. Hymn Detail Screen
- **Purpose**: Display full hymn lyrics with verse numbers
- **Header**: Custom header, back button (left), favorite icon (right), hymn number + title
- **Layout**:
  - Scrollable content with safe area inset: top = Spacing.xl, bottom = insets.bottom + Spacing.xl
  - Language toggle (if bilingual hymn) at top
  - Lyrics in verse blocks with clear spacing
  - Footer: "Share" and "Report Issue" buttons
- **Typography**: Larger text for in-church readability

### 3. Bible Tab
- **Purpose**: Read scripture across multiple versions
- **Header**: Transparent, title "Bible", version selector (subtitle), settings icon (right)
- **Layout**:
  - Book/Chapter selector (collapsible navigation)
  - Scrollable content with safe area inset: top = headerHeight + Spacing.xl
  - Testament sections (Old/New) with book grid
- **Components**: Book grid (cards), chapter picker, version switcher
- **Empty State**: None (content always present)

### 4. Bible Reader Screen
- **Purpose**: Display scripture chapter with verse-by-verse layout
- **Header**: Custom header, back button (left), bookmark icon (right), book + chapter title
- **Layout**:
  - Scrollable content with safe area inset: top = Spacing.xl, bottom = insets.bottom + Spacing.xl
  - Version selector (dropdown at top)
  - Verses displayed as numbered paragraphs
  - Chapter navigation (previous/next) at bottom
- **Interaction**: Tap verse to highlight and show share/bookmark options

### 5. Favorites Tab
- **Purpose**: Access saved hymns and verses
- **Header**: Transparent, title "Favorites", settings icon (right)
- **Layout**:
  - Scrollable content with safe area inset: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl
  - Segmented control: "Hymns" / "Verses"
  - List of saved items with swipe-to-delete
- **Empty State**: Show empty-favorites.png when no items saved
- **Components**: Segmented control, swipeable list items

### 6. Settings Screen (Modal)
- **Purpose**: App customization
- **Header**: Modal header, "Done" button (right)
- **Layout**:
  - Scrollable form with safe area inset: top = Spacing.xl, bottom = insets.bottom + Spacing.xl
  - Sections: Appearance (theme, text size), Bible (default version), About (version, privacy, contact)
- **Components**: Form groups, toggle switches, radio buttons

## Color Palette

- **Primary**: #8B5E3C (Warm sepia - heritage brown)
- **Accent**: #C17F3E (Bronze gold - highlights)
- **Background**: #FFFBF5 (Cream white - aged paper)
- **Surface**: #F5EFE6 (Light parchment - cards)
- **Text Primary**: #2C1810 (Deep brown - high contrast)
- **Text Secondary**: #6B5040 (Medium brown)
- **Border**: #E0D5C7 (Subtle beige)
- **Semantic - Favorite**: #D4A373 (Warm gold)

## Typography

- **Primary Font**: System Font (SF Pro for iOS, Roboto for Android)
- **Display**: Bold, 28pt (screen titles)
- **Title**: Semibold, 20pt (hymn titles, chapter headings)
- **Body**: Regular, 17pt (lyrics, verses) - increase to 19pt for reader screens
- **Caption**: Regular, 13pt (hymn numbers, verse numbers)

Line height: 1.5 for body text (readability during services)

## Visual Design

- All cards have subtle border (1px, Border color), no shadows
- Touchable items use opacity change (0.7) on press
- Search bar: rounded corners (12px), Surface background
- Section headers: uppercase, Caption size, Text Secondary color, letter-spacing: 1px
- Floating action buttons: None used
- Icons: Feather icon set (@expo/vector-icons)

## Assets to Generate

1. **icon.png** - App icon featuring open hymnal with cross
2. **splash-icon.png** - Simplified icon for launch screen
3. **empty-hymns.png** - Illustration of closed hymnal, USED: Hymns tab when search returns no results
4. **empty-favorites.png** - Illustration of bookmark with heart, USED: Favorites tab when no items saved
5. **avatar-default.png** - Simple user silhouette, USED: Settings screen profile placeholder

All illustrations: Simple line art style in Primary color, minimal detail, supportive not distracting.
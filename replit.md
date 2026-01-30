# Chants d'Espérance & Bible App

## Overview

A React Native (Expo) mobile application serving as a digital hymnal and Bible reader for Haitian Christian worship. The app provides quick lookup of Chants d'Espérance hymns (in French and Kreyol) alongside multiple Bible translations. Designed for distraction-free use during church services with a warm, reverent aesthetic reminiscent of aged hymnal pages.

**Core Features:**
- Hymn browsing and search across 13 separate collections
- Bible reading with multiple versions (NKJV, NIV, ESV, French translations)
- Favorites system for saved hymns and verses
- Community contribution system for adding missing hymn lyrics
- Offline-first with local storage

**Important: French and Kreyol are SEPARATE Collections**
The French and Kreyol versions of hymn books (like Chants d'Espérance) are NOT translations of each other - they are completely different songs that happen to share the same numbering system. For example:
- Chants d'Espérance #28 (Français) = "Mon seul appui, c'est l'ami céleste"
- Chants d'Espérance #28 (Kreyòl) = "Lanmou Bondye pi gran pase"

These are two entirely different hymns. The app treats them as separate collections with distinct language badges (FR in bronze, KR in green).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo/React Native)
- **Framework**: Expo SDK 54 with React Native 0.81
- **Navigation**: React Navigation v7 with native stack navigators and bottom tabs
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: StyleSheet API with a custom theming system (light/dark mode support)
- **Animations**: React Native Reanimated for smooth, performant animations
- **Storage**: AsyncStorage for favorites and settings (no user accounts)

**Directory Structure:**
- `client/` - All frontend code (aliased as `@/`)
- `client/screens/` - Screen components
- `client/components/` - Reusable UI components
- `client/navigation/` - Navigation configuration
- `client/data/` - Static data (hymns, Bible books)
- `client/hooks/` - Custom React hooks
- `client/lib/` - Utilities (API client, storage helpers)
- `client/constants/` - Theme and design tokens

### Backend (Express)
- **Runtime**: Node.js with Express 5
- **Purpose**: Minimal API server primarily for proxying external Bible APIs
- **Bible API**: Proxies requests to Bolls.life API for Bible text and search

**Key Routes:**
- `GET /api/bible/:version/:book/:chapter` - Fetch chapter text
- `GET /api/bible/search/:version?query=` - Search Bible
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user session
- `POST /api/submissions` - Submit a hymn
- `GET /api/submissions/pending` - Get pending submissions (admin)
- `POST /api/submissions/:id/approve` - Approve submission (admin)
- `POST /api/submissions/:id/reject` - Reject submission (admin)

### Data Storage
- **Local Storage**: AsyncStorage for favorites and user preferences
- **Static Data**: Hymn lyrics and Bible book metadata bundled in the app
- **Database**: PostgreSQL with Drizzle ORM configured but primarily used for future expansion (current schema only has users table)

### Design System
- Warm sepia color palette (#8B5E3C primary, #C17F3E accent)
- Typography optimized for readability in low-light conditions
- Consistent spacing scale (xs: 4, sm: 8, md: 12, lg: 16, xl: 20)
- Border radius scale for visual consistency

## External Dependencies

### Third-Party APIs
- **Bolls.life Bible API**: Primary source for Bible text across multiple translations
  - Endpoint: `https://bolls.life/get-text/{version}/{book}/{chapter}/`
  - Search: `https://bolls.life/v2/find/{version}?search={query}`

### Key Libraries
- **expo**: Core framework for cross-platform development
- **@react-navigation/***: Navigation framework (native-stack, bottom-tabs)
- **@tanstack/react-query**: Server state management and caching
- **react-native-reanimated**: High-performance animations
- **expo-haptics**: Haptic feedback for tactile interactions
- **@react-native-async-storage/async-storage**: Persistent local storage
- **drizzle-orm**: PostgreSQL ORM (configured for future features)

### Database
- PostgreSQL via Drizzle ORM
- Schema defined in `shared/schema.ts`
- Tables: users, hymnSubmissions
- Session management via express-session with MemoryStore

### Community Contribution System
- Users can register/login to contribute missing hymn lyrics
- Submissions go through hybrid moderation:
  - New users: Submissions require admin approval
  - Trusted users (5+ approved submissions): Auto-publish enabled
- Duplicate detection checks for existing hymns before submission
- Admin panel for reviewing, approving, or rejecting pending submissions
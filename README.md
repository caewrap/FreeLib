# FreeLib - Digital Library App 

A simple digital library app built with **React Native** and **Expo (v57)**. FreeLib lets you read full books for free, track your reading progress, and manage your profile, all in a clean **White & Navy Blue** design.

---

##  Student Information

- **Name:** Nicole Keith Inot
- **Section:** CS41A
- **Year / Course:** 4th Year, Computer Science

---

##  Features

- **Full-Text Reader** – Read whole books in one continuous page, with font size controls (`A-` / `A+`) and three reading themes (Slate, Sepia, OLED).
- **White / Navy Theme** – Switch the app's look with one tap.
- **Reading Stats** – Track hours read, books finished, and your 7-day reading streak.
- **Search & Filter** – Find books by title, author, or genre.
- **Profile** – Sign in or use Guest Mode, and set a profile photo using the camera or gallery.
- **Offline Reading** – Book content is bundled inside the app.

---

##  Screens

- **Home** (`src/app/index.tsx`) – Theme toggle, "Resume Reading" card, and featured books.
- **Dashboard** (`src/app/dashboard.tsx`) – Reading stats, search, categories, the book catalog, and the full-text reader.
- **Profile** (`src/components/profile-modal.tsx`) – Login/register, profile photo, and account settings.

---

##  Custom Components

Found in `src/components/ui-custom/`:

- **ProfileCard** – Shows the user's photo or initials, name, and email.
- **AppHeader** – Reusable header with title, back button, and action button.
- **CustomButton** – Button with different styles and sizes.
- **InfoRow** – List row with an icon, label, and value.
- **PhotoPreview** – Preview and pick a profile photo.

---

##  Main Packages

- `expo`, `expo-router` – App framework and navigation
- `react`, `react-native` – UI
- `expo-image`, `expo-image-picker` – Images and camera/gallery access
- `lucide-react-native` – Icons
- `react-native-reanimated`, `react-native-gesture-handler` – Animations and gestures

---

##  How to Run

**Requirements:** Node.js 18+, npm, and optionally the **Expo Go** app on your phone.

```bash
git clone <REPOSITORY_URL>
cd FreeLib
npm install
npx expo start
```

Then:
- Press `w` to open in a web browser
- Press `a` for an Android emulator
- Scan the QR code with **Expo Go** to open on your phone (same Wi-Fi)

If something doesn't load, try clearing the cache: `npx expo start -c`

---

*Made for academic purposes. All book content is for educational use only.*

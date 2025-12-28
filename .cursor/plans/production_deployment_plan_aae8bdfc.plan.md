---
name: POC Deployment Plan
overview: Simplified plan to deploy the React + Capacitor health tracking app as a proof of concept for web (Vercel) and iOS (TestFlight internal testing), focusing on getting it working for a small group of testers without full App Store submission.
todos:
  - id: env-setup
    content: Set up environment variables for Supabase (create .env files, update supabase.ts to use env vars, add to .gitignore)
    status: completed
  - id: app-config
    content: Update app configuration (capacitor.config.ts app ID/name, package.json version, index.html title)
    status: completed
  - id: build-scripts
    content: Enhance build scripts in package.json (add ios:sync, ios:open, production build script)
    status: completed
  - id: ios-bundle-id
    content: Update iOS bundle identifier and version in Xcode project (project.pbxproj, capacitor.config.ts)
    status: completed
  - id: basic-icons
    content: Ensure basic app icons are configured (minimal set, just enough to build)
    status: completed
  - id: certificates
    content: Configure certificates and provisioning profiles in Xcode (App ID, Development/Distribution Certificate for TestFlight)
    status: completed
    dependencies:
      - ios-bundle-id
  - id: testflight
    content: Build and upload to TestFlight for internal testing (archive in Xcode, upload, invite testers via email)
    status: pending
    dependencies:
      - certificates
      - basic-icons
---

# POC Deployment Plan: Web & iOS TestFlight

This plan covers deploying your health tracking app as a proof of concept for web (Vercel) and iOS (TestFlight internal testing). Since this is a POC for testing Capacitor with a small group, we're skipping full App Store submission and focusing on getting it working quickly.

## Current State Analysis

**What's Working:**

- React + TypeScript + Vite setup
- Capacitor iOS project configured
- Supabase integration (credentials hardcoded)
- HealthKit plugin integrated
- Basic iOS app structure

**What Needs Work (POC-focused):**

- Environment variables for Supabase (currently hardcoded in `src/lib/supabase.ts`)
- App ID is placeholder (`com.yourname.healthkitapp`) - needs real bundle ID for TestFlight
- Basic app configuration (name, version)
- Basic production build setup
- Web hosting (Vercel)
- iOS TestFlight setup (internal testing only - no App Store submission)

---

## Phase 1: Environment & Configuration Setup

### 1.1 Environment Variables Setup

**Files to modify:** `src/lib/supabase.ts`, create `.env` files

- Create `.env.local` for local development
- Create `.env.production` for production builds
- Update `src/lib/supabase.ts` to use `import.meta.env` variables
- Add `.env*` to `.gitignore` (except `.env.example`)
- Create `.env.example` template file

**Environment variables needed:**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 1.2 Update App Configuration

**Files to modify:** `capacitor.config.ts`, `package.json`, `index.html`

- Update `capacitor.config.ts` with final app ID and name
- Update `package.json` version from `0.0.0` to `1.0.0`
- Update `index.html` title and meta tags
- Add proper app description and keywords

### 1.3 Build Scripts Enhancement

**Files to modify:** `package.json`

- Add production build script with environment check
- Add iOS sync script: `"ios:sync": "npm run build && npx cap sync ios"`
- Add iOS open script: `"ios:open": "npx cap open ios"`

---

## Phase 2: Web Deployment (Vercel)

### 2.1 Build Optimization

**Files to modify:** `vite.config.ts`

- Vite already has production optimizations enabled by default
- Verify build works: `npm run build`
- Test locally: `npm run preview`

### 2.2 Vercel Deployment Setup

**Actions required:**

- Create Vercel account (free tier is fine for POC)
- Connect GitHub/GitLab repository
- Vercel auto-detects Vite and configures build
- Set environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Deploy (automatic on git push, or manual)

### 2.3 Quick Production Check

- Test production build locally first
- Verify environment variables work
- Test basic functionality on Vercel deployment
- Share URL with testers

---

## Phase 3: iOS TestFlight Setup (Internal Testing Only)

### 3.1 App Identity Configuration

**Files to modify:** `ios/App/App.xcodeproj/project.pbxproj`, `capacitor.config.ts`

- Update `PRODUCT_BUNDLE_IDENTIFIER` to your real bundle ID (e.g., `com.yourcompany.healthkitapp`)
- Update `MARKETING_VERSION` (e.g., 1.0.0)
- Update `CURRENT_PROJECT_VERSION` (build number, e.g., 1)
- Update `capacitor.config.ts` appId to match
- Update `CFBundleDisplayName` in `Info.plist` (appears on home screen)

### 3.2 Basic App Icons

**Files to modify:** `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

- For POC: Use existing icon or create a simple placeholder icon
- Ensure at least one icon size is configured (iOS will use it for all sizes if needed)
- Update `Contents.json` if adding new icon sizes
- Splash screen assets are already present

### 3.3 App Store Connect (Minimal Setup)

**Actions required (outside codebase):**

- Create app in App Store Connect (if not already created)
- For TestFlight internal testing: No screenshots, descriptions, or marketing materials needed
- Just need basic app name and bundle ID
- HealthKit privacy will be handled automatically via `Info.plist`

### 3.4 Certificates & Provisioning

**Actions required (in Xcode):**

- Ensure Apple Developer account is connected in Xcode
- Create/verify App ID in Apple Developer portal (with HealthKit capability)
- Xcode can automatically manage signing (recommended for POC)
- For TestFlight: Need Distribution Certificate (Xcode can generate this)
- Configure automatic signing in Xcode project settings

### 3.5 Build Configuration

**Files to check:** `ios/App/App.xcodeproj/project.pbxproj`

- Set build configuration to Release for TestFlight
- Verify code signing settings (automatic signing recommended)
- Check deployment target (iOS version - typically 13.0+ for Capacitor)
- Ensure HealthKit capabilities are enabled in Xcode
- Verify privacy descriptions in `Info.plist` are complete (already present)

---

## Phase 4: Testing & TestFlight

### 4.1 Local Testing

- Test iOS app on physical device (connect iPhone via USB, run from Xcode)
- Test HealthKit permissions flow
- Verify all features work on device
- Basic functionality check (no extensive QA needed for POC)

### 4.2 TestFlight Internal Testing

**Actions required:**

- Archive app in Xcode (Product → Archive)
- Upload to App Store Connect (via Xcode Organizer)
- Wait for processing (usually 10-30 minutes)
- Add internal testers in App Store Connect (use their Apple ID emails)
- Testers receive email invitation to TestFlight
- They install TestFlight app, then your app

**Note:** Internal testing allows up to 100 testers and doesn't require App Store review

### 4.3 POC Testing Checklist

- [ ] App builds and runs on device locally
- [ ] HealthKit permissions work
- [ ] Basic features functional
- [ ] TestFlight upload successful
- [ ] Testers can install via TestFlight

---

## Phase 5: Deployment Execution

### 5.1 Web Deployment

1. Push code to GitHub/GitLab
2. Connect repository to Vercel (via Vercel dashboard)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically (Vercel detects Vite and builds)
5. Test basic functionality on production URL
6. Share URL with testers

### 5.2 iOS TestFlight Distribution

1. Build and archive in Xcode (Product → Archive)
2. Upload to App Store Connect (via Organizer window)
3. Wait for processing (check status in App Store Connect)
4. Go to TestFlight section in App Store Connect
5. Add internal testers (email addresses)
6. Testers receive email and install via TestFlight app
7. No App Store review needed for internal testing

---

## Phase 6: Post-Deployment (POC - Minimal)

### 6.1 Basic Monitoring

- Monitor Supabase usage and costs (keep an eye on free tier limits)
- Check Vercel deployment status if issues arise
- Basic error checking via browser console / Xcode logs

### 6.2 Documentation

- Update README with basic deployment instructions
- Document environment setup (for team members)
- Note any POC-specific issues or limitations

---

## Critical Files to Modify

1. **`src/lib/supabase.ts`** - Move hardcoded credentials to env vars
2. **`capacitor.config.ts`** - Update app ID and name
3. **`package.json`** - Update version, add scripts
4. **`vite.config.ts`** - Production optimizations
5. **`ios/App/App.xcodeproj/project.pbxproj`** - Bundle ID and version
6. **`ios/App/App/Info.plist`** - App display name
7. **`.gitignore`** - Add environment files
8. **`index.html`** - Update title and meta tags

---

## Important Notes for POC

- **Supabase Credentials:** Currently hardcoded - should be moved to environment variables (good practice, but less critical for POC)
- **App ID:** Needs to be changed from placeholder to your real bundle ID (required for TestFlight)
- **App Name:** Update with your custom name throughout
- **HealthKit:** Privacy descriptions are already in `Info.plist` - verify they're accurate
- **Versioning:** iOS uses semantic versioning (1.0.0) and build numbers (1, 2, 3...)
- **TestFlight:** Internal testing requires no App Store review - perfect for POC
- **No App Store Submission:** This plan skips full App Store submission (screenshots, descriptions, review process)

---

## Estimated Timeline (POC)

- **Phase 1-2 (Web):** 1-2 hours
- **Phase 3 (iOS TestFlight Prep):** 2-3 hours (mostly waiting for certificates/processing)
- **Phase 4 (Testing):** 1-2 hours + tester feedback
- **Phase 5 (Deployment):** 30 minutes - 1 hour
- **Total:** ~1 day for setup, then ongoing testing

**Key Difference:** No App Store review wait time (can take 1-2 weeks for real submissions)
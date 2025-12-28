# TestFlight Setup Guide

This guide walks you through setting up certificates and uploading your app to TestFlight for internal testing.

## Prerequisites

- ✅ Bundle ID configured: `com.cassidyapps.petal`
- ✅ Apple Developer account (Team ID: 87XC98HD85)
- ✅ Xcode installed

---

## Step 1: Sync Capacitor with iOS Project

First, make sure your web build is synced with the iOS project:

```bash
npm run ios:sync
```

This will:
- Build your web app
- Copy the built files to the iOS project
- Update Capacitor configuration

---

## Step 2: Open Project in Xcode

```bash
npm run ios:open
```

Or manually: Open `ios/App/App.xcodeproj` in Xcode.

---

## Step 3: Configure Signing & Capabilities in Xcode

### 3.1 Select the Project

1. In Xcode, click on **"App"** in the left sidebar (blue project icon)
2. Select the **"App"** target (under TARGETS)
3. Click the **"Signing & Capabilities"** tab

### 3.2 Configure Automatic Signing

1. Check **"Automatically manage signing"**
2. Select your **Team** from the dropdown (should show your Apple Developer account)
3. Verify **Bundle Identifier** shows: `com.cassidyapps.petal`

### 3.3 Verify HealthKit Capability

1. In the "Signing & Capabilities" tab, check that **HealthKit** is listed
2. If not, click **"+ Capability"** and add **HealthKit**
3. Ensure both **HealthKit** and **Background Modes** are enabled

### 3.4 Verify Provisioning Profile

- Xcode should automatically create/update the provisioning profile
- You should see a green checkmark if everything is configured correctly
- If you see errors, Xcode will usually provide a "Fix Issue" button

---

## Step 4: Verify Bundle ID in Apple Developer Portal

1. Go to https://developer.apple.com/account
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers**
4. Find or create an App ID with bundle ID: `com.cassidyapps.petal`
5. Ensure **HealthKit** capability is enabled for this App ID

---

## Step 5: Build Configuration for TestFlight

### 5.1 Set Build Configuration to Release

1. In Xcode, go to **Product** → **Scheme** → **Edit Scheme...**
2. Select **"Run"** on the left
3. Set **Build Configuration** to **"Release"** (for TestFlight, you want Release builds)
4. Click **Close**

### 5.2 Select Generic iOS Device

1. **Find the device selector** in Xcode's top toolbar:
   - Look at the very top of the Xcode window, in the toolbar
   - It's located to the right of the Play/Stop buttons (▶️ ⏹️)
   - It shows your currently selected device/simulator (e.g., "iPhone 15 Pro" or a device name)
   - If you don't see it, make sure your Xcode window is wide enough - the toolbar might be collapsed
   
2. **Click on the device selector dropdown** and choose:
   - **"Any iOS Device (arm64)"** (preferred)
   - OR **"Generic iOS Device"**
   - This is required for archiving (TestFlight upload)
   
3. **If you still don't see it:**
   - Make sure you have the **App** target selected (not the project)
   - Try making your Xcode window wider
   - The selector should be between the scheme selector (left) and the activity viewer (right)

---

## Step 6: Resolve Swift Package Dependencies (if needed)

**If you get an error about "Missing package product 'CapApp-SPM'":**

### Try these solutions in order:

**Solution 1: Re-sync Capacitor (Recommended)**
1. Close Xcode completely
2. In Terminal, run:
   ```bash
   npm run build
   npx cap sync ios
   ```
3. Reopen Xcode: `npm run ios:open`
4. Try archiving again

**Solution 2: Resolve Packages in Xcode**
1. In Xcode, go to **File** → **Packages** → **Resolve Package Versions**
2. Wait for packages to resolve (this may take a minute)
3. If that doesn't work, try: **File** → **Packages** → **Reset Package Caches**
4. Then try **File** → **Packages** → **Resolve Package Versions** again

**Solution 3: Clean and Rebuild**
1. In Xcode: **Product** → **Clean Build Folder** (Shift+Cmd+K)
2. Close Xcode
3. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
4. Reopen Xcode
5. **File** → **Packages** → **Resolve Package Versions**
6. Try archiving again

**Solution 4: Build the Package Scheme First**
1. In Xcode, look at the scheme selector (top left)
2. Change the scheme from "App" to "CapApp-SPM"
3. Build it: **Product** → **Build** (Cmd+B)
4. Change scheme back to "App"
5. Try archiving again

**Solution 5: Update Capacitor (if above don't work)**
If none of the above work, you can try updating to the latest Capacitor version:
```bash
npm install @capacitor/cli@latest @capacitor/core@latest @capacitor/ios@latest
npx cap sync ios
```

---

## Step 7: Archive the App

1. In Xcode menu: **Product** → **Archive**
2. Wait for the build to complete (this may take a few minutes)
3. The **Organizer** window should open automatically when done
4. If not, go to **Window** → **Organizer**

---

## Step 8: Upload to App Store Connect

### 7.1 In the Organizer Window

1. You should see your archive listed
2. Select it and click **"Distribute App"**

### 7.2 Distribution Method

1. Select **"App Store Connect"**
2. Click **"Next"**

### 7.3 Distribution Options

1. Select **"Upload"** (not "Export")
2. Click **"Next"**

### 7.4 Distribution Options (Advanced)

1. Leave defaults (usually fine)
2. Click **"Next"**

### 7.5 Review & Upload

1. Review the summary
2. Click **"Upload"**
3. Wait for upload to complete (this may take 10-30 minutes depending on your connection)

---

## Step 9: Process in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Navigate to **My Apps** → Select your app (or create it if first time)
3. Go to **TestFlight** tab
4. Wait for processing (usually 10-30 minutes)
   - You'll see a yellow "Processing" status
   - When ready, it will turn green

---

## Step 10: Add Internal Testers

### 9.1 Add Testers

1. In App Store Connect, go to **TestFlight** tab
2. Click **"Internal Testing"** (left sidebar)
3. Click **"+"** to add testers
4. Enter email addresses of testers (must be Apple IDs)
5. Click **"Add"**

### 9.2 Invite Testers

1. Select the build you want to test
2. Click **"Start Testing"**
3. Testers will receive an email invitation

---

## Step 11: Testers Install TestFlight

1. Testers receive email invitation
2. They need to install **TestFlight** app from App Store (if not already installed)
3. Open TestFlight app
4. Accept invitation
5. Install your app from TestFlight

---

## Troubleshooting

### "No accounts with App Store Connect access"

- Make sure you're signed in to Xcode with your Apple Developer account
- Go to **Xcode** → **Settings** → **Accounts** → Add your Apple ID

### "Bundle identifier is already in use"

- The bundle ID `com.cassidyapps.petal` must be registered in Apple Developer portal
- Go to Identifiers and create it if it doesn't exist

### "Provisioning profile doesn't match"

- Make sure the bundle ID in Xcode matches exactly: `com.cassidyapps.petal`
- Try cleaning the build: **Product** → **Clean Build Folder** (Shift+Cmd+K)

### Build Errors

- Make sure you've run `npm run ios:sync` first
- Check that all dependencies are installed: `npm install`

### HealthKit Not Working

- Verify HealthKit capability is enabled in Xcode
- Check that privacy descriptions are in `Info.plist` (already configured)

---

## Next Steps After TestFlight

Once testers have the app:
- Collect feedback
- Fix any issues
- Upload new builds as needed (just repeat Steps 6-7)
- Each new build increments the build number automatically

---

## Quick Reference Commands

```bash
# Build and sync with iOS
npm run ios:sync

# Open in Xcode
npm run ios:open

# Or manually build
npm run build
npx cap sync ios
```


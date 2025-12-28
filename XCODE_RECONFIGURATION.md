# Xcode Reconfiguration Guide

After migrating from SPM to CocoaPods, you need to configure a few things in Xcode.

## Important: Open the Workspace, Not the Project

**CRITICAL:** You must open `ios/App/App.xcworkspace` (NOT `.xcodeproj`) when using CocoaPods.

```bash
npm run ios:open
```

Or manually: Open `ios/App/App.xcworkspace` in Xcode.

---

## Step 1: Verify Bundle ID

1. In Xcode, select the **App** project (blue icon) in the left sidebar
2. Select the **App** target (under TARGETS)
3. Go to **General** tab
4. Verify **Bundle Identifier** is: `com.cassidyapps.petal`
5. If not, update it to: `com.cassidyapps.petal`

---

## Step 2: Configure Signing

1. Still in the **App** target, go to **Signing & Capabilities** tab
2. Check **"Automatically manage signing"**
3. Select your **Team** from the dropdown (should show your Apple Developer account)
4. Verify the provisioning profile is created successfully (green checkmark)

---

## Step 3: Add HealthKit Capability

1. In the **Signing & Capabilities** tab, click **"+ Capability"**
2. Search for and add **"HealthKit"**
3. This will automatically create the `App.entitlements` file
4. Verify HealthKit appears in the capabilities list

---

## Step 4: Verify HealthKit Privacy Descriptions

The HealthKit privacy descriptions are already in `Info.plist`:
- `NSHealthShareUsageDescription`
- `NSHealthUpdateUsageDescription`

These are required by Apple and are already configured.

---

## Step 5: Test Build

1. Select a simulator or device from the device selector (top toolbar)
2. Press **Cmd+B** to build
3. Verify the build succeeds without errors
4. You should see no "Missing package product" errors

---

## Step 6: Continue with TestFlight

Once the build succeeds, you can continue with the TestFlight setup:
- Follow the `TESTFLIGHT_SETUP.md` guide from Step 6 (Archive the App)
- The SPM-related errors should be gone!

---

## Troubleshooting

### "No such module 'Capacitor'"
- Make sure you opened `.xcworkspace`, not `.xcodeproj`
- Try: `cd ios/App && pod install` again

### HealthKit capability not available
- Make sure your Apple Developer account is selected
- Verify the bundle ID matches your App ID in Apple Developer portal

### Build errors
- Clean build folder: **Product** → **Clean Build Folder** (Shift+Cmd+K)
- Rebuild: **Product** → **Build** (Cmd+B)


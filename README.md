# react-native-in-app-gallery
A react-native in-app gallery component which allows to pick an image from both gallery and camera, optionally without exiting the current screen.
It's **Android** and **iOS** compatible.

![](example.gif)

## Getting started

### Installation guide

This package depends on some common react-native packages:
* [@react-native-community/cameraroll](https://github.com/react-native-community/react-native-cameraroll)
* [react-native-permissions](https://github.com/react-native-community/react-native-permissions)
* [react-native-camera](https://github.com/react-native-community/react-native-camera)
* [react-native-image-picker](https://github.com/react-native-community/react-native-image-picker)


```
npm i --save @react-native-community/cameraroll react-native-permissions react-native-camera react-native-image-picker react-native-in-app-gallery
```

#### Android

Add required permissions inside the manifest
```xml
<manifest>
...
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
...
<application>
```

Add the following lines in `android/app/build.gradle`

```
android {
  ...
  defaultConfig {
    ...
    missingDimensionStrategy 'react-native-camera', 'general' // <--- insert this line
  }
}
```

#### iOS

Add required keys in your `Info.plist`

```xml
    <key>NSCameraUsageDescription</key>
	<string>$(PRODUCT_NAME) would like to use your camera</string>
	<key>NSMicrophoneUsageDescription</key>
	<string>$(PRODUCT_NAME) would like to use your microphone to let you take and send videos</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>$(PRODUCT_NAME) would like to save photos to your photo gallery</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>$(PRODUCT_NAME) would like access to your photo gallery</string>
```

Add permission handlers in your `Podfile`
```
  permissions_path = '../node_modules/react-native-permissions/ios'

  pod 'Permission-Camera', :path => "#{permissions_path}/Camera.podspec"
  pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary.podspec"
```

Run 
```
cd ios
pod install
```


If any problems, please refer to the mentioned above packages installation guides before opening an issue.

## Usage

The usage should be straightforward: simply import the component and consume it.

```
import InAppGallery from 'react-native-in-app-gallery';
...
<InAppGallery
    onImagePicked={(image) => {
        console.log(image);
    }}
/>
```

## Try it out

You can check a simple example [here](https://github.com/xtreamsrl/react-native-in-app-gallery/tree/master/Example).


### Props

| Property                                |                   Type                   | Description                           |
| --------------------------------------- | :--------------------------------------: | :--------------------------------------- |
| onImagePicked                           |      (image: ImageFile) => void          | Callback which triggers when an image is picked (press on image, take a photo from the camera or from gallery) |
| pageSize                                |          number (default 100)            | (Optional) The page size dimension to paginate images fetching |
| initialNumToRender                      |          number (default 9)              | (Optional) The initial number of items to render for the FlatList |
| imageHeight                             |          number (default 120)            | (Optional) The height of the image item |
| withCamera                              |           bool (default true)            | (Optional) If true, shows camera preview and allow to take picture from the camera |
| withFullGallery                         |           bool (default true)            | (Optional) If true, a FAB button allows you to open the gallery |
| onPermissionGranted                     |    (permission: Permission) => void      | (Optional) Callback on permission granted |
| onPermissionDenied                      |    (permission: Permission) => void      | (Optional) Callback on permission denied |
| onPermissionBlocked                     |    (permission: Permission) => void      | (Optional) Callback on permission blocked |
| imagePickerOptions                      | ImagePickerOptions (default  ```{storageOptions: {skipBackup: true, path: 'images'}}```) | (Optional) Options for ImagePicker |
| enableSelection                         |         bool (default false)             | (Optional) It enables selection (with long press) |
| onImageSelected                         |    (image: ImageFile, selected: boolean) | (Optional) Callback on image selection. It's triggered whenever an image is selected or deselected |
| onSelectionEnd                          |    (images: ImageFile[]) => void         | (Optional) Callback on images selection end |
| cancelSelectionText                     |       string (default `Cancel`)          | (Optional) Text to cancel selection |
| doneSelectionText                       |        string (default `DONE`)           | (Optional) Text to end selection |
| selectionColor                          |        string (default `#0284ff`)        | (Optional) It's the tint color for selection icon |

### Methods

| Method                                  |                Description               | 
| --------------------------------------- | :--------------------------------------: |
| clearSelection                          |         It clears selected images        | 


# Who we are
<img align="left" width="80" height="80" src="https://avatars2.githubusercontent.com/u/38501645?s=450&u=1eb7348ca81f5cd27ce9c02e689f518d903852b1&v=4">
A proudly 🇮🇹 software development and data science startup.<br>We consider ourselves a family of talented and passionate people building their own products and powerful solutions for our clients. Get to know us more on <a target="_blank" href="https://xtreamers.io">xtreamers.io</a> or follow us on <a target="_blank" href="https://it.linkedin.com/company/xtream-srl">LinkedIn</a>.




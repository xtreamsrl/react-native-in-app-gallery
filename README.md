# react-native-in-app-gallery
A RN in-app gallery component which allows to pick an image from both gallery and camera.
## Getting started

### Prerequisites
The current package is not yet published. To try it out, these are the steps required.

To link without pain the local package install [wml](https://github.com/wix/wml) by running
```
npm install -g wml
```

With wml installed, you can use it by typing 
```
wml add ~/my-package ~/main-project/node_modules/my-package
# start watching all links added
wml start
```
in particular, you need to clone the package locally and refer to its path. Second argument is the destination, so it should be your real project.

Now you can add the package dependency on your package.json, without worrying about the IDE complaining on a missing dependency.
### Installation guide
This package depends on few common react-native packages:
* [@react-native-community/cameraroll](https://github.com/react-native-community/react-native-cameraroll)
* [react-native-permissions](https://github.com/react-native-community/react-native-permissions)
* [react-native-camera](https://github.com/react-native-community/react-native-camera)
* [react-native-image-picker](https://github.com/react-native-community/react-native-image-picker)

To make it works, we need to setup these packages. Please refer to their installation guide which is maintained up-do-date.

##Usage

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
  
###Props

| Property                                |                   Type                   | Description                           |
| --------------------------------------- | :--------------------------------------: | :--------------------------------------- |
| onImagePicked                           |           (image: ImageFile) => void     | Callback which triggers when an image is picked (press on image, take a photo from the camera or from gallery)             |
| withCamera                              |           bool (default true)            | (Optional) If true, shows camera preview and allow to take picture from the camera |
| withFullGallery                         |           bool (default true)            | (Optional) If true, a FAB button allows you to open the gallery |
| onPermissionGranted                     |    (permission: Permission) => void      | (Optional) Callback on permission granted |
| onPermissionDenied                      |    (permission: Permission) => void      | (Optional) Callback on permission denied |
| onPermissionBlocked                     |    (permission: Permission) => void      | (Optional) Callback on permission blocked |
| onImageSelected                         |    (image: ImageFile, selected: boolean) | (Optional) Callback on image selection. It enables selection with long press. It's triggered whenever an image is selected or deselected |
| onSelectionEnd                          |    (image: ImageFile[]) => void          | (Optional) Callback on images selection end |
| cancelSelectionText                     |       string (default `Cancel`)          | (Optional) Text to cancel selection |
| doneSelectionText                       |        string (default `DONE`)           | (Optional) Text to end selection |

###Methods

| Method                                  |                Description               | 
| --------------------------------------- | :--------------------------------------: | 
| clearSelection                          |         It clears selected images        | 


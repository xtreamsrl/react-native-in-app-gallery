import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';
import {FlatList, Platform, TouchableOpacity, View, Text, ListRenderItemInfo} from 'react-native';
import {
  check,
  checkMultiple,
  Permission,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {PhotoIdentifier} from '@react-native-community/cameraroll';
import {fetchInitialPhotos, fetchMorePhotos} from './CameraRollUtils';
import {CameraButton} from './CameraButton';
import FloatFullGalleryButton from './GalleryButton';
import {ImageFile} from './typings';
import SelectableImage from './SelectableImage';
import {ImagePickerOptions} from 'react-native-image-picker';
import {inAppGalleryStyles} from "./styles";

export interface Props {
  onImagePicked: (image: ImageFile) => void;
  pageSize?: number;
  initialNumToRender?: number;
  imageHeight?: number;
  withCamera?: boolean;
  withFullGallery?: boolean;
  onPermissionGranted?: (permission: Permission) => void;
  onPermissionDenied?: (permission: Permission) => void;
  onPermissionBlocked?: (permission: Permission) => void;
  enableSelection?: boolean;
  onImageSelected?: (image: ImageFile, selected: boolean) => void;
  onSelectionEnd?: (images: ImageFile[]) => void;
  cancelSelectionText?: string;
  doneSelectionText?: string;
  imagePickerOptions?: ImagePickerOptions;
  selectionColor?: string;
}

const handlePermissionRequest = (
  result: 'unavailable' | 'denied' | 'blocked' | 'granted',
  permission: Permission,
  onPermissionGranted?: (permission: Permission) => void,
  onPermissionDenied?: (permission: Permission) => void,
  onPermissionBlocked?: (permission: Permission) => void,
) => {
  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.log('This feature is not available (on this device / in this context)');
      break;
    case RESULTS.DENIED:
      console.log('The permission has not been requested / is denied but requestable');
      onPermissionDenied && onPermissionDenied(permission);
      break;
    case RESULTS.GRANTED:
      console.log('The permission is granted');
      onPermissionGranted && onPermissionGranted(permission);
      break;
    case RESULTS.BLOCKED:
      console.log('The permission is denied and not requestable anymore');
      onPermissionBlocked && onPermissionBlocked(permission);
      break;
  }
};

const ANDROID_WITH_CAMERA_PERMISSIONS = [
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
];
const IOS_WITH_CAMERA_PERMISSIONS = [PERMISSIONS.IOS.CAMERA];

const defaultImagePickerOptions = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  quality: 0.8
};

const InAppGallery = forwardRef<any, Props>(
  (
    {
      onImagePicked,
      onImageSelected,
      onSelectionEnd,
      onPermissionGranted,
      onPermissionDenied,
      onPermissionBlocked,
      enableSelection,
      imagePickerOptions = defaultImagePickerOptions,
      imageHeight = 120,
      pageSize = 100,
      initialNumToRender = 9,
      withCamera = true,
      withFullGallery = true,
      cancelSelectionText = 'Cancel',
      doneSelectionText = 'DONE',
      selectionColor = '#0284ff',
    },
    ref,
  ) => {
    const [cameraGrants, setCameraGrants] = useState<number>(0);
    const [isSelectionEnabled, setIsSelectionEnabled] = useState<boolean>(false);
    const [isPhotoLibraryGranted, setIsPhotoLibraryGranted] = useState<boolean>(false);
    const [photos, setPhotos] = useState<PhotoIdentifier[] | null>(null);
    const [selectedPhotos, setSelectedPhotos] = useState<PhotoIdentifier[]>([]);
    const [selectedPhotosMap, setSelectedPhotosMap] = useState<{[key: string]: boolean}>({});

    const handleClearSelection = useCallback(() => {
      setIsSelectionEnabled(false);
      setSelectedPhotos([]);
      setSelectedPhotosMap({});
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        clearSelection() {
          handleClearSelection();
        },
      }),
      [handleClearSelection],
    );

    const isCameraGranted =
      Platform.OS === 'android'
        ? cameraGrants >= ANDROID_WITH_CAMERA_PERMISSIONS.length
        : cameraGrants >= IOS_WITH_CAMERA_PERMISSIONS.length;

    const askCameraPermission = useCallback(
      (permission: Permission, results: any) => {
        switch (results[permission]) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            onPermissionDenied && onPermissionDenied(permission);
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            onPermissionGranted && onPermissionGranted(permission);
            setCameraGrants((cnt) => cnt + 1);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            onPermissionBlocked && onPermissionBlocked(permission);
            break;
        }
      },
      [onPermissionGranted, onPermissionDenied, onPermissionBlocked],
    );

    const askCameraPermissions = useCallback(async () => {
      const permissions =
        Platform.OS === 'android' ? ANDROID_WITH_CAMERA_PERMISSIONS : IOS_WITH_CAMERA_PERMISSIONS;
      const results = await requestMultiple(permissions);
      for (let i = 0; i < permissions.length; i++) {
        askCameraPermission(permissions[i], results);
      }
    }, [askCameraPermission]);

    const checkCameraPermissions = useCallback(async () => {
      const permissions =
        Platform.OS === 'android' ? ANDROID_WITH_CAMERA_PERMISSIONS : IOS_WITH_CAMERA_PERMISSIONS;
      const results = await checkMultiple(permissions);
      for (let i = 0; i < permissions.length; i++) {
        switch (results[permissions[i]]) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            onPermissionDenied && onPermissionDenied(permissions[i]);
            askCameraPermission(permissions[i], results);
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            onPermissionGranted && onPermissionGranted(permissions[i]);
            setCameraGrants((cnt) => cnt + 1);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            onPermissionBlocked && onPermissionBlocked(permissions[i]);
            break;
        }
      }
    }, [onPermissionGranted, onPermissionDenied, onPermissionBlocked, askCameraPermission]);

    const askPhotoLibraryPermissions = useCallback(async () => {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
      const result = await request(permission);
      handlePermissionRequest(
        result,
        permission,
        async () => {
          onPermissionGranted && onPermissionGranted(permission);
          setIsPhotoLibraryGranted(true);
          const _photos = await fetchInitialPhotos();
          setPhotos(_photos);
        },
        onPermissionDenied,
        onPermissionBlocked,
      );
    }, [onPermissionGranted, onPermissionDenied, onPermissionBlocked]);

    const checkPhotoLibraryPermissions = useCallback(async () => {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
      const result = await check(permission);
      handlePermissionRequest(
        result,
        permission,
        async () => {
          onPermissionGranted && onPermissionGranted(permission);
          setIsPhotoLibraryGranted(true);
          const _photos = await fetchInitialPhotos(undefined, undefined, pageSize);
          setPhotos(_photos);
        },
        askPhotoLibraryPermissions,
        onPermissionBlocked,
      );
    }, [onPermissionGranted, onPermissionBlocked, askPhotoLibraryPermissions, pageSize]);

    useEffect(() => {
      async function doAsyncStuff() {
        await checkPhotoLibraryPermissions();
        if (withCamera) {
          await checkCameraPermissions();
        }
      }

      doAsyncStuff();
    }, [checkPhotoLibraryPermissions, checkCameraPermissions, withCamera]);

    const loadMorePhotos = useCallback(async () => {
      const phts = await fetchMorePhotos(pageSize);
      setPhotos((ps) => {
        if (ps) {
          if (phts) {
            return [...ps, ...phts];
          } else {
            return ps;
          }
        } else {
          if (phts) {
            return [...phts];
          } else {
            return ps;
          }
        }
      });
    }, [pageSize]);

    const renderItem = useCallback(
      ({item, index} : ListRenderItemInfo<PhotoIdentifier>) => {
        const itemUri = item.node.image.uri;

        const handleOnImagePress = () => {
          if (isSelectionEnabled) {
            if (itemUri in selectedPhotosMap) {
              setSelectedPhotos((spp) =>
                spp.filter((sp) => sp.node.image.uri !== item.node.image.uri),
              );
              setSelectedPhotosMap((smap) => {
                const newMap = {...smap};
                delete newMap[itemUri];
                return newMap;
              });
              onImageSelected && onImageSelected(item.node.image, false);
            } else {
              setSelectedPhotos((spp) => [...spp, item]);
              setSelectedPhotosMap((smap) => {
                const newMap = {...smap};
                newMap[itemUri] = true;
                return newMap;
              });
              onImageSelected && onImageSelected(item.node.image, true);
            }
          } else {
            onImagePicked(item.node.image);
          }
        };

        const handleOnImageLongPress = () => {
          if (!isSelectionEnabled) {
            setIsSelectionEnabled(true);
            setSelectedPhotos([item]);
            setSelectedPhotosMap({[itemUri]: true});
            onImageSelected && onImageSelected(item.node.image, true);
          }
        };

        if (withCamera) {
          if (index === 0) {
            if (isCameraGranted) {
              return <CameraButton height={imageHeight} onImagePicked={onImagePicked} imagePickerOptions={imagePickerOptions} />;
            } else {
              return (
                <TouchableOpacity
                  onPress={askCameraPermissions}
                />
              );
            }
          } else {
            return (
              <SelectableImage
                imageHeight={imageHeight}
                enableSelection={enableSelection}
                onImagePress={handleOnImagePress}
                onImageLongPress={handleOnImageLongPress}
                item={item}
                isSelected={itemUri in selectedPhotosMap}
                selectionColor={selectionColor}
              />
            );
          }
        } else {
          return (
            <SelectableImage
              imageHeight={imageHeight}
              enableSelection={enableSelection}
              onImagePress={handleOnImagePress}
              onImageLongPress={handleOnImageLongPress}
              item={item}
              isSelected={itemUri in selectedPhotosMap}
              selectionColor={selectionColor}
            />
          );
        }
      },
      [
        imageHeight,
        isCameraGranted,
        withCamera,
        isSelectionEnabled,
        onImagePicked,
        selectedPhotos,
        selectedPhotosMap,
        onImageSelected,
        askCameraPermissions,
        imagePickerOptions,
      ],
    );

    const handleDoneSelection = useCallback(() => {
      onSelectionEnd && onSelectionEnd(selectedPhotos.map((sp) => sp.node.image));
      handleClearSelection();
    }, [onSelectionEnd, selectedPhotos, handleClearSelection]);

    const renderHeader = useCallback(() => {
      if (!isSelectionEnabled) {
        return null;
      }
      return (
        <View
          style={inAppGalleryStyles.selectionHeaderContainer}>
          <View>
            <TouchableOpacity onPress={handleClearSelection}>
              <Text>{cancelSelectionText}</Text>
            </TouchableOpacity>
          </View>
          <View style={inAppGalleryStyles.row}>
            <TouchableOpacity onPress={handleDoneSelection}>
              <Text>
                {doneSelectionText}
                {' ('}
                {selectedPhotos.length}
                {')'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }, [
      isSelectionEnabled,
      selectedPhotos,
      handleClearSelection,
      cancelSelectionText,
      doneSelectionText,
      handleDoneSelection,
    ]);

    const handleGetItemLayout = useCallback((_, index) => (
      {length: imageHeight, offset: imageHeight * index, index}
    ), [imageHeight]);

    const keyExtractor = useCallback((item: PhotoIdentifier, index: number) => {
      return item.node.image.uri || index.toString();
    }, []);

    if (!isPhotoLibraryGranted) return null;

    return (
      <View style={inAppGalleryStyles.container}>
          <FlatList
            stickyHeaderIndices={[0]}
            data={photos}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            numColumns={3}
            removeClippedSubviews={Platform.OS === 'android'}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.7}
            onEndReached={loadMorePhotos}
            initialNumToRender={initialNumToRender}
            getItemLayout={handleGetItemLayout}
          />
        {withFullGallery && (
          <View
            style={inAppGalleryStyles.floatButtonContainer}>
            <FloatFullGalleryButton onImagePicked={onImagePicked} imagePickerOptions={imagePickerOptions} />
          </View>
        )}
      </View>
    );
  },
);

InAppGallery.displayName = 'InAppGallery';

export default InAppGallery;

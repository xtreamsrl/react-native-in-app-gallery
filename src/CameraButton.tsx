import React, {useCallback} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
//@ts-ignore
import camera from './assets/camera.png';
import ImagePicker, {ImagePickerResponse, ImagePickerOptions} from 'react-native-image-picker';
import {ImageFile} from './typings';
import {convertToImageFile} from './utils';

type Props = {
  onImagePicked: (image: ImageFile) => void;
  imagePickerOptions?: ImagePickerOptions;
};

const defaultImagePickerOptions = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export const CameraButton: React.FC<Props> = ({
  onImagePicked,
  imagePickerOptions = defaultImagePickerOptions,
}) => {
  const callback = useCallback(
    (res: ImagePickerResponse) => {
      onImagePicked(convertToImageFile(res, imagePickerOptions));
    },
    [onImagePicked, imagePickerOptions],
  );

  const handleOnPress = useCallback(() => {
    ImagePicker.launchCamera(imagePickerOptions, callback);
  }, [imagePickerOptions, callback]);

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={{
        width: '33.33%',
        height: 120,
        position: 'relative',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#fff',
      }}>
      <RNCamera style={{flex: 1}} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={camera} style={{width: 30, height: 30, tintColor: '#fff'}} />
      </View>
    </TouchableOpacity>
  );
};

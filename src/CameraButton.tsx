import React, {useCallback, useMemo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
//@ts-ignore
import camera from '../assets/camera.png';
import ImagePicker, {ImagePickerResponse, ImagePickerOptions} from 'react-native-image-picker';
import {ImageFile} from './typings';
import {convertToImageFile} from './utils';
import {cameraButtonStyles, inAppGalleryStyles} from "./styles";

type Props = {
  height: number;
  onImagePicked: (image: ImageFile) => void;
  imagePickerOptions: ImagePickerOptions;
};

export const CameraButton: React.FC<Props> = ({
  height,
  onImagePicked,
  imagePickerOptions,
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

  const touchableStyle = useMemo(() => {
    return [cameraButtonStyles.touchable, {height}]
  }, [height]);

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={touchableStyle}>
      <RNCamera style={inAppGalleryStyles.flex} />
      <View
        style={cameraButtonStyles.imageContainer}>
        <Image source={camera} style={cameraButtonStyles.image} />
      </View>
    </TouchableOpacity>
  );
};

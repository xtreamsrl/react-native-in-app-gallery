import React, {useCallback} from 'react';
import ImagePicker, {ImagePickerOptions, ImagePickerResponse} from 'react-native-image-picker';
import {Image, TouchableOpacity} from 'react-native';
//@ts-ignore
import grid from '../assets/grid.png';
import {convertToImageFile} from './utils';
import {ImageFile} from './typings';
import {galleryButtonStyles} from "./styles";

type Props = {
  onImagePicked: (image: ImageFile) => void;
  imagePickerOptions: ImagePickerOptions;
};

const FloatFullGalleryButton: React.FC<Props> = ({
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
    ImagePicker.launchImageLibrary(imagePickerOptions, callback);
  }, [imagePickerOptions, callback]);

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={galleryButtonStyles.touchable}>
      <Image style={galleryButtonStyles.image} source={grid} />
    </TouchableOpacity>
  );
};

export default FloatFullGalleryButton;

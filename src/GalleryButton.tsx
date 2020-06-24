import React, {useCallback} from 'react';
import ImagePicker, {ImagePickerOptions, ImagePickerResponse} from 'react-native-image-picker';
import {Image, TouchableOpacity} from 'react-native';
//@ts-ignore
import grid from '../assets/grid.png';
import {convertToImageFile} from './utils';
import {ImageFile} from './typings';

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

const FloatFullGalleryButton: React.FC<Props> = ({
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
    ImagePicker.launchImageLibrary(imagePickerOptions, callback);
  }, [imagePickerOptions, callback]);

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
      }}>
      <Image style={{width: 30, height: 30, tintColor: 'gray'}} source={grid} />
    </TouchableOpacity>
  );
};

export default FloatFullGalleryButton;

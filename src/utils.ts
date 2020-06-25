import {ImageFile} from './typings';
import {ImagePickerOptions, ImagePickerResponse} from 'react-native-image-picker';

export const convertToImageFile = (
  res: ImagePickerResponse,
  options: ImagePickerOptions,
): ImageFile => {
  return {
    uri: res.uri || '',
    filename: res.fileName || '',
    fileSize: res.fileSize,
    height: res.height,
    width: res.width,
    playableDuration: 0,
    isStored: options.hasOwnProperty('storageOptions'),
  };
};

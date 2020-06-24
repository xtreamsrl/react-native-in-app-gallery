import React from 'react';
import {PhotoIdentifier} from '@react-native-community/cameraroll';
import {Image, TouchableOpacity, View} from 'react-native';
import {ImageFile} from './typings';
//@ts-ignore
import check from '../assets/check.png';

type Props = {
  isSelected: boolean;
  item: PhotoIdentifier;
  onImagePress: () => void;
  onImageLongPress: () => void;
  onImageSelected?: (image: ImageFile, selected: boolean) => void;
  selectionColor?: string;
};

const SelectableImage: React.FC<Props> = ({
  isSelected,
  item,
  onImagePress,
  onImageSelected,
  onImageLongPress,
  selectionColor = '#0284ff',
}) => {
  return (
    <TouchableOpacity
      onPress={onImagePress}
      onLongPress={onImageSelected && onImageLongPress}
      style={{
        width: '33.33%',
        height: 120,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#fff'
      }}>
      {isSelected ? (
        <View style={{position: 'relative'}}>
          <Image style={{width: '100%', height: '100%', opacity: 0.8}} source={{uri: item.node.image.uri}} />
          <Image
            source={check}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              width: 20,
              height: 20,
              tintColor: selectionColor,
            }}
          />
        </View>
      ) : (
        <Image style={{width: '100%', height: '100%'}} source={{uri: item.node.image.uri}} />
      )}
    </TouchableOpacity>
  );
};

export default SelectableImage;

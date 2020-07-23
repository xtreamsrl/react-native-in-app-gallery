import React, {useMemo} from 'react';
import {PhotoIdentifier} from '@react-native-community/cameraroll';
import {Image, TouchableOpacity, View} from 'react-native';
//@ts-ignore
import check from '../assets/check.png';
import {inAppGalleryStyles, selectableImageStyles} from "./styles";

type Props = {
  imageHeight: number;
  isSelected: boolean;
  item: PhotoIdentifier;
  onImagePress: () => void;
  onImageLongPress: () => void;
  enableSelection?: boolean;
  selectionColor?: string;
};

const SelectableImage: React.FC<Props> = ({
  imageHeight,
  isSelected,
  item,
  onImagePress,
  enableSelection,
  onImageLongPress,
  selectionColor,
}) => {

  const touchableStyle = useMemo(() => {
    return [selectableImageStyles.touchable, {height: imageHeight}]
  }, [imageHeight]);

  const checkStyle = useMemo(() => {
    return [selectableImageStyles.checkImage, {tintColor: selectionColor}];
  }, [selectionColor]);

  const source = useMemo(() => {
    return {uri: item.node.image.uri};
  }, [item]);

  return (
    <TouchableOpacity
      onPress={onImagePress}
      onLongPress={enableSelection ? onImageLongPress : undefined}
      style={touchableStyle}>
      {isSelected ? (
        <View style={inAppGalleryStyles.relative}>
          <Image style={selectableImageStyles.image} source={source} />
          <Image
            source={check}
            style={checkStyle}
          />
        </View>
      ) : (
        <Image style={selectableImageStyles.image} source={source} />
      )}
    </TouchableOpacity>
  );
};

export default SelectableImage;

import {StyleSheet} from "react-native";

export const inAppGalleryStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  relative: {
    position: 'relative',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  selectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  floatButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
});

export const galleryButtonStyles = StyleSheet.create({
  touchable: {
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
  },
  image: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  }
});

export const cameraButtonStyles = StyleSheet.create({
  touchable: {
    width: '33.33%',
    position: 'relative',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  }
});

export const selectableImageStyles = StyleSheet.create({
  touchable: {
    width: '33.33%',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  checkImage: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 20,
    height: 20,
  }
});

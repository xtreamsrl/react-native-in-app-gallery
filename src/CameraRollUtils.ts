import CameraRoll, {
  PhotoIdentifier,
  PhotoIdentifiersPage,
} from '@react-native-community/cameraroll';

export interface FetchPaginatedResult {
  data: PhotoIdentifier[] | null;
  fetchMore: (pageSize?: number) => Promise<PhotoIdentifier[] | null>;
}

const paginatePhotos = async (
  onEnd?: (success: boolean) => void,
  onPaginationEnd?: () => void,
  pageSize = 50,
): Promise<FetchPaginatedResult> => {
  let lastPageInfo: PhotoIdentifiersPage['page_info'] | undefined;
  let photos: PhotoIdentifiersPage | undefined;

  async function fetchMore(pageSize = 50) {
    if (lastPageInfo) {
      photos = await CameraRoll.getPhotos({
        first: pageSize,
        after: lastPageInfo.end_cursor,
      });
    } else {
      photos = await CameraRoll.getPhotos({
        first: pageSize,
      });
    }
    lastPageInfo = photos.page_info;
    console.log('Last visible cursor', lastPageInfo);
    onEnd && onEnd(true);
    return photos.edges;
  }

  if (!lastPageInfo || lastPageInfo.has_next_page) {
    await fetchMore(pageSize);
  } else {
    onPaginationEnd && onPaginationEnd();
  }
  return {
    data: photos ? photos.edges : null,
    fetchMore,
  };
};

let _fetchMorePhotos: FetchPaginatedResult['fetchMore'];

export const fetchInitialPhotos = async (
  onEnd?: (success: boolean) => void,
  onPaginationEnd?: () => void,
  pageSize = 50,
): Promise<PhotoIdentifier[] | null> => {
  const result = await paginatePhotos(onEnd, onPaginationEnd, pageSize);
  _fetchMorePhotos = result.fetchMore;
  return result.data;
};

export const fetchMorePhotos = async (pageSize = 50): Promise<PhotoIdentifier[] | null> => {
  if (_fetchMorePhotos) {
    return await _fetchMorePhotos(pageSize);
  }
  return null;
};

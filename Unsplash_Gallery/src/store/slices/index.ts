// Home slice exports
export { 
  setCurrentPage as homeSetCurrentPage,
  clearError as homeClearError,
  fetchHomePhotos,
  homeSlice 
} from './homeSlice';

// Search slice exports
export { 
  setQuery,
  setCurrentPage as searchSetCurrentPage,
  setOrderBy,
  setOrientation as searchSetOrientation,
  setColor,
  clearError as searchClearError,
  resetSearch,
  searchPhotos,
  searchSlice 
} from './searchSlice';

// Random slice exports
export { 
  setCount,
  setOrientation as randomSetOrientation,
  clearError as randomClearError,
  clearPhotos,
  generateRandomPhotos,
  randomSlice 
} from './randomSlice';
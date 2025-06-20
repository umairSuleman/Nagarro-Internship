import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import { ImageCard, Pagination, PageHeader, Section, Grid, Button } from '../components';
import { fetchHomePhotos, setCurrentPage } from '../store/slices/homeSlice';
import type { RootState, AppDispatch} from '../store/types';

export const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { photos, currentPage, perPage } = useSelector(
    (state: RootState) => state.home
  );
  
  // Check if specifically the home photos are loading
  const loading = useSelector((state: RootState) => 
    Object.keys(state.global.loading).some(key => 
      key.includes('home/fetchPhotos') && state.global.loading[key]
    )
  );

  const loadPhotos = (page: number = 1) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchHomePhotos({
      page,
      per_page: perPage,
    }));
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      loadPhotos(newPage);
    }
  };

  const handleRefresh = () => {
    loadPhotos(currentPage);
  };

  const refreshAction = (
    <Button
      onClick={handleRefresh}
      disabled={loading}
      icon={RefreshCw}
      loading={loading}
    >
      Refresh
    </Button>
  );

  return (
    <Section>
      <PageHeader
        title="Editorial Photos"
        action={refreshAction}
      />

      <Section>
        <Grid cols={4}>
          {photos.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </Grid>

        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          hasMore={photos.length === perPage}
          loading={loading}
        />
      </Section>
    </Section>
  );
};
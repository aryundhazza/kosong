import { Carousel } from '@/components/carousel';
import { ListEventsPage } from '@/components/listEvents';

import type { NextPage } from 'next';
import { carouselImages } from '@/utils/images';
import Wrapper from '@/components/wrapper';

const Home: NextPage = () => {
  return (
    <Wrapper>
      <div className="container mx-auto px-10">
        <div className="w-full h-full">
          <Carousel images={carouselImages.map((image) => image.src)} />
          <ListEventsPage />
        </div>
      </div>
    </Wrapper>
  );
};

export default Home;

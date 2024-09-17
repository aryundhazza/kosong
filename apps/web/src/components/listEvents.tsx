'use client';
import { CardEvent } from '@/components/card';
import Wrapper from '@/components/wrapper';
import { getEvents } from '@/lib/event';
import { Suspense, useEffect, useState } from 'react';
interface Item {
  id: string;
  name: string;
  slug: string;
}

export const ListEventsPage: React.FC = () => {
  const [listEvents, setListEvents] = useState([]);
  const onCreate = async () => {
    try {
      const listEvents = await getEvents();
      console.log(listEvents, ',.,,,.,');
      setListEvents(listEvents.events);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    onCreate();
  }, []);
  return (
    <Wrapper>
      <div className="flex justify-start w-fit overflow-x-scroll">
        <Suspense>
          {/* <div className="md:overflow-x-auto xs:overflow-x-auto sm:overflow-x-auto"> */}
          {listEvents?.map((item: Item, idx) => {
            return <CardEvent key={idx} data={item} slug={item.slug} />;
          })}
          {/* </div> */}
        </Suspense>
      </div>
    </Wrapper>
  );
};

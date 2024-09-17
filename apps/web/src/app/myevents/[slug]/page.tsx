import BuyButton from '@/components/buyButton';
import FormEdit from '@/components/formEdit';
import Komentar from '@/components/komentar';
import ShareButton from '@/components/share';
import Wrapper from '@/components/wrapper';
import { formatDate } from '@/helper/formatDate';
import { getEventSlug, getEvents } from '@/lib/event';
import { getToken } from '@/lib/server';
import Link from 'next/link';

export const revalidate = 0;

export const generateStaticParams = async () => {
  const { events } = await getEvents();

  return events.map((event: any) => ({
    params: {
      slug: event.slug,
    },
  }));
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { event } = await getEventSlug(params.slug);

  return {
    title: event.title,
    description: event.description,
    organizer: event.organizer.name,
    openGraph: {
      images: [event.image],
    },
  };
}

export default async function EventDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { event } = await getEventSlug(params.slug);

  return (
    <Wrapper>
      <div className="flex">
        <div className="flex-1 sticky max-md:hidden top-[100px] h-full">
          <Link href={`/`} className="flex items-center gap-2">
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            back
          </Link>
          <ShareButton slug={event.slug} className="mt-5" />
        </div>
        <div className="flex-[2] pr-52 max-lg:pr-0">
          <FormEdit event={event} />
        </div>
      </div>
    </Wrapper>
  );
}

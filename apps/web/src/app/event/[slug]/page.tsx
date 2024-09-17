import BuyButton from '@/components/buyButton';
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
  console.log(event, '???????');
  const token = await getToken();

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
          <h5 className="mb-2 text-[32px] max-md:text-[24px] font-bold tracking-tight text-gray-900 dark:text-white">
            {event.title}
          </h5>
          <div className="flex gap-1">
            <p className="font-bold text-[18px] max-md:text-[14px]">
              {event.organizer.name}
            </p>
            ∙
            <p className="text-[18px] max-md:text-[14px]">
              {formatDate(event.createdAt)}
            </p>
          </div>
          <ShareButton slug={event.slug} className="hidden max-md:block" />
          <img
            className="h-[350px] max-sm:h-[200px] max-md:h-[300px] w-full my-5 shadow"
            src={event.image}
            alt={event.title}
          />
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300">
              {event.description.replace(/(<([^>]+)>)/gi, '')}
            </p>
          </div>
          <div className="mt-4">
            <p className="font-bold text-[18px] max-md:text-[14px]">
              Tiket Tersedia: {event.seatsAvailable}
            </p>
            <p className="font-bold text-[18px] max-md:text-[14px]">
              Price:{' '}
              {event?.price != 0
                ? Intl.NumberFormat('id', {
                    currency: 'IDR',
                    style: 'currency',
                  }).format(event?.price)
                : 'free'}
            </p>

            <p className="font-bold text-[18px] max-md:text-[14px]">
              Lokasi: {event.location}
            </p>
            <p className="font-bold text-[18px] max-md:text-[14px]">
              Tanggal dan Waktu:{' '}
              {new Date(event.dateTime)
                .toLocaleString('ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
                .replace(',', '')}
            </p>
            <BuyButton
              eventId={event.id}
              // token={token} // Gantilah dengan token yang valid
              // userId={1} // Gantilah dengan ID pengguna yang valid
            />
          </div>
          <Komentar eventId={event.id} />
        </div>
      </div>
    </Wrapper>
  );
}

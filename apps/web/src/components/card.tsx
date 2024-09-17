import { splitStr } from '@/helper/splitStr';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ICardEvent {
  title?: string;
  image?: string;
  avatar?: string;
  email?: string;
  id?: string;
  slug: string;
  data: any;
}

export const CardEvent: React.FC<ICardEvent> = ({
  title,
  image,
  avatar,
  email,
  id,
  slug,
  data,
}) => {
  const [base, setBase] = useState<string>('/event');
  console.log(window.location.href, 'HREFF');

  useEffect(() => {
    if (window.location.href.indexOf('myevent') > 1) {
      console.log('MASOKKK');
      setBase('/myevents');
    }
  }, []);

  return (
    <a href={`${base}/${slug}`} className="pr-2 flex">
      <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
        <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md ">
          <img
            src={data?.image}
            alt="card-image"
            className="h-56 w-full flex justify-center"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-fit text-center">
              {data.price != 0
                ? Intl.NumberFormat('id', {
                    currency: 'IDR',
                    style: 'currency',
                  }).format(data?.price)
                : 'free'}
            </div>
            <div className="mb-4 rounded-full bg-gray-700 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-fit text-center">
              {' '}
              Available : {data?.seatsAvailable}
            </div>
          </div>
          <h6 className="mb-2 text-slate-800 text-xl font-semibold">
            {data.name}
          </h6>
          <p className="text-slate-600 leading-normal font-light max-w-100px">
            {/* The place is close to Barceloneta Beach and bus stop just 2 min by
            walk and near to &quot;Naviglio&quot; where you can enjoy the main
            night life in Barcelona. */}
            {data.description.replace(/(<([^>]+)>)/gi, '')}
          </p>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <img
              alt="Tania Andrew"
              src={
                data?.organizer?.avatar ||
                'https://cdn-icons-png.freepik.com/512/6915/6915987.png'
              }
              className="relative inline-block h-8 w-8 rounded-full"
            />
            <div className="flex flex-col ml-3 text-sm">
              <span className="text-slate-800 font-semibold">
                {data?.organizer?.name}
              </span>
              <span className="text-slate-600">
                {new Date(data.dateTime)
                  .toLocaleString('ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                  .replace(',', '')}
              </span>
            </div>
          </div>
          <Link
            href={`/event/${slug}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-cyan-600 rounded-lg hoverbg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 "
          >
            Buy
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
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
        </div>
      </div>
    </a>
  );
};

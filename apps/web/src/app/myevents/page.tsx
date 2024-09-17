'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import debounce from 'lodash.debounce';
import { CardEvent } from '@/components/card';
import Pagination from '@/components/pagination';
import Wrapper from '@/components/wrapper';
import { getMyEvents } from '@/lib/event';

interface EventType {
  id: string;
  name: string;
  slug: string;
  // Add other properties according to your event data
}

interface DropdownOption {
  value: string;
  label: string;
}

const categories: DropdownOption[] = [
  { value: 'all', label: 'All Categories' },
  { label: 'Klasik', value: 'Klasik' },
  { label: 'Jazz', value: 'Jazz' },
  { label: 'Blues', value: 'Blues' },
  { label: 'Reggae', value: 'Reggae' },
  { label: 'Rap', value: 'Rap' },
  { label: 'Pop', value: 'Pop' },
  { label: 'Dangdut', value: 'Dangdut' },
  { label: 'Hindi', value: 'Hindi' },
];

export default function MyEventsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [myEvents, setMyEvents] = useState<EventType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(search);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Function to fetch events
  const fetchMyEvents = async (
    search?: string,
    page?: number,
    category?: string,
  ) => {
    try {
      const response = await getMyEvents(search, page, 10, category);
      setMyEvents(response.events);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  // Debounced fetch events function
  const debouncedFetchMyEvents = useCallback(
    debounce((search: string, page: number, category: string) => {
      fetchMyEvents(search, page, category);
    }, 2000),
    [],
  );

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    debouncedFetchMyEvents(event.target.value, page, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedCategory(event.target.value);
    debouncedFetchMyEvents(searchQuery, page, event.target.value);
  };

  // Fetch events when component mounts or when `searchQuery`, `page`, or `selectedCategory` changes
  useEffect(() => {
    fetchMyEvents(searchQuery, page, selectedCategory);
  }, []);

  return (
    <>
      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between my-4 md:mx-0 p-4 gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search icon</span>
          </div>
          <input
            type="text"
            id="search-navbar-desktop"
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="block p-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Event Cards */}
      <Wrapper>
        <div className="flex justify-center flex-wrap gap-4 p-4 overflow-auto">
          {myEvents?.map((item) => (
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4" key={item.id}>
              <CardEvent data={item} slug={item.slug} />
            </div>
          ))}
        </div>
      </Wrapper>

      {/* No Data and Pagination */}
      {myEvents.length === 0 && (
        <h1 className="flex justify-center text-center font-bold text-xl p-6">
          Belum Memiliki Data
        </h1>
      )}
      {myEvents.length > 0 && (
        <Wrapper>
          <div className="flex justify-end p-4">
            <Pagination totalPages={totalPages} />
          </div>
        </Wrapper>
      )}
    </>
  );
}

'use client';
import { useState } from 'react';
import ChartKomponen from '@/components/chart/chart';
import SelectDropdown from '@/components/select';
import MyEventsPage from '../myevents/page';
import PesertaPage from '../peserta/page';

export default function DashboardPage() {
  const [selectedOption, setSelectedOption] = useState<string>('/dashboard');

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    // Handle the selected option value here, e.g., update chart data
  };

  const dropdownOptions = [
    { label: 'Dashboard', value: '/dashboard' },
    { label: 'My Events', value: '/myevents' },
    { label: 'Daftar Peserta', value: '/peserta' },
    // { label: 'Laporan', value: '/laporan' },
  ];

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <SelectDropdown
          options={dropdownOptions}
          onChange={handleSelectChange}
          selectedValue={selectedOption}
        />
      </div>
      <div className="flex flex-col h-full">
        {selectedOption === '/dashboard' && (
          <div className="flex-grow">
            <ChartKomponen />
          </div>
        )}
        {selectedOption === '/myevents' && (
          <div className="flex-grow overflow-auto">
            <MyEventsPage />
          </div>
        )}
        {selectedOption === '/peserta' && (
          <div className="flex-grow overflow-auto">
            <PesertaPage />
          </div>
        )}
      </div>
    </div>
  );
}

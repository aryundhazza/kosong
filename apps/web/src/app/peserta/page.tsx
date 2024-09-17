'use client';
import React, { useState, useEffect } from 'react';
import Table from '@/components/table'; // Adjust the import path as needed
import { getToken, getUserId } from '@/lib/server';
import { getPeserta } from '@/lib/event';
import { toast } from 'react-toastify';

// Example function to fetch participant data (replace with actual API call)

const PesertaPage: React.FC = () => {
  const [data, setData] = useState<
    {
      id: number;
      name: string;
      email: string;
      registrationDate: string;
      event: { name: string; price: number };
      totalTicket: number;
    }[]
  >([]);

  const fetchParticipantData = async () => {
    // Replace with your data fetching logic
    try {
      const token = await getToken();
      const organizerId = await getUserId();
      const input = {
        organizerId: Number(organizerId),
      };
      const { result, ok } = await getPeserta(input, token);
      if (!ok) throw new Error(result.msg);
      setData(result.reviews);
    } catch (error) {
      toast.error((error as string) || 'An error occurred');
    }
    //   return [
    //     {
    //       id: 1,
    //       name: 'John Doe',
    //       email: 'john@example.com',
    //       registrationDate: '2024-09-15',
    //     },
    //     {
    //       id: 2,
    //       name: 'Jane Smith',
    //       email: 'jane@example.com',
    //       registrationDate: '2024-09-16',
    //     },
    //   ];
  };

  useEffect(() => {
    // const getData = async () => {
    //   const result = await fetchParticipantData();
    //   //   setData(result);
    // };

    // getData();
    fetchParticipantData();
  }, []);

  console.log(data, 'DATA BOY');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">List Peserta</h1>
      <Table data={data} />
    </div>
  );
};

export default PesertaPage;

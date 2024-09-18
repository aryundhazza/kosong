'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { buyTicket } from '@/lib/event';
import { getToken, getUserId } from '@/lib/server';

interface BuyButtonProps {
  eventId: number;
}

export const BuyButton: React.FC<BuyButtonProps> = ({ eventId }) => {
  const [totalTicket, setTotalTicket] = useState<number | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTotalTicket(value === '' ? '' : Number(value));
  };

  const handleBuy = async () => {
    if (totalTicket === '' || totalTicket <= 0) {
      toast.error('Please enter a valid number of tickets.');
      return;
    }

    try {
      const token = await getToken();
      const userId = await getUserId();

      if (!token) {
        throw new Error('Authentication token is missing.');
      }
      if (typeof userId !== 'number') {
        throw new Error('User ID is not valid.');
      }

      const input = {
        eventId,
        userId,
        totalTicket,
      };

      const { result, ok } = await buyTicket(input, token);
      if (!ok) throw new Error(result.msg);
      toast.success(result.msg);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while buying the ticket.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="number"
        value={totalTicket === '' ? '' : totalTicket}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter number of tickets"
      />
      <button
        onClick={handleBuy}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 mt-4"
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
      </button>
    </div>
  );
};

export default BuyButton;

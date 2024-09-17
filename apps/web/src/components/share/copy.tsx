'use client';
import { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

export default function CopyButton({
  slug,
  url,
}: {
  slug: string;
  url: string;
}) {
  const [value, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  return (
    <button
      onMouseLeave={() => setCopied(false)}
      onClick={() => {
        copy(`${url}/event/${slug}`);
        setCopied(true);
      }}
      className="text-gray-500 dark:text-gray-400 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-full p-[10px] inline-flex items-center justify-center"
    >
      {copied ? (
        <span className="inline-flex items-center">
          <svg
            className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
        </span>
      ) : (
        <span>
          <svg
            className="w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
          </svg>
        </span>
      )}
    </button>
  );
}

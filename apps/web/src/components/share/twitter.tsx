'use client';
import { TwitterIcon, TwitterShareButton } from 'react-share';

export default function TwitterButton({
  slug,
  url,
}: {
  slug: string;
  url: string;
}) {
  return (
    <TwitterShareButton url={`${url}/event/${slug}`}>
      <TwitterIcon size={32} round />
    </TwitterShareButton>
  );
}

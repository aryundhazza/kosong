'use client';
import { LinkedinIcon, LinkedinShareButton } from 'react-share';

export default function LinkedInButton({
  slug,
  url,
}: {
  slug: string;
  url: string;
}) {
  return (
    <LinkedinShareButton url={`${url}/event/${slug}`}>
      <LinkedinIcon size={32} round />
    </LinkedinShareButton>
  );
}

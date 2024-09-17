'use client';
import { WhatsappIcon, WhatsappShareButton } from 'react-share';

export default function WaButton({ slug, url }: { slug: string; url: string }) {
  return (
    <WhatsappShareButton url={`${url}/event/${slug}`}>
      <WhatsappIcon size={32} round />
    </WhatsappShareButton>
  );
}

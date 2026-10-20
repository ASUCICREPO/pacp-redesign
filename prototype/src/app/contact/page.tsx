'use client';

import dynamic from 'next/dynamic';

const ContactPage = dynamic(() => import('@/legacy/pages/ContactPage.jsx'), { ssr: false });

export default function Route() {
  return <ContactPage />;
}

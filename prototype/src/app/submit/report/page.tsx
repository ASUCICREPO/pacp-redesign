import { ReportUpload } from '@/components/extraction/ReportUpload';

export const metadata = { title: 'Extract Records from a Report' };

/** Sits beside the prototype's /submit/vessel, reached from the Submit page. */
export default async function Page({ searchParams }: { searchParams: Promise<{ example?: string }> }) {
  const { example } = await searchParams;
  return <ReportUpload startWithExample={example === '1'} />;
}

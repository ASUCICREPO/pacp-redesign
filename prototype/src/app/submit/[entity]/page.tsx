'use client';

import dynamic from 'next/dynamic';
import { notFound, useParams } from 'next/navigation';

import { ENTITY_FORMS } from '@/legacy/submit/entityForms';

const EntitySubmissionForm = dynamic(() => import('@/legacy/submit/EntitySubmissionForm.jsx'), { ssr: false });

/**
 * The nine entity submission pages the Submit page links to.
 * /submit/vessel and /submit/report are static routes and take precedence.
 */
export default function Route() {
  const { entity } = useParams<{ entity: string }>();
  const spec = ENTITY_FORMS[entity as keyof typeof ENTITY_FORMS];
  if (!spec) notFound();
  return <EntitySubmissionForm spec={spec} />;
}

/**
 * GET /api/extract/status — whether real extraction is likely to work.
 *
 * "Likely" on purpose: the Anthropic SDK also resolves credentials from an
 * `ant auth login` profile, so a missing env var is a strong hint, not proof.
 * The UI uses this to steer people toward demo mode, never to hard-block.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  const credentialHint = Boolean(
    process.env.ANTHROPIC_API_KEY ||
      process.env.ANTHROPIC_AUTH_TOKEN ||
      process.env.ANTHROPIC_PROFILE,
  );
  return Response.json({ credentialHint });
}

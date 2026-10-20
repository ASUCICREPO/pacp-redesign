import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

import { palette, sansFont } from '../lib/theme.js';
import {
  FieldLabel,
  OnboardingStep,
  OnboardingSubtitle,
  OnboardingTitle,
  PasswordField,
  PrimaryButton,
  TextField,
} from './OnboardingFlow.jsx';

/**
 * Sign in and password recovery, in the prototype's own onboarding card.
 *
 * These two screens had been built in a second visual language — a different
 * card, different buttons, a different logo mark. They are the same kind of
 * screen as "Create your account", so they are built from the same pieces:
 * the logo card, the centred panel, the prototype's own fields and buttons.
 * Only the step dots are dropped, since neither screen is part of the
 * four-step flow.
 */

const linkStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: palette.terra,
  fontSize: 13,
  fontFamily: sansFont,
};

const footerNote = {
  fontFamily: sansFont,
  fontSize: 13,
  color: palette.muted,
  textAlign: 'center',
  marginTop: 20,
};

const fieldStack = { display: 'flex', flexDirection: 'column', gap: 18 };

export function SignInScreen({ onSignIn, onForgotPassword, onCreateAccount }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <OnboardingStep step={-1} dots={false}>
      <OnboardingTitle>Welcome back</OnboardingTitle>
      <OnboardingSubtitle>
        Sign in to pick up your drafts, submissions and saved reasoning where you left them.
      </OnboardingSubtitle>

      <div style={fieldStack}>
        <div>
          <FieldLabel label="Email" required />
          <TextField
            placeholder="your.email@university.edu"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
        </div>
        <div>
          <FieldLabel label="Password" required />
          <PasswordField
            placeholder="Your password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <button type="button" style={linkStyle} onClick={onForgotPassword}>
              Forgot your password?
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
        <PrimaryButton onClick={() => onSignIn({ email, password })}>
          Sign in <ArrowRight size={16} strokeWidth={2.5} />
        </PrimaryButton>
      </div>

      <p style={footerNote}>
        {'New to PACP? '}
        <button type="button" style={linkStyle} onClick={onCreateAccount}>
          Create an account
        </button>
      </p>
    </OnboardingStep>
  );
}

export function ResetPasswordScreen({ onBackToSignIn }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <OnboardingStep step={-1} dots={false}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: `${palette.terra}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={26} color={palette.terra} strokeWidth={2.5} />
          </div>
        </div>
        <OnboardingTitle>Check your email</OnboardingTitle>
        <OnboardingSubtitle>
          {`If an account exists for ${email.trim() || 'that address'}, a link to set a new password is on its way. The link expires in an hour.`}
        </OnboardingSubtitle>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton onClick={onBackToSignIn}>
            Back to sign in <ArrowRight size={16} strokeWidth={2.5} />
          </PrimaryButton>
        </div>
      </OnboardingStep>
    );
  }

  return (
    <OnboardingStep step={-1} dots={false}>
      <OnboardingTitle>Reset your password</OnboardingTitle>
      <OnboardingSubtitle>
        Enter the email you signed up with and we will send you a link to set a new password.
      </OnboardingSubtitle>

      <div style={fieldStack}>
        <div>
          <FieldLabel label="Email" required />
          <TextField
            placeholder="your.email@university.edu"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
        <PrimaryButton onClick={() => setSent(true)}>
          Send reset link <ArrowRight size={16} strokeWidth={2.5} />
        </PrimaryButton>
      </div>

      <p style={footerNote}>
        {'Remembered it? '}
        <button type="button" style={linkStyle} onClick={onBackToSignIn}>
          Back to sign in
        </button>
      </p>
    </OnboardingStep>
  );
}

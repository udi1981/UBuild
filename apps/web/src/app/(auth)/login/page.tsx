"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Alert, Separator } from "@ubuilder/ui";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();

  // Email + password form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Magic link state
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicError, setMagicError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("נא למלא את כל השדות");
      setLoading(false);
      return;
    }

    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      setError(result.error.message || "שגיאה בהתחברות");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMagicError("");
    setMagicLoading(true);

    if (!magicEmail) {
      setMagicError("נא להזין כתובת אימייל");
      setMagicLoading(false);
      return;
    }

    const result = await authClient.signIn.magicLink({
      email: magicEmail,
    });

    if (result.error) {
      setMagicError(result.error.message || "שגיאה בשליחת הקישור");
      setMagicLoading(false);
      return;
    }

    setMagicSent(true);
    setMagicLoading(false);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-fg mb-6">התחברות</h2>

      {/* Email + Password Form */}
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="אימייל"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
          autoComplete="email"
        />

        <Input
          label="סיסמה"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          dir="ltr"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <Link
            href="/forgot"
            className="text-primary hover:text-primary-hover transition-colors"
          >
            שכחת סיסמה?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          התחברות
        </Button>
      </form>

      <Separator label="או להמשיך עם" className="my-6" />

      {/* Google OAuth */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        המשך עם Google
      </Button>

      <Separator label="או" className="my-6" />

      {/* Magic Link */}
      {magicSent ? (
        <Alert variant="success">
          שלחנו לך קישור כניסה לאימייל <strong>{magicEmail}</strong>. בדוק את
          תיבת הדואר שלך.
        </Alert>
      ) : (
        <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
          {magicError && <Alert variant="error">{magicError}</Alert>}
          <Input
            label="כניסה עם קישור"
            type="email"
            placeholder="you@example.com"
            value={magicEmail}
            onChange={(e) => setMagicEmail(e.target.value)}
            dir="ltr"
            autoComplete="email"
          />
          <Button
            type="submit"
            variant="secondary"
            loading={magicLoading}
            className="w-full"
          >
            שלח לי קישור
          </Button>
        </form>
      )}

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-fg-muted">
        אין לך חשבון?{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary-hover font-medium transition-colors"
        >
          צור חשבון
        </Link>
      </p>
    </Card>
  );
};

export default LoginPage;

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Alert, Separator } from "@ubuilder/ui";
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("נא למלא את כל השדות");
      return;
    }

    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "שגיאה ביצירת החשבון");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch {
      setError("לא ניתן להתחבר לשרת. נסה שוב מאוחר יותר.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-fg mb-6">יצירת חשבון</h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="שם מלא"
          type="text"
          placeholder="ישראל ישראלי"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

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
          placeholder="לפחות 8 תווים"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          dir="ltr"
          autoComplete="new-password"
        />

        <Input
          label="אימות סיסמה"
          type="password"
          placeholder="הזן שוב את הסיסמה"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          dir="ltr"
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          צור חשבון
        </Button>
      </form>

      <Separator label="או להירשם עם" className="my-6" />

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignUp}
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
        הירשם עם Google
      </Button>

      <p className="mt-6 text-center text-sm text-fg-muted">
        יש לך כבר חשבון?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary-hover font-medium transition-colors"
        >
          התחבר
        </Link>
      </p>
    </Card>
  );
};

export default RegisterPage;

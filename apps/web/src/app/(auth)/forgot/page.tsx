"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Card, Alert } from "@ubuilder/ui";
import { authClient } from "@/lib/auth-client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("נא להזין כתובת אימייל");
      return;
    }

    setLoading(true);

    const result = await authClient.signIn.magicLink({
      email,
    });

    if (result.error) {
      setError(result.error.message || "שגיאה בשליחת הקישור");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-fg mb-2">שחזור סיסמה</h2>
      <p className="text-sm text-fg-muted mb-6">
        הזן את כתובת האימייל שלך ונשלח לך קישור לכניסה.
      </p>

      {sent ? (
        <div className="flex flex-col gap-4">
          <Alert variant="success">
            שלחנו קישור כניסה ל-<strong>{email}</strong>. בדוק את תיבת הדואר
            שלך.
          </Alert>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
          >
            שלח שוב
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <Button type="submit" loading={loading} className="w-full">
            שלח קישור
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-fg-muted">
        <Link
          href="/login"
          className="text-primary hover:text-primary-hover font-medium transition-colors"
        >
          חזרה להתחברות
        </Link>
      </p>
    </Card>
  );
};

export default ForgotPasswordPage;

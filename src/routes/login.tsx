import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type AdminProfile, requestAdminOtp, verifyAdminOtp } from "@/lib/admin-api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Sign In — Phone Club" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [temporaryToken, setTemporaryToken] = useState<string>();
  const [adminProfile, setAdminProfile] = useState<Partial<AdminProfile>>();
  const [otpRequested, setOtpRequested] = useState(false);

  const login = useMutation({
    mutationFn: () => requestAdminOtp(email, password),
    onSuccess: ({ temporaryToken: token, profile }) => {
      setTemporaryToken(token);
      setAdminProfile(profile);
      setOtpRequested(true);
    },
  });
  const verify = useMutation({
    mutationFn: () => verifyAdminOtp(email, otp, temporaryToken, adminProfile),
    onSuccess: () => navigate({ to: "/", replace: true }),
  });

  const submitCredentials = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate();
  };
  const submitOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verify.mutate();
  };
  const error = login.error ?? verify.error;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
      <Card className="card-soft w-full max-w-md rounded-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="gradient-primary mx-auto grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground">
            {otpRequested ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <Smartphone className="h-6 w-6" />
            )}
          </div>
          <div>
            <CardTitle>{otpRequested ? "Verify your sign-in" : "Admin sign in"}</CardTitle>
            <CardDescription className="mt-2">
              {otpRequested
                ? `Enter the OTP sent to ${email}.`
                : "Use your Phone Club administrator credentials to continue."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {otpRequested ? (
            <form className="space-y-4" onSubmit={submitOtp}>
              <Input
                autoFocus
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                placeholder="6-digit OTP"
                required
                value={otp}
              />
              <Button className="w-full rounded-xl" disabled={verify.isPending} type="submit">
                {verify.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Verify and sign
                in
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setOtpRequested(false);
                  setOtp("");
                }}
                type="button"
                variant="ghost"
              >
                Use a different account
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={submitCredentials}>
              <Input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Admin email"
                required
                type="email"
                value={email}
              />
              <Input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
              <Button className="w-full rounded-xl" disabled={login.isPending} type="submit">
                {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Send OTP
              </Button>
            </form>
          )}
          {error && <p className="mt-4 text-center text-sm text-destructive">{error.message}</p>}
        </CardContent>
      </Card>
    </main>
  );
}

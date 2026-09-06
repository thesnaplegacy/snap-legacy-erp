'use client';

import { useState } from 'react';
import { signInWithEmail, quickDemoLogin } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2, Sparkles, ArrowRight } from 'lucide-react';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleQuickDemo() {
    setDemoLoading(true);
    setError(null);
    await quickDemoLogin();
  }

  return (
    <div className="space-y-8">
      {/* Logo / Brand */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 backdrop-blur-sm shadow-xl shadow-amber-500/5">
          <Shield className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            The Snap Legacy
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Enterprise Resource Planning
          </p>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {IS_DEMO && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs text-neutral-300 space-y-1">
            <p className="font-semibold text-amber-400">Demo Mode Active</p>
            <p className="text-neutral-400 leading-relaxed">
              Explore the full ERP suite with simulated data. Use the 1-click button below or sign in with any credentials.
            </p>
          </div>
        </div>
      )}

      {/* Login Card */}
      <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl text-center text-white">Sign in to HQ</CardTitle>
          <CardDescription className="text-center text-neutral-400">
            Enter your credentials to access the command center
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Demo Access Button */}
          {IS_DEMO && (
            <>
              <Button
                type="button"
                onClick={handleQuickDemo}
                disabled={demoLoading || loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-semibold h-11 transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {demoLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Launching Demo Dashboard...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Instant Demo Access (Super Admin)
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink mx-3 text-xs text-neutral-500 uppercase tracking-wider">or sign in with email</span>
                <div className="flex-grow border-t border-neutral-800"></div>
              </div>
            </>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={IS_DEMO ? 'admin@thesnaplegacy.com' : ''}
                placeholder="admin@thesnaplegacy.com"
                required
                autoComplete="email"
                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                defaultValue={IS_DEMO ? 'password' : ''}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant={IS_DEMO ? "outline" : "default"}
              className={`w-full ${
                IS_DEMO
                  ? 'border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20'
              } transition-all duration-200`}
              disabled={loading || demoLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-neutral-600">
        {IS_DEMO ? 'Demo Mode • Full System Simulation' : 'Secured by Supabase Auth'} • The Snap Legacy © {new Date().getFullYear()}
      </p>
    </div>
  );
}

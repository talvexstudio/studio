'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    // For now, we'll just redirect to the dashboard.
    router.push('/dashboard');
  };

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleLogin} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          defaultValue="demo@flowledger.com"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          required
          defaultValue="password"
        />
      </div>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.85 1.62-4.65 0-8.42-3.82-8.42-8.5s3.77-8.5 8.42-8.5c2.53 0 4.22.98 5.17 1.89l2.76-2.76C18.99 1.21 16.25 0 12.48 0 5.88 0 .04 5.88.04 12.5s5.84 12.5 12.44 12.5c3.23 0 5.49-1.08 7.28-2.86 1.84-1.79 2.4-4.29 2.4-6.69 0-.6-.06-1.2-.18-1.78Z"
          ></path>
        </svg>
        Sign in with Google
      </Button>
    </form>
  );
}

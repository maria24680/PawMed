'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      router.push('/');
    }
  }, [router, session, isPending]);

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
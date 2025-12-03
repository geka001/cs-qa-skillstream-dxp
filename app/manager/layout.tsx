'use client';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ManagerProvider is now in the root layout, so we don't need it here
  return <>{children}</>;
}


"use client";

import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-zinc-950">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
"use client";

import React from 'react';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
} 
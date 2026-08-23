import React from "react";

interface FullBleedGridProps {
  children: React.ReactNode;
}

/**
 * FullBleedGrid — constrains nothing. All children span the full viewport
 * width; each section is responsible for its own internal grid/padding.
 * The outer container applies the global obsidian border frame.
 */
export default function FullBleedGrid({ children }: FullBleedGridProps) {
  return (
    <main className="flex-1 flex flex-col border-t-0 border-x-0">
      {children}
    </main>
  );
}

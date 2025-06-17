"use client"; 

import { useParams } from 'next/navigation';

export default function MatchDetailPage() {
  const params = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Lunch Match Details</h1>
      <p>Match ID: {params.id}</p>
      {/* Match info, profile preview, lunch plan */}
    </div>
  );
}
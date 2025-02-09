"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Candidate {
  id: string;
  name: string;
  description: string;
  _count: {
    votesReceived: number;
  };
}

export default function CandidatesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      fetchCandidates();
    }
  }, [status, router]);

  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      setMessage("Error fetching candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId: string) => {
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateId }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // Refresh the candidates list to update vote counts
        fetchCandidates();
      }
    } catch (error) {
      setMessage("Error submitting vote");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Presidential Candidates
        </h1>

        {message && (
          <div className="mb-4 p-4 rounded bg-blue-100 text-blue-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{candidate.name}</h2>
              <p className="text-gray-600 mb-4">{candidate.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Votes: {candidate._count.votesReceived}
                </span>
                <button
                  onClick={() => handleVote(candidate.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>

        {candidates.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No candidates have registered yet.
          </p>
        )}
      </div>
    </div>
  );
}

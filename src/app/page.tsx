"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Candidate {
  id: string;
  name: string;
  description: string;
  _count: {
    votesReceived: number;
  };
}

export default function Home() {
  const { data: session } = useSession();
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCandidates = async () => {
      try {
        const res = await fetch("/api/candidates/top");
        const data = await res.json();
        setTopCandidates(data);
      } catch (error) {
        console.error("Error fetching top candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCandidates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Presidential Elections
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Exercise your right to vote and shape the future
          </p>

          {!session && (
            <div className="space-x-4 mb-12">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Register to Vote
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top Candidates
          </h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600 mr-4">
                      #{index + 1}
                    </span>
                    <h3 className="text-xl font-semibold">{candidate.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{candidate.description}</p>
                  <div className="text-sm text-gray-500">
                    Votes: {candidate._count.votesReceived}
                  </div>
                </div>
              ))}
            </div>
          )}

          {topCandidates.length === 0 && !loading && (
            <p className="text-center text-gray-500">
              No candidates have registered yet.
            </p>
          )}

          {session && (
            <div className="mt-8 text-center">
              <Link
                href="/candidates"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Candidates
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

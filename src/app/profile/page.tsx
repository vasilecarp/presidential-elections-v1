"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  description: string | null;
  isCandidate: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
      setDescription(data.description || "");
      setLoading(false);
    } catch (error) {
        console.log(error);
      setMessage("Error fetching profile");
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully");
        fetchProfile();
      } else {
        setMessage("Error updating profile");
      }
    } catch (error) {
      setMessage("Error updating profile");
    }
  };

  const handleSubmitCandidacy = async () => {
    try {
      const res = await fetch("/api/profile/candidacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setMessage("Successfully submitted candidacy");
        fetchProfile();
      } else {
        setMessage("Error submitting candidacy");
      }
    } catch (error) {
      setMessage("Error submitting candidacy");
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

          {message && (
            <div className="mb-4 p-4 rounded bg-blue-100 text-blue-700">
              {message}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {profile?.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {profile?.email}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {profile?.isCandidate ? "Presidential Candidate" : "Voter"}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Write a short description about yourself..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
            </form>

            {!profile?.isCandidate && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Submit Candidacy</h3>
                <button
                  onClick={handleSubmitCandidacy}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Submit Your Candidacy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

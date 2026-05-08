"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function MerchantUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // API requires pagination for users
      const res = await fetch(`/api/v1/users?limit=100&page=0`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });

      if (!res.ok) {
        setError("Failed to load users");
        setLoading(false);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setUsers(data.data || []);
      } else {
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8 hairline-b pb-4">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
          MANAGE USERS
        </h1>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-on-surface-variant font-label-caps animate-pulse">LOADING USERS...</div>
      ) : users.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center hairline-all">
          <p className="font-body-lg text-on-surface-variant mb-6">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant uppercase hairline-b">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hairline-b hover:bg-surface-container-lowest transition-colors font-body-md text-on-surface">
                  <td className="p-4">
                    <div className="font-bold">{user.first_name} {user.last_name}</div>
                    <div className="text-xs text-on-surface-variant">ID: {user.id.substring(0, 8)}...</div>
                  </td>
                  <td className="p-4">
                    {user.email}
                  </td>
                  <td className="p-4">
                    {user.phone || "-"}
                  </td>
                  <td className="p-4">
                    {user.is_verified ? (
                      <span className="text-green-600 font-label-caps text-xs">VERIFIED</span>
                    ) : (
                      <span className="text-orange-500 font-label-caps text-xs">PENDING</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
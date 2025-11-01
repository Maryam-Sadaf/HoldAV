"use client";

import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
type UserRow = {
  fullName: string | null;
  email: string | null;
  role: string | null;
  companyName: string | null;
  createdBy: string | null;
  userId: string | null;
  createdAt: string | null;
};

const AllUsersPage = () => {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  // Using browser translation instead of custom toggle

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/all-users", { cache: "no-store" });
        if (!res.ok) {
          setUsers([]);
          return;
        }
        const data = (await res.json()) as UserRow[];
        if (isMounted) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // No language toggle: rely on Google Translate/browser translation

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No users found.</p>
      </div>
    );
  }

  return (
    <Container>
    <div className="p-6">
       <Heading title="All Users" subTitle="View and manage all registered users from this section." />
      <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th> */}
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u, idx) => (
              <tr key={`${u.userId}-${idx}`} className={idx % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                <td className="px-4 py-3 text-sm text-gray-900">{u.fullName || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{u.email || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{u.role || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{u.companyName || "-"}</td>
                {/* <td className="px-4 py-3 text-sm text-gray-700">{u.createdBy || "-"}</td> */}
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Container>

  );
};

export default AllUsersPage;



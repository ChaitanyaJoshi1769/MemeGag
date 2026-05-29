"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  totalPosts: number;
  pendingReports: number;
  bannedUsers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats({
      totalUsers: 1250,
      totalPosts: 45000,
      pendingReports: 42,
      bannedUsers: 15,
    });
  }, []);

  return (
    <div className="container">
      <header style={{ padding: "2rem 0", borderBottom: "1px solid var(--border)" }}>
        <h1>MemeGag Admin Dashboard</h1>
        <p style={{ color: "gray", marginTop: "0.5rem" }}>System moderation and analytics</p>
      </header>

      {stats ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Posts" value={stats.totalPosts} />
          <StatCard label="Pending Reports" value={stats.pendingReports} color="warning" />
          <StatCard label="Banned Users" value={stats.bannedUsers} color="danger" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function StatCard({ label, value, color = "primary" }: { label: string; value: number; color?: string }) {
  return (
    <div
      style={{
        padding: "1.5rem",
        border: `1px solid var(--border)`,
        borderRadius: "0.5rem",
        backgroundColor: `var(--${color})15`,
      }}
    >
      <p style={{ fontSize: "0.875rem", color: "gray" }}>{label}</p>
      <p style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem" }}>{value}</p>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Loader from "@/components/ui/loading";

type DashboardData = {
  notesLastMonth: number;
  completedNotes: number;
  pendingNotes: number;
  latestNotes: Array<{
    id: string;
    content: string;
    date: string;
    time: string;
  }>;
};

export default function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Notes (Last Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.notesLastMonth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.completedNotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.pendingNotes}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Latest Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {dashboardData.latestNotes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/calendar?date=${note.date.split("T")[0]}`}
                  className="block p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <p className="font-semibold">
                    {new Date(note.date).toLocaleDateString()} - {note.time}
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: note.content.substring(0, 100) + "...",
                    }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const [notesLastMonth, completedNotes, pendingNotes, latestNotes] =
      await Promise.all([
        prisma.note.count({
          where: {
            userId: session.user.id,
            date: { gte: oneMonthAgo },
          },
        }),
        prisma.note.count({
          where: {
            userId: session.user.id,
            date: { gte: oneMonthAgo },
            status: "completed",
          },
        }),
        prisma.note.count({
          where: {
            userId: session.user.id,
            date: { gte: oneMonthAgo },
            status: "pending",
          },
        }),
        prisma.note.findMany({
          where: { userId: session.user.id },
          orderBy: { date: "desc" },
          take: 5,
          select: {
            id: true,
            content: true,
            date: true,
            time: true,
          },
        }),
      ]);

    return NextResponse.json({
      notesLastMonth,
      completedNotes,
      pendingNotes,
      latestNotes,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

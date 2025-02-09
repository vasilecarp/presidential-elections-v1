import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topCandidates = await prisma.user.findMany({
      where: {
        isCandidate: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            votesReceived: true,
          },
        },
      },
      orderBy: {
        votesReceived: {
          _count: "desc",
        },
      },
      take: 3,
    });

    return NextResponse.json(topCandidates);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching top candidates" },
      { status: 500 }
    );
  }
}

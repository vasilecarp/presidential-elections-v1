import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const candidates = await prisma.user.findMany({
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
    });

    return NextResponse.json(candidates);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching candidates" },
      { status: 500 }
    );
  }
}

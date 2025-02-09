import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { candidateId } = await req.json();

    const voter = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        votes: true,
      },
    });

    if (!voter) {
      return NextResponse.json({ message: "Voter not found" }, { status: 404 });
    }

    if (voter.votes.length > 0) {
      return NextResponse.json(
        { message: "You have already voted" },
        { status: 400 }
      );
    }

    await prisma.vote.create({
      data: {
        voterId: voter.id,
        candidateId,
      },
    });

    return NextResponse.json(
      { message: "Vote recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error recording vote" },
      { status: 500 }
    );
  }
}

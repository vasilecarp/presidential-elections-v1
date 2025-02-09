import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { isCandidate: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Error submitting candidacy" },
      { status: 500 }
    );
  }
}

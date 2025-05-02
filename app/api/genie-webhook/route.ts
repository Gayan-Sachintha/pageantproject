import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Genie Webhook Received:", data);

    if (data.state !== "CONFIRMED") {
      return NextResponse.json({ error: "Transaction not completed" }, { status: 400 });
    }

    const { localId, payAmount, customerReference } = data;

    const { ContestantId, votes, packageType } = JSON.parse(customerReference);

    const newVote = await prisma.votes.create({
      data: {
        PurchaseId: localId,
        Amount: payAmount / 100,
        ContestantId,
        Votes: votes,
        PackageType: packageType,
      },
    });

    console.log("Vote recorded successfully:", newVote);
    return NextResponse.json({ message: "Payment recorded successfully" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

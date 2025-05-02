import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ContestantId, packageType, votes, price } = body;

        const payload = {
          order: {
            appId: "83b2f4d7-f583-4500-88ed-3b6330f7a35e", 
            amount: Math.round(price * 100),
            currency: "LKR",
            customer: {
              name: "John Doe",
              email: "johndoe@example.com",
              billingEmail: "johndoe@example.com",
              billingAddress1: "123 Main St",
              billingCity: "Colombo",
              billingCountry: "LK",
              billingPostCode: "00100",
            },
            tokenizationDetails: {
              tokenize: false,
              paymentType: "UNSCHEDULED",
              recurringFrequency: "AD_HOC",
            },
            webhook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/genie-webhook`,
            redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?contestant=${ContestantId}`,
            localId: `ORDER_${Date.now()}`,
            customerReference: JSON.stringify({
              ContestantId,
              votes,
              packageType,
            }),
          },
        };
        
          


        const response = await axios.post(
            "https://stoplight.io/mocks/geniebusiness/genie-business-connect/68676462/public/v2/transactions",  
            payload,
            {
                headers: {
                    Authorization: `Bearer dummy_token`,  
                    "Content-Type": "application/json",
                },
            }
        );


        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("❌ Genie API ERROR ❌");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("No response received from Genie:", error.request);
        } else {
            console.error("Request setup error:", error.message);
        }

        return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }

}

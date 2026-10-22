import { shipments, type Shipment } from "@/lib/shipments";

export async function GET () {
    return Response.json(shipments)
}

export async function POST (req: Request) {
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return Response.json({error: 'Invalid JSON'}, {status: 400})
    }

    const {origin, destination, weightKg} = body;

    if (!origin || !destination) {
        return Response.json({error: 'origin and destination are required'}, {status: 400});
    }
    if (typeof weightKg !== 'number' || weightKg <= 0) {
        return Response.json({error: 'weightKg must be a positive number'}, {status: 400});
    }

    const shipment: Shipment = {
        id: Date.now(),
        origin,
        destination, 
        weightKg,
        status: "pending"
    };
    shipments.push(shipment);

    return Response.json(shipment, {status: 201});
}
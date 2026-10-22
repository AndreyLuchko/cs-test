import { shipments} from "@/lib/shipments";
import type {ShipmentStatus} from "@/lib/shipments"

const NEXT_STATUS: Record<ShipmentStatus, ShipmentStatus | null> = {
  pending: "in_transit",
  in_transit: "delivered",
  delivered: null,
};

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shipment = shipments.find((s) => s.id === Number(id));

  if (!shipment) {
    return Response.json({ error: "Shipment not found" }, { status: 404 });
  }

  const next = NEXT_STATUS[shipment.status];
  if (!next) {
    return Response.json({ error: "Shipment already delivered" }, { status: 400 });
  }

  shipment.status = next;
  return Response.json(shipment);
}

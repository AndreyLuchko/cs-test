import { trips } from "@/lib/trips";

// добавил Number(id) в trips.find
// добавил await перед дестркуктуризацией params
// в условии trip.status === "done" поменял статус на 400, а условие там не должно быть
// добавил условие trip.status === "planned" для задания "доделать"
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const trip = trips.find((t) => t.id === Number(id));

  if (!trip) return Response.json({ error: "Not found" }, { status: 404 });

  if (trip.status === "done") return Response.json({ error: "Already done" }, { status: 400 });
  
  if (trip.status === "planned") return Response.json({ error: "Only active trips can be completed" }, { status: 400 });

  trip.status = 'done'
  
  return Response.json(trip);
}

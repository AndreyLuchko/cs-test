import { trips } from "@/lib/trips";

// добавил строгое сравнение у методе filter
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const result = status ? trips.filter((t) => (t.status === status)) : trips;
  return Response.json(result);
}

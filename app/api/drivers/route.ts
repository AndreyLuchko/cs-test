type Driver = { id: number; name: string; hoursToday: number };

const drivers: Driver[] = [{ id: 1, name: "Ivan", hoursToday: 4 }];

export async function GET() {
  return Response.json(drivers);
}

export async function POST(req: Request) {
  // 1. ДІСТАТИ
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { name, hoursToday } = body;

  // 2. ПЕРЕВІРИТИ: name не порожній, hoursToday — число від 0 до 11
  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }
  if (typeof hoursToday !== "number" || hoursToday < 0 || hoursToday > 11) {
    return Response.json({ error: "hoursToday must be 0-11" }, { status: 400 });
  }

  // 3. ЗРОБИТИ
  const driver: Driver = { id: Date.now(), name, hoursToday };
  drivers.push(driver);

  // 4. ВІДПОВІСТИ
  return Response.json(driver, { status: 201 });
}

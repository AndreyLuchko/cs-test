import {drivers} from '@/lib/drivers'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }>}
  // другий аргумент: { params }, тип — params це Promise з { id: string }
) {
  // 1. ДІСТАТИ
  //   а) id з params (не забудь await) і перетвори рядок на число
  //   б) body через req.json() у try/catch → 400 "Invalid JSON"
  //   в) дістань hoursToday з body
  const { id } = await params

  let body

  try {
    body =await req.json()
  } catch {
    return Response.json({error: "Invalid JSON"}, {status: 400} )
  }

  const {hoursToday} = body

  // 2. ПЕРЕВІРИТИ
  //   а) hoursToday: число від 0 до 11, інакше 400
  //   б) знайди водія за id (який метод масиву повертає ОДИН елемент?)
  //   в) не знайшли → 404 "Driver not found"

  if(typeof hoursToday !== "number"|| hoursToday < 0 || hoursToday > 11) {
    return Response.json({ error: "hoursToday must be 0-11" }, { status: 400 });
  }

  const driver  = drivers.find((s) => s.id === Number(id))

  if (!driver) {
    return Response.json({error: 'Driver not found'}, {status: 404})
  }

  // 3. ЗРОБИТИ
  //   онови hoursToday у знайденого водія

  driver.hoursToday = hoursToday 

  // 4. ВІДПОВІСТИ
  //   оновлений водій, статус 200

  return Response.json(driver, { status: 200 });
}
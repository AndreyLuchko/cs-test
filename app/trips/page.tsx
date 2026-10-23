"use client";
import { useEffect, useState } from "react";
import type { Trip } from "@/lib/trips";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  // добавил в зависимость status, чтобы произошел перерендер результата после select
  useEffect(() => {
    fetch(`/api/trips?status=${status}`)
      .then((res) => res.json())
      .then((data) => setTrips(data));
  }, [status]);

  // добавил начальное значение для акумулятора 0
  const totalKm = trips.reduce((sum, t) => sum + t.km, 0);

  async function markDone(id: number) {
    const res = await fetch(`/api/trips/${id}`, { 
      method: "PATCH"
     });
    const data = await res.json();
    // не было return в условии if (!res.ok)
    if (!res.ok) {
      setError(data.error)
      return
    };
    setTrips((prev) => prev.map((t) => (t.id === id ? data : t)));
  }
// функция onClick не должна вызываться прямо при рендери на теге button
// добавил key={t.id} на li
  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="planned">Planned</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {trips.map((t) => (
          <li key={t.id}>
            {t.driver} — {t.km} km — {t.status}
            <button onClick={() => markDone(t.id)} disabled={t.status === "done"}>Done</button>    
            {/* {t.status !== "done" && <button onClick={() => markDone(t.id)}>Done</button>}  */}
          </li>
        ))}
      </ul>
      <p>Total: {totalKm} km</p>
    </div>
  );
}

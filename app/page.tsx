'use client'
import type { Shipment } from '@/lib/shipments';
import {useState, useEffect, type FormEvent} from 'react'
import DriversPage from '@/app/drivers/page'


export default function Home() {

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);



  useEffect(()=> {
    fetch('/api/shipments')
    .then((res) => {
      if(!res.ok) throw new Error (`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: Shipment[]) => setShipments(data))
    .catch((e: Error) => setError(e.message))
    .finally(() => setLoading(false))
  }, [])

  async function handleSubmit (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({origin, destination, weightKg: Number(weightKg)}),
      })
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error)
        return;
      }

      setShipments((prev) => [...prev, data]);
      setOrigin('')
      setDestination('')
      setWeightKg('')
    } catch {
      setFormError('Network error');
    } finally {
      setSubmitting(false)
    }
  } 

  async function advanceStatus(id: number) {
  setActionError(null);
  const res = await fetch(`/api/shipments/${id}`, { method: "PATCH" });
  const data = await res.json();

  if (!res.ok) {
    setActionError(data.error);
    return;
  }

  setShipments((prev) => prev.map((s) => (s.id === id ? data : s)));
}


  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  
  return (
      <main style={{padding: 24}}>
        <h1>Shipments</h1>

        <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, marginBottom: 16}}>
          <input placeholder='Origin' value={origin} onChange={(e) => setOrigin(e.target.value)} />
          <input placeholder='Destination' value={destination} onChange={(e) => setDestination(e.target.value)} />
          <input type='number' placeholder='Weight, Kg' value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          <button type='submit' disabled={submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </form>
        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <ul>
          {shipments.map((s) => (
            <li key={s.id}>
              {s.origin} → {s.destination} · {s.weightKg} kg · {s.status}{" "}
              <button onClick={() => advanceStatus(s.id)} disabled={s.status === "delivered"}>
                Next status
              </button>
            </li>
          ))}
        </ul>
        {actionError && <p style={{ color: "red" }}>{actionError}</p>}
        <DriversPage/>
      </main>
  );
}

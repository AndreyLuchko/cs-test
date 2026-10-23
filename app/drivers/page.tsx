'use client'

import type { Driver } from "@/lib/drivers";
import type { FormEvent } from "react";
import { useState, useEffect } from "react";

export default function DriversPage () {
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [hoursToday, setHoursToday] = useState('')
     const [submitting, setSubmitting] = useState(false);
     const [formError, setFormError] = useState<string | null>(null)
     const [addHourError, setAddHourError] = useState<string | null>(null)

    useEffect(() => {
       fetch('/api/drivers')
           .then((res) => {
             if(!res.ok) throw new Error (`HTTP ${res.status}`);
             return res.json();
           })
           .then((data: Driver[]) => setDrivers(data))
           .catch((e: Error) => setError(e.message))
           .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError(null)
        setSubmitting(true)

        try {
            const res = await fetch ('/api/drivers', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, hoursToday: Number(hoursToday)}),
            })
            const data = await res.json()
            
             if (!res.ok) {
                setFormError(data.error)
                return;
            }
            setDrivers((prev) => [...prev, data])
            setName('')
            setHoursToday('')

        } catch {
            setFormError('Network error');
        }  finally {
            setSubmitting(false)
        }
        
    }

    const handleAddHour = async (driver: Driver) => {
        setAddHourError(null)

        try {
             const res = await fetch(`/api/drivers/${driver.id}`, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ hoursToday: driver.hoursToday + 1}),
        })

        const data = await res.json()

        if(!res.ok) {
            setAddHourError(data.error)
            return 
        }

        setDrivers(prev => prev.map((item) => item.id === data.id ? data : item ))
        } catch  {
            setAddHourError('Network error')
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{color: 'red'}}>{error}</p>

    return (
        <section style={{margin: "0 auto", paddingTop: 20}}>
            <h1>Drivers</h1>
            <form onSubmit={handleSubmit} style={{display: "flex", gap: 10, marginBottom: 20}}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="number" placeholder="Hours Today" value={hoursToday} onChange={(e) => setHoursToday(e.target.value)}/>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Adding' : 'Add'}
                </button>
            </form>
            {formError ? <p style={{color: 'red'}}>{formError}</p> : null}
            <ul >
                {drivers && (
                        drivers.map((item) => (           
                            <li key={item.id} style={{color: item.hoursToday >= 10 ? 'red' : undefined, marginBottom: 15}}>
                                {`${item.name} - ${item.hoursToday}h`}
                                <button style={{marginLeft: 20}} onClick={() => handleAddHour(item)} disabled={item.hoursToday >= 11}>+1h</button>
                            </li>
                        ))
                    )}
            </ul>
            {addHourError && <p style={{color: 'red'}}>{addHourError}</p>}
        </section>
    )
}

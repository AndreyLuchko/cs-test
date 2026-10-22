export type ShipmentStatus = 'pending' | 'in_transit' | 'delivered';

export type Shipment  = {
    id: number;
    origin: string;
    destination: string;
    weightKg: number;
    status: ShipmentStatus;
}

export const shipments: Shipment[] = [
    {id: 1, origin: 'Chisinau', destination: 'Cluj', weightKg: 120, status: 'pending'},
]
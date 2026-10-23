export type Trip = { id: number; driver: string; km: number; status: "planned" | "active" | "done" };

export const trips: Trip[] = [
  { id: 1, driver: "Ivan", km: 320, status: "active" },
  { id: 2, driver: "Ana", km: 150, status: "planned" },
  { id: 3, driver: "Ion", km: 410, status: "done" },
];

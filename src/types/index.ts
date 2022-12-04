export type Payment = {
  id: string;
  description: string;
  amount: number;
};

export type User = { id: string; name: string; payments: Payment[] };

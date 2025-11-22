import { create } from "zustand";

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: Date;
  dueDate: Date;
  items: LineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  currency: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  categoryId?: string;
  vendor?: string;
  receipt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget?: number;
}

interface InvoiceState {
  invoices: Invoice[];
  expenses: Expense[];
  clients: Client[];
  categories: Category[];
  selectedInvoice: Invoice | null;
  view: "dashboard" | "invoices" | "expenses" | "clients" | "settings";

  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  selectInvoice: (invoice: Invoice | null) => void;

  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;

  setCategories: (categories: Category[]) => void;
  setView: (view: InvoiceState["view"]) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  expenses: [],
  clients: [],
  categories: [],
  selectedInvoice: null,
  view: "dashboard",

  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) => set((s) => ({ invoices: [invoice, ...s.invoices] })),
  updateInvoice: (id, updates) => set((s) => ({
    invoices: s.invoices.map((i) => i.id === id ? { ...i, ...updates } : i)
  })),
  deleteInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((i) => i.id !== id) })),
  selectInvoice: (invoice) => set({ selectedInvoice: invoice }),

  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((s) => ({ expenses: [expense, ...s.expenses] })),
  deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

  setClients: (clients) => set({ clients }),
  addClient: (client) => set((s) => ({ clients: [client, ...s.clients] })),

  setCategories: (categories) => set({ categories }),
  setView: (view) => set({ view }),
}));

"use client";

import { useEffect } from "react";
import { useInvoiceStore, Invoice, Expense, Client } from "@/lib/store";
import {
  LayoutDashboard, FileText, Receipt, Users, Settings, Plus, TrendingUp, TrendingDown,
  DollarSign, Clock, CheckCircle, AlertCircle, ArrowRight, Send
} from "lucide-react";

// Sample data
const sampleInvoices: Invoice[] = [
  {
    id: "1", invoiceNumber: "INV-001", clientId: "1",
    client: { id: "1", name: "Acme Corp", email: "billing@acme.com", company: "Acme Corporation" },
    status: "paid", issueDate: new Date("2024-03-01"), dueDate: new Date("2024-03-15"),
    items: [{ id: "1", description: "Web Development", quantity: 40, rate: 150, amount: 6000 }],
    subtotal: 6000, tax: 0, discount: 0, total: 6000, currency: "USD"
  },
  {
    id: "2", invoiceNumber: "INV-002", clientId: "2",
    client: { id: "2", name: "TechStart Inc", email: "pay@techstart.io" },
    status: "sent", issueDate: new Date("2024-03-10"), dueDate: new Date("2024-03-25"),
    items: [{ id: "1", description: "UI/UX Design", quantity: 20, rate: 120, amount: 2400 }],
    subtotal: 2400, tax: 0, discount: 0, total: 2400, currency: "USD"
  },
  {
    id: "3", invoiceNumber: "INV-003", clientId: "3",
    client: { id: "3", name: "Global Media", email: "ap@globalmedia.com" },
    status: "overdue", issueDate: new Date("2024-02-15"), dueDate: new Date("2024-03-01"),
    items: [{ id: "1", description: "Content Writing", quantity: 10, rate: 80, amount: 800 }],
    subtotal: 800, tax: 0, discount: 0, total: 800, currency: "USD"
  },
];

const sampleExpenses: Expense[] = [
  { id: "1", description: "Adobe Creative Cloud", amount: 54.99, date: new Date("2024-03-01"), vendor: "Adobe", categoryId: "1" },
  { id: "2", description: "AWS Hosting", amount: 127.50, date: new Date("2024-03-05"), vendor: "Amazon", categoryId: "2" },
  { id: "3", description: "Figma Pro", amount: 15, date: new Date("2024-03-10"), vendor: "Figma", categoryId: "1" },
];

export default function Home() {
  const { invoices, expenses, view, setView, setInvoices, setExpenses } = useInvoiceStore();

  useEffect(() => {
    if (invoices.length === 0) setInvoices(sampleInvoices);
    if (expenses.length === 0) setExpenses(sampleExpenses);
  }, []);

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((a, i) => a + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === "sent").reduce((a, i) => a + i.total, 0);
  const overdueAmount = invoices.filter(i => i.status === "overdue").reduce((a, i) => a + i.total, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "invoices", icon: FileText, label: "Invoices" },
    { id: "expenses", icon: Receipt, label: "Expenses" },
    { id: "clients", icon: Users, label: "Clients" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold">InvoiceFlow</h1>
            <p className="text-xs text-muted-foreground">Pro Plan</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as typeof view)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                view === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
          <p className="text-sm font-medium mb-2">Upgrade to Business</p>
          <p className="text-xs text-muted-foreground mb-3">Unlock recurring invoices, reports & more</p>
          <button className="btn btn-primary w-full text-xs py-1.5">Upgrade Now</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Revenue (Paid)", value: totalRevenue, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Pending", value: pendingAmount, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Overdue", value: overdueAmount, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
            { label: "Expenses", value: totalExpenses, icon: TrendingDown, color: "text-orange-400", bg: "bg-orange-500/10" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">${stat.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Invoices</h3>
            <button className="text-sm text-primary flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium">
                    {invoice.client?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{invoice.client?.name}</p>
                    <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${invoice.total.toLocaleString()}</p>
                  <span className={`status-badge status-${invoice.status}`}>{invoice.status}</span>
                </div>
                <button className="btn btn-ghost">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

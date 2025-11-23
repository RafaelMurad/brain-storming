"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode, Users, Receipt, DollarSign, Plus, X, Check, Clock,
  CreditCard, Utensils, MoreVertical, UserPlus, Split, Download,
  Settings, BarChart2, Home, Table2, ChevronRight, Search
} from "lucide-react";

interface Guest {
  id: string;
  name: string;
  color: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedTo: string[]; // guest ids
}

interface TableOrder {
  id: string;
  tableNumber: number;
  guests: Guest[];
  items: OrderItem[];
  status: "active" | "partial" | "paid";
  createdAt: Date;
  total: number;
  paidAmount: number;
}

const guestColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

const menuItems = [
  { id: "m1", name: "Grilled Salmon", price: 24.99, category: "Mains" },
  { id: "m2", name: "Caesar Salad", price: 12.99, category: "Starters" },
  { id: "m3", name: "Ribeye Steak", price: 34.99, category: "Mains" },
  { id: "m4", name: "Margherita Pizza", price: 16.99, category: "Mains" },
  { id: "m5", name: "Garlic Bread", price: 6.99, category: "Starters" },
  { id: "m6", name: "Tiramisu", price: 8.99, category: "Desserts" },
  { id: "m7", name: "Craft Beer", price: 7.99, category: "Drinks" },
  { id: "m8", name: "House Wine", price: 9.99, category: "Drinks" },
  { id: "m9", name: "Sparkling Water", price: 3.99, category: "Drinks" },
  { id: "m10", name: "Espresso", price: 3.49, category: "Drinks" },
];

const sampleOrders: TableOrder[] = [
  {
    id: "o1", tableNumber: 5, status: "active", createdAt: new Date(), total: 89.95, paidAmount: 0,
    guests: [
      { id: "g1", name: "Alex", color: "#10b981" },
      { id: "g2", name: "Jordan", color: "#3b82f6" },
      { id: "g3", name: "Sam", color: "#f59e0b" },
    ],
    items: [
      { id: "i1", name: "Ribeye Steak", price: 34.99, quantity: 1, assignedTo: ["g1"] },
      { id: "i2", name: "Grilled Salmon", price: 24.99, quantity: 1, assignedTo: ["g2"] },
      { id: "i3", name: "Margherita Pizza", price: 16.99, quantity: 1, assignedTo: ["g3"] },
      { id: "i4", name: "House Wine", price: 9.99, quantity: 1, assignedTo: ["g1", "g2"] },
      { id: "i5", name: "Sparkling Water", price: 3.99, quantity: 1, assignedTo: ["g3"] },
    ],
  },
  {
    id: "o2", tableNumber: 3, status: "partial", createdAt: new Date(), total: 62.96, paidAmount: 28.98,
    guests: [
      { id: "g4", name: "Taylor", color: "#8b5cf6" },
      { id: "g5", name: "Morgan", color: "#ec4899" },
    ],
    items: [
      { id: "i6", name: "Caesar Salad", price: 12.99, quantity: 2, assignedTo: ["g4", "g5"] },
      { id: "i7", name: "Craft Beer", price: 7.99, quantity: 2, assignedTo: ["g4", "g5"] },
      { id: "i8", name: "Tiramisu", price: 8.99, quantity: 2, assignedTo: ["g4", "g5"] },
    ],
  },
];

export default function Home() {
  const [orders, setOrders] = useState<TableOrder[]>(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<TableOrder | null>(sampleOrders[0]);
  const [showQR, setShowQR] = useState(false);
  const [view, setView] = useState<"tables" | "order">("order");

  const stats = {
    activeOrders: orders.filter(o => o.status === "active").length,
    totalRevenue: orders.reduce((a, o) => a + o.paidAmount, 0),
    pendingAmount: orders.reduce((a, o) => a + (o.total - o.paidAmount), 0),
    avgOrderValue: orders.length ? orders.reduce((a, o) => a + o.total, 0) / orders.length : 0,
  };

  const addGuest = () => {
    if (!selectedOrder) return;
    const newGuest: Guest = {
      id: `g${Date.now()}`,
      name: `Guest ${selectedOrder.guests.length + 1}`,
      color: guestColors[selectedOrder.guests.length % guestColors.length],
    };
    setSelectedOrder({ ...selectedOrder, guests: [...selectedOrder.guests, newGuest] });
  };

  const toggleItemAssignment = (itemId: string, guestId: string) => {
    if (!selectedOrder) return;
    setSelectedOrder({
      ...selectedOrder,
      items: selectedOrder.items.map(item => {
        if (item.id !== itemId) return item;
        const assigned = item.assignedTo.includes(guestId);
        return {
          ...item,
          assignedTo: assigned
            ? item.assignedTo.filter(id => id !== guestId)
            : [...item.assignedTo, guestId],
        };
      }),
    });
  };

  const getGuestTotal = (guestId: string) => {
    if (!selectedOrder) return 0;
    return selectedOrder.items.reduce((total, item) => {
      if (!item.assignedTo.includes(guestId)) return total;
      const share = item.price / item.assignedTo.length;
      return total + share * item.quantity;
    }, 0);
  };

  const addMenuItem = (menuItem: typeof menuItems[0]) => {
    if (!selectedOrder) return;
    const existingItem = selectedOrder.items.find(i => i.name === menuItem.name);
    if (existingItem) {
      setSelectedOrder({
        ...selectedOrder,
        items: selectedOrder.items.map(i =>
          i.id === existingItem.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
        total: selectedOrder.total + menuItem.price,
      });
    } else {
      const newItem: OrderItem = {
        id: `i${Date.now()}`,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        assignedTo: [],
      };
      setSelectedOrder({
        ...selectedOrder,
        items: [...selectedOrder.items, newItem],
        total: selectedOrder.total + menuItem.price,
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
            <Split className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">SplitPay</h1>
            <p className="text-xs text-muted-foreground">Restaurant Dashboard</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { icon: Home, label: "Dashboard", active: true },
            { icon: Table2, label: "Tables" },
            { icon: Receipt, label: "Orders" },
            { icon: BarChart2, label: "Analytics" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        {/* Stats */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Orders</span>
            <span className="font-semibold">{stats.activeOrders}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Today's Revenue</span>
            <span className="font-semibold text-primary">${stats.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pending</span>
            <span className="font-semibold text-amber-400">${stats.pendingAmount.toFixed(2)}</span>
          </div>
        </div>
      </aside>

      {/* Main Content - Order Management */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Active Tables</h2>
              <p className="text-muted-foreground">{orders.length} orders in progress</p>
            </div>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4" /> New Table
            </button>
          </div>

          {/* Table Cards */}
          <div className="table-grid mb-8">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`card text-left hover:border-primary/50 transition-colors ${selectedOrder?.id === order.id ? "border-primary" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Table2 className="w-5 h-5 text-primary" />
                    <span className="font-bold">Table {order.tableNumber}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "paid" ? "status-paid" :
                    order.status === "partial" ? "status-partial" : "status-pending"
                  }`}>
                    {order.status === "paid" ? "Paid" : order.status === "partial" ? "Partial" : "Active"}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {order.guests.map((guest) => (
                    <div key={guest.id} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: guest.color }}>
                      {guest.name[0]}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{order.items.length} items</span>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
                {order.paidAmount > 0 && (
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(order.paidAmount / order.total) * 100}%` }} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Quick Menu Add */}
          {selectedOrder && (
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Quick Add Items</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="Search menu..." className="input pl-9 w-48" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {menuItems.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addMenuItem(item)}
                    className="px-3 py-2 bg-secondary rounded-lg text-sm hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" /> {item.name} <span className="text-muted-foreground">${item.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Panel - Order Details & Assignment */}
      {selectedOrder && (
        <aside className="w-96 bg-card border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Table {selectedOrder.tableNumber}</h3>
                <p className="text-sm text-muted-foreground">{selectedOrder.items.length} items • ${selectedOrder.total.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowQR(true)} className="btn btn-secondary">
                  <QrCode className="w-4 h-4" />
                </button>
                <button className="btn btn-secondary">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedOrder.guests.map((guest) => (
                <div key={guest.id} className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: guest.color }}>
                    {guest.name[0]}
                  </div>
                  <span className="text-sm">{guest.name}</span>
                  <span className="text-xs text-muted-foreground">${getGuestTotal(guest.id).toFixed(2)}</span>
                </div>
              ))}
              <button onClick={addGuest} className="p-1.5 rounded-full bg-secondary hover:bg-accent transition-colors">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="flex-1 overflow-auto p-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">ORDER ITEMS</h4>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="p-3 bg-secondary rounded-xl">
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.quantity > 1 && <span className="text-muted-foreground ml-1">x{item.quantity}</span>}
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-2">Assign:</span>
                    {selectedOrder.guests.map((guest) => (
                      <button
                        key={guest.id}
                        onClick={() => toggleItemAssignment(item.id, guest.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          item.assignedTo.includes(guest.id)
                            ? "text-white ring-2 ring-white"
                            : "opacity-40 hover:opacity-70"
                        }`}
                        style={{ backgroundColor: guest.color }}
                      >
                        {guest.name[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Totals & Actions */}
          <div className="p-4 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">SPLIT BREAKDOWN</h4>
            <div className="space-y-2 mb-4">
              {selectedOrder.guests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: guest.color }}>
                      {guest.name[0]}
                    </div>
                    <span className="font-medium">{guest.name}</span>
                  </div>
                  <span className="font-bold">${getGuestTotal(guest.id).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary flex-1">
                <Receipt className="w-4 h-4" /> Print Bill
              </button>
              <button onClick={() => setShowQR(true)} className="btn btn-primary flex-1">
                <QrCode className="w-4 h-4" /> Show QR
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* QR Code Modal */}
      {showQR && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowQR(false)}>
          <div className="bg-card rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl">Pay Your Bill</h3>
              <button onClick={() => setShowQR(false)} className="p-2 hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl mb-6 flex items-center justify-center">
              <QRCodeSVG
                value={`https://splitpay.app/pay/${selectedOrder.id}`}
                size={200}
                level="H"
              />
            </div>
            <p className="text-center text-muted-foreground mb-6">
              Scan this QR code to pay your share of the bill
            </p>
            <div className="space-y-2 p-4 bg-secondary rounded-xl mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Table</span>
                <span className="font-semibold">{selectedOrder.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Bill</span>
                <span className="font-semibold">${selectedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-primary">${(selectedOrder.total - selectedOrder.paidAmount).toFixed(2)}</span>
              </div>
            </div>
            <button className="btn btn-secondary w-full">
              <Download className="w-4 h-4" /> Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Link2, Plus, GripVertical, ExternalLink, Eye, Settings, Palette, BarChart2, Share2, Instagram, Twitter, Youtube, Twitch, Github, Globe, Mail, Trash2, Crown, QrCode } from "lucide-react";

interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
  enabled: boolean;
}

const sampleLinks: BioLink[] = [
  { id: "1", title: "My Portfolio Website", url: "https://portfolio.com", icon: "globe", clicks: 1234, enabled: true },
  { id: "2", title: "YouTube Channel", url: "https://youtube.com/@creator", icon: "youtube", clicks: 892, enabled: true },
  { id: "3", title: "Follow on Instagram", url: "https://instagram.com/creator", icon: "instagram", clicks: 567, enabled: true },
  { id: "4", title: "Latest Blog Post", url: "https://blog.com/post", icon: "link", clicks: 234, enabled: true },
  { id: "5", title: "Book a Call", url: "https://calendly.com/creator", icon: "mail", clicks: 156, enabled: false },
];

const themes = [
  { id: "dark", name: "Midnight", bg: "#0a0a0a", card: "#1a1a1a", accent: "#ec4899" },
  { id: "gradient", name: "Sunset", bg: "linear-gradient(135deg, #1a1a2e, #16213e)", card: "#1a1a1a", accent: "#f97316" },
  { id: "minimal", name: "Clean", bg: "#ffffff", card: "#f5f5f5", accent: "#000000" },
  { id: "neon", name: "Neon", bg: "#0f0f23", card: "#1a1a2e", accent: "#00ff88" },
];

const iconMap: Record<string, React.ElementType> = { instagram: Instagram, twitter: Twitter, youtube: Youtube, twitch: Twitch, github: Github, globe: Globe, mail: Mail, link: Link2 };

export default function Home() {
  const [links, setLinks] = useState(sampleLinks);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [username] = useState("@creativecoder");
  const [view, setView] = useState<"editor" | "preview">("editor");

  const totalClicks = links.reduce((a, l) => a + l.clicks, 0);

  const toggleLink = (id: string) => setLinks(links.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
  const deleteLink = (id: string) => setLinks(links.filter(l => l.id !== id));

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">LinkBio</h1>
            <p className="text-xs text-muted-foreground">link.bio/{username.slice(1)}</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { icon: Link2, label: "Links", active: true },
            { icon: Palette, label: "Appearance" },
            { icon: BarChart2, label: "Analytics" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2"><Crown className="w-4 h-4 text-yellow-400" /> <span className="font-medium">Pro Plan</span></div>
          <p className="text-xs text-muted-foreground mb-3">Get custom domains, analytics, and more</p>
          <button className="btn btn-primary w-full text-xs py-1.5">Upgrade $5/mo</button>
        </div>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Your Links</h2>
              <p className="text-muted-foreground">{links.filter(l => l.enabled).length} active links • {totalClicks.toLocaleString()} total clicks</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary"><QrCode className="w-4 h-4" /> QR Code</button>
              <button className="btn btn-secondary"><Share2 className="w-4 h-4" /> Share</button>
              <button className="btn btn-primary"><Plus className="w-4 h-4" /> Add Link</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Views", value: "12.4K", change: "+12%" },
              { label: "Link Clicks", value: totalClicks.toLocaleString(), change: "+8%" },
              { label: "Click Rate", value: "24%", change: "+3%" },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <span className="text-xs text-green-400">{stat.change}</span>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {links.map((link) => {
              const Icon = iconMap[link.icon] || Link2;
              return (
                <div key={link.id} className={`card flex items-center gap-4 ${!link.enabled && "opacity-50"}`}>
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{link.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{link.clicks}</p>
                    <p className="text-xs text-muted-foreground">clicks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleLink(link.id)} className={`w-10 h-6 rounded-full transition-colors ${link.enabled ? "bg-primary" : "bg-secondary"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${link.enabled ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                    <button onClick={() => deleteLink(link.id)} className="p-2 hover:bg-accent rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Themes */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Themes</h3>
            <div className="grid grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-4 rounded-xl border-2 transition-all ${selectedTheme.id === theme.id ? "border-primary" : "border-border hover:border-primary/50"}`}
                  style={{ background: theme.bg }}
                >
                  <div className="w-full h-8 rounded-lg mb-2" style={{ backgroundColor: theme.card }} />
                  <div className="w-1/2 h-2 rounded" style={{ backgroundColor: theme.accent }} />
                  <p className="text-xs mt-2" style={{ color: theme.accent }}>{theme.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Preview */}
      <aside className="w-80 bg-card border-l border-border p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Preview</h3>
          <button className="btn btn-secondary text-xs"><Eye className="w-3 h-3" /> View Live</button>
        </div>
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: selectedTheme.bg }}>
          <div className="p-6 text-center">
            <div className="w-20 h-20 rounded-full gradient-pink mx-auto mb-3" />
            <h4 className="font-bold text-lg" style={{ color: selectedTheme.accent === "#000000" ? "#000" : "#fff" }}>{username}</h4>
            <p className="text-sm opacity-70" style={{ color: selectedTheme.accent === "#000000" ? "#666" : "#aaa" }}>Creative Developer & Designer</p>
            <div className="mt-6 space-y-3">
              {links.filter(l => l.enabled).map((link) => (
                <div key={link.id} className="link-card" style={{ backgroundColor: selectedTheme.card, borderColor: selectedTheme.accent + "30" }}>
                  <span style={{ color: selectedTheme.accent === "#000000" ? "#000" : "#fff" }}>{link.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

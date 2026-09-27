import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Activity, ArrowLeft, ArrowRight, BatteryFull, Check, ChevronRight, CircleCheck, Clock3, MapPin, Mic, Minus, Plus, Shield, ShieldCheck, Signal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Screen = "safe" | "watch" | "emergency" | "contacts" | "cancel";
type Contact = { id: number; name: string; relation: string };

const screenLabels: { id: Screen; label: string; subtitle: string; number: string }[] = [
  { id: "safe", label: "Safe", subtitle: "Everyday watch face", number: "01" },
  { id: "watch", label: "Safety Watch", subtitle: "Discreet monitoring", number: "02" },
  { id: "emergency", label: "Emergency", subtitle: "Alert in progress", number: "03" },
  { id: "contacts", label: "Trusted contacts", subtitle: "Setup & preferences", number: "04" },
  { id: "cancel", label: "All clear", subtitle: "False-trigger flow", number: "05" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Naari OS — SheShield Sentinel Watch Prototype" },
      { name: "description", content: "An interactive 410 × 502 watch interface prototype for SheShield Sentinel safety states, trusted contacts, and discreet cancellation." },
      { property: "og:title", content: "Naari OS — SheShield Sentinel Watch Prototype" },
      { property: "og:description", content: "Explore five glanceable safety states for the SheShield Sentinel wrist-worn device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function formatDuration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function Index() {
  const [screen, setScreen] = useState<Screen>("safe");
  const [cancelFrom, setCancelFrom] = useState<"watch" | "emergency">("watch");
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Maya R.", relation: "Sister" },
    { id: 2, name: "Arjun K.", relation: "Friend" },
  ]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("");
  const [time, setTime] = useState("09:41");
  const [date, setDate] = useState("SUNDAY, 27 SEPTEMBER");
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [escalated, setEscalated] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [confirmation, setConfirmation] = useState(false);
  const holdStart = useRef<number | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }).toUpperCase());
    };
    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (screen !== "watch") return;
    const interval = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [screen]);

  useEffect(() => {
    if (screen !== "emergency" || escalated) return;
    const interval = setInterval(() => setCountdown((value) => {
      if (value <= 1) {
        setEscalated(true);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => clearInterval(interval);
  }, [screen, escalated]);

  function goTo(next: Screen) {
    setConfirmation(false);
    setHoldProgress(0);
    if (next === "watch") setElapsed(0);
    if (next === "emergency") { setCountdown(30); setEscalated(false); }
    if (next === "cancel") setCancelFrom(screen === "emergency" ? "emergency" : "watch");
    setScreen(next);
  }

  function openCancel(from: "watch" | "emergency") {
    setCancelFrom(from);
    setHoldProgress(0);
    setScreen("cancel");
  }

  function stopHold() {
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdInterval.current = null;
    holdStart.current = null;
    setHoldProgress((value) => value >= 100 ? 100 : 0);
  }

  function beginHold() {
    if (holdStart.current !== null) return;
    holdStart.current = Date.now();
    holdInterval.current = setInterval(() => {
      if (holdStart.current === null) return;
      const progress = Math.min(100, (Date.now() - holdStart.current) / 14);
      setHoldProgress(progress);
      if (progress >= 100) {
        stopHold();
        setConfirmation(true);
        setTimeout(() => { setScreen("safe"); setConfirmation(false); }, 1100);
      }
    }, 20);
  }

  useEffect(() => () => { if (holdInterval.current) clearInterval(holdInterval.current); }, []);

  function addContact() {
    if (!newName.trim()) return;
    setContacts((current) => [...current, { id: Date.now(), name: newName.trim(), relation: newRelation.trim() || "Contact" }]);
    setNewName("");
    setNewRelation("");
    setAdding(false);
  }

  return (
    <main className="prototype-page">
      <header className="studio-header">
        <div className="studio-brand"><span className="studio-brand-mark"><Shield size={18} strokeWidth={2.2} /></span><span>Naari <span className="studio-brand-light">OS</span></span></div>
        <span className="studio-header-right">SHE SHIELD <span className="header-divider">/</span> SENTINEL</span>
      </header>

      <div className="studio-layout">
        <aside className="studio-sidebar" aria-label="Prototype screens">
          <div className="side-eyebrow">INTERFACE STUDY <span>001 / 005</span></div>
          <h1>Safety,<br /><em>within reach.</em></h1>
          <p className="side-description">A discreet safety experience, designed for a single glance.</p>
          <div className="screen-list" role="navigation" aria-label="Screens">
            {screenLabels.map((item) => (
              <Button key={item.id} variant="ghost" onClick={() => goTo(item.id)} className={`screen-nav ${screen === item.id ? "screen-nav-active" : ""}`} aria-current={screen === item.id ? "page" : undefined}>
                <span className="nav-number">{item.number}</span>
                <span className="nav-copy"><strong>{item.label}</strong><small>{item.subtitle}</small></span>
                <ChevronRight size={16} className="nav-arrow" />
              </Button>
            ))}
          </div>
          <p className="prototype-note"><span className="note-dot" /> INTERACTIVE REFERENCE · NO REAL ALERTS SENT</p>
        </aside>

        <section className="device-area" aria-label="410 by 502 pixel watch prototype">
          <div className="device-topline"><span>Naari OS / Sentinel</span><span>410 × 502 PX</span></div>
          <div className="watch-hardware">
            <div className="watch-crown" aria-hidden="true" />
            <Button variant="ghost" className="watch-side-button" title="Activate Safety Watch" aria-label="Activate Safety Watch with side button" onClick={() => goTo("watch")} />
            <div className="watch-screen">
              {screen === "safe" && (
                <div className="watch-content safe-screen">
                  <div className="watch-top"><span className="watch-os">naari<span className="watch-os-muted"> os</span></span><div className="battery-status"><BatteryFull size={18} strokeWidth={1.8} /><span>82%</span></div></div>
                  <div className="safe-main">
                    <div className="safe-date">{date}</div>
                    <div className="safe-time" aria-label={`Time ${time}`}>{time}</div>
                    <div className="safe-seconds"><span className="safe-seconds-line" />RIGHT HERE, WITH YOU</div>
                  </div>
                  <div className="safe-bottom">
                    <div className="safe-indicator"><div className="safe-indicator-icon"><ShieldCheck size={24} strokeWidth={1.8} /></div><div><strong>All is well</strong><span>Your day, uninterrupted</span></div><span className="safe-indicator-dot" /></div>
                    <Button variant="ghost" className="gesture-hint" onClick={() => goTo("watch")}><span className="gesture-line" />Hold side button<ArrowRight size={16} /></Button>
                  </div>
                </div>
              )}

              {screen === "watch" && (
                <div className="watch-content watch-active-screen">
                  <div className="watch-top"><span className="watch-os">naari<span className="watch-os-muted"> os</span></span><span className="top-mode-dot"><span /> ACTIVE</span></div>
                  <div className="watch-active-main">
                    <div className="orbit-mark"><div className="orbit-inner"><Shield size={37} strokeWidth={1.5} /></div></div>
                    <div className="state-eyebrow">DISCREETLY BY YOUR SIDE</div>
                    <h2>Safety Watch<br />Active</h2>
                    <div className="watch-stats"><div><MapPin size={20} /><span>Location sharing</span><span className="live-tag">LIVE</span></div><div><Clock3 size={20} /><span>Time active</span><strong>{formatDuration(elapsed)}</strong></div></div>
                  </div>
                  <div className="watch-actions"><Button className="watch-primary calm-button" onClick={() => openCancel("watch")}>I'm safe now <ChevronRight size={19} /></Button><Button variant="ghost" className="watch-secondary" onClick={() => goTo("emergency")}>Need help now <ArrowRight size={17} /></Button></div>
                </div>
              )}

              {screen === "emergency" && (
                <div className="watch-content emergency-screen">
                  <div className="watch-top"><span className="watch-os">naari<span className="watch-os-muted"> os</span></span><span className="emergency-top-label"><span /> EMERGENCY</span></div>
                  <div className="emergency-intro"><div className="sent-icon"><Check size={26} strokeWidth={2.5} /></div><div className="state-eyebrow">HELP IS ON ITS WAY</div><h2>Alert sent.</h2><p>{contacts.length} trusted {contacts.length === 1 ? "contact" : "contacts"} notified</p></div>
                  <div className="emergency-details"><div className="detail-row"><span className="detail-icon"><Signal size={18} /></span><span>Contacts notified</span><strong>{contacts.length > 0 ? contacts.map((contact) => contact.name).join(", ") : "None set"}</strong></div><div className="detail-row"><span className="detail-icon"><Mic size={18} /></span><span>Audio evidence</span><strong className="recording-label"><span /> Recording</strong></div></div>
                  <div className="escalation-row"><div><span className="escalation-label">{escalated ? "ESCALATION COMPLETE" : "ESCALATING IN"}</span><strong>{escalated ? "Sent" : `00:${String(countdown).padStart(2, "0")}`}</strong></div><div className="countdown-track"><span style={{ width: `${(countdown / 30) * 100}%` }} /></div></div>
                  <div className="emergency-actions"><Button className="watch-primary emergency-cancel" onClick={() => openCancel("emergency")}>Cancel false alert <ChevronRight size={19} /></Button><div className="silent-hint"><Activity size={14} /> Silent vibration confirms delivery</div></div>
                </div>
              )}

              {screen === "contacts" && (
                <div className="watch-content contacts-screen">
                  <div className="watch-top"><Button variant="ghost" className="top-back" onClick={() => goTo("safe")} aria-label="Back to watch face"><ArrowLeft size={22} /></Button><span className="watch-os">naari<span className="watch-os-muted"> os</span></span><span className="top-right-spacer" /></div>
                  <div className="contacts-heading"><span className="state-eyebrow">YOUR CIRCLE</span><h2>Trusted<br />contacts.</h2><p>The people who hear from you first.</p></div>
                  <div className="contacts-list">{contacts.length === 0 && <div className="no-contacts">No contacts added yet.</div>}{contacts.map((contact, index) => <div className="contact-row" key={contact.id}><div className="contact-avatar">{contact.name.charAt(0).toUpperCase()}</div><div className="contact-copy"><strong>{contact.name}</strong><span>{contact.relation} · {index === 0 ? "Primary" : "Trusted"}</span></div><Button variant="ghost" className="contact-remove" onClick={() => setContacts((current) => current.filter((item) => item.id !== contact.id))} title={`Remove ${contact.name}`} aria-label={`Remove ${contact.name}`}><Minus size={19} /></Button></div>)}</div>
                  {adding ? <form className="add-contact-form" onSubmit={(event) => { event.preventDefault(); addContact(); }}><input autoFocus aria-label="Contact name" placeholder="Name" value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={20} /><input aria-label="Relationship" placeholder="Relationship" value={newRelation} onChange={(event) => setNewRelation(event.target.value)} maxLength={16} /><div><Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit" disabled={!newName.trim()}>Save contact</Button></div></form> : <Button className="watch-primary add-contact" onClick={() => setAdding(true)}><Plus size={20} /> Add contact</Button>}
                  <div className="contacts-footer"><ShieldCheck size={15} /> Only you can edit your circle</div>
                </div>
              )}

              {screen === "cancel" && (
                <div className="watch-content cancel-screen">
                  <div className="watch-top"><Button variant="ghost" className="top-back" onClick={() => setScreen(cancelFrom)} aria-label="Back"><ArrowLeft size={22} /></Button><span className="watch-os">naari<span className="watch-os-muted"> os</span></span><span className="top-right-spacer" /></div>
                  <div className="cancel-center"><div className={`cancel-symbol ${confirmation ? "cancel-symbol-done" : ""}`}>{confirmation ? <Check size={40} strokeWidth={1.7} /> : <CircleCheck size={44} strokeWidth={1.4} />}</div><div className="state-eyebrow">{confirmation ? "CONFIRMED" : "FALSE TRIGGER?"}</div><h2>{confirmation ? <>All clear.</> : <>Are you<br />safe now?</>}</h2><p>{confirmation ? "Back to your day." : "Hold to stop this safety session."}</p></div>
                  <div className="cancel-actions"><Button className="hold-button" onPointerDown={beginHold} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") beginHold(); }} onKeyUp={stopHold} disabled={confirmation}><span className="hold-fill" style={{ width: `${holdProgress}%` }} /><span className="hold-button-content">{confirmation ? <Check size={20} /> : <ShieldCheck size={20} />} {confirmation ? "Session ended" : "Hold to confirm"}</span></Button><Button variant="ghost" className="watch-secondary" onClick={() => setScreen(cancelFrom)}><X size={16} /> Keep {cancelFrom === "watch" ? "watching" : "alert active"}</Button></div>
                </div>
              )}
            </div>
          </div>
          <div className="device-caption"><span className="caption-rule" /><span>{screenLabels.find((item) => item.id === screen)?.number} — {screenLabels.find((item) => item.id === screen)?.label.toUpperCase()}</span><span className="caption-rule" /></div>
        </section>
      </div>
      <footer className="studio-footer"><span>NAARI OS © 2026</span><span>DESIGNED FOR CALM. READY FOR MORE.</span></footer>
    </main>
  );
}

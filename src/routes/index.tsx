import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone, Flame, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Nordlys Van — Campervan Repair in Tromsø",
      },
      {
        name: "description",
        content:
          "24/7 mobile campervan repair in Tromsø. 12V electrical and Truma heating repairs delivered to your layby across Nord-Norge. Clear NOK pricing and an instant travel-fee calculator.",
      },
      { property: "og:title", content: "Nordlys Van — Campervan Repair in Tromsø" },
      {
        property: "og:description",
        content:
          "12V electrical and Truma heating repairs for campervans, delivered to your layby anywhere in Nord-Norge. Emergency WhatsApp, 24/7.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATSAPP_URL = "https://wa.me/47900000000";
const PHONE_URL = "tel:+4790000000";
const PHONE_DISPLAY = "+47 900 00 000";

const TRAVEL_FREE_KM = 10;
const PER_KM_RATE = 30;

const ELECTRICAL_PRICES = [
  { label: "Battery & alternator check", price: 450 },
  { label: "Wiring fault diagnosis", price: 600 },
  { label: "Fuse / relay replacement", price: 350 },
  { label: "Inverter repair", price: 900 },
];

const TRUMA_PRICES = [
  { label: "Heater diagnostics", price: 550 },
  { label: "Igniter / burner service", price: 750 },
  { label: "Flue & vent inspection", price: 400 },
  { label: "Full system service", price: 1200 },
];

function travelFee(km: number): number {
  return Math.max(0, km - TRAVEL_FREE_KM) * PER_KM_RATE;
}

function EmergencyButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-display text-lg font-semibold text-primary-foreground ring-1 ring-primary/40 shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--color-primary)_50%,transparent)]"
    >
      <span className="grid size-6 place-items-center rounded-full bg-primary-foreground/15">
        <MessageCircle className="size-4" />
      </span>
      Emergency WhatsApp
    </a>
  );
}

function PriceCard({
  title,
  tagline,
  icon,
  items,
}: {
  title: string;
  tagline: string;
  icon: React.ReactNode;
  items: { label: string; price: number }[];
}) {
  return (
    <div className="metal mt-6 rounded-2xl p-4 ring-1 ring-border">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <span className="text-primary">{icon}</span>
          {title}
        </h3>
        <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {tagline}
        </span>
      </div>
      <div className="mt-3 divide-y divide-border">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3">
            <span className="text-sm text-foreground">{item.label}</span>
            <span className="font-display font-semibold text-primary">
              NOK {item.price.toLocaleString("nb-NO")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const [km, setKm] = useState(25);
  const fee = travelFee(km);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
              N
            </span>
            <span className="font-display font-semibold tracking-tight">
              NORDLYS <span className="text-muted-foreground">VAN</span>
            </span>
          </div>
          <nav className="flex items-center gap-4 text-[13px] font-medium text-muted-foreground">
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#calculator" className="transition-colors hover:text-foreground">
              Travel
            </a>
            <a href="#contact" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="cabin-glow relative">
        <div className="mx-auto max-w-md px-5 pt-10 pb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-primary ring-1 ring-primary/30">
            <span className="size-1.5 rounded-full bg-primary" />
            On call · Tromsø
          </span>

          <h1 className="mt-5 font-display text-[52px] font-bold leading-none tracking-tight text-balance">
            NORDLYS
            <br />
            <span className="text-primary">VAN</span>
          </h1>

          <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground text-pretty">
            12V electrical and Truma heating repairs for campervans, delivered to
            your layby anywhere in Nord-Norge.
          </p>

          <div className="mt-7">
            <EmergencyButton />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Average response under 15 min, 24/7
          </p>

          {/* Trust strip */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="metal rounded-xl px-3 py-3 ring-1 ring-border">
              <p className="font-display text-xl font-semibold text-primary">12+</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">years on the road</p>
            </div>
            <div className="metal rounded-xl px-3 py-3 ring-1 ring-border">
              <p className="font-display text-xl font-semibold text-primary">80km</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">service radius</p>
            </div>
            <div className="metal rounded-xl px-3 py-3 ring-1 ring-border">
              <p className="font-display text-xl font-semibold text-primary">24/7</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">polar-night ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-card">
        <div className="mx-auto max-w-md px-5 py-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Pricing
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-balance">
            Clear rates, no surprises
          </h2>

          <PriceCard
            title="12V Electrical"
            tagline="Repairs"
            icon={<Zap className="size-5" />}
            items={ELECTRICAL_PRICES}
          />
          <PriceCard
            title="Truma Heating"
            tagline="Diagnostics"
            icon={<Flame className="size-5" />}
            items={TRUMA_PRICES}
          />
        </div>
      </section>

      {/* Distance calculator */}
      <section id="calculator" className="bg-background">
        <div className="mx-auto max-w-md px-5 py-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Travel fee
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-balance">
            Distance calculator
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Enter the distance from Tromsø centre. The first 10 km are included,
            then NOK {PER_KM_RATE} per km.
          </p>

          <div className="metal mt-6 rounded-2xl p-5 ring-1 ring-border">
            <label htmlFor="distance" className="block text-[13px] font-medium">
              Distance from Tromsø (km)
            </label>
            <input
              id="distance"
              type="number"
              inputMode="numeric"
              min={0}
              max={200}
              value={km}
              onChange={(e) => setKm(Math.min(200, Math.max(0, Number(e.target.value) || 0)))}
              className="mt-3 w-full rounded-xl bg-muted px-4 py-3 font-display text-2xl font-semibold text-foreground ring-1 ring-input outline-none focus:ring-2 focus:ring-primary/60"
            />
            <input
              type="range"
              aria-label="Distance in kilometres"
              min={0}
              max={200}
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              className="mt-4 w-full accent-primary"
            />

            <div className="mt-5 rounded-xl bg-primary/10 p-4 ring-1 ring-primary/25">
              <div className="flex items-end justify-between">
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Travel fee
                </span>
                <span className="font-display text-4xl font-bold leading-none text-primary">
                  NOK {fee.toLocaleString("nb-NO")}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                First {TRAVEL_FREE_KM} km included · NOK {PER_KM_RATE} / km after
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / contact */}
      <footer id="contact" className="border-t border-border bg-card">
        <div className="mx-auto max-w-md px-5 py-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-balance">
            On the road, we're on call
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Serving Tromsø and the surrounding Nord-Norge roads. Call or message
            for a same-day visit.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={PHONE_URL}
              className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 ring-1 ring-border"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <Phone className="size-4" />
              </span>
              <span className="text-[15px] font-medium">{PHONE_DISPLAY}</span>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 ring-1 ring-border"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <MessageCircle className="size-4" />
              </span>
              <span className="text-[15px] font-medium">WhatsApp · {PHONE_DISPLAY}</span>
            </a>
          </div>

          <p className="mt-6 pb-16 text-xs text-muted-foreground">
            Service area: Tromsø, Bardu, and the E6 corridor. Travel fees apply
            beyond {TRAVEL_FREE_KM} km.
          </p>
        </div>
      </footer>

      {/* Floating emergency CTA */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary py-3 pl-4 pr-5 font-display text-[15px] font-semibold text-primary-foreground ring-1 ring-primary/40 shadow-[0_12px_30px_-6px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
      >
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
          <MessageCircle className="size-3" />
        </span>
        Emergency WhatsApp
      </a>
    </div>
  );
}

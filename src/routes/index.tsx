// ============= Full file contents =============

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Flame, Zap, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { getRoadDistance, BASE } from "@/lib/travel.functions";
import logoUrl from "@/assets/logo-badge.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Aurora CamperService — Campervan Repair in Tromsø",
      },
      {
        name: "description",
        content:
          "24/7 mobile campervan repair in Tromsø. 12V electrical and Truma heating repairs delivered to your layby across Nord-Norge. Clear NOK pricing and an instant travel-fee calculator.",
      },
      { property: "og:title", content: "Aurora CamperService — Campervan Repair in Tromsø" },
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

const WHATSAPP_URL = "https://wa.me/4796719002";
const PHONE_URL = "tel:+4796719002";
const PHONE_DISPLAY = "+47 967 19 002";

// Official WhatsApp glyph (lucide has no brand icons).
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const TRAVEL_FREE_KM = 10;
const PER_KM_RATE = 15;

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

// Narrow column on phones, full-width canvas on desktop.
const container = "mx-auto max-w-md px-5 sm:max-w-3xl lg:max-w-6xl";

function EmergencyButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-display text-lg font-semibold text-primary-foreground ring-1 ring-primary/40 shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--color-primary)_50%,transparent)] lg:max-w-sm"
    >
      <span className="grid size-6 place-items-center rounded-full bg-primary-foreground/15">
        <WhatsAppIcon className="size-4" />
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
    <div className="metal rounded-2xl p-4 ring-1 ring-border lg:p-6">
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
          <div key={item.label} className="flex items-center justify-between py-3 lg:py-4">
            <span className="text-sm text-foreground lg:text-[15px]">{item.label}</span>
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
  const [source, setSource] = useState<"manual" | "gps">("manual");
  const [approx, setApprox] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const fee = travelFee(km);

  function locateMe() {
    if (!("geolocation" in navigator)) {
      setLocError("Your browser cannot share your location — enter the distance below instead.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await getRoadDistance({
            data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          });
          setKm(Math.min(500, Math.max(0, result.km)));
          setSource("gps");
          setApprox(result.approximate);
        } catch {
          setLocError("Could not measure the distance from your position — enter it below instead.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocError("Location was blocked — allow it in your browser, or enter the distance below.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className={`${container} flex items-center justify-between py-3`}>
          <a href="#" className="flex items-center">
            <img
              src={logoUrl}
              alt="Aurora CamperService — Tromsø"
              className="h-12 w-auto lg:h-14"
            />
          </a>
          <nav className="flex items-center gap-4 text-[13px] font-medium text-muted-foreground lg:gap-8 lg:text-sm">
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
        <div
          className={`${container} pb-14 pt-10 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20 lg:pb-24 lg:pt-20`}
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-accent ring-1 ring-accent/30">
              <span className="size-1.5 rounded-full bg-accent" />
              On call · Tromsø
            </span>

            <h1 className="mt-5 font-display text-[52px] font-bold leading-none tracking-tight text-balance lg:mt-6 lg:text-[110px]">
              NORDLYS
              <br />
              <span className="text-primary">VAN</span>
            </h1>

            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground text-pretty lg:text-lg">
              12V electrical and Truma heating repairs for campervans, delivered to
              your layby anywhere in Nord-Norge.
            </p>

            <div className="mt-7">
              <EmergencyButton />
            </div>
            <p className="mt-2 text-xs text-muted-foreground lg:text-center lg:max-w-sm">
              Average response under 15 min, 24/7
            </p>
          </div>

          {/* Trust strip */}
          <div className="mt-8 grid grid-cols-3 gap-2 lg:mt-0 lg:grid-cols-1 lg:gap-4">
            <div className="metal rounded-xl px-3 py-3 ring-1 ring-border lg:flex lg:items-baseline lg:justify-between lg:gap-6 lg:px-6 lg:py-5">
              <p className="font-display text-xl font-semibold text-accent lg:text-4xl">12+</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground lg:mt-0 lg:text-sm">
                years on the road
              </p>
            </div>
            <div className="metal rounded-xl px-3 py-3 ring-1 ring-border lg:flex lg:items-baseline lg:justify-between lg:gap-6 lg:px-6 lg:py-5">
              <p className="font-display text-xl font-semibold text-accent lg:text-4xl">80km</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground lg:mt-0 lg:text-sm">
                service radius
              </p>
            </div>
            <div className="metal rounded-xl px-3 py-3 ring-1 ring-border lg:flex lg:items-baseline lg:justify-between lg:gap-6 lg:px-6 lg:py-5">
              <p className="font-display text-xl font-semibold text-accent lg:text-4xl">24/7</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground lg:mt-0 lg:text-sm">
                polar-night ready
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-card">
        <div className={`${container} py-12 lg:py-20`}>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            Pricing
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-balance lg:text-5xl">
            Clear rates, no surprises
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-10">
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
        </div>
      </section>

      {/* Distance calculator */}
      <section id="calculator" className="bg-background">
        <div
          className={`${container} py-12 lg:grid lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-20 lg:py-20`}
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              Travel fee
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-balance lg:text-5xl">
              Distance calculator
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground text-pretty lg:mt-4 lg:text-base">
              We set out from our workshop at {BASE.label}. The first 10 km are
              included, then NOK {PER_KM_RATE} per road-kilometre.
            </p>
          </div>

          <div className="metal mt-6 rounded-2xl p-5 ring-1 ring-border lg:mt-0 lg:p-8">
            <button
              type="button"
              onClick={locateMe}
              disabled={locating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-[15px] font-semibold text-primary-foreground ring-1 ring-primary/40 transition-opacity disabled:opacity-70"
            >
              {locating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MapPin className="size-4" />
              )}
              {locating ? "Finding you…" : "Use my current location"}
            </button>
            {locError && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                {locError}
              </p>
            )}

            <div className="mt-5">
              <label htmlFor="distance" className="block text-[13px] font-medium">
                {source === "gps"
                  ? "Road distance from the workshop (km)"
                  : "Or enter distance from the workshop (km)"}
              </label>
              <input
                id="distance"
                type="number"
                inputMode="numeric"
                min={0}
                max={500}
                value={km}
                onChange={(e) => {
                  setSource("manual");
                  setApprox(false);
                  setKm(Math.min(500, Math.max(0, Number(e.target.value) || 0)));
                }}
                className="mt-3 w-full rounded-xl bg-muted px-4 py-3 font-display text-2xl font-semibold text-foreground ring-1 ring-input outline-none focus:ring-2 focus:ring-primary/60"
              />
              <input
                type="range"
                aria-label="Distance in kilometres"
                min={0}
                max={200}
                value={km}
                onChange={(e) => {
                  setSource("manual");
                  setApprox(false);
                  setKm(Number(e.target.value));
                }}
                className="mt-4 w-full accent-primary"
              />
            </div>

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
                {source === "gps" && approx && " · road distance approximated"}
              </p>
            </div>

            {source === "gps" && km > 80 && (
              <p className="mt-3 text-xs text-accent">
                That is beyond our usual 80 km service radius — message us to
                confirm we can come.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer / contact */}
      <footer id="contact" className="border-t border-border bg-card">
        <div
          className={`${container} py-12 lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:py-16`}
        >
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-balance lg:text-4xl">
              On the road, we're on call
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground text-pretty lg:text-base">
              Serving Tromsø and the surrounding Nord-Norge roads. Call or message
              for a same-day visit.
            </p>
            <p className="mt-6 pb-16 text-xs text-muted-foreground lg:pb-0">
              Service area: Tromsø, Bardu, and the E6 corridor. Travel fees apply
              beyond {TRAVEL_FREE_KM} km.
            </p>
          </div>

          <div className="mt-6 space-y-3 lg:mt-1">
            <a
              href={PHONE_URL}
              className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 ring-1 ring-border transition-colors hover:bg-secondary"
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
              className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 ring-1 ring-border transition-colors hover:bg-secondary"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <WhatsAppIcon className="size-4" />
              </span>
              <span className="text-[15px] font-medium">WhatsApp · {PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating emergency CTA */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary py-3 pl-4 pr-5 font-display text-[15px] font-semibold text-primary-foreground ring-1 ring-primary/40 shadow-[0_12px_30px_-6px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] lg:bottom-8 lg:left-auto lg:right-8 lg:translate-x-0"
      >
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
          <WhatsAppIcon className="size-3" />
        </span>
        Emergency WhatsApp
      </a>
    </div>
  );
}

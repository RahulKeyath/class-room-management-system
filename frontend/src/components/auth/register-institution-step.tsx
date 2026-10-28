import React, { memo, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Globe,
  Loader2,
  MapPin,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  type Institution,
  findInstitutionByCodeOrDomain,
  registerInstitution,
} from "@/lib/institutions";
import { InstitutionAvatar } from "./institution-step";

const INSTITUTION_TYPES: Institution["type"][] = [
  "K-12 Campus",
  "University",
  "Autonomous",
  "International School",
];

const GRADIENT_PRESETS = [
  { label: "Blue / Indigo", value: "from-blue-500 to-indigo-600" },
  { label: "Emerald / Teal", value: "from-emerald-500 to-teal-600" },
  { label: "Rose / Pink", value: "from-rose-500 to-pink-600" },
  { label: "Violet / Purple", value: "from-violet-500 to-purple-600" },
  { label: "Amber / Orange", value: "from-amber-500 to-orange-600" },
];

const CURRENT_YEAR = new Date().getFullYear();
const DOMAIN_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
const STOP_WORDS = new Set(["of", "and", "the", "for", "at", "in"]);

interface FormState {
  name: string;
  shortName: string;
  campus: string;
  city: string;
  type: Institution["type"];
  code: string;
  domain: string;
  established: string;
  gradient: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  shortName: "",
  campus: "",
  city: "",
  type: "University",
  code: "",
  domain: "",
  established: "",
  gradient: GRADIENT_PRESETS[0].value,
};

/** "Horizon Institute of Technology" → "HIT-01" */
function suggestCode(name: string): string {
  const initials = name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()))
    .slice(0, 4)
    .map((w) => w[0].toUpperCase())
    .join("");
  return initials ? `${initials}-01` : "";
}

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

/** Returns the first validation problem, or undefined when the form is good to submit. */
function validate(form: FormState): string | undefined {
  if (!form.name.trim()) return "Institution full name is required.";
  if (!form.shortName.trim()) return "Short display name is required.";
  if (!form.campus.trim() || !form.city.trim())
    return "Campus / branch and city are required.";
  if (!form.code.trim()) return "Campus code is required.";
  const domain = normalizeDomain(form.domain);
  if (!DOMAIN_PATTERN.test(domain))
    return "Enter a valid official domain (e.g. horizon.edu).";
  const year = Number(form.established);
  if (!Number.isInteger(year) || year < 1800 || year > CURRENT_YEAR)
    return `Founding year must be between 1800 and ${CURRENT_YEAR}.`;
  if (findInstitutionByCodeOrDomain(form.code))
    return `Campus code ${form.code.trim().toUpperCase()} is already registered.`;
  if (findInstitutionByCodeOrDomain(domain))
    return `The domain ${domain} is already linked to an institution.`;
  return undefined;
}

function SectionHeading({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof Building2;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="h-7 w-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">
          {title}
        </p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  className,
  ...inputProps
}: {
  id: string;
  label: string;
  className?: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        className="h-10 rounded-xl bg-card border-border/80 focus-visible:ring-accent text-sm"
        {...inputProps}
      />
    </div>
  );
}

export const RegisterInstitutionStep = memo(function RegisterInstitutionStep({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: (inst: Institution) => void;
}) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [codeEdited, setCodeEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Keep suggesting a code from the name until the admin types their own
  const handleNameChange = (name: string) =>
    setForm((prev) => ({
      ...prev,
      name,
      code: codeEdited ? prev.code : suggestCode(name),
    }));

  const preview = useMemo<Institution>(
    () => ({
      id: "preview",
      name: form.name.trim() || "Horizon Institute of Technology",
      shortName: form.shortName.trim() || "Horizon",
      code: form.code.trim().toUpperCase() || "HIT-01",
      type: form.type,
      city: form.city.trim() || "City",
      campus: form.campus.trim() || "Main Campus",
      domain: normalizeDomain(form.domain) || "horizon.edu",
      established: Number(form.established) || CURRENT_YEAR,
      motto: "",
      gradient: form.gradient,
    }),
    [form],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const problem = validate(form);
    if (problem) {
      toast.error("Please review your registration", { description: problem });
      return;
    }

    setIsSubmitting(true);
    // Brief settle so the loading state reads as intentional rather than a flicker
    window.setTimeout(() => {
      const { id: _id, ...data } = preview;
      const inst = registerInstitution({
        ...data,
        motto: `Est. ${data.established} — ${data.campus}, ${data.city}.`,
      });
      toast.success("Institution Registered!", {
        description: `${inst.name} is ready. Sign in to your new portal.`,
      });
      setIsSubmitting(false);
      onSuccess(inst);
    }, 450);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="mb-5 text-left">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-3 cursor-pointer group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Institution Search
        </button>
        <div className="flex">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2.5 border border-accent/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Institutional Onboarding • Self-Service Portal</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Register Your Institution
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set up your campus workspace, domain access, and administrative
          credentials in minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Campus Details */}
        <section className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs">
          <SectionHeading
            icon={Building2}
            title="Campus Details"
            hint="How your institution appears across the platform"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              id="reg-name"
              label="Institution Full Name"
              placeholder="e.g. Horizon Institute of Technology"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="sm:col-span-2"
              autoFocus
            />
            <Field
              id="reg-short"
              label="Short Display Name"
              placeholder="e.g. Horizon"
              value={form.shortName}
              onChange={(e) => update("shortName", e.target.value)}
              maxLength={24}
            />
            <Field
              id="reg-campus"
              label="Campus / Branch"
              placeholder="e.g. Main Campus"
              value={form.campus}
              onChange={(e) => update("campus", e.target.value)}
            />
            <Field
              id="reg-city"
              label="City"
              placeholder="e.g. Bengaluru"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="sm:col-span-2"
            />
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="text-xs font-semibold text-foreground">
              Institution Type
            </span>
            <div
              role="radiogroup"
              aria-label="Institution type"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {INSTITUTION_TYPES.map((type) => {
                const active = form.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => update("type", type)}
                    className={`h-9 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? "border-accent bg-accent/10 text-accent shadow-xs"
                        : "border-border/80 bg-card text-muted-foreground hover:text-foreground hover:border-accent/40"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Access & Domain */}
        <section className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs">
          <SectionHeading
            icon={ShieldCheck}
            title="Access & Domain"
            hint="Used for code lookup and institutional email sign-in"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field
              id="reg-code"
              label="Campus Code"
              placeholder="e.g. HIT-01"
              value={form.code}
              onChange={(e) => {
                setCodeEdited(true);
                update("code", e.target.value.toUpperCase());
              }}
              maxLength={12}
              autoComplete="off"
            />
            <Field
              id="reg-domain"
              label="Official Domain"
              placeholder="e.g. horizon.edu"
              value={form.domain}
              onChange={(e) => update("domain", e.target.value)}
              inputMode="url"
              autoComplete="off"
            />
            <Field
              id="reg-year"
              label="Founding Year"
              placeholder="e.g. 2015"
              value={form.established}
              onChange={(e) =>
                update("established", e.target.value.replace(/\D/g, ""))
              }
              inputMode="numeric"
              maxLength={4}
            />
          </div>
        </section>

        {/* Brand & Avatar Preset */}
        <section className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs">
          <SectionHeading
            icon={Palette}
            title="Brand & Avatar Preset"
            hint="Pick a signature gradient for your campus identity"
          />
          <div
            role="radiogroup"
            aria-label="Brand gradient"
            className="flex flex-wrap items-center gap-2.5 mb-4"
          >
            {GRADIENT_PRESETS.map((preset) => {
              const active = form.gradient === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={preset.label}
                  title={preset.label}
                  onClick={() => update("gradient", preset.value)}
                  className={`h-9 w-9 rounded-full bg-gradient-to-br ${preset.value} flex items-center justify-center text-white shadow-md transition-all cursor-pointer focus-visible:outline-none ${
                    active
                      ? "ring-2 ring-offset-2 ring-offset-background ring-accent scale-110"
                      : "opacity-80 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  {active && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>

          {/* Live Preview — mirrors the card on the institution search screen */}
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Live Preview
          </p>
          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-accent/40 ring-2 ring-accent/10 shadow-lg shadow-accent/5">
            <InstitutionAvatar institution={preview} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">
                {preview.name}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4.5 font-medium bg-muted/80 text-muted-foreground"
                >
                  {preview.type}
                </Badge>
                <span className="text-[11px] text-muted-foreground flex items-center gap-0.5 font-medium">
                  <MapPin className="h-2.5 w-2.5 text-muted-foreground/70" />
                  {preview.city}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground/80">
                  {preview.code}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground/80 mt-1 truncate flex items-center gap-1">
                <Globe className="h-3 w-3 shrink-0 text-accent/70" />
                {preview.domain}
              </p>
            </div>
            <div className="h-7 w-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-11 rounded-xl px-5 text-sm cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-xl px-6 text-sm font-semibold gap-2 shadow-md shadow-accent/10 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering…
              </>
            ) : (
              <>
                Register &amp; Access Portal
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
});

import React, { memo, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  Globe,
  History,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  type Institution,
  filterInstitutions,
  findInstitutionByCodeOrDomain,
  getInstitutionInitials,
} from "@/lib/institutions";

export function InstitutionAvatar({
  institution,
  size = "md",
}: {
  institution: Institution;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-9 w-9 text-xs rounded-lg",
    md: "h-11 w-11 text-sm rounded-xl",
    lg: "h-12 w-12 text-base rounded-xl",
  };
  return (
    <div
      className={`${sizes[size]} shrink-0 flex items-center justify-center bg-gradient-to-br ${institution.gradient} text-white font-bold tracking-wide shadow-md border border-white/10`}
    >
      {getInstitutionInitials(institution)}
    </div>
  );
}

export const InstitutionStep = memo(function InstitutionStep({
  remembered,
  onSelect,
  onForgetRemembered,
}: {
  remembered?: Institution;
  onSelect: (inst: Institution) => void;
  onForgetRemembered: () => void;
}) {
  const [query, setQuery] = useState("");
  const [manualCode, setManualCode] = useState("");
  const results = useMemo(() => filterInstitutions(query), [query]);

  // Curate to top 4 featured campuses when idle, or up to 6 matches on search (no scrollbar)
  const displayedInstitutions = useMemo(() => {
    if (!query.trim()) {
      return results.slice(0, 4);
    }
    return results.slice(0, 6);
  }, [results, query]);

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault();
    const match = findInstitutionByCodeOrDomain(manualCode);
    if (match) {
      onSelect(match);
    } else {
      toast.error("No institution found for that code or domain.", {
        description:
          "Check the code on your ID card or contact your school's IT office.",
      });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Header */}
      <div className="mb-5 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2.5 border border-accent/20">
          <Building2 className="h-3.5 w-3.5" />
          <span>Institutional Single Sign-On</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Find Your Institution
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Search your campus by name, city, domain, or institutional access
          code.
        </p>
      </div>

      {/* Hero Search Bar — The Centerpiece of this Screen */}
      <div className="relative mb-5">
        <div className="relative rounded-2xl bg-card border-2 border-border/80 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 shadow-md shadow-black/5 hover:border-accent/40 transition-all duration-300 group">
          <div className="flex items-center h-14 sm:h-15 px-4 gap-3">
            <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 transition-transform group-focus-within:scale-105">
              <Search className="h-4.5 w-4.5" />
            </div>
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type institution name, campus, domain, or code..."
              aria-label="Search institutions"
              className="h-full border-0 shadow-none bg-transparent text-sm sm:text-base font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0 px-0"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="h-7 w-7 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground/75 font-mono shrink-0 select-none">
                <span className="px-2 py-0.5 rounded-md bg-muted/70 border border-border/80 text-[11px] font-semibold">
                  Search
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Resume Recent Session Banner (if present and user hasn't typed a query) */}
      {remembered && !query && (
        <div className="mb-5 p-3 rounded-2xl border border-accent/40 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <InstitutionAvatar institution={remembered} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1 bg-accent/15 px-1.5 py-0.2 rounded">
                  <History className="h-2.5 w-2.5" />
                  Recent
                </span>
                <p className="text-xs font-semibold text-foreground truncate">
                  {remembered.name}
                </p>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground truncate">
                {remembered.domain} • {remembered.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onForgetRemembered}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => onSelect(remembered)}
              className="h-7 px-3 text-xs gap-1 font-semibold cursor-pointer"
            >
              Resume
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Grid Subheader */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          {query ? "Search Results" : "Featured Institutions"}
        </span>
        <span className="text-[11px] font-mono text-muted-foreground">
          {displayedInstitutions.length} shown
        </span>
      </div>

      {/* Curated Institution Grid — No Inner Scrollbar */}
      {displayedInstitutions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayedInstitutions.map((inst) => {
            const isRemembered = remembered?.id === inst.id;
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => onSelect(inst)}
                className={`group text-left flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/60 hover:ring-2 hover:ring-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer ${
                  isRemembered
                    ? "border-accent/40 bg-accent/[0.02]"
                    : "border-border/80"
                }`}
              >
                <InstitutionAvatar institution={inst} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground truncate">
                      {inst.name}
                    </p>
                    {isRemembered && (
                      <span
                        className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"
                        title="Last selected"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4.5 font-medium bg-muted/80 text-muted-foreground"
                    >
                      {inst.type}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5 font-medium">
                      <MapPin className="h-2.5 w-2.5 text-muted-foreground/70" />
                      {inst.city}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground/80 mt-1 truncate flex items-center gap-1">
                    <Globe className="h-3 w-3 shrink-0 text-accent/70" />
                    {inst.domain}
                  </p>
                </div>
                <div className="h-7 w-7 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground flex items-center justify-center shrink-0 transition-all duration-200">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center bg-card/40">
          <div className="h-10 w-10 rounded-full bg-muted/80 flex items-center justify-center mx-auto mb-2 text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No institutions match "{query}"
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try searching by city or domain, or enter your institutional code
            below.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuery("")}
            className="mt-3.5 h-8 text-xs cursor-pointer"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Manual code / domain fallback */}
      <form
        onSubmit={handleFind}
        className="mt-5 pt-3.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
      >
        <div className="min-w-0">
          <Label
            htmlFor="institution-code"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer"
          >
            <span>Have an unlisted campus code?</span>
          </Label>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Enter institutional code (e.g.{" "}
            <span className="font-mono text-accent">NGA-01</span>) or custom
            portal domain
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:max-w-xs w-full">
          <Input
            id="institution-code"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="e.g. NGA-01 or school.edu"
            className="h-9 rounded-xl bg-card border-border/80 focus-visible:ring-accent text-xs font-mono"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={!manualCode.trim()}
            className="h-9 rounded-xl px-3.5 text-xs font-medium shrink-0 cursor-pointer"
          >
            Find
          </Button>
        </div>
      </form>
    </div>
  );
});

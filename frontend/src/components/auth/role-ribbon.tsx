import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Role } from "@/lib/mock-data";
import { ROLE_OPTIONS, type RoleOption } from "./auth-constants";

/** Role selector carousel; owns its own scroll state so scrolling never re-renders the page. */
export const RoleRibbon = memo(function RoleRibbon({
  roleOptions = ROLE_OPTIONS,
  selectedRole,
  onRoleChange,
}: {
  roleOptions?: RoleOption[];
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const roleButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scrollRoleContainer = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 140;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Center the chosen role in view before notifying the parent
  const handleSelect = (role: Role) => {
    onRoleChange(role);
    const btn = roleButtonRefs.current[role];
    if (btn && scrollContainerRef.current) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const selected = roleOptions.find((r) => r.id === selectedRole);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Select Institutional Role
            </Label>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/15 text-accent">
              {roleOptions.length} Portals
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose your role to switch permissions and authentication
            credentials
          </p>
        </div>

        {/* Refined Navigation Controls in Header */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border shrink-0">
          <button
            type="button"
            onClick={() => scrollRoleContainer("left")}
            disabled={!canScrollLeft}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-card hover:text-foreground text-muted-foreground disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
            title="Scroll roles left"
            aria-label="Scroll roles left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold px-2 text-foreground/80 tabular-nums select-none">
            {Math.max(
              1,
              roleOptions.findIndex((r) => r.id === selectedRole) + 1,
            )}{" "}
            of {roleOptions.length}
          </span>
          <button
            type="button"
            onClick={() => scrollRoleContainer("right")}
            disabled={!canScrollRight}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-card hover:text-foreground text-muted-foreground disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
            title="Scroll roles right"
            aria-label="Scroll roles right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Full-Width Spacious Role Ribbon */}
      <div className="relative group">
        {/* Left subtle edge fade */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 rounded-l-2xl transition-opacity" />
        )}
        {/* Right subtle edge fade */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 rounded-r-2xl transition-opacity" />
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onWheel={(e) => {
            if (
              scrollContainerRef.current &&
              Math.abs(e.deltaX) < Math.abs(e.deltaY)
            ) {
              scrollContainerRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex gap-2.5 p-2 bg-muted/40 rounded-2xl border border-border/80 overflow-x-auto scroll-smooth scrollbar-none select-none snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {roleOptions.map((opt) => {
            const isSelected = selectedRole === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                ref={(el) => {
                  roleButtonRefs.current[opt.id] = el;
                }}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={`snap-center relative flex-1 min-w-[120px] sm:min-w-[126px] md:min-w-[132px] flex flex-col items-center justify-center py-3.5 px-3 rounded-xl sm:rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-card text-foreground shadow-sm border border-accent/40 font-semibold ring-2 ring-accent/20 scale-[1.01]"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/70 border border-transparent"
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center mb-1.5 transition-all ${
                    isSelected
                      ? "bg-accent/15 text-accent shadow-xs"
                      : "bg-muted/80 text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="leading-tight font-semibold tracking-tight whitespace-nowrap text-xs sm:text-[13px]">
                  {opt.label}
                </span>
                <span
                  className={`text-[10px] mt-1 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
                    isSelected
                      ? "bg-accent/15 text-accent font-semibold"
                      : "text-muted-foreground/75"
                  }`}
                >
                  {opt.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Role Preview & Context Banner */}
      <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-card border border-border/80 flex items-center justify-between text-xs transition-all shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <p className="text-muted-foreground truncate">
            <span className="font-semibold text-foreground">
              {selected?.label}:
            </span>{" "}
            {selected?.description}
          </p>
        </div>
        <span className="shrink-0 ml-2 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
          {selected?.badge} Access
        </span>
      </div>
    </div>
  );
});

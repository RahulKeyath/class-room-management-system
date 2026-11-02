import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { DbInstitutionalRole } from "@/lib/api";
import { getRoleIcon } from "@/modules/roles/lib/role-visuals";

/** Role selector carousel; owns its own scroll state so scrolling never re-renders the page. */
export const RoleRibbon = memo(function RoleRibbon({
  roles,
  selectedRole,
  onRoleChange,
  isLoading = false,
}: {
  roles: DbInstitutionalRole[];
  selectedRole: string;
  onRoleChange: (slug: string) => void;
  isLoading?: boolean;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const roleButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.department?.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q),
    );
  }, [roles, searchQuery]);

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
  }, [checkScroll, filteredRoles, isLoading]);

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
  const handleSelect = (slug: string) => {
    onRoleChange(slug);
    const btn = roleButtonRefs.current[slug];
    if (btn && scrollContainerRef.current) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const selectedIdx = filteredRoles.findIndex((r) => r.slug === selectedRole);
  const displayIndex = selectedIdx >= 0 ? selectedIdx + 1 : 1;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Select Institutional Role
            </Label>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/15 text-accent">
              {searchQuery
                ? `${filteredRoles.length} of ${roles.length} Portals`
                : `${roles.length} Portals`}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose your role to switch permissions and authentication
            credentials
          </p>
        </div>

        {/* Refined Navigation Controls in Header */}
        {filteredRoles.length > 0 && (
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
              {displayIndex} of {filteredRoles.length}
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
        )}
      </div>

      {/* Premium Integrated Role Search Bar */}
      {roles.length > 0 && (
        <div className="relative mb-3">
          <div className="relative flex items-center h-10 px-3 rounded-xl bg-card border border-border/80 shadow-2xs hover:border-accent/40 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 transition-all duration-200 group">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors shrink-0 mr-2.5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchQuery("");
              }}
              placeholder="Search roles by title, department, or keyword..."
              aria-label="Search institutional roles"
              className="h-full border-0 shadow-none bg-transparent text-xs placeholder:text-muted-foreground/60 focus-visible:ring-0 px-0 flex-1"
            />
            {searchQuery && (
              <div className="flex items-center gap-1.5 shrink-0 ml-2 animate-in fade-in duration-150">
                <span className="text-[10px] font-semibold tracking-tight text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  {filteredRoles.length}{" "}
                  {filteredRoles.length === 1 ? "match" : "matches"}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="h-5 w-5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear search (Esc)"
                  aria-label="Clear search filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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

        {/* Empty search state */}
        {!isLoading && roles.length > 0 && filteredRoles.length === 0 && (
          <div className="w-full py-8 px-4 text-center rounded-2xl bg-muted/20 border border-dashed border-border/80 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
            <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mb-2.5">
              <Search className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              No roles matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 mb-3 max-w-xs">
              Try searching with another keyword or check the department title
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Reset search filter
            </button>
          </div>
        )}

        {(!searchQuery || filteredRoles.length > 0) && (
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
            {isLoading &&
              Array.from({ length: 4 }, (_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 min-w-[124px] sm:min-w-[130px] md:min-w-[138px] h-[108px] sm:h-[114px] rounded-xl sm:rounded-2xl"
                />
              ))}
            {!isLoading && roles.length === 0 && (
              <p className="w-full py-6 text-center text-xs text-muted-foreground">
                No roles are available for this institution yet. Please contact
                your administrator.
              </p>
            )}
            {!isLoading &&
              filteredRoles.map((opt) => {
                const isSelected = selectedRole === opt.slug;
                const Icon = getRoleIcon(opt.iconName);
                return (
                  <button
                    key={opt.id}
                    ref={(el) => {
                      roleButtonRefs.current[opt.slug] = el;
                    }}
                    type="button"
                    onClick={() => handleSelect(opt.slug)}
                    title={`${opt.name}${opt.department ? ` • ${opt.department}` : ""}`}
                    className={`snap-center relative flex-1 min-w-[124px] sm:min-w-[130px] md:min-w-[138px] flex flex-col items-center justify-center py-3 px-2 sm:px-2.5 rounded-xl sm:rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer ${
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
                    <div className="w-full h-8 sm:h-9 flex items-center justify-center px-0.5">
                      <span className="leading-tight font-semibold tracking-tight text-xs sm:text-[13px] line-clamp-2 text-center break-words">
                        {opt.name}
                      </span>
                    </div>
                    <span
                      title={opt.department || opt.slug}
                      className={`text-[10px] mt-1 px-2 py-0.5 rounded-full transition-colors truncate max-w-full text-center ${
                        isSelected
                          ? "bg-accent/15 text-accent font-semibold"
                          : "text-muted-foreground/75"
                      }`}
                    >
                      {opt.department || opt.slug}
                    </span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Active Role Preview & Context Banner (Hidden) */}
      {/* <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-card border border-border/80 flex items-center justify-between text-xs transition-all shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <p className="text-muted-foreground truncate">
            <span className="font-semibold text-foreground">
              {selected?.name}:
            </span>{" "}
            {selected?.description}
          </p>
        </div>
        <span className="shrink-0 ml-2 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
          {selected?.department || selected?.slug} Access
        </span>
      </div> */}
    </div>
  );
});

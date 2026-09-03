import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getSchemes } from "../api/schemes";
import { SchemeCard } from "../components/schemes/SchemeCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useAsyncData } from "../hooks/useAsyncData";

export function Schemes() {
  const { data, error, loading, reload } = useAsyncData(getSchemes, "Unable to load schemes.");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");

  const categories = useMemo(
    () => Array.from(new Set((data ?? []).map((scheme) => scheme.category))).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (data ?? [])
      .filter((scheme) => scheme.is_active)
      .filter((scheme) => !category || scheme.category === category)
      .filter((scheme) => {
        if (!normalizedQuery) return true;
        return [scheme.scheme_name, scheme.category, scheme.department, scheme.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) =>
        sort === "category"
          ? a.category.localeCompare(b.category)
          : a.scheme_name.localeCompare(b.scheme_name),
      );
  }, [category, data, query, sort]);

  return (
    <div>
      <PageHeader
        description="Browse active government schemes returned by the backend schemes API."
        title="Schemes"
      />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_180px]">
        <div className="relative">
          <Input
            label="Search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, department, or category"
            value={query}
          />
          <Search className="pointer-events-none absolute right-3 top-8 h-4 w-4 text-app-muted" />
        </div>
        <Select
          label="Category"
          onChange={(event) => setCategory(event.target.value)}
          options={categories}
          placeholder="All categories"
          value={category}
        />
        <Select
          label="Sort"
          onChange={(event) => setSort(event.target.value)}
          options={["name", "category"]}
          value={sort}
        />
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : null}
      {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          title="No schemes found"
          message="Adjust your search or category filter to view available schemes."
        />
      ) : null}
      {!loading && !error && filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

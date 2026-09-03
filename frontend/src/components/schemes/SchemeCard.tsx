import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { EligibleScheme, Scheme } from "../../types/api";
import { truncate } from "../../utils/format";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface SchemeCardProps {
  scheme: Scheme | EligibleScheme;
  eligible?: boolean;
}

export function SchemeCard({ eligible = false, scheme }: SchemeCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-app-text">{scheme.scheme_name}</h3>
          <p className="mt-1 text-sm text-app-muted">{scheme.department}</p>
        </div>
        <Badge variant={eligible ? "green" : "teal"}>{eligible ? "Eligible" : scheme.category}</Badge>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-app-muted">{truncate(scheme.description)}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link to={`/schemes/${scheme.id}`}>
          <Button variant="secondary">View details</Button>
        </Link>
        {scheme.official_url ? (
          <a
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-dark"
            href={scheme.official_url}
            rel="noreferrer"
            target="_blank"
          >
            Official website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </Card>
  );
}

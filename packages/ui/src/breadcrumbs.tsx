import { ChevronLeft } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

/** RTL-aware breadcrumbs with chevron separators */
export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="ניווט" className="flex items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronLeft size={14} className="shrink-0 text-fg-subtle" aria-hidden="true" />
            )}
            {isLast || !item.href ? (
              <span className="font-medium text-fg">{item.label}</span>
            ) : (
              <a
                href={item.href}
                className="text-fg-muted hover:text-fg transition-colors"
              >
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
};

import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Action buttons or other elements */
  action?: ReactNode;
  /** Children elements */
  children?: ReactNode;
}

/**
 * PageHeader component - consistent page header across all pages
 */
export function PageHeader({
  title,
  description,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {(action || children) && (
        <div className="flex items-center gap-2">{action || children}</div>
      )}
    </div>
  );
}

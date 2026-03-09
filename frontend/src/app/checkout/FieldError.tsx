export function FieldError({
  errors,
}: {
  errors: Array<string | { message: string } | undefined>;
}) {
  const first = errors.find(Boolean);
  if (!first) return null;
  return (
    <p className="text-sm text-destructive">
      {typeof first === "string" ? first : first.message}
    </p>
  );
}

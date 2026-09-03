export function Logo({
  compact = false,
  large = false,
  sidebar = false,
}: {
  compact?: boolean;
  large?: boolean;
  sidebar?: boolean;
}) {
  return (
    <div
      className={
        large
          ? "flex items-center gap-4"
          : "flex items-center gap-2.5"
      }
    >
      <img
        src={
          compact || sidebar
            ? "/logo_withoutword.png"
            : "/logo_CIVORA.png"
        }
        alt="CIVORA"
        className={
          compact
            ? "h-9 w-9 object-contain"
            : sidebar
              ? "h-9 w-9 object-contain"
              : large
                ? "h-20 w-20 object-contain"
                : "h-10 w-10 object-contain"
        }
      />

      {!compact ? (
        <div>
          <p
            className={
              large
                ? "text-xl font-semibold leading-6 text-app-text"
                : "text-base font-semibold leading-5 text-app-text"
            }
          >
            CIVORA
          </p>

          <p
            className={
              large
                ? "mt-1 text-sm text-app-muted"
                : "text-xs text-app-muted"
            }
          >
            Intelligent Access to Government Benefits
          </p>
        </div>
      ) : null}
    </div>
  );
}
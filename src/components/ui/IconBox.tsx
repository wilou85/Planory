import type { LucideIcon } from "lucide-react";

type IconBoxProps = {
  icon: LucideIcon;
  size?: "sm" | "md";
  className?: string;
  iconClassName?: string;
};

export function IconBox({
  icon: Icon,
  size = "md",
  className = "",
  iconClassName = "",
}: IconBoxProps) {
  const box = size === "sm" ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-lg";
  const glyph = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className={`flex shrink-0 items-center justify-center border border-white/10 bg-white/5 text-slate-300 ${box} ${className}`}
    >
      <Icon className={`${glyph} ${iconClassName}`} aria-hidden />
    </span>
  );
}

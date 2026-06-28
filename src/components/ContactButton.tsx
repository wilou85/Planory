"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LanguageSwitcher";
import { getContactPath } from "@/lib/contact-nav";

type ContactButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm";
  className?: string;
  showArrow?: boolean;
};

export function ContactButton({
  children,
  variant = "primary",
  size = "default",
  className = "",
  showArrow = false,
}: ContactButtonProps) {
  const locale = useLocale();

  return (
    <Button
      href={getContactPath(locale)}
      variant={variant}
      size={size}
      className={className}
      showArrow={showArrow}
    >
      {children}
    </Button>
  );
}

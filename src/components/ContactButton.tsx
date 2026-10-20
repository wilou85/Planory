"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LanguageSwitcher";
import { trackContactClick } from "@/components/analytics/TrackedContactLink";
import type { ContactSource } from "@/lib/analytics/conversions";
import { getContactMailtoHref } from "@/lib/contact-nav";

type ContactButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm";
  className?: string;
  showArrow?: boolean;
  analyticsSource: ContactSource;
};

export function ContactButton({
  children,
  variant = "primary",
  size = "default",
  className = "",
  showArrow = false,
  analyticsSource,
}: ContactButtonProps) {
  const locale = useLocale();

  return (
    <Button
      href={getContactMailtoHref(locale)}
      variant={variant}
      size={size}
      className={className}
      showArrow={showArrow}
      onClick={() => trackContactClick(analyticsSource)}
    >
      {children}
    </Button>
  );
}

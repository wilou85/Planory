"use client";

import { Button } from "@/components/ui/Button";
import { CONTACT_PATH } from "@/lib/contact-nav";

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
  return (
    <Button
      href={CONTACT_PATH}
      variant={variant}
      size={size}
      className={className}
      showArrow={showArrow}
    >
      {children}
    </Button>
  );
}

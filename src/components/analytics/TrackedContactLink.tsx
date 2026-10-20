"use client";

import { trackAnalyticsEvent } from "@/lib/analytics/client";
import { contactClickPayload, type ContactSource } from "@/lib/analytics/conversions";

export function trackContactClick(source: ContactSource) {
  void trackAnalyticsEvent("cta_click", { payload: contactClickPayload(source) });
}

type TrackedContactLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  source: ContactSource;
};

export function TrackedContactLink({ source, onClick, ...props }: TrackedContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackContactClick(source);
        onClick?.(event);
      }}
    />
  );
}

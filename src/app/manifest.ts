import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_PAGES, SITE_URL } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "Planory — planning augmenté par IA pour équipes, ressources et environnements 24/7.",
    start_url: "/",
    display: "standalone",
    background_color: "#050a14",
    theme_color: "#050a14",
    lang: "fr",
    icons: [
      {
        src: "/planory-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

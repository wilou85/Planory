type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function normalizeJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  if (Array.isArray(data)) {
    return {
      "@context": "https://schema.org",
      "@graph": data.map((item) =>
        item["@context"] ? { ...item, "@context": undefined } : item,
      ),
    };
  }

  if (data["@context"]) {
    return data;
  }

  return {
    "@context": "https://schema.org",
    ...data,
  };
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = normalizeJsonLd(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

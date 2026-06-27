type PageContentProps = {
  children: React.ReactNode;
};

export function PageContent({ children }: PageContentProps) {
  return <div className="pt-0">{children}</div>;
}

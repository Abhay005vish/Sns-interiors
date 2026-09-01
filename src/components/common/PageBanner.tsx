export function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-secondary py-16 text-center">
      <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

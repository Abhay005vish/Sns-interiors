export function SectionTitle({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      {label && <p className="text-sm font-mono uppercase tracking-widest text-primary mb-2">{label}</p>}
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

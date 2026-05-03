export function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {children}
    </div>
  );
}

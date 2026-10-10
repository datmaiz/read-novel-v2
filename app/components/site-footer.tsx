export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground md:flex-row md:px-6">
        <p className="font-serif">Inkwell &mdash; A quiet place to read.</p>
        <p>{`© ${new Date().getFullYear()} Inkwell`}</p>
      </div>
    </footer>
  )
}

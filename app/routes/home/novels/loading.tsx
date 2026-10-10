import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NovelPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back to library
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="aspect-3/4 overflow-hidden rounded-lg border border-border bg-muted">
            <div className="flex h-full w-full items-center justify-center bg-secondary animate-pulse"></div>
          </div>

          <div className="flex flex-col gap-3">
            {
              <span className="inline-flex rounded-full bg-secondary h-3 w-20 text-xs font-medium capitalize text-secondary-foreground animate-pulse"></span>
            }
            <h1 className="text-balance font-serif text-3xl font-semibold leading-tight tracking-tight md:text-4xl h-12 w-full animate-pulse bg-secondary rounded-md"></h1>
            {
              <p className="text-muted-foreground">
                by{' '}
                <span className="h-full w-6 bg-secondary animate-pulse"></span>
              </p>
            }
            {/* genres */}
            {
              <div className="flex flex-wrap gap-1.5">
                {[0].map((g) => (
                  <span
                    key={g}
                    className="rounded-full h-6 w-12 bg-secondary animate-pulse text-xs text-accent-foreground"
                  ></span>
                ))}
              </div>
            }
            {Array.from({ length: 3 }).map((_, i) => (
              <p
                key={i}
                className="h-4 w-full bg-secondary animate-pulse rounded-md"
              ></p>
            ))}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {
                <Button asChild size="lg">
                  <Link to={`/`}>
                    Start reading
                    <BookOpen className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Chapters
          </h2>
          <ol className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {Array.from({ length: 5 })
              .fill(0)
              .map((_, i) => (
                <li key={i}>
                  <Link
                    to={`/`}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-medium text-secondary-foreground animate-pulse"></span>
                      <span className="truncate font-serif w-52 animate-pulse bg-secondary h-6 rounded-md"></span>
                    </div>
                    <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex h-4 w-16 animate-pulse bg-secondary rounded-sm"></span>
                  </Link>
                </li>
              ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

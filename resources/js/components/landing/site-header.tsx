import { useState } from 'react';

import {
    EYAD_SITE_URL,
    GITHUB_REPO_URL,
    NAV_ITEMS,
} from '@/components/landing/links';
import { LinkButton } from '@/components/landing/shared';

function BrandMark() {
    return (
        <a
            href="#home"
            className="flex items-center gap-2.5"
            aria-label="Eyad Tools — الرئيسية"
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-night-600 bg-night-850 text-gold-400">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                >
                    <path d="m4 17 6-6-6-6" />
                    <path d="M12 19h8" />
                </svg>
            </span>
            <span dir="ltr" className="text-base font-black text-cream-100">
                Eyad <span className="text-gold-400">Tools</span>
            </span>
        </a>
    );
}

function GitHubIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
    );
}

export default function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-night-700 bg-night-950/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
                <BrandMark />

                <nav
                    aria-label="التنقل الرئيسي"
                    className="hidden items-center gap-1 md:flex"
                >
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="rounded-md px-3 py-2 text-sm font-medium text-sand-400 transition-colors duration-200 hover:text-cream-100"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-sand-400 transition-colors duration-200 hover:text-cream-100"
                    >
                        <GitHubIcon className="h-4 w-4" />
                        GitHub
                    </a>
                </nav>

                <div className="hidden md:block">
                    <LinkButton
                        variant="secondary"
                        external
                        href={EYAD_SITE_URL}
                    >
                        تعرّف على إياد
                    </LinkButton>
                </div>

                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-night-600 text-cream-100 md:hidden"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-nav"
                    aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    )}
                </button>
            </div>

            {menuOpen ? (
                <nav
                    id="mobile-nav"
                    aria-label="قائمة الجوال"
                    className="border-t border-night-700 bg-night-900 md:hidden"
                >
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-sand-400 transition-colors duration-200 hover:bg-night-800 hover:text-cream-100"
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            href={GITHUB_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-sand-400 transition-colors duration-200 hover:bg-night-800 hover:text-cream-100"
                        >
                            <GitHubIcon className="h-4 w-4" />
                            GitHub
                        </a>
                        <LinkButton
                            variant="secondary"
                            external
                            href={EYAD_SITE_URL}
                            className="mt-2 self-start"
                        >
                            تعرّف على إياد
                        </LinkButton>
                    </div>
                </nav>
            ) : null}
        </header>
    );
}

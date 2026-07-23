import {
    EYAD_SITE_URL,
    GITHUB_REPO_URL,
    NAV_ITEMS,
} from '@/components/landing/links';

export default function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-night-700 bg-night-900">
            <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <p
                            dir="ltr"
                            className="text-base font-black text-cream-100"
                        >
                            Eyad <span className="text-gold-400">Tools</span>
                        </p>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-sand-400">
                            مساحة مفتوحة المصدر لأدوات مجانية ومركزة تبسّط
                            المهام المتكررة وتعالج مشكلات عملية محددة.
                        </p>
                    </div>

                    <nav aria-label="روابط التذييل">
                        <h2 className="text-sm font-bold text-cream-300">
                            التنقل
                        </h2>
                        <ul className="mt-4 space-y-2.5">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="text-sm text-sand-400 transition-colors duration-200 hover:text-cream-100"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className="text-sm font-bold text-cream-300">
                            روابط خارجية
                        </h2>
                        <ul className="mt-4 space-y-2.5">
                            <li>
                                <a
                                    href={EYAD_SITE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-sand-400 transition-colors duration-200 hover:text-cream-100"
                                >
                                    الموقع الشخصي — eyadcs.dev
                                </a>
                            </li>
                            <li>
                                <a
                                    href={GITHUB_REPO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-sand-400 transition-colors duration-200 hover:text-cream-100"
                                >
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-night-800 pt-6 text-sm text-sand-600 sm:flex-row sm:items-center">
                    <p>
                        <span dir="ltr">© {year} Eyad Tools</span> — مشروع مفتوح
                        المصدر.
                    </p>
                    <p>صُمم وطُوّر بواسطة إياد الحطامي.</p>
                </div>
            </div>
        </footer>
    );
}

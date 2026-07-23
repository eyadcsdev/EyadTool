import { GITHUB_REPO_URL } from '@/components/landing/links';
import { LinkButton } from '@/components/landing/shared';

function ManifestRow({
    label,
    value,
    valueClassName = 'text-cream-100',
}: {
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="flex">
            <span className="w-20 shrink-0 text-gold-300">{label}</span>
            <span className="me-3 text-sand-600">:</span>
            <span className={valueClassName}>{value}</span>
        </div>
    );
}

function ManifestWindow() {
    return (
        <div className="overflow-hidden rounded-xl border border-night-700 bg-night-900 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)]">
            <div
                dir="ltr"
                className="flex items-center gap-2 border-b border-night-700 bg-night-850 px-4 py-3"
            >
                <span className="h-3 w-3 rounded-full bg-clay-400/80" />
                <span className="h-3 w-3 rounded-full bg-gold-400/80" />
                <span className="h-3 w-3 rounded-full bg-moss-400/80" />
                <span className="ms-3 font-mono text-xs text-sand-600">
                    eyad@tools: ~/eyad-tools
                </span>
            </div>

            <div dir="ltr" className="space-y-1.5 p-5 font-mono text-sm">
                <div className="mb-3">
                    <span className="text-gold-400">eyad@tools</span>
                    <span className="ms-3 text-sand-600">────────────</span>
                </div>
                <ManifestRow label="Project" value="Eyad Tools" />
                <ManifestRow
                    label="Type"
                    value="مشروع مفتوح المصدر"
                    valueClassName="text-moss-300"
                />
                <ManifestRow label="License" value="MIT" />
                <ManifestRow label="Stack" value="Laravel + React" />
                <ManifestRow label="Focus" value="أدوات صغيرة لمشكلات حقيقية" />
                <ManifestRow
                    label="Status"
                    value="الأداة الأولى قيد التجهيز"
                    valueClassName="text-moss-300"
                />
                <div
                    className="mt-4 flex items-center gap-2 border-t border-night-700 pt-4"
                    aria-hidden="true"
                >
                    <span className="text-sand-600">eyad@tools ~</span>
                    <span className="text-moss-400">❯</span>
                    <span className="terminal-cursor inline-block h-4 w-2 bg-cream-100" />
                </div>
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <section id="home" className="scroll-mt-20">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-24 lg:grid-cols-2">
                <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-night-700 bg-night-900 px-3.5 py-1.5 text-xs font-bold text-moss-300">
                        <span
                            className="h-1.5 w-1.5 rounded-full bg-moss-400"
                            aria-hidden="true"
                        />
                        مشروع مفتوح المصدر
                    </p>
                    <h1 className="mt-6 text-4xl leading-snug font-black text-cream-100 sm:text-5xl sm:leading-snug">
                        أدوات صغيرة
                        <br />
                        لمشكلات <span className="text-gold-400">حقيقية</span>
                    </h1>
                    <p className="mt-6 max-w-xl font-serif text-lg leading-loose text-sand-400">
                        مساحة مفتوحة المصدر يضع فيها إياد الحطامي الأدوات التي
                        يطوّرها لتبسيط المهام المتكررة وتحويل المشكلات العملية
                        إلى حلول سهلة الاستخدام.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <LinkButton href="#about">استكشف المشروع</LinkButton>
                        <LinkButton
                            variant="secondary"
                            external
                            href={GITHUB_REPO_URL}
                        >
                            ساهم عبر GitHub
                        </LinkButton>
                    </div>
                </div>

                <ManifestWindow />
            </div>
        </section>
    );
}

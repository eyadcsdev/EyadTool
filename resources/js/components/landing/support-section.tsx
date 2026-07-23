import { GITHUB_REPO_URL } from '@/components/landing/links';
import { Reveal, Section, SectionHeading } from '@/components/landing/shared';

const cards = [
    {
        title: 'شارك الأدوات',
        description:
            'عرّف من حولك بالمشروع؛ وصول الأدوات إلى من يحتاجها هو أبسط أشكال الدعم وأكثرها أثرًا.',
        icon: (
            <>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.6 10.7 6.8-4M8.6 13.3l6.8 4" />
            </>
        ),
    },
    {
        title: 'ساهم في التطوير',
        description:
            'راجع الشيفرة، أبلغ عن المشكلات، أو اقترح تحسينات عبر المستودع البرمجي للمشروع.',
        icon: (
            <>
                <circle cx="6" cy="6" r="2.5" />
                <circle cx="6" cy="18" r="2.5" />
                <circle cx="18" cy="8" r="2.5" />
                <path d="M6 8.5v7M18 10.5c0 3.5-3.5 4.2-9 4.4" />
            </>
        ),
        action: true,
    },
    {
        title: 'دعم مالي اختياري',
        description:
            'قد يُتاح لاحقًا خيار دعم مالي اختياري تمامًا للمساعدة في استمرارية المشروع واستضافته.',
        icon: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 .9-3 2.2c0 3.1 6 1.6 6 4.8 0 1.3-1.3 2.5-3 2.5s-3-1.1-3-2.5" />
            </>
        ),
    },
] as const;

export default function SupportSection() {
    return (
        <Section>
            <Reveal>
                <SectionHeading
                    eyebrow="الدعم"
                    title="ادعم استمرار المشروع"
                    description="ينمو المشروع بمشاركة الناس؛ وكل أشكال الدعم، الصغير منها والكبير، تصنع فرقًا حقيقيًا."
                />
            </Reveal>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
                {cards.map((card) => (
                    <Reveal key={card.title}>
                        <div
                            className={
                                card.title === 'دعم مالي اختياري'
                                    ? 'flex h-full flex-col rounded-xl border border-dashed border-night-600 bg-night-900/40 p-6'
                                    : 'flex h-full flex-col rounded-xl border border-night-700 bg-night-900 p-6 transition-colors duration-200 hover:border-night-600'
                            }
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-night-700 bg-night-850 text-gold-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.7}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    {card.icon}
                                </svg>
                            </span>
                            <h3 className="mt-4 font-bold text-cream-100">
                                {card.title}
                            </h3>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-sand-400">
                                {card.description}
                            </p>
                            {'action' in card && card.action ? (
                                <a
                                    href={GITHUB_REPO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-bold text-gold-400 transition-colors duration-200 hover:text-gold-300"
                                >
                                    انتقل إلى GitHub
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 17 17 7" />
                                        <path d="M8 7h9v9" />
                                    </svg>
                                </a>
                            ) : null}
                            {card.title === 'دعم مالي اختياري' ? (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-5 cursor-not-allowed self-start rounded-lg border border-night-700 px-4 py-2 text-sm font-bold text-sand-600"
                                >
                                    سيُتاح قريبًا
                                </button>
                            ) : null}
                        </div>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
}

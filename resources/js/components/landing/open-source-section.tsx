import {
    CONTRIBUTING_GUIDE_URL,
    GITHUB_REPO_URL,
} from '@/components/landing/links';
import {
    LinkButton,
    Reveal,
    Section,
    SectionHeading,
} from '@/components/landing/shared';

const contributions = [
    'مراجعة الشيفرة المصدرية',
    'الإبلاغ عن المشكلات',
    'اقتراح ميزات جديدة',
    'تحسين التوثيق',
    'المشاركة في التطوير',
] as const;

export default function OpenSourceSection() {
    return (
        <Section id="contribute" className="max-w-6xl">
            <Reveal>
                <div className="rounded-xl border border-night-700 bg-night-900 p-8 sm:p-10">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <SectionHeading
                                eyebrow="المصدر المفتوح"
                                title="المشروع مفتوح للجميع"
                                description="تُطوَّر Eyad Tools بروح المصدر المفتوح وشفافيته. من خلال المستودع البرمجي، سيكون بإمكانك:"
                            />
                            <div className="mt-8 flex flex-wrap gap-3">
                                <LinkButton external href={GITHUB_REPO_URL}>
                                    زيارة GitHub
                                </LinkButton>
                                <LinkButton
                                    variant="secondary"
                                    external
                                    href={CONTRIBUTING_GUIDE_URL}
                                >
                                    دليل المساهمة
                                </LinkButton>
                            </div>
                        </div>

                        <ul className="grid gap-3 sm:grid-cols-2">
                            {contributions.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 rounded-lg border border-night-700 bg-night-850 px-4 py-3.5 text-sm font-medium text-cream-300"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 shrink-0 text-moss-400"
                                        aria-hidden="true"
                                    >
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Reveal>
        </Section>
    );
}

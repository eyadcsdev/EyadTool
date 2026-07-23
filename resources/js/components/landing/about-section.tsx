import { Reveal, Section, SectionHeading } from '@/components/landing/shared';

const principles = [
    {
        title: 'مفتوحة المصدر',
        description: 'شيفرة كل أداة متاحة للاطلاع والاستخدام والتعلم منها.',
        icon: (
            <path
                d="m8 6-5 6 5 6M16 6l5 6-5 6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
    },
    {
        title: 'مجانية الاستخدام',
        description: 'دون اشتراكات أو خطط مدفوعة أو قيود خفية.',
        icon: (
            <>
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
            </>
        ),
    },
    {
        title: 'سهلة ومباشرة',
        description: 'كل أداة تعالج مهمة واحدة بواجهة واضحة دون تعقيد.',
        icon: (
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
        ),
    },
    {
        title: 'قابلة للمراجعة والمساهمة',
        description:
            'يمكن مراجعة الشيفرة واقتراح التحسينات والمشاركة في التطوير.',
        icon: (
            <>
                <circle cx="6" cy="6" r="2.5" />
                <circle cx="6" cy="18" r="2.5" />
                <circle cx="18" cy="8" r="2.5" />
                <path d="M6 8.5v7M18 10.5c0 3.5-3.5 4.2-9 4.4" />
            </>
        ),
    },
] as const;

export default function AboutSection() {
    return (
        <Section id="about">
            <Reveal>
                <SectionHeading
                    eyebrow="عن المشروع"
                    title="ما هي Eyad Tools؟"
                    description="مشروع مفتوح المصدر يضم أدوات مجانية ومركزة، صُممت لمعالجة مشكلات عملية محددة دون تعقيد أو اشتراكات غير ضرورية. يمكن للجميع استخدام الأدوات، ومراجعة شيفرتها، واقتراح تحسينات، والمساهمة في تطويرها."
                />
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {principles.map((principle) => (
                    <Reveal key={principle.title}>
                        <div className="h-full rounded-xl border border-night-700 bg-night-900 p-5 transition-colors duration-200 hover:border-night-600">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-night-700 bg-night-850 text-gold-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.7}
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    {principle.icon}
                                </svg>
                            </span>
                            <h3 className="mt-4 font-bold text-cream-100">
                                {principle.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-sand-400">
                                {principle.description}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
}

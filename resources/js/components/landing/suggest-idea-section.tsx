import { SUGGEST_TOOL_URL } from '@/components/landing/links';
import { LinkButton, Reveal, Section } from '@/components/landing/shared';

export default function SuggestIdeaSection() {
    return (
        <Section className="max-w-6xl">
            <Reveal>
                <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-s-4 border-night-700 border-s-moss-400 bg-night-900 p-8 sm:p-10 lg:flex-row lg:items-center">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-black text-cream-100 sm:text-3xl">
                            لديك مشكلة متكررة؟
                        </h2>
                        <p className="mt-4 font-serif text-lg leading-loose text-sand-400">
                            إذا كنت تنفذ مهمة مملة أو متكررة، شارك الفكرة. قد
                            تتحول إلى إحدى الأدوات القادمة في المنصة.
                        </p>
                    </div>
                    <LinkButton
                        external
                        href={SUGGEST_TOOL_URL}
                        className="shrink-0"
                    >
                        اقترح أداة
                    </LinkButton>
                </div>
            </Reveal>
        </Section>
    );
}

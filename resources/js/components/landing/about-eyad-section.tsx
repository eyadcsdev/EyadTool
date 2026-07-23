import { EYAD_SITE_URL, GITHUB_REPO_URL } from '@/components/landing/links';
import {
    LinkButton,
    Reveal,
    Section,
    SectionHeading,
} from '@/components/landing/shared';

export default function AboutEyadSection() {
    return (
        <Section className="max-w-6xl">
            <Reveal>
                <div className="grid items-center gap-10 rounded-xl border border-night-700 bg-night-900 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                        <SectionHeading
                            eyebrow="المطوّر"
                            title="من يقف خلف المشروع؟"
                            description="أنا إياد الحطامي، مطوّر ومهتم ببناء حلول تقنية عملية تساعد على تبسيط الأعمال اليومية وتحويل المشكلات المتكررة إلى أدوات قابلة للاستخدام."
                        />
                        <div className="mt-8 flex flex-wrap gap-3">
                            <LinkButton external href={EYAD_SITE_URL}>
                                تعرّف على إياد
                            </LinkButton>
                            <LinkButton
                                variant="secondary"
                                external
                                href={GITHUB_REPO_URL}
                            >
                                GitHub
                            </LinkButton>
                        </div>
                    </div>

                    <div
                        dir="ltr"
                        className="flex items-center justify-center rounded-xl border border-night-700 bg-night-850 px-6 py-10 font-mono text-sm sm:text-base"
                        aria-hidden="true"
                    >
                        <span className="text-gold-400">eyad@tools</span>
                        <span className="mx-2 text-sand-600">~</span>
                        <span className="text-moss-400">❯</span>
                        <span className="terminal-cursor ms-2 inline-block h-4 w-2 bg-cream-100" />
                    </div>
                </div>
            </Reveal>
        </Section>
    );
}

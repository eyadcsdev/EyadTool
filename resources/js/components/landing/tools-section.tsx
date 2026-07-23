import { KASHF_JAHIZ_URL } from '@/components/landing/links';
import {
    LinkButton,
    Reveal,
    Section,
    SectionHeading,
} from '@/components/landing/shared';

export default function ToolsSection() {
    return (
        <Section id="tools">
            <Reveal>
                <SectionHeading eyebrow="مكتبة الأدوات" title="الأدوات" />
            </Reveal>

            <Reveal className="mt-10">
                <div className="rounded-xl border border-night-700 bg-night-900 transition-colors duration-200 hover:border-night-600">
                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-night-700 bg-night-850 text-gold-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.7}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                >
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                            </span>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-black text-cream-100">
                                        كشف جاهز
                                    </h3>
                                    <span className="inline-flex items-center rounded-full border border-moss-400/30 bg-moss-400/10 px-2.5 py-0.5 text-xs font-bold text-moss-300">
                                        متاحة
                                    </span>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-sand-400">
                                    تجهيز كشوف درجات مدرسي اللغة الإنجليزية في
                                    مركز اللغات والترجمة، وإخراج نسخة نهائية
                                    بالقيم الثابتة دون معادلات الحساب المؤقتة.
                                </p>
                                <span className="mt-3 inline-flex items-center rounded-full border border-night-700 bg-night-850 px-2.5 py-0.5 text-xs font-medium text-sand-400">
                                    التعليم
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <LinkButton href={KASHF_JAHIZ_URL}>
                                استخدام الأداة
                            </LinkButton>
                            <LinkButton
                                variant="secondary"
                                href={KASHF_JAHIZ_URL}
                            >
                                التعرّف على الأداة
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </Reveal>
        </Section>
    );
}

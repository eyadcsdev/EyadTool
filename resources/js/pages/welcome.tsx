import { Head } from '@inertiajs/react';

import AboutEyadSection from '@/components/landing/about-eyad-section';
import AboutSection from '@/components/landing/about-section';
import Hero from '@/components/landing/hero';
import OpenSourceSection from '@/components/landing/open-source-section';
import SiteFooter from '@/components/landing/site-footer';
import SiteHeader from '@/components/landing/site-header';
import SuggestIdeaSection from '@/components/landing/suggest-idea-section';
import SupportSection from '@/components/landing/support-section';
import ToolsSection from '@/components/landing/tools-section';

export default function Welcome() {
    return (
        <>
            <Head title="Eyad Tools | أدوات مفتوحة المصدر لمشكلات عملية">
                <meta
                    name="description"
                    content="منصة إياد الحطامي للأدوات المجانية ومفتوحة المصدر التي تبسّط المهام المتكررة وتقدم حلولًا عملية سهلة الاستخدام."
                />
            </Head>

            <div className="min-h-screen bg-night-950 font-sans text-cream-100">
                <SiteHeader />
                <main>
                    <Hero />
                    <AboutSection />
                    <ToolsSection />
                    <OpenSourceSection />
                    <SuggestIdeaSection />
                    <SupportSection />
                    <AboutEyadSection />
                </main>
                <SiteFooter />
            </div>
        </>
    );
}

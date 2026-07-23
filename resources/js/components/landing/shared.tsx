import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export function Section({
    id,
    className,
    children,
}: {
    id?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-20">
            <div
                className={cn(
                    'mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24',
                    className,
                )}
            >
                {children}
            </div>
        </section>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="max-w-2xl">
            {eyebrow ? (
                <p className="mb-3 text-sm font-bold text-gold-400">
                    {eyebrow}
                </p>
            ) : null}
            <h2 className="text-3xl font-black text-cream-100 sm:text-4xl">
                {title}
            </h2>
            {description ? (
                <p className="mt-5 font-serif text-lg leading-loose text-sand-400">
                    {description}
                </p>
            ) : null}
        </div>
    );
}

const linkButtonVariants = {
    primary:
        'border-gold-400 bg-gold-400 text-night-950 hover:border-gold-300 hover:bg-gold-300',
    secondary:
        'border-night-600 bg-night-850 text-cream-100 hover:border-gold-400/60 hover:text-gold-300',
    ghost: 'border-transparent text-sand-400 hover:text-cream-100',
} as const;

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: keyof typeof linkButtonVariants;
    external?: boolean;
};

export function LinkButton({
    variant = 'primary',
    external = false,
    className,
    children,
    ...rest
}: LinkButtonProps) {
    return (
        <a
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-bold transition-colors duration-200',
                linkButtonVariants[variant],
                className,
            )}
            {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            {...rest}
        >
            {children}
            {external ? (
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
            ) : null}
        </a>
    );
}

export function Reveal({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(
        () =>
            typeof window === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            !('IntersectionObserver' in window),
    );

    useEffect(() => {
        const element = ref.current;

        if (visible || !element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [visible]);

    return (
        <div
            ref={ref}
            data-visible={visible}
            className={cn('reveal', className)}
        >
            {children}
        </div>
    );
}

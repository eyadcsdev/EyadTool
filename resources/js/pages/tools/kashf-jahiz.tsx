import { Head } from '@inertiajs/react';
import { useRef, useState } from 'react';

import { Reveal } from '@/components/landing/shared';
import SiteFooter from '@/components/landing/site-footer';
import { cn } from '@/lib/utils';

type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

export default function KashfJahiz({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [state, setState] = useState<ProcessingState>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    function handleFile(file: File) {
        const lower = file.name.toLowerCase();

        if (!lower.endsWith('.xlsx')) {
            setErrorMessage('يرجى رفع ملف بصيغة XLSX.');
            setState('error');

            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage(
                'يتجاوز حجم الملف الحد المسموح به وهو 10 ميجابايت.',
            );
            setState('error');

            return;
        }

        setSelectedFile(file);
        setState('idle');
        setErrorMessage('');
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];

        if (file) {
            handleFile(file);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (file) {
            handleFile(file);
        }
    }

    async function handleProcess() {
        if (!selectedFile) {
            return;
        }

        setState('processing');
        setErrorMessage('');

        try {
            const formData = new FormData();

            formData.append('file', selectedFile);

            const response = await fetch('/tools/kashf-jahiz', {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.head.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement | null
                        )?.content ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });

            if (response.ok) {
                setState('success');

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');

                a.href = url;
                a.download =
                    selectedFile.name.replace(/\.xlsx$/i, '') +
                    '-كشف-جاهز.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                const json = await response.json().catch(() => ({
                    error: 'حدث خطأ أثناء تجهيز الملف. لم يُجرَ أي تعديل على ملفك الأصلي.',
                }));

                setErrorMessage(
                    json.error ??
                        'حدث خطأ أثناء تجهيز الملف. لم يُجرَ أي تعديل على ملفك الأصلي.',
                );
                setState('error');
            }
        } catch {
            setErrorMessage(
                'حدث خطأ أثناء تجهيز الملف. لم يُجرَ أي تعديل على ملفك الأصلي.',
            );
            setState('error');
        }
    }

    function resetForm() {
        setSelectedFile(null);
        setState('idle');
        setErrorMessage('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const formatsLabels = ['XLS', 'CSV', 'XLSM', 'محمي بكلمة مرور'];

    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <meta name="csrf-token" content="" />
            </Head>

            <div className="min-h-screen bg-night-950 font-sans text-cream-100">
                {/* Tool header */}
                <header className="sticky top-0 z-50 border-b border-night-700 bg-night-950/95 backdrop-blur-sm">
                    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
                        <a
                            href="/"
                            className="flex items-center gap-2.5"
                            aria-label="العودة إلى الصفحة الرئيسية"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-night-600 bg-night-850 text-gold-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <path d="m9 17-5-5 5-5" />
                                    <path d="M20 18V7a1 1 0 0 0-1-1H7" />
                                </svg>
                            </span>
                            <span
                                dir="ltr"
                                className="text-base font-black text-cream-100"
                            >
                                Eyad{' '}
                                <span className="text-gold-400">Tools</span>
                            </span>
                        </a>
                        <p className="text-sm font-medium text-sand-400">
                            كشف جاهز
                        </p>
                    </div>
                </header>

                <main>
                    {/* Hero */}
                    <section className="scroll-mt-20">
                        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
                            <Reveal>
                                <p className="inline-flex items-center gap-2 rounded-full border border-night-700 bg-night-900 px-3.5 py-1.5 text-xs font-bold text-moss-300">
                                    <span
                                        className="h-1.5 w-1.5 rounded-full bg-moss-400"
                                        aria-hidden="true"
                                    />
                                    أداة مجانية — التعليم
                                </p>
                                <h1 className="mt-6 text-4xl leading-snug font-black text-cream-100 sm:text-5xl sm:leading-snug">
                                    كشف{' '}
                                    <span className="text-gold-400">جاهز</span>
                                </h1>
                                <p className="mt-4 text-xl font-bold text-cream-300">
                                    جهّز كشف الدرجات النهائي خلال خطوات بسيطة
                                </p>
                                <p className="mt-5 max-w-2xl font-serif text-lg leading-loose text-sand-400">
                                    أداة مخصصة لمدرسي اللغة الإنجليزية في مركز
                                    اللغات والترجمة. تحتفظ بالدرجات النهائية
                                    المحسوبة، وتحولها إلى قيم ثابتة، وتحذف أعمدة
                                    الاختبارات المستخدمة في الحساب، ثم تعيد ملف
                                    Excel جاهزًا للتسليم.
                                </p>
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <a
                                        href="#upload"
                                        className="inline-flex items-center gap-2 rounded-lg border border-gold-400 bg-gold-400 px-5 py-2.5 text-sm font-bold text-night-950 transition-colors duration-200 hover:border-gold-300 hover:bg-gold-300"
                                    >
                                        ابدأ تجهيز الكشف
                                    </a>
                                    <a
                                        href="#how-it-works"
                                        className="inline-flex items-center gap-2 rounded-lg border border-night-600 bg-night-850 px-5 py-2.5 text-sm font-bold text-cream-100 transition-colors duration-200 hover:border-gold-400/60 hover:text-gold-300"
                                    >
                                        كيف تعمل الأداة؟
                                    </a>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* Who is this for */}
                    <section className="scroll-mt-20">
                        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
                            <Reveal>
                                <div className="rounded-xl border border-s-4 border-night-700 border-s-gold-400 bg-night-900 p-8 sm:p-10">
                                    <h2 className="text-2xl font-black text-cream-100 sm:text-3xl">
                                        لمن صُممت الأداة؟
                                    </h2>
                                    <p className="mt-4 font-serif text-lg leading-loose text-sand-400">
                                        صُممت كشف جاهز بصورة أساسية لمدرسي اللغة
                                        الإنجليزية في مركز اللغات والترجمة الذين
                                        يستخدمون نموذج كشف الدرجات المعتمد،
                                        ويحتاجون إلى إخراج نسخة نهائية خالية من
                                        معادلات الجمع والتقريب وأعمدة الحساب
                                        المؤقتة.
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* What the tool does */}
                    <section id="how-it-works" className="scroll-mt-20">
                        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
                            <Reveal>
                                <h2 className="text-2xl font-black text-cream-100 sm:text-3xl">
                                    ما الذي تفعله الأداة؟
                                </h2>
                            </Reveal>
                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                {[
                                    'تقرأ القيم الحالية المحسوبة في كشف الدرجات.',
                                    'تحوّل خلايا المعادلات إلى قيم رقمية ثابتة.',
                                    'تحذف أعمدة الاختبارات المؤقتة المستخدمة في حساب درجة الاختبار النهائية.',
                                    'تحتفظ بعمود الاختبار النهائي بعد تثبيت قيمه.',
                                    'تحتفظ بعمود الدرجة الكلية بعد تثبيت قيمه.',
                                    'تحافظ على أسماء الطلاب وباقي أعمدة الدرجات دون تغيير.',
                                    'تُنشئ ملفًا جديدًا دون أي تعديل على الملف الأصلي.',
                                ].map((item) => (
                                    <Reveal key={item}>
                                        <div className="flex items-start gap-3 rounded-lg border border-night-700 bg-night-900 p-4">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mt-0.5 h-5 w-5 shrink-0 text-moss-400"
                                                aria-hidden="true"
                                            >
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                            <p className="text-sm leading-relaxed text-cream-300">
                                                {item}
                                            </p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Before / After comparison */}
                    <section className="scroll-mt-20">
                        <div className="mx-auto w-full max-w-none px-5 py-16 sm:px-8 sm:py-24">
                            <Reveal>
                                <h2 className="text-2xl font-black text-cream-100 sm:text-3xl">
                                    قبل التجهيز وبعد التجهيز
                                </h2>
                                <p className="mt-4 max-w-3xl font-serif text-lg leading-loose text-sand-400">
                                    تظهر المقارنة أدناه كيف تحذف الأداة أعمدة
                                    الاختبارات الفردية مع الاحتفاظ بنتيجة
                                    الاختبار النهائية والدرجة الكلية كقيم ثابتة،
                                    دون أي تعديل على باقي الأعمدة أو بيانات
                                    الطلاب.
                                </p>
                            </Reveal>

                            <div className="mt-10 grid items-start gap-8 xl:grid-cols-2">
                                {/* Before */}
                                <Reveal>
                                    <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-sand-600">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-clay-400/40 bg-night-800 text-xs text-clay-400">
                                            ١
                                        </span>
                                        قبل التجهيز
                                    </h3>

                                    <div className="overflow-x-auto rounded-xl border border-night-700 bg-night-900">
                                        <table className="w-full min-w-[720px] text-xs sm:text-sm">
                                            <thead>
                                                <tr className="border-b border-night-700 bg-night-850">
                                                    <th className="px-3 py-2.5 text-start font-bold text-cream-100">
                                                        اسم الطالب
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-clay-400">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            Quiz1 5
                                                            <span className="text-[10px] font-normal text-clay-400/60">
                                                                {' '}
                                                                ستُحذف
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-clay-400">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            Quiz2 5
                                                            <span className="text-[10px] font-normal text-clay-400/60">
                                                                {' '}
                                                                ستُحذف
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-clay-400">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            Quiz3 5
                                                            <span className="text-[10px] font-normal text-clay-400/60">
                                                                {' '}
                                                                ستُحذف
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-gold-400">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            Quiz 10%
                                                            <span className="text-[10px] font-normal text-gold-400/60">
                                                                {' '}
                                                                معادلة
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-cream-300">
                                                        <span className="whitespace-nowrap">
                                                            Atted 5%
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-cream-300">
                                                        <span className="whitespace-nowrap">
                                                            mid 15%
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-cream-300">
                                                        <span className="whitespace-nowrap">
                                                            final 30%
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-gold-400">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            100
                                                            <span className="text-[10px] font-normal text-gold-400/60">
                                                                {' '}
                                                                معادلة
                                                            </span>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    {
                                                        name: 'فاطمة حسن عبدالله',
                                                        q1: 5,
                                                        q2: 4,
                                                        q3: 3,
                                                        qf: '=ROUND((SUM(C:E)/3)*2,0)',
                                                        qfv: '8.0',
                                                        att: 4,
                                                        mid: 13,
                                                        fin: 19,
                                                        tot: '=SUM(F:N)',
                                                        totv: '69.0',
                                                    },
                                                    {
                                                        name: 'خالد إبراهيم يوسف',
                                                        q1: 4,
                                                        q2: 5,
                                                        q3: 4,
                                                        qf: '=ROUND((SUM(C:E)/3)*2,0)',
                                                        qfv: '8.7',
                                                        att: 5,
                                                        mid: 15,
                                                        fin: 30,
                                                        tot: '=SUM(F:N)',
                                                        totv: '97.0',
                                                    },
                                                    {
                                                        name: 'نورا أحمد السيد',
                                                        q1: 5,
                                                        q2: 5,
                                                        q3: 5,
                                                        qf: '=ROUND((SUM(C:E)/3)*2,0)',
                                                        qfv: '10.0',
                                                        att: 5,
                                                        mid: 14,
                                                        fin: 28,
                                                        tot: '=SUM(F:N)',
                                                        totv: '96.0',
                                                    },
                                                ].map((s) => (
                                                    <tr
                                                        key={s.name}
                                                        className="border-b border-night-800 last:border-0"
                                                    >
                                                        <td className="px-3 py-2.5 text-cream-100">
                                                            {s.name}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-clay-400/70 line-through decoration-clay-400/40">
                                                            {s.q1}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-clay-400/70 line-through decoration-clay-400/40">
                                                            {s.q2}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-clay-400/70 line-through decoration-clay-400/40">
                                                            {s.q3}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            <span className="rounded bg-gold-400/10 px-1.5 py-0.5 font-mono text-[10px] leading-relaxed text-gold-300 sm:text-xs">
                                                                {s.qf}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-cream-300">
                                                            {s.att}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-cream-300">
                                                            {s.mid}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-cream-300">
                                                            {s.fin}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            <span className="rounded bg-gold-400/10 px-1.5 py-0.5 font-mono text-[10px] leading-relaxed text-gold-300 sm:text-xs">
                                                                {s.tot}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-sand-600">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-clay-400/60" />
                                            أعمدة مؤقتة تُحذف
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-gold-400/60" />
                                            خلايا تحتوي معادلات
                                        </span>
                                    </div>
                                </Reveal>

                                {/* After */}
                                <Reveal>
                                    <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-moss-300">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-moss-400/40 bg-night-800 text-xs text-moss-400">
                                            ٢
                                        </span>
                                        بعد التجهيز
                                    </h3>

                                    <div className="overflow-x-auto rounded-xl border border-moss-400/30 bg-night-900">
                                        <table className="w-full min-w-[540px] text-xs sm:text-sm">
                                            <thead>
                                                <tr className="border-b border-night-700 bg-night-850">
                                                    <th className="px-3 py-2.5 text-start font-bold text-cream-100">
                                                        اسم الطالب
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-moss-300">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            Quiz 10%
                                                            <span className="text-[10px] font-normal text-moss-300/60">
                                                                {' '}
                                                                قيمة ثابتة
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-cream-300">
                                                        <span className="whitespace-nowrap">
                                                            Atted 5%
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-cream-300">
                                                        <span className="whitespace-nowrap">
                                                            mid 15%
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-cream-300">
                                                        <span className="whitespace-nowrap">
                                                            final 30%
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center font-bold text-moss-300">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            100
                                                            <span className="text-[10px] font-normal text-moss-300/60">
                                                                {' '}
                                                                قيمة ثابتة
                                                            </span>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    {
                                                        name: 'فاطمة حسن عبدالله',
                                                        qf: '8.0',
                                                        att: 4,
                                                        mid: 13,
                                                        fin: 19,
                                                        tot: '69.0',
                                                    },
                                                    {
                                                        name: 'خالد إبراهيم يوسف',
                                                        qf: '8.7',
                                                        att: 5,
                                                        mid: 15,
                                                        fin: 30,
                                                        tot: '97.0',
                                                    },
                                                    {
                                                        name: 'نورا أحمد السيد',
                                                        qf: '10.0',
                                                        att: 5,
                                                        mid: 14,
                                                        fin: 28,
                                                        tot: '96.0',
                                                    },
                                                ].map((s) => (
                                                    <tr
                                                        key={s.name}
                                                        className="border-b border-night-800 last:border-0"
                                                    >
                                                        <td className="px-3 py-2.5 text-cream-100">
                                                            {s.name}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            <span className="rounded bg-moss-400/10 px-2 py-0.5 font-mono font-bold text-moss-300">
                                                                {s.qf}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-cream-300">
                                                            {s.att}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-cream-300">
                                                            {s.mid}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center text-cream-300">
                                                            {s.fin}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            <span className="rounded bg-moss-400/10 px-2 py-0.5 font-mono font-bold text-moss-300">
                                                                {s.tot}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-sand-600">
                                        <span className="inline-flex items-center gap-1.5">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                className="h-3.5 w-3.5 text-moss-400"
                                                aria-hidden="true"
                                            >
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                            قيم رقمية ثابتة دون معادلات
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                className="h-3.5 w-3.5 text-clay-400"
                                                aria-hidden="true"
                                            >
                                                <path d="M6 6 18 18M18 6 6 18" />
                                            </svg>
                                            أعمدة محذوفة بالكامل
                                        </span>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    {/* Privacy notice */}
                    <section className="scroll-mt-20">
                        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
                            <Reveal>
                                <div className="rounded-xl border border-night-700 bg-night-900/50 p-5 text-center">
                                    <p className="text-sm leading-relaxed text-sand-600">
                                        تُعالَج الملفات مؤقتًا ولا تُحفظ في حساب
                                        مستخدم أو قاعدة بيانات. تُحذف النسخة
                                        المؤقتة بعد تجهيز ملف التنزيل.
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* Upload interface */}
                    <section id="upload" className="scroll-mt-20">
                        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
                            <Reveal>
                                <h2 className="text-2xl font-black text-cream-100 sm:text-3xl">
                                    ارفع كشف الدرجات
                                </h2>
                                <p className="mt-3 font-serif text-lg leading-loose text-sand-400">
                                    اختر ملف Excel ثم اضغط على زر التجهيز.
                                </p>
                            </Reveal>

                            <Reveal className="mt-8">
                                {/* Drag-and-drop area */}
                                <div
                                    className={cn(
                                        'rounded-xl border-2 border-dashed p-8 text-center transition-colors duration-200 sm:p-12',
                                        dragOver
                                            ? 'border-gold-400 bg-gold-400/5'
                                            : selectedFile
                                              ? 'border-moss-400/50 bg-moss-400/5'
                                              : 'hover:border-night-500 border-night-600 bg-night-900/40',
                                    )}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOver(true);
                                    }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    {selectedFile ? (
                                        <div className="space-y-3">
                                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-moss-400/30 bg-moss-400/10 text-moss-400">
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
                                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                    <path d="M14 2v6h6" />
                                                </svg>
                                            </span>
                                            <p className="font-bold text-cream-100">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-sand-400">
                                                {(
                                                    selectedFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(1)}{' '}
                                                ميجابايت
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    resetForm();
                                                }}
                                                className="text-xs font-medium text-sand-400 underline hover:text-cream-100"
                                            >
                                                اختر ملفًا آخر
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-night-600 bg-night-850 text-gold-400">
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
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <path d="M17 8l-5-5-5 5" />
                                                    <path d="M12 3v12" />
                                                </svg>
                                            </span>
                                            <p className="font-bold text-cream-100">
                                                اسحب ملف Excel إلى هنا، أو اضغط
                                                لاختياره
                                            </p>
                                            <p className="text-sm text-sand-400">
                                                يدعم الإصدار الحالي ملفات XLSX
                                                المطابقة لنموذج كشف الدرجات.
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx"
                                        className="sr-only"
                                        onChange={handleChange}
                                        aria-label="اختيار ملف Excel"
                                    />
                                </div>
                            </Reveal>

                            {/* Unsupported formats */}
                            <Reveal>
                                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-sand-600">
                                    <span>لا يُقبل:</span>
                                    {formatsLabels.map((label) => (
                                        <span
                                            key={label}
                                            className="rounded border border-night-700 bg-night-900 px-2 py-0.5"
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </Reveal>

                            {/* Error message */}
                            {state === 'error' && errorMessage ? (
                                <Reveal className="mt-6">
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-clay-400/40 bg-clay-400/10 p-5 text-center"
                                    >
                                        <p className="font-bold text-clay-400">
                                            {errorMessage}
                                        </p>
                                    </div>
                                </Reveal>
                            ) : null}

                            {/* Success message */}
                            {state === 'success' ? (
                                <Reveal className="mt-6">
                                    <div
                                        role="status"
                                        className="rounded-xl border border-moss-400/50 bg-moss-400/10 p-5 text-center"
                                    >
                                        <p className="font-bold text-moss-300">
                                            تم تجهيز الملف بنجاح. جارِ
                                            التنزيل...
                                        </p>
                                    </div>
                                </Reveal>
                            ) : null}

                            {/* Process button */}
                            <Reveal className="mt-8 text-center">
                                <button
                                    type="button"
                                    disabled={
                                        !selectedFile || state === 'processing'
                                    }
                                    onClick={handleProcess}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-bold transition-colors duration-200',
                                        selectedFile && state !== 'processing'
                                            ? 'border-gold-400 bg-gold-400 text-night-950 hover:border-gold-300 hover:bg-gold-300'
                                            : 'cursor-not-allowed border-night-600 bg-night-850 text-sand-600',
                                    )}
                                >
                                    {state === 'processing' ? (
                                        <>
                                            <svg
                                                className="h-4 w-4 animate-spin"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className="opacity-25"
                                                />
                                                <path
                                                    d="M4 12a8 8 0 0 1 8-8"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    className="opacity-75"
                                                />
                                            </svg>
                                            جارِ التجهيز...
                                        </>
                                    ) : (
                                        'تجهيز الملف وتنزيله'
                                    )}
                                </button>
                            </Reveal>
                        </div>
                    </section>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}

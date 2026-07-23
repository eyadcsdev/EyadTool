<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use App\Http\Requests\KashfJahizUploadRequest;
use App\Services\KashfJahizService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class KashfJahizController extends Controller
{
    public function index(): Response
    {
        return inertia('tools/kashf-jahiz', [
            'title' => 'كشف جاهز | تجهيز كشوف درجات مركز اللغات والترجمة',
            'description' => 'أداة مفتوحة المصدر لمدرسي اللغة الإنجليزية في مركز اللغات والترجمة لتحويل معادلات كشف الدرجات إلى قيم ثابتة وإخراج نسخة نهائية جاهزة.',
        ]);
    }

    public function process(KashfJahizUploadRequest $request, KashfJahizService $service): \Symfony\Component\HttpFoundation\BinaryFileResponse|JsonResponse|RedirectResponse
    {
        $file = $request->file('file');

        if (! $file || ! $file->isValid()) {
            return $this->errorResponse($request, 'حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.');
        }

        $originalName = $file->getClientOriginalName();
        $tempPath = $file->store('kj-uploads', 'local');

        if (! $tempPath) {
            return $this->errorResponse($request, 'حدث خطأ أثناء حفظ الملف المؤقت.');
        }

        try {
            $result = $service->process(
                Storage::disk('local')->path($tempPath),
                $originalName,
            );
        } catch (\RuntimeException $e) {
            $this->deleteTempFile($tempPath);

            return $this->errorResponse($request, $e->getMessage());
        }

        $this->deleteTempFile($tempPath);

        $downloadName = pathinfo($originalName, PATHINFO_FILENAME) . '-كشف-جاهز.xlsx';

        return response()
            ->download($result['path'], $downloadName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])
            ->deleteFileAfterSend();
    }

    private function errorResponse($request, string $message): JsonResponse|RedirectResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => $message], 422);
        }

        return back()->withErrors(['file' => $message]);
    }

    private function deleteTempFile(string $path): void
    {
        if ($path && Storage::disk('local')->exists($path)) {
            Storage::disk('local')->delete($path);
        }
    }
}

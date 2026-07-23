<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use RuntimeException;

class KashfJahizService
{
    /**
     * Process a grade workbook: convert formulas to values,
     * delete temporary Quiz source columns, return processed file path.
     *
     * @return array{path: string, summary: array{fileName: string, sheetName: string, studentCount: int, deletedColumns: string[], convertedColumns: string[]}}
     *
     * @throws RuntimeException on any processing error
     */
    public function process(string $uploadedPath, string $originalName): array
    {
        $spreadsheet = $this->loadWorkbook($uploadedPath);

        $sheet = $this->findGradeSheet($spreadsheet);

        $headerRow = $this->findHeaderRow($sheet);

        $columns = $this->mapColumns($sheet, $headerRow);

        $this->validateColumnMapping($columns);

        $dataStartRow = $headerRow + 1;
        $lastDataRow = $this->findLastDataRow($sheet, $columns, $dataStartRow);

        $studentCount = $lastDataRow - $dataStartRow + 1;

        // 1. Read and store calculated values before any deletion
        $this->convertFormulasToValues($sheet, $columns, $dataStartRow, $lastDataRow);

        // 2. Delete temporary Quiz source columns (right to left)
        $sourceColumns = $columns['quiz_sources'];
        usort($sourceColumns, fn ($a, $b) => Coordinate::columnIndexFromString($b) <=> Coordinate::columnIndexFromString($a));

        foreach ($sourceColumns as $col) {
            $sheet->removeColumn($col);
        }

        // 3. Validate the result
        $this->validateOutput($sheet, $columns, $dataStartRow, $lastDataRow);

        // 4. Save to temporary file
        $outputPath = $this->generateOutputPath($originalName);

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->setPreCalculateFormulas(false);
        $writer->save($outputPath);

        return [
            'path' => $outputPath,
            'summary' => [
                'fileName' => $originalName,
                'sheetName' => $sheet->getTitle(),
                'studentCount' => $studentCount,
                'deletedColumns' => array_map(
                    fn ($c) => Coordinate::columnIndexFromString($c),
                    $columns['quiz_sources'],
                ),
                'convertedColumns' => array_unique([
                    Coordinate::columnIndexFromString($columns['quiz_final']),
                    Coordinate::columnIndexFromString($columns['total']),
                ]),
            ],
        ];
    }

    private function loadWorkbook(string $path): Spreadsheet
    {
        try {
            return IOFactory::load($path);
        } catch (\Throwable $e) {
            throw new RuntimeException('تعذر قراءة ملف Excel. تأكد من أن الملف سليم وغير محمي بكلمة مرور.', 0, $e);
        }
    }

    private function findGradeSheet(Spreadsheet $spreadsheet): Worksheet
    {
        foreach ($spreadsheet->getAllSheets() as $sheet) {
            $headerRow = $this->findHeaderRow($sheet);

            if ($headerRow !== null) {
                return $sheet;
            }
        }

        throw new RuntimeException('لم تتمكن الأداة من التعرّف على نموذج كشف الدرجات. تأكد من استخدام النموذج المخصص لمركز اللغات والترجمة.');
    }

    private function findHeaderRow(Worksheet $sheet): ?int
    {
        $maxScanRows = min(20, $sheet->getHighestRow());
        $maxCol = $sheet->getHighestColumn();
        $maxColIndex = Coordinate::columnIndexFromString($maxCol);

        for ($row = 1; $row <= $maxScanRows; $row++) {
            $hasStudentName = false;
            $quizCount = 0;

            for ($colIndex = 1; $colIndex <= $maxColIndex; $colIndex++) {
                $header = $this->normalizeHeader($sheet->getCell([$colIndex, $row])->getValue());

                if ($header === null) {
                    continue;
                }

                if (str_contains($header, 'اسم الطالب') || str_contains($header, 'student name')) {
                    $hasStudentName = true;
                }

                if ($this->isQuizSourceHeader($header)) {
                    $quizCount++;
                }
            }

            // Must have a student name column AND at least one individual quiz
            if ($hasStudentName && $quizCount >= 1) {
                return $row;
            }
        }

        return null;
    }

    /**
     * Map header row to classified columns.
     *
     * @return array{id: ?string, name: string, quiz_sources: string[], quiz_final: string, total: string, other_formulas: string[]}
     */
    private function mapColumns(Worksheet $sheet, int $headerRow): array
    {
        $maxCol = $sheet->getHighestColumn();
        $maxColIndex = Coordinate::columnIndexFromString($maxCol);

        $id = null;
        $name = null;
        $quizSources = [];
        $quizFinal = null;
        $total = null;
        $otherFormulas = [];

        for ($colIndex = 1; $colIndex <= $maxColIndex; $colIndex++) {
            $col = Coordinate::stringFromColumnIndex($colIndex);
            $header = $this->normalizeHeader($sheet->getCell([$colIndex, $headerRow])->getValue());

            if ($header === null) {
                continue;
            }

            // Student name column
            if (str_contains($header, 'اسم الطالب') || str_contains($header, 'student name')) {
                $name = $col;

                continue;
            }

            // Student ID column
            if (str_contains($header, 'رقم الطالب') || str_contains($header, 'student id')) {
                $id = $col;

                continue;
            }

            // Final quiz column (contains "quiz" with percentage, e.g. "Quiz 10%")
            // Check before quiz source so "Quiz 10%" is not misclassified.
            if ($this->isQuizFinalHeader($header)) {
                $quizFinal = $col;

                continue;
            }

            // Quiz source column (e.g. Quiz1, Quiz 2, quiz3 5)
            if ($this->isQuizSourceHeader($header)) {
                $quizSources[] = $col;

                continue;
            }

            // Total column (e.g. "100")
            if ($this->isTotalHeader($header)) {
                $total = $col;

                continue;
            }
        }

        if ($name === null) {
            throw new RuntimeException('لم يتم العثور على عمود اسم الطالب داخل الملف.');
        }

        if ($quizFinal === null) {
            throw new RuntimeException('لم يتم العثور على أعمدة الدرجات المطلوبة داخل الملف.');
        }

        if ($total === null) {
            throw new RuntimeException('لم يتم العثور على عمود الدرجة الكلية داخل الملف.');
        }

        if (count($quizSources) === 0) {
            throw new RuntimeException('لم يتم العثور على أعمدة الاختبارات المؤقتة داخل الملف.');
        }

        return [
            'id' => $id,
            'name' => $name,
            'quiz_sources' => $quizSources,
            'quiz_final' => $quizFinal,
            'total' => $total,
            'other_formulas' => $otherFormulas,
        ];
    }

    private function isQuizSourceHeader(string $normalized): bool
    {
        // Match "Quiz1", "Quiz 2", "Quiz3 5" — standalone quiz number.
        // Exclude headers with "%" which indicate the final weighted Quiz column.
        if (str_contains($normalized, '%')) {
            return false;
        }

        return (bool) preg_match('/^quiz\s*\d+/i', $normalized);
    }

    private function isQuizFinalHeader(string $normalized): bool
    {
        // Match "Quiz 10%" — "quiz" + a percentage sign
        return str_contains($normalized, 'quiz') && str_contains($normalized, '%');
    }

    private function isTotalHeader(string $normalized): bool
    {
        // "100" or contains "total"
        return $normalized === '100' || str_contains($normalized, 'total');
    }

    private function validateColumnMapping(array $columns): void
    {
        // No source quiz columns should overlap with final quiz or total
        $finalIndex = Coordinate::columnIndexFromString($columns['quiz_final']);
        $totalIndex = Coordinate::columnIndexFromString($columns['total']);

        foreach ($columns['quiz_sources'] as $source) {
            $sourceIndex = Coordinate::columnIndexFromString($source);

            if ($sourceIndex >= $finalIndex) {
                throw new RuntimeException('لم تتمكن الأداة من التعرّف على نموذج كشف الدرجات. تأكد من استخدام النموذج المخصص لمركز اللغات والترجمة.');
            }

            if ($sourceIndex === $totalIndex) {
                throw new RuntimeException('لم تتمكن الأداة من التعرّف على نموذج كشف الدرجات. تأكد من استخدام النموذج المخصص لمركز اللغات والترجمة.');
            }
        }
    }

    private function findLastDataRow(Worksheet $sheet, array $columns, int $dataStartRow): int
    {
        $maxRow = $sheet->getHighestRow();

        for ($row = $maxRow; $row >= $dataStartRow; $row--) {
            $nameCol = $columns['name'];
            $cellValue = $sheet->getCell($nameCol . $row)->getValue();

            if ($cellValue !== null && trim((string) $cellValue) !== '') {
                return $row;
            }
        }

        throw new RuntimeException('لم يتم العثور على صفوف طلاب داخل الملف.');
    }

    private function convertFormulasToValues(Worksheet $sheet, array $columns, int $dataStartRow, int $lastDataRow): void
    {
        $converted = 0;

        for ($row = $dataStartRow; $row <= $lastDataRow; $row++) {
            // Skip completely empty rows
            $nameVal = $sheet->getCell($columns['name'] . $row)->getValue();

            if ($nameVal === null || trim((string) $nameVal) === '') {
                continue;
            }

            // Convert final Quiz formula to value
            $this->convertCellToValue($sheet, $columns['quiz_final'], $row);
            $converted++;

            // Convert Total formula to value
            $this->convertCellToValue($sheet, $columns['total'], $row);

            // Convert any other formula cells in this row
            $maxCol = $sheet->getHighestColumn();
            $maxColIndex = Coordinate::columnIndexFromString($maxCol);

            for ($colIndex = 1; $colIndex <= $maxColIndex; $colIndex++) {
                $col = Coordinate::stringFromColumnIndex($colIndex);

                // Skip already-converted columns
                if ($col === $columns['quiz_final'] || $col === $columns['total']) {
                    continue;
                }

                // Skip quiz source columns (will be deleted)
                if (in_array($col, $columns['quiz_sources'], true)) {
                    continue;
                }

                $this->convertCellToValue($sheet, $col, $row);
            }
        }

        if ($converted === 0) {
            throw new RuntimeException('لم يتم العثور على صفوف طلاب تحتوي على بيانات داخل الملف.');
        }
    }

    private function convertCellToValue(Worksheet $sheet, string $col, int $row): void
    {
        $cell = $sheet->getCell($col . $row);
        $raw = $cell->getValue();

        // Only convert formula cells
        if (! is_string($raw) || ! str_starts_with(trim($raw), '=')) {
            return;
        }

        $calculated = $cell->getCalculatedValue();

        // Null calculated value → keep as-is (might be an intentional blank)
        if ($calculated === null) {
            return;
        }

        // Non-numeric result for a grade column → safety check
        if (! is_numeric($calculated)) {
            throw new RuntimeException('تعذر تثبيت إحدى القيم المحسوبة بأمان، لذلك لم يُنشأ الملف النهائي.');
        }

        $cell->setValue($calculated);
    }

    private function validateOutput(Worksheet $sheet, array $columns, int $dataStartRow, int $lastDataRow): void
    {
        // Re-scan headers after deletion (columns have shifted)
        $maxColIndex = Coordinate::columnIndexFromString($sheet->getHighestColumn());
        $newQuizFinal = null;
        $newTotal = null;
        $newName = null;

        for ($colIndex = 1; $colIndex <= $maxColIndex; $colIndex++) {
            $col = Coordinate::stringFromColumnIndex($colIndex);
            $header = $this->normalizeHeader($sheet->getCell([$colIndex, 1])->getValue());

            if ($header === null) {
                continue;
            }

            if (str_contains($header, 'اسم الطالب') || str_contains($header, 'student name')) {
                $newName = $col;
            }

            // 1. Quiz source columns must NOT appear
            if ($this->isQuizSourceHeader($header)) {
                throw new RuntimeException('تعذر حذف أحد أعمدة الاختبارات المؤقتة.');
            }

            // 2. Track final quiz and total for validation checks
            if ($this->isQuizFinalHeader($header)) {
                $newQuizFinal = $col;
            }

            if ($this->isTotalHeader($header)) {
                $newTotal = $col;
            }
        }

        if ($newName === null || $newQuizFinal === null || $newTotal === null) {
            throw new RuntimeException('تعذر تثبيت إحدى القيم المحسوبة بأمان، لذلك لم يُنشأ الملف النهائي.');
        }

        // 3. Final Quiz and Total cells must contain literal values, not formulas
        for ($row = $dataStartRow; $row <= $lastDataRow; $row++) {
            $nameVal = $sheet->getCell($newName . $row)->getValue();

            if ($nameVal === null || trim((string) $nameVal) === '') {
                continue;
            }

            $quizCell = $sheet->getCell($newQuizFinal . $row);
            $quizRaw = $quizCell->getValue();

            if (is_string($quizRaw) && str_starts_with(trim($quizRaw), '=')) {
                throw new RuntimeException('تعذر تثبيت إحدى القيم المحسوبة بأمان، لذلك لم يُنشأ الملف النهائي.');
            }

            if ($quizRaw === null || (! is_numeric($quizRaw) && ! is_float($quizRaw) && ! is_int($quizRaw))) {
                throw new RuntimeException('تعذر تثبيت إحدى القيم المحسوبة بأمان، لذلك لم يُنشأ الملف النهائي.');
            }

            $totalCell = $sheet->getCell($newTotal . $row);
            $totalRaw = $totalCell->getValue();

            if (is_string($totalRaw) && str_starts_with(trim($totalRaw), '=')) {
                throw new RuntimeException('تعذر تثبيت إحدى القيم المحسوبة بأمان، لذلك لم يُنشأ الملف النهائي.');
            }
        }

        // 4. Student rows must still be present
        $nameCellFirst = $sheet->getCell($newName . $dataStartRow)->getValue();
        $nameCellLast = $sheet->getCell($newName . $lastDataRow)->getValue();

        if ($nameCellFirst === null || trim((string) $nameCellFirst) === '') {
            throw new RuntimeException('تعذر تثبيت إحدى القيم المحسوبة بأمان، لذلك لم يُنشأ الملف النهائي.');
        }

        if ($nameCellLast === null || trim((string) $nameCellLast) === '') {
            throw new RuntimeException('تعذر تثبيت إحدى القيم المحسوبة بأمان، لذلك لم يُنشأ الملف النهائي.');
        }
    }

    private function generateOutputPath(string $originalName): string
    {
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);

        // Remove any characters that aren't safe for filenames
        $safeName = preg_replace('/[^\p{Arabic}\p{Latin}\d\s_\-]/u', '', $baseName);
        $safeName = trim($safeName);

        if ($safeName === '' || $safeName === '0') {
            $safeName = 'كشف-جاهز';
        }

        $outputName = $safeName . '-كشف-جاهز.xlsx';
        $tempDir = sys_get_temp_dir();
        $tempPath = $tempDir . '/' . uniqid('kj_', true) . '_' . $outputName;

        return $tempPath;
    }

    private function normalizeHeader(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $str = trim((string) $value);

        if ($str === '') {
            return null;
        }

        // Normalize spaces and lowercase for comparison
        $str = mb_strtolower($str, 'UTF-8');
        $str = preg_replace('/\s+/u', ' ', $str);

        return trim($str);
    }
}

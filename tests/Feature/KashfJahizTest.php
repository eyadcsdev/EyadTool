<?php

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

/*
 * Helper: create a valid grade-workbook matching the Center for Languages
 * and Translation template structure.
 */
function createValidWorkbook(): string
{
    $spreadsheet = new Spreadsheet;
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle('Sheet1');

    $headers = [
        'A1' => 'رقم الطالب', 'B1' => 'اسم الطالب', 'C1' => 'Quiz1 5',
        'D1' => 'Quiz2 5', 'E1' => 'Quiz3 5', 'F1' => 'Quiz 10%',
        'G1' => 'Atted 5%', 'H1' => 'presention 10%', 'I1' => 'H.W 5 %',
        'J1' => 'Dectation 5 %', 'K1' => 'mid 15 %', 'L1' => 'Oral Test 15%',
        'M1' => 'story 5%', 'N1' => 'final 30%', 'O1' => '100',
    ];

    foreach ($headers as $cell => $value) {
        $sheet->setCellValue($cell, $value);
    }

    $students = [
        ['A2' => 1001, 'B2' => 'احمد محمد علي', 'C2' => 5, 'D2' => 4, 'E2' => 3, 'G2' => 4, 'H2' => 8, 'I2' => 5, 'J2' => 4, 'K2' => 12, 'L2' => 0, 'M2' => 5, 'N2' => 22],
        ['A3' => 1002, 'B3' => 'فاطمة حسن عبدالله', 'C3' => 4, 'D3' => 5, 'E3' => 4, 'G3' => 5, 'H3' => 10, 'I3' => 5, 'J3' => 5, 'K3' => 15, 'L3' => 15, 'M3' => 5, 'N3' => 30],
        ['A4' => 1003, 'B4' => 'خالد ابراهيم يوسف', 'C4' => 5, 'D4' => 5, 'E4' => 5, 'G4' => 5, 'H4' => 10, 'I4' => 5, 'J4' => 5, 'K4' => 14, 'L4' => 14, 'M4' => 5, 'N4' => 28],
    ];

    foreach ($students as $rowData) {
        foreach ($rowData as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        $row = substr((string) array_key_first($rowData), 1);
        $sheet->setCellValue("F{$row}", "=ROUND((SUM(C{$row}:E{$row})/3)*2,0)");
        $sheet->setCellValue("O{$row}", "=SUM(F{$row}:N{$row})");
    }

    $path = sys_get_temp_dir() . '/test_valid_' . uniqid() . '.xlsx';
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($path);

    return $path;
}

function createWorkbookWithoutQuizHeaders(): string
{
    $spreadsheet = new Spreadsheet;
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setCellValue('A1', 'الاسم');
    $sheet->setCellValue('B1', 'الدرجة');
    $sheet->setCellValue('A2', 'طالب');
    $sheet->setCellValue('B2', 85);

    $path = sys_get_temp_dir() . '/test_noquiz_' . uniqid() . '.xlsx';
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save($path);

    return $path;
}

/*
 * Common request options for POST tests.
 * "acceptBoth" allows the server to return either JSON (on error)
 * or a binary XLSX download (on success).
 */
function acceptBoth(): array
{
    return [
        'Accept' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json',
    ];
}

function acceptJson(): array
{
    return ['Accept' => 'application/json'];
}

// ---------------------------------------------------------------------------
// Test: page is publicly accessible
// ---------------------------------------------------------------------------
test('tool page is publicly accessible', function () {
    $response = $this->get(route('tools.kashf-jahiz.index'));

    $response->assertOk();
});

// ---------------------------------------------------------------------------
// Test: non-xlsx files are rejected
// ---------------------------------------------------------------------------
test('non-xlsx files are rejected', function () {
    $file = \Illuminate\Http\UploadedFile::fake()->create('grades.csv', kilobytes: 50, mimeType: 'text/csv');

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptJson());

    $response->assertStatus(422);
});

// ---------------------------------------------------------------------------
// Test: oversized files are rejected
// ---------------------------------------------------------------------------
test('oversized files are rejected', function () {
    $file = \Illuminate\Http\UploadedFile::fake()->create(
        'large.xlsx',
        kilobytes: 11 * 1024,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptJson());

    $response->assertStatus(422);
});

// ---------------------------------------------------------------------------
// Test: corrupt workbook is rejected safely
// ---------------------------------------------------------------------------
test('corrupt workbook is rejected safely', function () {
    $file = \Illuminate\Http\UploadedFile::fake()->create(
        'corrupt.xlsx',
        kilobytes: 5,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptJson());

    $response->assertStatus(422);
});

// ---------------------------------------------------------------------------
// Test: workbook without expected headers is rejected
// ---------------------------------------------------------------------------
test('workbook without expected grade headers is rejected', function () {
    $path = createWorkbookWithoutQuizHeaders();
    $file = new \Illuminate\Http\UploadedFile(
        $path, 'noquiz.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null, true,
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptJson());

    $response->assertStatus(422);

    @unlink($path);
});

// ---------------------------------------------------------------------------
// Test: upload without file returns validation error
// ---------------------------------------------------------------------------
test('upload without file returns validation error', function () {
    $response = $this->post(route('tools.kashf-jahiz.process'), [], acceptJson());

    $response->assertStatus(422);
});

// ---------------------------------------------------------------------------
// Test: valid XLSX returns a downloadable file
// ---------------------------------------------------------------------------
test('valid XLSX upload returns a downloadable XLSX file', function () {
    $path = createValidWorkbook();
    $file = new \Illuminate\Http\UploadedFile(
        $path, 'grades.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null, true,
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptBoth());

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    @unlink($path);
});

// ---------------------------------------------------------------------------
// Test: Quiz source columns are removed
// ---------------------------------------------------------------------------
test('temporary quiz source columns are removed', function () {
    $path = createValidWorkbook();
    $file = new \Illuminate\Http\UploadedFile(
        $path, 'grades.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null, true,
    );
    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptBoth());

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Copy the temporary output file for inspection (BinaryFileResponse deletes on send)
    $outputPath = sys_get_temp_dir() . '/kj_output_' . uniqid() . '.xlsx';
    copy($response->baseResponse->getFile()->getRealPath(), $outputPath);
    expect(file_exists($outputPath))->toBeTrue();

    $spreadsheet = IOFactory::load($outputPath);
    $sheet = $spreadsheet->getActiveSheet();
    $maxCol = $sheet->getHighestColumn();

    $headers = [];

    for ($c = 'A'; $c <= $maxCol; $c++) {
        $headers[] = (string) $sheet->getCell($c . '1')->getValue();
    }

    $headerStr = implode(' ', $headers);

    expect(mb_strpos($headerStr, 'Quiz1'))->toBeFalse();
    expect(mb_strpos($headerStr, 'Quiz2'))->toBeFalse();
    expect(mb_strpos($headerStr, 'Quiz3'))->toBeFalse();

    @unlink($path);
    @unlink($outputPath);
});

// ---------------------------------------------------------------------------
// Test: final Quiz and Total values are preserved
// ---------------------------------------------------------------------------
test('final quiz values remain numerically equal to original calculated results', function () {
    $path = createValidWorkbook();
    $original = IOFactory::load($path);
    $originalSheet = $original->getActiveSheet();

    $expectedQuiz = [];
    $expectedTotal = [];

    foreach ($originalSheet->getRowIterator(2) as $row) {
        $ri = $row->getRowIndex();
        $expectedQuiz[$ri] = (float) $originalSheet->getCell("F{$ri}")->getCalculatedValue();
        $expectedTotal[$ri] = (float) $originalSheet->getCell("O{$ri}")->getCalculatedValue();
    }

    $file = new \Illuminate\Http\UploadedFile(
        $path, 'grades.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null, true,
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptBoth());
    $response->assertOk();

    $outputPath = sys_get_temp_dir() . '/kj_output_' . uniqid() . '.xlsx';
    copy($response->baseResponse->getFile()->getRealPath(), $outputPath);

    $result = IOFactory::load($outputPath);
    $resultSheet = $result->getActiveSheet();
    $maxCol = $resultSheet->getHighestColumn();

    $quizFinalCol = null;
    $totalCol = null;

    for ($c = 'A'; $c <= $maxCol; $c++) {
        $val = trim(mb_strtolower((string) $resultSheet->getCell($c . '1')->getValue(), 'UTF-8'));

        if (str_contains($val, 'quiz') && str_contains($val, '%')) {
            $quizFinalCol = $c;
        }

        if ($val === '100') {
            $totalCol = $c;
        }
    }

    expect($quizFinalCol)->not->toBeNull('final Quiz column missing');
    expect($totalCol)->not->toBeNull('Total column missing');

    foreach ($resultSheet->getRowIterator(2) as $row) {
        $ri = $row->getRowIndex();
        $actualQuiz = (float) $resultSheet->getCell("{$quizFinalCol}{$ri}")->getValue();
        $actualTotal = (float) $resultSheet->getCell("{$totalCol}{$ri}")->getValue();

        expect($actualQuiz)->toEqual($expectedQuiz[$ri]);
        expect($actualTotal)->toEqual($expectedTotal[$ri]);
    }

    @unlink($path);
    @unlink($outputPath);
});

// ---------------------------------------------------------------------------
// Test: final cells are static values (not formulas)
// ---------------------------------------------------------------------------
test('final retained cells are values and not formulas', function () {
    $path = createValidWorkbook();
    $file = new \Illuminate\Http\UploadedFile(
        $path, 'grades.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null, true,
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptBoth());
    $response->assertOk();

    $outputPath = sys_get_temp_dir() . '/kj_output_' . uniqid() . '.xlsx';
    copy($response->baseResponse->getFile()->getRealPath(), $outputPath);

    $result = IOFactory::load($outputPath);
    $resultSheet = $result->getActiveSheet();

    $maxRow = $resultSheet->getHighestRow();
    $maxCol = $resultSheet->getHighestColumn();

    for ($r = 1; $r <= $maxRow; $r++) {
        for ($c = 'A'; $c <= $maxCol; $c++) {
            $val = $resultSheet->getCell($c . $r)->getValue();

            if (is_string($val)) {
                expect(trim($val))->not->toStartWith('=');
            }
        }
    }

    @unlink($path);
    @unlink($outputPath);
});

// ---------------------------------------------------------------------------
// Test: student names are preserved
// ---------------------------------------------------------------------------
test('student names and unrelated grade columns are preserved', function () {
    $path = createValidWorkbook();
    $file = new \Illuminate\Http\UploadedFile(
        $path, 'grades.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null, true,
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptBoth());
    $response->assertOk();

    $outputPath = sys_get_temp_dir() . '/kj_output_' . uniqid() . '.xlsx';
    copy($response->baseResponse->getFile()->getRealPath(), $outputPath);

    $result = IOFactory::load($outputPath);
    $resultSheet = $result->getActiveSheet();
    $maxCol = $resultSheet->getHighestColumn();

    $headers = [];

    for ($c = 'A'; $c <= $maxCol; $c++) {
        $headers[] = (string) $resultSheet->getCell($c . '1')->getValue();
    }

    $headerStr = implode(' ', $headers);

    expect($headerStr)->toContain('اسم الطالب');
    expect($headerStr)->toContain('Atted');
    expect($headerStr)->toContain('final');

    $names = [];

    for ($row = 2; $row <= $resultSheet->getHighestRow(); $row++) {
        for ($c = 'A'; $c <= $maxCol; $c++) {
            $val = (string) $resultSheet->getCell($c . $row)->getValue();

            if (mb_strlen($val, 'UTF-8') > 10 && ! is_numeric($val)) {
                $names[] = $val;
            }
        }
    }

    expect($names)->toHaveCount(3);
    expect($names)->toContain('احمد محمد علي');

    @unlink($path);
    @unlink($outputPath);
});

// ---------------------------------------------------------------------------
// Test: temporary files are cleaned up
// ---------------------------------------------------------------------------
test('uploaded temp file is deleted after processing', function () {
    $path = createValidWorkbook();
    $file = new \Illuminate\Http\UploadedFile(
        $path, 'grades.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null, true,
    );

    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => $file], acceptBoth());
    $response->assertOk();

    // The controller stores under kj-uploads then deletes after processing.
    $files = \Illuminate\Support\Facades\Storage::disk('local')->files('kj-uploads');

    expect($files)->toBeEmpty();

    @unlink($path);
});

// ---------------------------------------------------------------------------
// Test: returns validation error when file is not a valid upload
// ---------------------------------------------------------------------------
test('returns validation error when file is not an xlsx', function () {
    $response = $this->post(route('tools.kashf-jahiz.process'), ['file' => 'not-a-file'], acceptJson());

    $response->assertStatus(422);
});

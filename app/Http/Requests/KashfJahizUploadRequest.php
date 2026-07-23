<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KashfJahizUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'max:10240',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'يرجى اختيار ملف لرفعه.',
            'file.file' => 'يرجى رفع ملف صالح.',
            'file.mimetypes' => 'يرجى رفع ملف بصيغة XLSX.',
            'file.max' => 'يتجاوز حجم الملف الحد المسموح به وهو 10 ميجابايت.',
        ];
    }
}

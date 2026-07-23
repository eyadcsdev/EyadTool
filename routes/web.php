<?php

use App\Http\Controllers\Tools\KashfJahizController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('tools/kashf-jahiz')->name('tools.kashf-jahiz.')->group(function () {
    Route::get('/', [KashfJahizController::class, 'index'])->name('index');
    Route::post('/', [KashfJahizController::class, 'process'])
        ->name('process')
        ->middleware('throttle:10,1');
});

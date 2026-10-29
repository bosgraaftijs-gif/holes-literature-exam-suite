@echo off
title Camp Green Lake - Holes Document Converter
echo ====================================================
echo    Camp Green Lake Inname & Conversie Tool
echo ====================================================
echo.
if "%~1"=="" (
    echo Bezig met omzetten van bestanden in inbox/ map...
    node scripts/convert.js
) else (
    echo Bezig met omzetten van: %~1
    node scripts/convert.js "%~1"
)
echo.
pause

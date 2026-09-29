@echo off
chcp 65001 >nul
echo ========================================
echo   Emoji Finder API - Запуск сервера
echo ========================================
echo.

:: Проверяем, установлен ли Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не найден! Установите Node.js с https://nodejs.org
    pause
    exit /b 1
)

:: Проверяем, есть ли package.json
if not exist package.json (
    echo [ОШИБКА] Файл package.json не найден! Запускайте батник из корня проекта.
    pause
    exit /b 1
)

:: Проверяем, установлены ли зависимости
if not exist node_modules (
    echo [1/2] Установка зависимостей...
    call npm install
    if %errorlevel% neq 0 (
        echo [ОШИБКА] Не удалось установить зависимости.
        pause
        exit /b 1
    )
    echo Зависимости установлены!
    echo.
) else (
    echo [1/2] Зависимости уже установлены, пропускаем.
    echo.
)

:: Запуск сервера
echo [2/2] Запуск сервера...
node app.js
if %errorlevel% neq 0 (
    echo.
    echo [ОШИБКА] Сервер завершился с ошибкой.
    pause
)

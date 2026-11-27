@echo off
setlocal
chcp 65001 >nul
rem Отправка свежей версии сайта в рабочий репозиторий (ветка dev) одним запуском.
rem Запускать двойным щелчком. Ничего не перезаписывает: если GitHub откажет, окно покажет ошибку.

set "REPO_DIR=C:\Users\Manager\stayinvestment"
set "SRC=https://github.com/restvip7-lang/stayinvestment.git"
set "SRC_BRANCH=claude/practical-shannon-z1pifq"
set "DST=https://staymng-bit@github.com/stayproperty-org/stayinvestment.git"

cd /d "%REPO_DIR%" || goto :nodir

echo.
echo [1/3] Забираю свежую версию сайта...
git fetch "%SRC%" "%SRC_BRANCH%" || goto :fail

rem Номер версии. Если он не получен, дальше не идём: пустой номер при отправке удалил бы ветку.
set "NEW="
for /f "delims=" %%i in ('git rev-parse --verify FETCH_HEAD') do set "NEW=%%i"
if not defined NEW goto :fail

echo.
echo [2/3] Отправляю версию %NEW:~0,7% в ветку dev рабочего репозитория...
git push "%DST%" "%NEW%:refs/heads/dev" || goto :fail

echo.
echo [3/3] Готово. Открываю страницу запроса на слияние dev в main.
echo       Нажмите: Create pull request, потом Merge pull request, потом Confirm merge.
echo       Ветку dev не удаляйте. Через 2-3 минуты после слияния сайт обновится на сервере.
start "" "https://github.com/stayproperty-org/stayinvestment/compare/main...dev?expand=1"
echo.
pause
exit /b 0

:nodir
echo.
echo Не найдена папка %REPO_DIR%
pause
exit /b 1

:fail
echo.
echo ОШИБКА: отправка не выполнена, в рабочем репозитории ничего не изменилось.
echo Сделайте снимок этого окна и пришлите его в чат.
pause
exit /b 1

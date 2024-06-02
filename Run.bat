@echo off

echo Running Back End:
cd SynergicAPI\bin\Debug\net8.0\
echo Openning port at [http://localhost:7201/] ^| [https://localhost:7200/]
start SynergicAPI.exe
echo Back End Is Now Running!
echo.
echo.

echo Running Front End:
echo Opend port at http://localhost:5173/
cd ..\..\..\..\Synergic-Front-End\
start http://localhost:5173/
call start.bat
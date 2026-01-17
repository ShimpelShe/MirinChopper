@echo off
cls
echo Compiling TypeScript files...
tsc ./index.ts -lib "dom, es2021" --outFile ./index.js
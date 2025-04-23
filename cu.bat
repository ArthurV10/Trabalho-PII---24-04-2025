@echo off
echo AVISO: Esse script vai abrir janelas do CMD em loop infinito. Pressione Ctrl+C agora se não quiser continuar.
pause

:loop
start cmd
goto loop
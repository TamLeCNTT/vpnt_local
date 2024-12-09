Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "run_react.bat", 0, False
WshShell.Run "run_api.bat", 0, False

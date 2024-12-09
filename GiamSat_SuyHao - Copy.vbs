Set WshShell = CreateObject("WScript.Shell")
CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run "cmd.exe /c ""cd /d " & CurrentDirectory & " && run_api.bat""", 0, False
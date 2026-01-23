@REM ----------------------------------------------------------------------------
@REM Copyright 2005-2009 The Apache Software Foundation
@REM
@REM Licensed under the Apache License, Version 2.0 (the "License");
@REM you may not use this file except in compliance with the License.
@REM You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the License for the specific language governing permissions and
@REM limitations under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM   JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. -Xms256m -Xmx512m
@REM   MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@REM Begin all REM lines with '@' in case MAVEN_BATCH_ECHO is 'on'
@echo off
@REM set title of command window
title %0
@REM enable echoing my setting MAVEN_BATCH_ECHO to 'on'
@if "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@REM set %HOME% to equivalent of $HOME
if "%HOME%" == "" (set "HOME=%USERPROFILE%")

@REM Execute a user defined script before this one
if not "%MAVEN_SKIP_RC%" == "" goto skipRcPre
@REM check for pre script, once for user folder, once for maven folder.
if exist "%HOME%\mavenrc_pre.bat" call "%HOME%\mavenrc_pre.bat"
if exist "%MAVEN_HOME%\bin\mavenrc_pre.bat" call "%MAVEN_HOME%\bin\mavenrc_pre.bat"
:skipRcPre

@REM dicover where the command script is
set "MAVEN_CMD_LINE_ARGS=%*"
set "MAVEN_PROJECT_DIR_RAW=%CD%"
if defined MAVEN_PROJECT_DIR (
  set "MAVEN_PROJECT_DIR_RAW=%MAVEN_PROJECT_DIR%"
)
for %%i in ("%MAVEN_PROJECT_DIR_RAW%") do set "MAVEN_PROJECT_DIR=%%~fi"

set "MAVEN_HOME_RAW=%MAVEN_PROJECT_DIR%\.mvn\wrapper\maven"
if defined MAVEN_HOME (
  set "MAVEN_HOME_RAW=%MAVEN_HOME%"
)
if not exist "%MAVEN_HOME_RAW%\bin\mvn.cmd" (
  set "MAVEN_WRAPPER_JAR_RAW=%MAVEN_PROJECT_DIR%\.mvn\wrapper\maven-wrapper.jar"
  if defined MAVEN_WRAPPER_JAR (
    set "MAVEN_WRAPPER_JAR_RAW=%MAVEN_WRAPPER_JAR%"
  )
  for %%i in ("%MAVEN_WRAPPER_JAR_RAW%") do set "MAVEN_WRAPPER_JAR=%%~fi"

  set "MAVEN_WRAPPER_PROPERTIES_RAW=%MAVEN_PROJECT_DIR%\.mvn\wrapper\maven-wrapper.properties"
  if defined MAVEN_WRAPPER_PROPERTIES (
    set "MAVEN_WRAPPER_PROPERTIES_RAW=%MAVEN_WRAPPER_PROPERTIES%"
  )
  for %%i in ("%MAVEN_WRAPPER_PROPERTIES_RAW%") do set "MAVEN_WRAPPER_PROPERTIES=%%~fi"

  if exist "%MAVEN_WRAPPER_PROPERTIES%" (
    for /f "usebackq tokens=1,2 delims==" %%a in ("%MAVEN_WRAPPER_PROPERTIES%") do (
      set "%%a=%%b"
    )
    if not defined mavenUrl (
      echo "error: mavenUrl property is not set in %MAVEN_WRAPPER_PROPERTIES%"
      exit /b 1
    )
    set "MAVEN_HOME_RAW=%MAVEN_PROJECT_DIR%\.mvn\wrapper\maven"
    if defined MAVEN_HOME (
      set "MAVEN_HOME_RAW=%MAVEN_HOME%"
    )
    if not exist "%MAVEN_HOME_RAW%\bin\mvn.cmd" (
      echo "Downloading Maven from %mavenUrl%"
      if not defined MAVEN_INSTALL_OPTS (
        set "MAVEN_INSTALL_OPTS=--insecure"
      )
      bitsadmin /transfer "mvnw-download-task" /dynamic /download /priority foreground "%mavenUrl%" "%TEMP%\maven.zip"
      if errorlevel 1 (
        echo "error: unable to download Maven from %mavenUrl%"
        exit /b 1
      )
      powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%MAVEN_HOME_RAW%'"
      if errorlevel 1 (
        echo "error: unable to extract Maven from %TEMP%\maven.zip"
        exit /b 1
      )
      del "%TEMP%\maven.zip"
      rem it's possible that the zip file does not contain a maven directory, but directly the content
      if not exist "%MAVEN_HOME_RAW%\bin\mvn.cmd" (
        rem move the content of the unzipped directory to the MAVEN_HOME directory
        for /d %%i in ("%MAVEN_HOME_RAW%\*") do (
          move "%%i\*" "%MAVEN_HOME_RAW%"
          rmdir "%%i"
        )
      )
    )
  )
)

if not exist "%MAVEN_HOME_RAW%\bin\mvn.cmd" (
  echo "error: MAVEN_HOME is not set and no maven wrapper found in %MAVEN_PROJECT_DIR%" >&2
  exit /b 1
)

for %%i in ("%MAVEN_HOME_RAW%") do set "MAVEN_HOME=%%~fi"
set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"
if defined MAVEN_PROJECT_DIR (
  set "MAVEN_CMD=%MAVEN_CMD% -f "%MAVEN_PROJECT_DIR%\pom.xml""
)

set "MAVEN_BATCH_ECHO_OFF_WAS_SET=true"
if "%MAVEN_BATCH_ECHO%" == "on" (
  set "MAVEN_BATCH_ECHO_OFF_WAS_SET="
)

rem The following is sourced from the official Apache Maven repository
rem https://github.com/apache/maven/blob/master/apache-maven/src/bin/mvn.cmd
rem
rem Licensed to the Apache Software Foundation (ASF) under one
rem or more contributor license agreements.  See the NOTICE file
rem distributed with this work for additional information
rem regarding copyright ownership.  The ASF licenses this file
rem to you under the Apache License, Version 2.0 (the
rem "License"); you may not use this file except in compliance
rem with the License.  You may obtain a copy of the License at
rem
rem    https://www.apache.org/licenses/LICENSE-2.0
rem
rem Unless required by applicable law or agreed to in writing,
rem software distributed under the License is distributed on an
rem "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
rem KIND, either express or implied.  See the License for the
rem specific language governing permissions and limitations
rem under the License.

rem author: Brett Porter
rem author: Emmanuel Venisse
rem author: Herve Quiroz
rem author: Jason van Zyl

rem ----------------------------------------------------------------------------
rem Error Messages
rem ----------------------------------------------------------------------------
set "MAVEN_PROJECT_DIR_WAS_EVALUATED_WARNING=Warning: MAVEN_PROJECT_DIR was evaluated to the current directory. If this is not the case, please specify MAVEN_PROJECT_DIR explicitly."

rem ----------------------------------------------------------------------------
rem Find JAVA_HOME
rem ----------------------------------------------------------------------------
if not defined JAVA_HOME (
  if defined JDK_HOME (
    set "JAVA_HOME=%JDK_HOME%"
  ) else (
    rem We attempt to find the javac executable and set JAVA_HOME from it.
    rem This is a last resort.
    for %%c in (javac.exe) do set "JAVAC_EXE=%%~$PATH:c"
    if defined JAVAC_EXE (
      for %%i in ("%JAVAC_EXE%") do set "JAVA_HOME=%%~dpi"
      set "JAVA_HOME=%JAVA_HOME:~0,-1%"
      set "JAVA_HOME=%JAVA_HOME:~0,-4%"
    )
  )
)
if not defined JAVA_HOME (
  echo "error: JAVA_HOME is not set and could not be found." >&2
  exit /b 1
)

set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if not exist "%JAVA_EXE%" (
  set "JAVA_EXE=%JAVA_HOME%\jre\bin\java.exe"
)
if not exist "%JAVA_EXE%" (
  echo "error: could not find java.exe in JAVA_HOME at %JAVA_HOME%" >&2
  exit /b 1
)
set "MAVEN_JAVA_EXE=%JAVA_EXE%"

rem ----------------------------------------------------------------------------
rem Maven Settings
rem ----------------------------------------------------------------------------
if not defined MAVEN_HOME (
  echo "error: MAVEN_HOME is not set" >&2
  exit /b 1
)

set "MAVEN_CLASSWORLDS_JAR=%MAVEN_HOME%\boot\plexus-classworlds-2.6.0.jar"
set "MAVEN_CORE_CLASSWORLDS_JAR=%MAVEN_HOME%\boot\plexus-classworlds-1.5.0.jar"
if exist "%MAVEN_CLASSWORLDS_JAR%" (
  set "CLASSWORLDS_JAR=%MAVEN_CLASSWORLDS_JAR%"
) else (
  if exist "%MAVEN_CORE_CLASSWORLDS_JAR%" (
    set "CLASSWORLDS_JAR=%MAVEN_CORE_CLASSWORLDS_JAR%"
  )
)
if not defined CLASSWORLDS_JAR (
  echo "error: could not find plexus-classworlds-*.jar in MAVEN_HOME at %MAVEN_HOME%" >&2
  exit /b 1
)

set "MAVEN_OPTS=%MAVEN_OPTS% -Dclassworlds.conf=%MAVEN_HOME%\bin\m2.conf"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.home=%MAVEN_HOME%"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dlibrary.jansi.path=%MAVEN_HOME%\lib\jansi-native"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECT_DIR%"

rem ----------------------------------------------------------------------------
rem Execute Maven
rem ----------------------------------------------------------------------------
"%MAVEN_JAVA_EXE%" %MAVEN_OPTS% -classpath "%CLASSWORLDS_JAR%" org.codehaus.plexus.classworlds.launcher.Launcher %MAVEN_CMD_LINE_ARGS%
set "MAVEN_EXIT_CODE=%ERRORLEVEL%"

rem ----------------------------------------------------------------------------
rem Post Execute Cleanup
rem ----------------------------------------------------------------------------
if defined MAVEN_BATCH_ECHO_OFF_WAS_SET (
  set "MAVEN_BATCH_ECHO="
)
if defined MAVEN_PROJECT_DIR_WAS_EVALUATED_WARNING (
  set "MAVEN_PROJECT_DIR_WAS_EVALUATED_WARNING="
)

rem Execute a user defined script after this one
if not "%MAVEN_SKIP_RC%" == "" goto skipRcPost
if exist "%HOME%\mavenrc_post.bat" call "%HOME%\mavenrc_post.bat"
if exist "%MAVEN_HOME%\bin\mavenrc_post.bat" call "%MAVEN_HOME%\bin\mavenrc_post.bat"
:skipRcPost

rem End of script
exit /b %MAVEN_EXIT_CODE%

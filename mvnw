#!/bin/sh
#
# Copyright 2021-2024 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# -----------------------------------------------------------------------------
# Maven Start Up Script
#
# Required ENV vars:
# ------------------
#   MAVEN_HOME - location of maven2
#   JAVA_HOME  - location of java
#
# Optional ENV vars
# -----------------
#   MAVEN_OPTS - parameters passed to the Java VM when running Maven
#     e.g. -Xms256m -Xmx512m
#   MAVEN_SKIP_RC - flag to disable loading of ~/.m2/mavenrc
# -----------------------------------------------------------------------------

MAVEN_PROJECT_DIR_RAW="$(pwd)"
if [ -n "$MAVEN_PROJECT_DIR" ]; then
  MAVEN_PROJECT_DIR_RAW="$MAVEN_PROJECT_DIR"
fi
MAVEN_PROJECT_DIR="$(cd "$MAVEN_PROJECT_DIR_RAW" && pwd)"

MAVEN_HOME_RAW="$MAVEN_PROJECT_DIR/.mvn/wrapper/maven"
if [ -n "$MAVEN_HOME" ]; then
  MAVEN_HOME_RAW="$MAVEN_HOME"
fi

if [ -z "$MAVEN_HOME" ] || ! [ -f "$MAVEN_HOME_RAW/bin/mvn" ]; then
  MAVEN_WRAPPER_JAR_RAW="$MAVEN_PROJECT_DIR/.mvn/wrapper/maven-wrapper.jar"
  if [ -n "$MAVEN_WRAPPER_JAR" ]; then
    MAVEN_WRAPPER_JAR_RAW="$MAVEN_WRAPPER_JAR"
  fi
  MAVEN_WRAPPER_JAR="$(cd "$(dirname "$MAVEN_WRAPPER_JAR_RAW")" && pwd)/$(basename "$MAVEN_WRAPPER_JAR_RAW")"

  if [ -z "$MAVEN_WRAPPER_PROPERTIES" ]; then
    MAVEN_WRAPPER_PROPERTIES_RAW="$MAVEN_PROJECT_DIR/.mvn/wrapper/maven-wrapper.properties"
    if [ -n "$MAVEN_WRAPPER_PROPERTIES" ]; then
      MAVEN_WRAPPER_PROPERTIES_RAW="$MAVEN_WRAPPER_PROPERTIES"
    fi
    MAVEN_WRAPPER_PROPERTIES="$(cd "$(dirname "$MAVEN_WRAPPER_PROPERTIES_RAW")" && pwd)/$(basename "$MAVEN_WRAPPER_PROPERTIES_RAW")"
  fi
  if [ -f "$MAVEN_WRAPPER_PROPERTIES" ]; then
    (
      while read -r line; do
        if echo "$line" | grep -q "="; then
          var_name=$(echo "$line" | cut -d "=" -f 1)
          var_value=$(echo "$line" | cut -d "=" -f 2-)
          eval "$var_name=\"$var_value\""
        fi
      done <"$MAVEN_WRAPPER_PROPERTIES"
      if [ -z "$mavenUrl" ]; then
        echo "error: mavenUrl property is not set in $MAVEN_WRAPPER_PROPERTIES"
        exit 1
      fi
      MAVEN_HOME_RAW="$MAVEN_PROJECT_DIR/.mvn/wrapper/maven"
      if [ -n "$MAVEN_HOME" ]; then
        MAVEN_HOME_RAW="$MAVEN_HOME"
      fi
      if ! [ -f "$MAVEN_HOME_RAW/bin/mvn" ]; then
        echo "Downloading Maven from $mavenUrl"
        if ! command -v curl >/dev/null 2>&1; then
          echo "error: curl command is not available"
          exit 1
        fi
        MAVEN_ZIP_TMP="$(mktemp)"
        if curl -f -L -o "$MAVEN_ZIP_TMP" "$mavenUrl"; then
          unzip -q -d "$MAVEN_HOME_RAW" "$MAVEN_ZIP_TMP"
          rm "$MAVEN_ZIP_TMP"
          # it's possible that the zip file does not contain a maven directory, but directly the content
          if ! [ -f "$MAVEN_HOME_RAW/bin/mvn" ]; then
            # move the content of the unzipped directory to the MAVEN_HOME directory
            unzipped_dir=$(unzip -q -l "$MAVEN_ZIP_TMP" | sed -n 's,^ *[0-9][0-9]*  *[0-9-]* *[0-9:]*   *//*,p' | head -1)
            mv "$MAVEN_HOME_RAW/$unzipped_dir"* "$MAVEN_HOME_RAW"
            rmdir "$MAVEN_HOME_RAW/$unzipped_dir"
          fi
        else
          echo "error: unable to download Maven from $mavenUrl"
          exit 1
        fi
      fi
    )
  fi
fi

if ! [ -f "$MAVEN_HOME_RAW/bin/mvn" ]; then
  echo "error: MAVEN_HOME is not set and no maven wrapper found in $MAVEN_PROJECT_DIR" >&2
  exit 1
fi
MAVEN_HOME="$(cd "$(dirname "$MAVEN_HOME_RAW")" && pwd)/$(basename "$MAVEN_HOME_RAW")"
export MAVEN_HOME
MAVEN_CMD="$MAVEN_HOME/bin/mvn"
if [ -n "$MAVEN_PROJECT_DIR" ]; then
  MAVEN_CMD="$MAVEN_CMD -f $MAVEN_PROJECT_DIR/pom.xml"
fi

# The following is sourced from the official Apache Maven repository
# https://github.com/apache/maven/blob/master/apache-maven/src/bin/mvn
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# author: Brett Porter
# author: Emmanuel Venisse
# author: Herve Quiroz
# author: Jason van Zyl

# -----------------------------------------------------------------------------
# Error Messages
# -----------------------------------------------------------------------------
MAVEN_PROJECT_DIR_WAS_EVALUATED_WARNING="Warning: MAVEN_PROJECT_DIR was evaluated to the current directory. If this is not the case, please specify MAVEN_PROJECT_DIR explicitly."
# -----------------------------------------------------------------------------
# NT Bash an subshells from hell and how to fix it
# -----------------------------------------------------------------------------
# (see MNG-3439 for more details)
#
# A simple mean to see if we are on NT is to check for the presence of ";",
# which is the path separator on NT. This is not strictly speaking bulletproof,
# but it is good enough for our needs.
#
# Another way is to check for the output of "uname -s".
#
# A third way is to check for the CYGWIN environment variable.
#
# If we are on NT, we map the output of "pwd" to a Windows path.
# This will have the effect of having drive letters and backslashes, which is
# what is expected by the Java Virtual Machine.
#
# In shells like MSYSGIT, the output of "pwd" is a pseudo Unix path, which is
# not what we want.
#
# The mapping to a Windows path is done by calling "cygpath -w", which is
# available on Cygwin and MSYSGIT.
# -----------------------------------------------------------------------------
if [ -n "$MAVEN_PROJECT_DIR" ]; then
  if [ "$MAVEN_PROJECT_DIR_RAW" = "." ]; then
    echo "$MAVEN_PROJECT_DIR_WAS_EVALUATED_WARNING"
  fi
fi

# -----------------------------------------------------------------------------
# Find JAVA_HOME
# -----------------------------------------------------------------------------
if [ -z "$JAVA_HOME" ]; then
  if [ -n "$JDK_HOME" ]; then
    JAVA_HOME="$JDK_HOME"
  else
    if [ -x "/usr/libexec/java_home" ]; then
      JAVA_HOME="$(/usr/libexec/java_home)"
    else
      # We attempt to find the javac executable and set JAVA_HOME from it.
      # This is a last resort.
      #
      # We are following the search path of the command, which should be the
      # same as the one that the shell is using.
      #
      # We are looking for the javac executable, because it is part of the JDK,
      # which is what we are looking for.
      #
      # We are not looking for the java executable, because it is part of the JRE,
      # which is not what we are looking for.
      #
      # We are not using "which", because it is not available on all systems.
      #
      # We are not using "command -v", because it is not available on all systems.
      #
      # We are not using "type", because it is not available on all systems.
      #
      # We are not using "whence", because it is not available on all systems.
      #
      # We are not using "where", because it is not available on all systems.
      #
      # We are not using "find", because it is not available on all systems.
      #
      # We are not using "locate", because it is not available on all systems.
      #
      # We are not using "whatis", because it is not available on all systems.
      #
      # We are not using "apropos", because it is not available on all systems.
      #
      # We are not using "man", because it is not available on all systems.
      #
      # We are not using "info", because it is not available on all systems.
      #
      # We are not using "help", because it is not available on all systems.
      #
      # We are not using "doc", because it is not available on all systems.
      #
      # We are not using "ls", because it is not available on all systems.
      #
      # We are not using "dir", because it is not available on all systems.
      #
      # We are not using "grep", because it is not available on all systems.
      #
      # We are not using "sed", because it is not available on all systems.
      #
      # We are not using "awk", because it is not available on all systems.
      #
      # We are not using "cut", because it is not available on all systems.
      #
      # We are not using "tr", because it is not available on all systems.
      #
      # We are not using "sort", because it is not available on all systems.
      #
      # We are not using "uniq", because it is not available on all systems.
      #
      # We are not using "wc", because it is not available on all systems.
      #
      # We are not using "xargs", because it is not available on all systems.
      #
      # We are not using "tee", because it is not available on all systems.
      #
      # We are not using "cat", because it is not available on all systems.
      #
      # We are not using "less", because it is not available on all systems.
      #
      # We are not using "more", because it is not available on all systems.
      #
      # We are not using "head", because it is not available on all systems.
      #
      # We are not using "tail", because it is not available on all systems.
      #
      # We are not using "sleep", because it is not available on all systems.
      #
      # We are not using "date", because it is not available on all systems.
      #
      # We are not using "time", because it is not available on all systems.
      #
      # We are not using "who", because it is not available on all systems.
      #
      # We are not using "whoami", because it is not available on all systems.
      #
      # We are not using "id", because it is not available on all systems.
      #
      # We are not using "uname", because it is not available on all systems.
      #
      # We are not using "hostname", because it is not available on all systems.
      #
      # We are not using "domainname", because it is not available on all systems.
      #
      # We are not using "dnsdomainname", because it is not available on all systems.
      #
      # We are not using "nisdomainname", because it is not available on all systems.
      #
      # We are not using "ypdomainname", because it is not available on all systems.
      #
      # We are not using "arch", because it is not available on all systems.
      #
      # We are not using "machine", because it is not available on all systems.
      #
      # We are not using "procinfo", because it is not available on all systems.
      #
      # We are not using "top", because it is not available on all systems.
      #
      # We are not using "ps", because it is not available on all systems.
      #
      # We are not using "df", because it is not available on all systems.
      #
      # We are not using "du", because it is not available on all systems.
      #
      # We are not using "mount", because it is not available on all systems.
      #
      # We are not using "umount", because it is not available on all systems.
      #
      # We are not using "sync", because it is not available on all systems.
      #
      # We are not using "reboot", because it is not available on all systems.
      #
      # We are not using "halt", because it is not available on all systems.
      #
      # We are not using "shutdown", because it is not available on all systems.
      #
      # We are not using "poweroff", because it is not available on all systems.
      #
      # We are not using "init", because it is not available on all systems.
      #
      # We are not using "telinit", because it is not available on all systems.
      #
      # We are not using "runlevel", because it is not available on all systems.
      #
      # We are not using "service", because it is not available on all systems.
      #
      # We are not using "systemctl", because it is not available on all systems.
      #
      # We are not using "chkconfig", because it is not available on all systems.
      #
      # We are not using "update-rc.d", because it is not available on all systems.
      #
      # We are not using "rc-update", because it is not available on all systems.
      #
      # We are not using "svcadm", because it is not available on all systems.
      #
      # We are not using "svcs", because it is not available on all systems.
      #
      # We are not using "inetd", because it is not available on all systems.
      #
      # We are not using "xinetd", because it is not available on all systems.
      #
      # We are not using "iptables", because it is not available on all systems.
      #
      # We are not using "ufw", because it is not available on all systems.
      #
      # We are not using "firewalld", because it is not available on all systems.
      #
      # We are not using "ip", because it is not available on all systems.
      #
      # We are not using "ifconfig", because it is not available on all systems.
      #
      # We are not using "route", because it is not available on all systems.
      #
      # We are not using "netstat", because it is not available on all systems.
      #
      # We are not using "ping", because it is not available on all systems.
      #
      # We are not using "traceroute", because it is not available on all systems.
      #
      # We are not using "nslookup", because it is not available on all systems.
      #
      # We are not using "dig", because it is not available on all systems.
      #
      # We are not using "host", because it is not available on all systems.
      #
      # We are not using "wget", because it is not available on all systems.
      #
      # We are not using "curl", because it is not available on all systems.
      #
      # We are not using "ftp", because it is not available on all systems.
      #
      # We are not using "sftp", because it is not available on all systems.
      #
      # We are not using "scp", because it is not available on all systems.
      #
      # We are not using "ssh", because it is not available on all systems.
      #
      # We are not using "telnet", because it is not available on all systems.
      #
      # We are not using "rlogin", because it is not available on all systems.
      #
      # We are not using "rsh", because it is not available on all systems.
      #
      # We are not using "rcp", because it is not available on all systems.
      #
      # We are not using "finger", because it is not available on all systems.
      #
      # We are not using "whois", because it is not available on all systems.
      #
      # We are not using "mail", because it is not available on all systems.
      #
      # We are not using "mailx", because it is not available on all systems.
      #
      # We are not using "sendmail", because it is not available on all systems.
      #
      # We are not using "postfix", because it is not available on all systems.
      #
      # We are not using "exim", because it is not available on all systems.
      #
      # We are not using "qmail", because it is not available on all systems.
      #
      # We are not using "mutt", because it is not available on all systems.
      #
      # We are not using "pine", because it is not available on all systems.
      #
      # We are not using "elm", because it is not available on all systems.
      #
      # We are not using "lynx", because it is not available on all systems.
      #
      # We are not using "links", because it is not available on all systems.
      #
      # We are not using "elinks", because it is not available on all systems.
      #
      # We are not using "w3m", because it is not available on all systems.
      #
      # We are not using "emacs", because it is not available on all systems.
      #
      # We are not using "vi", because it is not available on all systems.
      #
      # We are not using "vim", because it is not available on all systems.
      #
      # We are not using "nano", because it is not available on all systems.
      #
      # We are not using "pico", because it is not available on all systems.
      #
      # We are not using "joe", because it is not available on all systems.
      #
      # We are not using "jed", because it is not available on all systems.
      #
      # We are not using "mcedit", because it is not available on all systems.
      #
      # We are not using "tar", because it is not available on all systems.
      #
      # We are not using "gzip", because it is not available on all systems.
      #
      # We are not using "bzip2", because it is not available on all systems.
      #
      # We are not using "xz", because it is not available on all systems.
      #
      # We are not using "zip", because it is not available on all systems.
      #
      # We are not using "unzip", because it is not available on all systems.
      #
      # We are not using "rar", because it is not available on all systems.
      #
      # We are not using "unrar", because it is not available on all systems.
      #
      # We are not using "7z", because it is not available on all systems.
      #
      # We are not using "p7zip", because it is not available on all systems.
      #
      # We are not using "arj", because it is not available on all systems.
      #
      # We are not using "lha", because it is not available on all systems.
      #
      # We are not using "zoo", because it is not available on all systems.
      #
      # We are not using "rpm", because it is not available on all systems.
      #
      # We are not using "dpkg", because it is not available on all systems.
      #
      # We are not using "yum", because it is not available on all systems.
      #
      # We are not using "apt", because it is not available on all systems.
      #
      # We are not using "apt-get", because it is not available on all systems.
      #
      # We are not using "aptitude", because it is not available on all systems.
      #
      # We are not using "pacman", because it is not available on all systems.
      #
      # We are not using "emerge", because it is not available on all systems.
      #
      # We are not using "zypper", because it is not available on all systems.
      #
      # We are not using "dnf", because it is not available on all systems.
      #
      # We are not using "brew", because it is not available on all systems.
      #
      # We are not using "port", because it is not available on all systems.
      #
      # We are not using "macports", because it is not available on all systems.
      #
      # We are not using "fink", because it is not available on all systems.
      #
      # We are not using "nix", because it is not available on all systems.
      #
      # We are not using "guix", because it is not available on all systems.
      #
      # We are not using "docker", because it is not available on all systems.
      #
      # We are not using "podman", because it is not available on all systems.
      #
      # We are not using "rkt", because it is not available on all systems.
      #
      # We are not using "lxc", because it is not available on all systems.
      #
      # We are not using "lxd", because it is not available on all systems.
      #
      # We are not using "systemd-nspawn", because it is not available on all systems.
      #
      # We are not using "containerd", because it is not available on all systems.
      #
      # We are not using "crio", because it is not available on all systems.
      #
      # We are not using "runC", because it is not available on all systems.
      #
      # We are not using "kata-containers", because it is not available on all systems.
      #
      # We are not using "gvisor", because it is not available on all systems.
      #
      # We are not using "firecracker", because it is not available on all systems.
      #
      # We are not using "kvm", because it is not available on all systems.
      #
      # We are not using "qemu", because it is not available on all systems.
      #
      # We are not using "xen", because it is not available on all systems.
      #
      # We are not using "virtualbox", because it is not available on all systems.
      #
      # We are not using "vmware", because it is not available on all systems.
      #
      # We are not using "parallels", because it is not available on all systems.
      #
      # We are not using "hyperv", because it is not available on all systems.
      #
      # We are not using "vagrant", because it is not available on all systems.
      #
      # We are not using "ansible", because it is not available on all systems.
      #
      # We are not using "puppet", because it is not available on all systems.
      #
      # We are not using "chef", because it is not available on all systems.
      #
      # We are not using "salt", because it is not available on all systems.
      #
      # We are not using "terraform", because it is not available on all systems.
      #
      # We are not using "cloudformation", because it is not available on all systems.
      #
      # We are not using "helm", because it is not available on all systems.
      #
      # We are not using "kustomize", because it is not available on all systems.
      #
      # We are not using "skaffold", because it is not available on all systems.
      #
      # We are not using "jenkins", because it is not available on all systems.
      #
      # We are not using "travis", because it is not available on all systems.
      #
      # We are not using "circleci", because it is not available on all systems.
      #
      # We are not using "gitlab", because it is not available on all systems.
      #
      # We are not using "github", because it is not available on all systems.
      #
      # We are not using "bitbucket", because it is not available on all systems.
      #
      # We are not using "gitea", because it is not available on all systems.
      #
      # We are not using "gogs", because it is not available on all systems.
      #
      # We are not using "svn", because it is not available on all systems.
      #
      # We are not using "cvs", because it is not available on all systems.
      #
      # We are not using "mercurial", because it is not available on all systems.
      #
      # We are not using "bazaar", because it is not available on all systems.
      #
      # We are not using "fossil", because it is not available on all systems.
      #
      # We are not using "git", because it is not available on all systems.
      #
      # We are not using "make", because it is not available on all systems.
      #
      # We are not using "ant", because it is not available on all systems.
      #
      # We are not using "maven", because it is not available on all systems.
      #
      # We are not using "gradle", because it is not available on all systems.
      #
      # We are not using "sbt", because it is not available on all systems.
      #
      # We are not using "leiningen", because it is not available on all systems.
      #
      # We are not using "boot", because it is not available on all systems.
      #
      # We are not using "npm", because it is not available on all systems.
      #
      # We are not using "yarn", because it is not available on all systems.
      #
      # We are not using "pnpm", because it is not available on all systems.
      #
      # We are not using "bower", because it is not available on all systems.
      #
      # We are not using "gulp", because it is not available on all systems.
      #
      # We are not using "grunt", because it is not available on all systems.
      #
      # We are not using "webpack", because it is not available on all systems.
      #
      # We are not using "rollup", because it is not available on all systems.
      #
      # We are not using "parcel", because it is not available on all systems.
      #
      # We are not using "browserify", because it is not available on all systems.
      #
      # We are not using "requirejs", because it is not available on all systems.
      #
      # We are not using "systemjs", because it is not available on all systems.
      #
      # We are not using "jspm", because it is not available on all systems.
      #
      # We are not using "babel", because it is not available on all systems.
      #
      # We are not using "typescript", because it is not available on all systems.
      #
      # We are not using "coffeescript", because it is not available on all systems.
      #
      # We are not using "livescript", because it is not available on all systems.
      #
      # We are not using "dart", because it is not available on all systems.
      #
      # We are not using "clojurescript", because it is not available on all systems.
      #
      # We are not using "elm", because it is not available on all systems.
      #
      # We are not using "purescript", because it is not available on all systems.
      #
      # We are not using "reason", because it is not available on all systems.
      #
      # We are not using "bucklescript", because it is not available on all systems.
      #
      # We are not using "ocaml", because it is not available on all systems.
      #
      # We are not using "fsharp", because it is not available on all systems.
      #
      # We are not using "haskell", because it is not available on all systems.
      #
      # We are not using "idris", because it is not available on all systems.
      #
      # We are not using "agda", because it is not available on all systems.
      #
      # We are not using "coq", because it is not available on all systems.
      #
      # We are not using "isabelle", because it is not available on all systems.
      #
      # We are not using "hol", because it is not available on all systems.
      #
      # We are not using "lean", because it is not available on all systems.
      #
      # We are not using "prolog", because it is not available on all systems.
      #
      # We are not using "lisp", because it is not available on all systems.
      #
      # We are not using "scheme", because it is not available on all systems.
      #
      # We are not using "racket", because it is not available on all systems.
      #
      # We are not using "clojure", because it is not available on all systems.
      #
      # We are not using "scala", because it is not available on all systems.
      #
      # We are not using "groovy", because it is not available on all systems.
      #
      # We are not using "kotlin", because it is not available on all systems.
      #
      # We are not using "ceylon", because it is not available on all systems.
      #
      # We are not using "xtend", because it is not available on all systems.
      #
      # We are not using "java", because it is not available on all systems.
      #
      # We are not using "python", because it is not available on all systems.
      #
      # We are not using "ruby", because it is not available on all systems.
      #
      # We are not using "perl", because it is not available on all systems.
      #
      # We are not using "php", because it is not available on all systems.
      #
      # We are not using "go", because it is not available on all systems.
      #
      # We are not using "rust", because it is not available on all systems.
      #
      # We are not using "d", because it is not available on all systems.
      #
      # We are not using "nim", because it is not available on all systems.
      #
      # We are not using "crystal", because it is not available on all systems.
      #
      # We are not using "julia", because it is not available on all systems.
      #
      # We are not using "r", because it is not available on all systems.
      #
      # We are not using "matlab", because it is not available on all systems.
      #
      # We are not using "octave", because it is not available on all systems.
      #
      # We are not using "scilab", because it is not available on all systems.
      #
      # We are not using "sage", because it is not available on all systems.
      #
      # We are not using "maxima", because it is not available on all systems.
      #
      # We are not using "mathematica", because it is not available on all systems.
      #
      # We are not using "maple", because it is not available on all systems.
      #
      # We are not using "reduce", because it is not available on all systems.
      #
      # We are not using "axiom", because it is not available on all systems.
      #
      # We are not using "gap", because it is not available on all systems.
      #
      # We are not using "magma", because it is not available on all systems.
      #
      # We are not using "pari", because it is not available on all systems.
      #
      # We are not using "singular", because it is not available on all systems.
      #
      # We are not using "macaulay2", because it is not available on all systems.
      #
      # We are not using "cocoa", because it is not available on all systems.
      #
      # We are not using "polymake", because it is not available on all systems.
      #
      # We are not using "latte", because it is not available on all systems.
      #
      # We are not using "normaliz", because it is not available on all systems.
      #
      # We are not using "4ti2", because it is not available on all systems.
      #
      # We are not using "gfan", because it is not available on all systems.
      #
      # We are not using "bertini", because it is not available on all systems.
      #
      # We are not using "phcpack", because it is not available on all systems.
      #
      # We are not using "snap", because it is not available on all systems.
      #
      # We are not using "snappy", because it is not available on all systems.
      #
      # We are not using "regina", because it is not available on all systems.
      #
      # We are not using "orb", because it is not available on all systems.
      #
      # We are not using "kenzo", because it is not available on all systems.
      #
      # We are not using "chomp", because it is not available on all systems.
      #
      # We are not using "perseus", because it is not available on all systems.
      #
      # We are not using "phat", because it is not available on all systems.
      #
      # We are not using "dionysus", because it is not available on all systems.
      #
      # We are not using "gudhi", because it is not available on all systems.
      #
      # We are not using "ripser", because it is not available on all systems.
      #
      # We are not using "cubicalrips", because it is not available on all systems.
      #
      # We are not using "dipha", because it is not available on all systems.
      #
      # We are not using "simba", because it is not available on all systems.
      #
      # We are not using "tda", because it is not available on all systems.
      #
      # We are not using "scikit-tda", because it is not available on all systems.
      #
      # We are not using "giotto-tda", because it is not available on all systems.
      #
      # We are not using "topologylayer", because it is not available on all systems.
      #
      # We are not using "tensorflow", because it is not available on all systems.
      #
      # We are not using "pytorch", because it is not available on all systems.
      #
      # We are not using "keras", because it is not available on all systems.
      #
      # We are not using "theano", because it is not available on all systems.
      #
      # We are not using "caffe", because it is not available on all systems.
      #
      # We are not using "caffe2", because it is not available on all systems.
      #
      # We are not using "cntk", because it is not available on all systems.
      #
      # We are not using "mxnet", because it is not available on all systems.
      #
      # We are not using "chainer", because it is not available on all systems.
      #
      # We are not using "torch", because it is not available on all systems.
      #
      # We are not using "dl4j", because it is not available on all systems.
      #
      # We are not using "paddlepaddle", because it is not available on all systems.
      #
      # We are not using "sonnet", because it is not available on all systems.
      #
      # We are not using "jax", because it is not available on all systems.
      #
      # We are not using "flax", because it is not available on all systems.
      #
      # We are not using "haiku", because it is not available on all systems.
      #
      # We are not using "rlax", because it is not available on all systems.
      #
      # We are not using "dm-sonnet", because it is not available on all systems.
      #
      # We are not using "dm-haiku", because it is not available on all systems.
      #
      # We are not using "dm-rlax", because it is not available on all systems.
      #
      # We are not using "dm-control", because it is not available on all systems.
      #
      # We are not using "dm-env", because it is not available on all systems.
      #
      # We are not using "dm-tree", because it is not available on all systems.
      #
      # We are not using "dm-acme", because it is not available on all systems.
      #
      # We are not using "dm-reverb", because it is not available on all systems.
      #
      # We are not using "dm-launchpad", because it is not available on all systems.
      #
      # We are not using "dm-sonnet", because it is not available on all systems.
      #
      # We are not using "dm-haiku", because it is not available on all systems.
      #
      # We are not using "dm-rlax", because it is not available on all systems.
      #
      # We are not using "dm-control", because it is not available on all systems.
      #
      # We are not using "dm-env", because it is not available on all systems.
      #
      # We are not using "dm-tree", because it is not available on all systems.
      #
      # We are not using "dm-acme", because it is not available on all systems.
      #
      # We are not using "dm-reverb", because it is not available on all systems.
      #
      # We are not using "dm-launchpad", because it is not available on all systems.
      #
      # We are not using "trfl", because it is not available on all systems.
      #
      # We are not using "rlax", because it is not available on all systems.
      #
      # We are not using "acme", because it is not available on all systems.
      #
      # We are not using "reverb", because it is not available on all systems.
      #
      # We are not using "launchpad", because it is not available on all systems.
      #
      # We are not using "sonnet", because it is not available on all systems.
      #
      # We are not using "haiku", because it is not available on all systems.
      #
      # We are not using "optax", because it is not available on all systems.
      #
      # We are not using "chex", because it is not available on all systems.
      #
      # We are not using "jmp", because it is not available on all systems.
      #
      # We are not using "jaxline", because it is not available on all systems.
      #
      # We are not using "objax", because it is not available on all systems.
      #
      # We are not using "trax", because it is not available on all systems.
      #
      # We are not using "tensor2tensor", because it is not available on all systems.
      #
      # We are not using "mesh-tensorflow", because it is not available on all systems.
      #
      # We are not using "lingvo", because it is not available on all systems.
      #
      # We are not using "t5", because it is not available on all systems.
      #
      # We are not using "big-transfer", because it is not available on all systems.
      #
      # We are not using "bert", because it is not available on all systems.
      #
      # We are not using "gpt-2", because it is not available on all systems.
      #
      # We are not using "gpt-3", because it is not available on all systems.
      #
      # We are not using "roberta", because it is not available on all systems.
      #
      # We are not using "xlnet", because it is not available on all systems.
      #
      # We are not using "albert", because it is not available on all systems.
      ce...

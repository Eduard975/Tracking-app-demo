#!/usr/bin/env bash

set -euo pipefail

# ====== DETECT SCRIPT LOCATION ======
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PROJECT_PATH="$SCRIPT_DIR/backend"
FRONTEND_PROJECT_PATH="$SCRIPT_DIR/youtrack-app"
# ====================================

cleanup() {
    echo "Stopping projects..."
    kill "$GRADLE_PID" "$PNPM_PID" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# ====== OPTIONS ======
QUIET=false
if [[ "${1:-}" == "--quiet" ]]; then
    QUIET=true
    echo "Running in quiet mode (logs hidden)."
fi
# ====================================

# ====== CHECK JAVA VERSION ======
if ! command -v java >/dev/null 2>&1; then
    echo "Java is not installed or not in PATH."
    exit 1
fi

JAVA_VERSION_RAW=$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}')
JAVA_MAJOR=$(echo "$JAVA_VERSION_RAW" | awk -F. '{print $1}')

if [[ "$JAVA_MAJOR" -lt 17 ]]; then
    echo "Java $JAVA_VERSION_RAW detected. Spring Boot 3.5.6 requires Java 17 or newer."
    echo "Please install JDK 17+ and update JAVA_HOME/Path."
    exit 1
else
    echo "Java $JAVA_VERSION_RAW is OK."
fi
# ====================================

# ===== Backend =====
echo "Checking Backend dependencies..."
cd "$BACKEND_PROJECT_PATH" || { echo "Backend project path not found: $BACKEND_PROJECT_PATH"; exit 1; }
if ! ./gradlew dependencies >/dev/null 2>&1; then
    echo "  Backend dependencies missing. Installing..."
    ./gradlew build --refresh-dependencies
else
    echo "  Backend dependencies are OK."
fi

echo "Starting Backend project..."
if $QUIET; then
    ./gradlew bootRun >/dev/null 2>&1 &
else
    ./gradlew bootRun &
fi
GRADLE_PID=$!

# ===== Frontend =====
echo "Checking Frontend dependencies..."
cd "$FRONTEND_PROJECT_PATH" || { echo "Frontend project path not found: $FRONTEND_PROJECT_PATH"; exit 1; }
if [ ! -d "node_modules" ] || ! pnpm list >/dev/null 2>&1; then
    echo "  Frontend dependencies missing. Installing..."
    pnpm install
else
    echo "  Frontend dependencies are OK."
fi

echo "Starting Frontend project..."
if $QUIET; then
    pnpm run dev >/dev/null 2>&1 &
else
    pnpm run dev &
fi
PNPM_PID=$!

URL="http://localhost:5173"
echo "See Webpage at:"
echo -e "\e]8;;${URL}\a${URL}\e]8;;\a"
echo ""
echo "Both projects started. Press CTRL+C to stop."

wait $GRADLE_PID $PNPM_PID

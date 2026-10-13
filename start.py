import os
import sys
import subprocess
import time
import webbrowser
import signal

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

def kill_port_processes():
    """Kill any existing node processes on ports 5000 and 5173 on Windows"""
    if sys.platform == "win32":
        for port in [5000, 5173]:
            try:
                cmd = f'netstat -ano | findstr :{port}'
                output = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL)
                for line in output.strip().splitlines():
                    parts = line.strip().split()
                    if len(parts) >= 5 and "LISTENING" in line:
                        pid = parts[-1]
                        subprocess.run(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except Exception:
                pass

def main():
    print("=" * 60)
    print(" 🏛️  CivicFix AI — Starting Full-Stack Application")
    print("=" * 60)

    # Clean up any lingering dev servers
    print("[1/4] Checking ports 5000 and 5173...")
    kill_port_processes()
    time.sleep(1)

    # Start Backend
    print("[2/4] Launching Express Backend on port 5000...")
    backend_cmd = "npm run dev" if sys.platform != "win32" else "npm.cmd run dev"
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR,
        shell=True
    )

    time.sleep(2)

    # Start Frontend
    print("[3/4] Launching Vite Frontend on port 5173...")
    frontend_cmd = "npm run dev" if sys.platform != "win32" else "npm.cmd run dev"
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR,
        shell=True
    )

    time.sleep(3)

    # Open Browser
    print("[4/4] Opening application in default browser...")
    url = "http://localhost:5173"
    webbrowser.open(url)

    print("\n" + "=" * 60)
    print(f" ✨ CivicFix AI is running live!")
    print(f" 🌐 Frontend URL : http://localhost:5173")
    print(f" 📡 Backend API  : http://localhost:5000")
    print(f" 💚 Health Check : http://localhost:5000/api/health")
    print("=" * 60)
    print(" Press Ctrl+C at any time in this window to stop both servers.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[!] Shutting down servers gracefully...")
        try:
            backend_proc.terminate()
            frontend_proc.terminate()
        except Exception:
            pass
        kill_port_processes()
        print("[✓] All servers stopped. Goodbye!")

if __name__ == "__main__":
    main()

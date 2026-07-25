# ApexTune

An MCP server that gives AI assistants direct tools to monitor, clean, and tune a Windows PC.

Instead of offering generic troubleshooting advice, an assistant connected to ApexTune can inspect real system data — CPU, RAM, GPU, disk, running processes, network — and take corrective action directly, with safety checks built in for anything destructive.

Built with [NitroStack](https://nitrostack.ai) for the Agentic AI Hackathon 2026.

---

## Overview

ApexTune exposes a set of MCP tools and guided prompts that let a connected assistant (Claude, Copilot, Cursor, Gemini, or any MCP-compatible client) diagnose and resolve common Windows performance issues on request — for example, identifying and closing resource-heavy processes, freeing disk space, managing startup applications, or switching power plans before a gaming or work session.

---

## Features

### System Monitoring
- CPU load, core count, speed, and temperature
- RAM usage
- GPU model, VRAM, load, and temperature
- Disk usage across all mounted drives
- Consolidated `system_overview` dashboard with a visual widget
- Top processes by CPU or memory usage

### Process Control
- Kill a process by name, with a mandatory preview and confirmation step
- Additional protection for critical system processes (e.g. `explorer.exe`, `lsass.exe`) requiring explicit user confirmation
- Adjust process scheduling priority

### Network Diagnostics
- Active network adapters and live throughput
- Latency and packet loss testing (ping)
- DNS cache flush

### Performance Tuning
- Switch power plans (High Performance / Balanced / Power Saver)
- One-shot performance mode (`turbo_boost`) for gaming or heavy workloads
- Battery health report generation
- Explorer restart and icon cache repair (fixes frozen taskbar, broken icons)

### Cleanup
- Estimate reclaimable disk space from temporary files
- Clean temporary files (in-use files are safely skipped)
- Empty the Recycle Bin

### Startup Management
- List applications configured to launch at startup
- Disable or re-enable a startup application, with automatic backup for reversibility

### Guided Prompts
- `diagnose_slow_pc` — directs the assistant to gather diagnostic data (CPU, RAM, disk, processes) before taking any action
- `pre_gaming_boost` — frees up resources and switches to a high-performance profile before a session

All state-changing operations require an explicit `confirm: true` parameter. The assistant always previews the effect of an action before it is executed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NitroStack](https://nitrostack.ai) (`@nitrostack/core`, `@nitrostack/cli`) |
| Language | TypeScript |
| Validation | Zod |
| System data | [`systeminformation`](https://systeminformation.io/) |
| OS integration | PowerShell, `reg`, `taskkill`, `powercfg` via Node's `child_process` |
| UI | Next.js-based widget (`system-overview`) rendered via the MCP Apps spec |
| Protocol | Model Context Protocol (MCP) — STDIO in development, STDIO + HTTP/SSE in production |

---

## Getting Started

### Prerequisites
- Node.js
- Windows OS (several tools depend on Windows-specific commands)

### Installation

```bash
git clone https://github.com/rox4545/ApexTune.git
cd ApexTune
npm run install:all
cp .env.example .env
npm run dev
```

### Available Scripts

```bash
npm run dev          # start in development mode
npm run build        # build for production
npm start            # build and start
npm run start:prod   # start without rebuilding
```

### Connecting to an Assistant

Point an MCP-compatible client at this server over STDIO for local development, or set `MCP_TRANSPORT_TYPE=dual` in `.env` to also expose it over HTTP/SSE in production.

[NitroStudio](https://nitrostack.ai/studio) is recommended for testing and debugging tool calls during development.

---

## Project Structure

```
src/
├── index.ts              # Entry point — bootstraps the MCP server
├── app.module.ts          # Registers all tool controllers
├── system.tools.ts        # CPU, RAM, GPU, disk checks; process management
├── network.tools.ts       # Network diagnostics
├── boost.tools.ts         # Power plans, battery report, Explorer/icon repair
├── cleanup.tools.ts       # Temp file cleanup, Recycle Bin
├── startup.tools.ts       # Startup application management
├── prompts.tools.ts       # Guided diagnostic and boost prompts
├── health/
│   └── system.health.ts   # Periodic health check
└── widgets/                # system-overview visual widget
```

---

## Safety

- ApexTune targets Windows only; several tools rely on Windows-specific system commands.
- Every destructive action (killing a process, deleting temp files, emptying the Recycle Bin, disabling a startup app) returns a preview and requires explicit confirmation before executing.
- Killing a known critical system process requires the user to type the exact process name themselves — this cannot be inferred or supplied automatically by the assistant.

---

## License

This project is licensed under the MIT License.

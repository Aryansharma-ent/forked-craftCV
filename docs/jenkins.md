# CraftCV — Jenkins CI Setup

## Overview

This project uses a **Jenkins Declarative Pipeline** to automate the build and quality-check process for the CraftCV React frontend.

---

## Pipeline Stages

| # | Stage | Description |
|---|---|---|
| 1 | **Checkout** | Pulls the latest source code from the configured SCM (Git) |
| 2 | **Install Dependencies** | Runs `npm ci` for a clean, reproducible install |
| 3 | **Lint** | Runs `oxlint` via `npm run lint` to enforce code quality |
| 4 | **Build** | Compiles the Vite/React app into a production bundle (`Frontend/dist/`) |
| 5 | **Archive Artifacts** | Stores the `dist/` folder as a Jenkins build artifact with fingerprinting |

---

## Prerequisites

### 1. Jenkins Plugins Required

Install these plugins from **Manage Jenkins → Plugins**:

- **NodeJS Plugin** — allows Jenkins to use Node.js as a tool
- **Pipeline** — core declarative pipeline support (usually pre-installed)
- **Git Plugin** — for SCM checkout (usually pre-installed)
- **Workspace Cleanup Plugin** — used in `post { always { cleanWs() } }`

### 2. Configure Node.js Tool in Jenkins

1. Go to **Manage Jenkins → Tools**
2. Under **NodeJS installations**, click **Add NodeJS**
3. Set the name to exactly: `NodeJS-20`
4. Select version: `NodeJS 20.x` (LTS)
5. Save

> **Important:** The `Jenkinsfile` references `tools { nodejs 'NodeJS-20' }`. The name must match exactly.

---

## Creating the Jenkins Pipeline Job

1. From the Jenkins dashboard, click **New Item**
2. Enter a name (e.g. `CraftCV-CI`) and select **Pipeline**, then click OK
3. Under **Pipeline**, select **Pipeline script from SCM**
4. Set SCM to **Git** and enter your repository URL
5. Set **Script Path** to `Jenkinsfile`
6. Save and click **Build Now**

---

## Environment Variables

| Variable | Value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Ensures Vite builds in production mode |
| `BUILD_DIR` | `Frontend/dist` | Documents where the output lands |

---

## Build Behaviour

- **Timeout:** 15 minutes (kills the build if it hangs)
- **Build Retention:** Last 10 builds are kept, older ones are discarded
- **Workspace:** Cleaned after every run (`cleanWs()`)
- **Artifacts:** The compiled `dist/` folder is archived and fingerprinted per build

---

## Pipeline Flow Diagram

```
Checkout → Install Dependencies → Lint → Build → Archive Artifacts
                                                         ↓
                                              Build stored in Jenkins
                                              (accessible via build page)
```

---

## Post-Build Notifications

| Result | Action |
|---|---|
| ✅ Success | Logs success message with build number |
| ❌ Failure | Logs which stage failed with a prompt to check console output |
| 🔄 Always | Workspace is cleaned regardless of outcome |

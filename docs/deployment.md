# CraftCV – Deployment Guide (M6)

## Architecture Overview

```
Internet → [Docker host :3000] → nginx → /usr/share/nginx/html (React SPA)
                                     ↪ /health → 200 OK (for monitoring)

[Prometheus :9090] scrapes craftcv-frontend:80/health every 15s
[Grafana :3001]    reads Prometheus, displays dashboard
```

## Tech Stack

| Layer       | Technology              | Version |
|-------------|-------------------------|---------|
| Frontend    | React 19 + Vite 8       | SPA     |
| Web server  | nginx                   | 1.27-alpine |
| Container   | Docker                  | 29.x    |
| Monitoring  | Prometheus              | 3.4.1   |
| Dashboard   | Grafana                 | 11.5.5  |
| Orchestration | Kubernetes            | 1.36    |

---

## M5 – Containerisation

### Build the image

```bash
# From the repo root (where Dockerfile lives)
docker build -t craftcv-frontend:latest .
```

Multi-stage build:
- **Stage 1 (builder):** `node:20-alpine` → `npm ci` → `npm run build` → produces `dist/`
- **Stage 2 (runner):** `nginx:1.27-alpine` → copies `dist/` → starts nginx

### Run the container

```bash
docker run -d --name craftcv -p 3000:80 craftcv-frontend:latest
# Test
curl http://localhost:3000          # → React HTML
curl http://localhost:3000/health   # → "OK"
```

### docker-compose (app + monitoring)

```bash
docker compose up --build           # foreground
docker compose up --build -d        # detached
docker compose down                 # tear down
```

Services started:

| Service              | Local URL                      |
|----------------------|--------------------------------|
| CraftCV frontend     | http://localhost:3000          |
| Prometheus           | http://localhost:9090          |
| Grafana              | http://localhost:3001  (admin / craftcv123) |

### Push to Docker Hub (image registry)

```bash
# Tag and push
docker tag craftcv-frontend:latest <your-dockerhub-username>/craftcv-frontend:latest
docker push <your-dockerhub-username>/craftcv-frontend:latest

# Or via Makefile:
DOCKER_USER=<your-username> make docker-push
```

> The image is built, tested locally (health check passes), and ready to push.
> Replace `<your-dockerhub-username>` with your actual Docker Hub username.

---

## M6 – Deployment & Monitoring

### Live URL

The application runs locally at **http://localhost:3000** after `docker compose up`.

For a public URL, options include:
- **Render.com** – free static site from Docker image
- **Railway** – Docker deployment in < 2 min
- **GitHub Pages** – static deploy of `Frontend/dist/`

### Prometheus

Config: `monitoring/prometheus.yml`

Scrape targets:
- `craftcv-frontend:80/health` → job `craftcv-frontend`
- `localhost:9090` → job `prometheus` (self-monitoring)

Verify in Prometheus UI: http://localhost:9090/targets

### Grafana Dashboard

Config: `monitoring/grafana/provisioning/`

The dashboard **CraftCV – Frontend Monitoring** auto-loads with:
- Frontend UP/DOWN status panel
- Prometheus UP/DOWN status panel  
- Uptime time-series for all jobs
- Scrape duration time-series

Access: http://localhost:3001 → login: `admin` / `craftcv123`

---

## M7 – Kubernetes

### Prerequisites

Enable Kubernetes in Docker Desktop:
> Settings → Kubernetes → Enable Kubernetes → Apply & Restart

Or install Minikube: https://minikube.sigs.k8s.io/docs/start/

### Apply manifests

```bash
# Apply both manifests
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml

# Or via Makefile
make k8s-apply

# Check status
make k8s-status
# kubectl get deployments,pods,services -l app=craftcv
```

Expected output:
```
NAME                               READY   UP-TO-DATE   AVAILABLE
deployment.apps/craftcv-frontend   2/2     2            2

NAME                                    READY   STATUS    RESTARTS
pod/craftcv-frontend-<hash>-<hash>      1/1     Running   0
pod/craftcv-frontend-<hash>-<hash>      1/1     Running   0

NAME                       TYPE       CLUSTER-IP     PORT(S)       AGE
service/craftcv-frontend   NodePort   10.x.x.x       80:30080/TCP  xs
```

Access the app: **http://localhost:30080**

### Validate manifests (no cluster needed)

```bash
kubectl apply -f k8s/deployment.yml --dry-run=client
kubectl apply -f k8s/service.yml    --dry-run=client
```

### Teardown

```bash
make k8s-delete
# or: kubectl delete -f k8s/
```

---

## Directory Map

```
CraftCV/
├── Dockerfile                          # M5 – multi-stage build
├── .dockerignore                       # M5 – build context exclusions
├── docker-compose.yml                  # M5 – app + monitoring stack
├── nginx.conf                          # M5 – SPA routing + /health
├── Makefile                            # CI targets (install/lint/build/docker/k8s)
├── monitoring/
│   ├── prometheus.yml                  # M6 – scrape config
│   └── grafana/provisioning/
│       ├── datasources/prometheus.yml  # M6 – auto-wires Prometheus
│       └── dashboards/
│           ├── dashboard-provider.yml  # M6 – tells Grafana where dashboards are
│           └── craftcv-dashboard.json  # M6 – 4-panel monitoring dashboard
├── k8s/
│   ├── deployment.yml                  # M7 – 2-replica Deployment
│   └── service.yml                     # M7 – NodePort Service :30080
└── docs/
    └── deployment.md                   # M6 – this file
```

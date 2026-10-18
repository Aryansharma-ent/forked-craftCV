# CraftCV Deployment and Kubernetes Verification Evidence

Generated: 2026-10-18 20:40:57 +05:30

## 1. Docker Image Verification (M5)
``
IMAGE                     ID             DISK USAGE   CONTENT SIZE   EXTRA
craftcv-frontend:latest   937da23faa30       76.4MB         21.7MB        

``

## 2. Kubernetes Cluster & Resource Status (M7)
``
NAME                                 STATUS   ROLES           AGE     VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                       KERNEL-VERSION                             CONTAINER-RUNTIME
node/craftcv-cluster-control-plane   Ready    control-plane   6m33s   v1.37.0   172.19.0.2    <none>        Debian GNU/Linux 13 (trixie)   6.6.87.2-microsoft-standard-WSL2 (amd64)   containerd://2.3.4

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS         IMAGES                    SELECTOR
deployment.apps/craftcv-frontend   2/2     2            2           5m28s   craftcv-frontend   craftcv-frontend:latest   app=craftcv,component=frontend

NAME                                   READY   STATUS    RESTARTS   AGE   IP            NODE                            NOMINATED NODE   READINESS GATES
pod/craftcv-frontend-c4b6b6955-m9v75   1/1     Running   0          30s   10.244.0.11   craftcv-cluster-control-plane   <none>           <none>
pod/craftcv-frontend-c4b6b6955-wlz6r   1/1     Running   0          41s   10.244.0.10   craftcv-cluster-control-plane   <none>           <none>

NAME                       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE     SELECTOR
service/craftcv-frontend   NodePort    10.96.213.25   <none>        80:30080/TCP   5m28s   app=craftcv,component=frontend
service/kubernetes         ClusterIP   10.96.0.1      <none>        443/TCP        6m31s   <none>

``

## 3. Prometheus & Grafana Configuration (M6)
- Prometheus configuration verified with valid scrape targets:
  - job: craftcv-frontend (Target: craftcv-frontend:80/metrics, Status: UP)
  - job: prometheus (Target: localhost:9090/metrics, Status: UP)
- Grafana dashboard provisioned:
  - Dashboard UID: craftcv-frontend-v1 (CraftCV – Frontend Monitoring)
  - Datasource: Prometheus (auto-provisioned)

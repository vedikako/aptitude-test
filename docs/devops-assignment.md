# DevOps assignment — foundation assessment

This file is the lab guide. The project already contains the workflow, the Ansible playbook, the container, the Kubernetes manifests, and the monitoring stack. Do not rewrite those files. Follow the steps below on your machine, take the screenshots, and submit them with the files.

The app is the class 9 assessment in this folder. Students take five tests. Only the counsellor can open the analysis and the PDF.

Open every local site with `http://`, not `https://`. Chrome shows `ERR_SSL_PROTOCOL_ERROR` if it upgrades `localhost` to HTTPS. This app has no certificate.

---

## 0. What is already in the project

| Task | Files you will submit |
| --- | --- |
| 1. Pipeline | `.github/workflows/pipeline.yml` and `docs/pipeline.mmd` |
| 2. Ansible | `ansible/playbook.yml`, `ansible/inventory.ini`, `ansible/templates/app.env.j2` |
| 3. Containers | `Dockerfile`, `docker-entrypoint.sh`, `k8s/namespace.yaml`, `k8s/deployment.yaml`, `k8s/service.yaml`, `k8s/secret.yaml` |
| 4. Monitoring | `app/api/metrics/route.ts`, `monitoring/prometheus.yml`, `monitoring/docker-compose.yml`, `monitoring/grafana/dashboards/aptitude.json` |
| 5. Report | `docs/slides.md` |

These checks were added so the later tasks have something to call:

- `GET /api/health` returns `{"status":"ok"}` when SQLite answers, and `503` when it does not. Kubernetes uses this for the readiness and liveness probes.
- `GET /api/metrics` returns Prometheus text: `aptitude_up`, `aptitude_uptime_seconds`, `aptitude_http_requests_total`, `aptitude_http_errors_total`, and the latency sum and count.

`.env` is gitignored. Do not commit it. `prisma/dev.db` is also gitignored so student answers are not pushed.

---

## 1. Install the tools once

You need all of these before Task 1.

1. Git for Windows. In PowerShell, `git --version` should print a version.
2. Node.js 20, which you already use for `npm run dev`.
3. Docker Desktop for Windows. In Settings, turn on Kubernetes if you want the cluster from Task 3 on this same PC. Apply and reboot Docker if it asks. Then `docker version` and `kubectl version --client` should both work.
4. A GitHub account.
5. Ubuntu in WSL, only for Ansible. In an **Administrator** PowerShell:

```powershell
wsl --install -d Ubuntu
```

Restart if Windows asks. Open Ubuntu from the Start menu, create the Linux user it asks for, then inside Ubuntu:

```bash
sudo apt update
sudo apt install -y ansible
ansible --version
```

---

## 2. Confirm the app itself before any DevOps task

In PowerShell, from the project folder:

```powershell
cd "C:\Users\Vedika\OneDrive\Desktop\projects\aptitude test"
npm install
npx prisma migrate deploy
npm run dev
```

In the browser open:

- http://localhost:3000
- http://localhost:3000/api/health

Health should look like `{"status":"ok","release":"local"}`.

- http://localhost:3000/api/metrics

You should see lines beginning with `aptitude_up` and `aptitude_http_requests_total`.

Leave this server running while you do Task 4. For Task 3 you will stop it, because Kubernetes will want port 3000 inside the container and the browser will use port 30080 instead.

Counsellor login, if you need it while testing the product:

- Email `counsellor@local.test`
- Password `ChangeMe123`

---

## 3. Task 1 — GitHub Actions pipeline (2 marks)

### 3.1 Put the project on GitHub

The workflow does nothing until the code is on GitHub. In PowerShell, from the project folder:

```powershell
git status
git add .
git status
```

Check the second `git status`. It must **not** list `.env` or `prisma/dev.db`. If either appears, do not continue; those files hold the local password and student data.

```powershell
git commit -m "Add deployment pipeline, container, Ansible, and monitoring."
```

Create an empty repository on GitHub named `aptitude-test`. Do not add a README there, or the first push will be rejected. Then, using your own GitHub user name:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USER/aptitude-test.git
git push -u origin main
```

### 3.2 Watch the pipeline

On GitHub, open the repository, then the **Actions** tab. The workflow **Foundation assessment pipeline** starts on the push.

It has two jobs:

1. **Install, check, and build** — `npm ci`, Prisma generate, migrate, lint, `npm run build`.
2. **Build the container image** — runs only if job 1 is green. It builds `aptitude-test:ci` and does not push the image to Docker Hub.

Wait until both jobs are green. Open each job and screenshot the step list.

If the lint or build job is red, open the failing step, fix the file it names, commit, and push again. A red run is not the screenshot you want.

### 3.3 Export the pipeline diagram

1. Open https://mermaid.live
2. Paste the contents of `docs/pipeline.mmd`
3. Export PNG
4. Name it `pipeline-diagram.png`

Submit `.github/workflows/pipeline.yml`, the PNG, and a screenshot of the green Actions run.

The diagram is:

```text
git push -> checkout -> npm ci -> prisma generate and migrate
-> lint -> next build -> docker image build
-> Kubernetes rolling update -> Prometheus and Grafana
```

---

## 4. Task 2 — Ansible (2 marks)

Ansible does not run in PowerShell. Use the Ubuntu app from Task 1's install step.

The project lives on the Windows disk. In Ubuntu:

```bash
cd "/mnt/c/Users/Vedika/OneDrive/Desktop/projects/aptitude test/ansible"
ansible-playbook -i inventory.ini playbook.yml --ask-become-pass
```

Enter the Ubuntu password when asked. That password is for `sudo`, not the counsellor password.

The playbook does five things:

1. Installs `ca-certificates`, `curl`, `git`, `python3`, and `docker.io`.
2. Starts Docker and enables it on boot.
3. Creates a Linux user named `aptitude` and adds that user to the `docker` group.
4. Creates `/opt/aptitude-test` owned by that user.
5. Writes `/opt/aptitude-test/.env` with mode `0600`, from `ansible/templates/app.env.j2`.

### Screenshots to take

Run these after the playbook finishes and screenshot each one:

```bash
ansible-playbook -i inventory.ini playbook.yml --ask-become-pass
id aptitude
ls -l /opt/aptitude-test
sudo sed 's/PASSWORD=.*/PASSWORD=REDACTED/' /opt/aptitude-test/.env
docker --version
```

The playbook is safe to run twice. The second run should report `ok` and `changed=0` for most tasks. Screenshot that second recap as well. It shows the playbook is idempotent.

Submit `ansible/playbook.yml`, `ansible/inventory.ini`, `ansible/templates/app.env.j2`, and those screenshots.

If `apt` says the Docker package is missing a service, install Docker's own package inside Ubuntu and run the playbook again. The rest of the tasks still create the user, the directory, and the env file.

---

## 5. Task 3 — Docker and Kubernetes (2 marks)

Stop `npm run dev` with `Ctrl+C` before this task if port 3000 is still taken by it. The container uses port 3000 inside the image. The browser will use port 30080.

### 5.1 Build the image

In PowerShell, from the project folder:

```powershell
docker build -t aptitude-test:1.0.0 .
```

The first build downloads Node and installs packages. It can take several minutes. When it finishes:

```powershell
docker run --rm -p 3000:3000 --name aptitude-demo aptitude-test:1.0.0
```

Open http://localhost:3000/api/health . The JSON should include `"release":"1.0.0"`.

Screenshot `docker ps` in a second terminal while the container is running. Then stop the demo container with `Ctrl+C` in the terminal that ran `docker run`. You must stop it before Kubernetes, or the NodePort mapping is the only site you should use and the extra container just confuses the screenshots.

### 5.2 Turn on the cluster

Docker Desktop → Settings → Kubernetes → Enable Kubernetes → Apply. Wait until it says Kubernetes is running.

```powershell
kubectl config use-context docker-desktop
kubectl get nodes
```

The node should be `Ready`.

### 5.3 Deploy

Still in the project folder:

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl -n aptitude rollout status deployment/aptitude-test
kubectl -n aptitude get pods,svc
```

Wait until the pod is `1/1 Running`. The first start runs Prisma migrate, then `npm start`, so it can sit on `ContainerCreating` or `Running` but not ready for half a minute. The readiness probe calls `/api/health` and only then marks the pod ready.

Open http://localhost:30080/api/health

You should see `"release":"1.0.0"`. Screenshot the pods and that health JSON.

There is one replica on purpose. The database is a SQLite file inside the pod. A second replica would be a second copy of that file, not a shared database.

### 5.4 Rolling update

Build a second image whose health JSON reports a new release:

```powershell
docker build -t aptitude-test:1.0.1 --build-arg APP_RELEASE=1.0.1 .
```

In `k8s/deployment.yaml` change both of these, and only these:

- `image: aptitude-test:1.0.0` becomes `image: aptitude-test:1.0.1`
- `value: "1.0.0"` under `APP_RELEASE` becomes `value: "1.0.1"`

Apply and watch:

```powershell
kubectl apply -f k8s/deployment.yaml
kubectl -n aptitude rollout status deployment/aptitude-test
kubectl -n aptitude get pods
kubectl -n aptitude rollout history deployment/aptitude-test
```

Refresh http://localhost:30080/api/health . It should now say `"release":"1.0.1"`.

Screenshot the rollout history and the new health JSON. If you refresh `kubectl get pods` during the update you may see two pods for a moment: the old one stays up until the new one's health check passes (`maxUnavailable: 0`, `maxSurge: 1`). That screenshot is the rolling update.

### 5.5 Rollback

```powershell
kubectl -n aptitude rollout undo deployment/aptitude-test
kubectl -n aptitude rollout status deployment/aptitude-test
```

Refresh http://localhost:30080/api/health . It should say `"release":"1.0.0"` again.

Screenshot the undo command and the health JSON after rollback.

Submit the Dockerfile, `k8s/*.yaml`, and the screenshots of deploy, rollout history, and undo.

---

## 6. Task 4 — Prometheus and Grafana (2 marks)

Use the app on port 3000 so Prometheus can scrape the PC. Either start `npm run dev` again, or run:

```powershell
docker run --rm -p 3000:3000 --name aptitude-demo aptitude-test:1.0.0
```

Do not rely on port 30080 for this task. The Prometheus config in `monitoring/prometheus.yml` scrapes `host.docker.internal:3000`.

In a second PowerShell window:

```powershell
cd "C:\Users\Vedika\OneDrive\Desktop\projects\aptitude test\monitoring"
docker compose up -d
docker compose ps
```

### 6.1 Prometheus

Open http://localhost:9090/targets

The job `aptitude-test` should be **UP**. If it is DOWN, the app is not on port 3000. Start it, wait 10 seconds, and refresh the targets page.

Open http://localhost:9090/graph and run:

```text
aptitude_up
```

Then:

```text
aptitude_uptime_seconds
```

Screenshot the UP target and one graph.

### 6.2 Generate a little traffic

Prometheus computes rates over one minute. Before opening Grafana, refresh these a few times in the browser:

- http://localhost:3000
- http://localhost:3000/api/health
- http://localhost:3000/api/metrics

Wait one minute so `rate(...[1m])` has two samples.

### 6.3 Grafana

Open http://localhost:3001

- User `admin`
- Password `admin`

Go to **Dashboards**. Open **Foundation assessment**.

You should see:

- **Up** — `1`
- **Uptime** — seconds since the Node process started
- **Request rate** — requests per second
- **Error rate** — share of responses that were HTTP 500 or higher. A healthy app shows 0.
- **Latency** — average seconds per observed request

Screenshot the whole dashboard. If request rate is empty, you opened it before the one-minute window filled. Refresh the app again and set the dashboard time range to **Last 15 minutes**.

Submit `monitoring/prometheus.yml`, `monitoring/docker-compose.yml`, `monitoring/grafana/dashboards/aptitude.json`, the targets screenshot, and the dashboard screenshot.

To stop monitoring later:

```powershell
docker compose down
```

---

## 7. Task 5 — Slides and write-up (2 marks)

`docs/slides.md` is already written for this project. Make five slides from it. Do not add a sixth.

1. Architecture
2. Pipeline flow
3. What each task added
4. Challenges
5. Lessons learned

Use the pipeline PNG from Task 1 on slide 2. Use one Grafana screenshot on slide 3 or slide 5.

Export the deck as PDF. That PDF is the report. The same five headings are the documentation the brief asks for, so you do not need a second long essay.

---

## 8. What to zip and submit

```text
.github/workflows/pipeline.yml
docs/pipeline.mmd
pipeline-diagram.png
actions-green.png

ansible/playbook.yml
ansible/inventory.ini
ansible/templates/app.env.j2
ansible-recap.png

Dockerfile
docker-entrypoint.sh
k8s/namespace.yaml
k8s/deployment.yaml
k8s/service.yaml
k8s/secret.yaml
k8s-pods.png
k8s-rollout.png
k8s-rollback.png

monitoring/prometheus.yml
monitoring/docker-compose.yml
monitoring/grafana/dashboards/aptitude.json
prometheus-target.png
grafana-dashboard.png

slides.pdf
```

---

## 9. Bonus

The bonus is only valid with proof from a real external event: a Devpost, Kaggle, or Cloud hackathon submission, a leaderboard, or a merged GitHub pull request on someone else's repository. Do not create a fake badge or a fake submission. If you do not have that proof, leave the bonus out. The five tasks above are the full assignment.

---

## 10. If something breaks

| What you see | What to do |
| --- | --- |
| `ERR_SSL_PROTOCOL_ERROR` | Use `http://localhost:3000`, not `https://`. In Chrome, open `chrome://net-internals/#hsts`, delete `localhost`, and try the `http://` address again. |
| Actions job failed on lint or build | Open the red step, fix the file, commit, and push. |
| `git push` asks you to pull first | The GitHub repo was not empty. Create a new empty repo and push to that. |
| Ansible `sudo` password rejected | That is the Ubuntu user password, set when WSL Ubuntu was installed. |
| Pod stays `ImagePullBackOff` | The image name in `k8s/deployment.yaml` does not match `docker images`. Rebuild with `-t aptitude-test:1.0.0` and keep `imagePullPolicy: IfNotPresent`. |
| Pod stays `0/1 Ready` | `kubectl -n aptitude logs deployment/aptitude-test`. Health must return 200. Give it 40 seconds on the first boot. |
| http://localhost:30080 does not open | `kubectl -n aptitude get svc` should show `nodePort` `30080`. Docker Desktop Kubernetes must be the current context: `kubectl config current-context`. |
| Prometheus target is DOWN | Something must be listening on port 3000. `npm run dev` or `docker run -p 3000:3000 aptitude-test:1.0.0`. |
| Grafana dashboard is blank | Wait a full minute after the first scrape, then refresh the app and the dashboard. |

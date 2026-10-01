# Reflection slides

Paste each slide into PowerPoint or Google Slides. Keep the title as the slide title and the bullets as the body. Five slides is the whole set.

## Slide 1 — Architecture

Foundation assessment is a Next.js app for one counsellor and many class 9 students.

- Students register, take five tests, and only see “Your report has been sent to your counsellor.”
- The counsellor sees the area analysis and downloads a PDF. The report does not name a career.
- Prisma stores users, answers, and the finished analysis in SQLite.
- `/api/health` tells Kubernetes the process and database are up.
- `/api/metrics` exposes uptime, request rate, latency, and error rate for Prometheus.
- Deployment path: GitHub Actions builds the app and the Docker image. Kubernetes runs one replica. Grafana reads Prometheus.

## Slide 2 — Pipeline flow

```text
git push
  -> checkout
  -> npm ci
  -> prisma generate and migrate
  -> lint
  -> next build
  -> docker image build
  -> kubectl apply
  -> readiness probe on /api/health
  -> Prometheus scrapes /api/metrics
```

The workflow file is `.github/workflows/pipeline.yml`. The image build does not push to a public registry. The cluster uses the image built on the same machine (`imagePullPolicy: IfNotPresent`).

## Slide 3 — What each task added

- GitHub Actions runs the same install, lint, and build on every push.
- Ansible, on Ubuntu or WSL, installs Docker and git, creates the `aptitude` user, creates `/opt/aptitude-test`, and writes a locked-down `.env`.
- The Dockerfile produces the runtime image. Kubernetes Deployment and Service run it, with a rolling update and `kubectl rollout undo` for rollback.
- Prometheus scrapes the app every 5 seconds. Grafana shows Up, Uptime, request rate, error rate, and latency.

## Slide 4 — Challenges

- The lab machine is Windows. Ansible expects Linux, so the playbook runs inside WSL, not in PowerShell.
- SQLite is one file. Two pods would lock that file, so the Deployment stays at 1 replica. A rolling update still starts the new pod before the old one stops, because `maxUnavailable` is 0.
- Chrome opens `localhost` as HTTPS and shows `ERR_SSL_PROTOCOL_ERROR`. The dev server is plain HTTP, so the address has to be `http://localhost:3000`.
- A few report sentences had quotes inside quotes and broke the Next.js build until the wording was changed.
- The container image is large because it keeps the Prisma CLI, which the start script needs to apply migrations.

## Slide 5 — Lessons learned

- Health and metrics routes have to exist before the cluster and the dashboard. Probes and graphs cannot be added to an app that only has pages.
- Passwords and `SESSION_SECRET` stay in `.env` and the Kubernetes Secret. They are not committed as a real production secret, and `.env` is gitignored.
- A readiness probe is what makes a rolling update safe. Kubernetes waits until `/api/health` returns 200 before sending traffic to the new pod.
- Rollback is a deployment history command, not a manual delete of the pod.
- This lab uses SQLite so it runs on one laptop. A shared class deployment would move the database to Postgres so more than one replica could run.

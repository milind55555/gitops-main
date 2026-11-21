# shack-app

The demo app for the DevOps Shack webinar **GitOps with GitHub Actions and Argo CD**.

Every push to `main` runs `.github/workflows/ci.yaml`, which:

1. smoke-tests the app in a container,
2. builds the image and pushes it to GHCR as `ghcr.io/<owner>/shack-app:sha-<commit>`,
3. commits the new tag to the **shack-gitops** repo, where Argo CD picks it up.

The page reads `APP_VERSION`, `APP_MESSAGE` and `APP_COLOR` from the environment.

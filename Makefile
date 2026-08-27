.PHONY: install check dev up down smoke helm terraform
install:
	npm ci
	uv sync --project services/ai-copilot --extra dev
check:
	npm run check
dev:
	npm run dev
up:
	docker compose up --build -d
down:
	docker compose down
smoke:
	./scripts/smoke-test.sh
helm:
	helm lint infra/helm/fincloud-sentinel
	helm template sentinel infra/helm/fincloud-sentinel >/tmp/fincloud-sentinel.yaml
terraform:
	terraform -chdir=infra/terraform/environments/demo fmt -check -recursive
	terraform -chdir=infra/terraform/environments/demo validate

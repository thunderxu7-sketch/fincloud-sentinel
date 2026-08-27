import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/console/");
  await expect(page.getByTestId("operations-lab")).toHaveAttribute("data-hydrated", "true");
});

test("executes review, settlement, idempotency, reconciliation, and containment", async ({ page }) => {
  await expect(page.getByTestId("operations-lab")).toBeVisible();
  await page.getByRole("button", { name: "人工审核" }).click();
  await page.getByRole("button", { name: "提交提现" }).click();

  await expect(page.getByTestId("selected-status")).toHaveText("RISK_REVIEW");
  await expect(page.getByTestId("operation-notice")).toContainText("已创建新交易");

  await page.getByRole("button", { name: "批准人工审核" }).click();
  await expect(page.getByTestId("selected-status")).toHaveText("APPROVED");
  await page.getByRole("button", { name: "广播并结算" }).click();
  await expect(page.getByTestId("selected-status")).toHaveText("COMPLETED");
  await expect(page.getByTestId("ledger-invariant")).toContainText("PASS");

  await page.getByRole("button", { name: "使用相同幂等键重放" }).click();
  await expect(page.getByTestId("live-metric-2").locator("strong")).toHaveText("1");
  await expect(page.getByTestId("operation-notice")).toContainText("没有创建重复交易或账本记录");

  await page.getByRole("button", { name: "结算金额不一致" }).click();
  await expect(page.getByTestId("reconciliation-issue")).toContainText("CHAIN_AMOUNT_MISMATCH");

  await page.getByRole("button", { name: "调查运行证据" }).click();
  await expect(page.getByTestId("copilot-finding")).toContainText("CHAIN_AMOUNT_MISMATCH");
  await expect(page.getByTestId("copilot-finding")).toContainText("外部确认金额与内部账本金额不一致");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出证据 JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^fincloud-evidence-.*\.json$/);

  await page.getByRole("button", { name: "批准风险隔离" }).click();
  await expect(page.getByTestId("operation-notice")).toContainText("操作员明确审批后暂停");
});

test("supports English and a mobile transaction workflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Switch language" }).click();
  await expect(page.getByRole("heading", { name: "Operate the transaction lifecycle—not a scripted animation." })).toBeVisible();
  await page.getByRole("button", { name: "Normal" }).click();
  await page.getByRole("button", { name: "Submit withdrawal" }).click();
  await expect(page.getByTestId("selected-status")).toHaveText("APPROVED");
});

test("exposes dedicated landing, architecture, runbook, and control-plane routes", async ({ page }) => {
  await page.getByRole("link", { name: "首页", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("landing-page")).toBeVisible();

  await page.getByRole("link", { name: "解决方案架构", exact: true }).click();
  await expect(page).toHaveURL(/\/architecture\/$/);
  await expect(page.getByTestId("architecture-page")).toBeVisible();

  await page.getByRole("link", { name: "运行手册", exact: true }).click();
  await expect(page).toHaveURL(/\/runbooks\/$/);
  await expect(page.getByTestId("runbooks-page")).toBeVisible();

  await page.getByRole("link", { name: "控制平台", exact: true }).click();
  await expect(page).toHaveURL(/\/console\/$/);
  await expect(page.getByTestId("control-plane-page")).toBeVisible();
});

test("publishes five linked interview explainers", async ({ page }) => {
  await page.goto("/guides/index.html");
  await expect(page.getByRole("heading", { name: "五项能力，从“会说”到“能证明”。" })).toBeVisible();
  await expect(page.locator(".guide-directory > a")).toHaveCount(5);

  await page.locator(".guide-directory").getByRole("link", { name: /金融交易保障/ }).click();
  await expect(page).toHaveURL(/\/guides\/01-financial-transaction\.html$/);
  await expect(page.getByRole("heading", { name: "一笔钱，为什么不能只靠“接口成功”？" })).toBeVisible();

  await page.getByRole("link", { name: "03 AI落地" }).click();
  await expect(page).toHaveURL(/\/guides\/03-ai-delivery\.html$/);
  await expect(page.getByRole("heading", { name: "AI 落地，不是接一个聊天框。" })).toBeVisible();
});

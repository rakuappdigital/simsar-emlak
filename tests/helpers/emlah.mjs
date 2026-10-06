// Emlah menüsü 4 bölüme ayrıldı (Çarşı / İşim / İnsanlar / Ben) — bir sekmeye
// gitmeden önce onu içeren bölüm açılmalı. Bölüm düğmesi data-tabs içinde
// sekmelerin TR/EN adlarını "|Ad|" biçiminde taşır.
export async function openEmlahTab(page, label, opts = {}) {
  const section = page.locator(`.emlah-section-btn[data-tabs*="|${label}|"]`);
  if (await section.count()) {
    await section.first().click({ timeout: opts.timeout ?? 3000 });
    await page.waitForTimeout(150);
  }
  await page.locator(".emlah-tab-btn", { hasText: label }).first().click({ timeout: opts.timeout ?? 3000 });
}

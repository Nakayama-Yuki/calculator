import { test, expect } from "@playwright/test";

test.describe("基本的な四則演算", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // 初期状態確認
    const display = page.locator('[role="status"]').nth(1);
    await expect(display).toHaveText("0");
  });

  test.describe("UI操作での四則演算", () => {
    test("加算: 2 + 3 = 5", async ({ page }) => {
      await test.step("数値と演算子を入力", async () => {
        await page.getByRole("button", { name: "2" }).click();
        await page.getByRole("button", { name: "足し算" }).click();
        await page.getByRole("button", { name: "3" }).click();
        await page.getByRole("button", { name: "イコール" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");

        const expression = page.locator('[role="status"]').first();
        await expect(expression).toContainText("2 + 3 = 5");
      });
    });

    test("減算: 8 - 5 = 3", async ({ page }) => {
      await test.step("数値と演算子を入力", async () => {
        await page.getByRole("button", { name: "8" }).click();
        await page.getByRole("button", { name: "引き算" }).click();
        await page.getByRole("button", { name: "5" }).click();
        await page.getByRole("button", { name: "イコール" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("3");

        const expression = page.locator('[role="status"]').first();
        await expect(expression).toContainText("8 - 5 = 3");
      });
    });

    test("乗算: 4 × 3 = 12", async ({ page }) => {
      await test.step("数値と演算子を入力", async () => {
        await page.getByRole("button", { name: "4" }).click();
        await page.getByRole("button", { name: "掛け算" }).click();
        await page.getByRole("button", { name: "3" }).click();
        await page.getByRole("button", { name: "イコール" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("12");

        const expression = page.locator('[role="status"]').first();
        await expect(expression).toContainText("4 × 3 = 12");
      });
    });

    test("除算: 10 ÷ 2 = 5", async ({ page }) => {
      await test.step("数値と演算子を入力", async () => {
        await page.getByRole("button", { name: "1" }).click();
        await page.getByRole("button", { name: "0" }).click();
        await page.getByRole("button", { name: "割り算" }).click();
        await page.getByRole("button", { name: "2" }).click();
        await page.getByRole("button", { name: "イコール" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");

        const expression = page.locator('[role="status"]').first();
        await expect(expression).toContainText("10 ÷ 2 = 5");
      });
    });
  });

  test.describe("キーボード操作での四則演算", () => {
    test("加算: 7 + 3 = 10", async ({ page }) => {
      await test.step("キーボードで入力", async () => {
        await page.keyboard.press("7");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("10");
      });
    });

    test("減算: 15 - 8 = 7", async ({ page }) => {
      await test.step("キーボードで入力", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("5");
        await page.keyboard.press("-");
        await page.keyboard.press("8");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("7");
      });
    });

    test("乗算: 6 × 7 = 42 (*キーが×にマッピング)", async ({ page }) => {
      await test.step("キーボードで入力", async () => {
        await page.keyboard.press("6");
        await page.keyboard.press("*"); // × にマッピング
        await page.keyboard.press("7");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("42");
      });
    });

    test("除算: 20 ÷ 4 = 5 (/キーが÷にマッピング)", async ({ page }) => {
      await test.step("キーボードで入力", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("0");
        await page.keyboard.press("/"); // ÷ にマッピング
        await page.keyboard.press("4");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });
  });

  test.describe("連続計算", () => {
    test("連続加算: 5 + 3 + 2 = 10", async ({ page }) => {
      await test.step("連続で演算子を入力", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("+"); // ここで 5+3=8 が計算される
        await page.keyboard.press("2");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("10");
      });
    });

    test("連続演算: 10 - 2 × 3 = 24 (左から順に計算)", async ({ page }) => {
      await test.step("連続で演算子を入力", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("0");
        await page.keyboard.press("-");
        await page.keyboard.press("2");
        await page.keyboard.press("*"); // ここで 10-2=8 が計算される
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("24");
      });
    });
  });

  test.describe("小数点計算 (Decimal.js による高精度計算)", () => {
    test("浮動小数点誤差が発生しない: 0.1 + 0.2 = 0.3", async ({ page }) => {
      await test.step("小数点を含む計算", async () => {
        await page.keyboard.press("0");
        await page.keyboard.press(".");
        await page.keyboard.press("1");
        await page.keyboard.press("+");
        await page.keyboard.press("0");
        await page.keyboard.press(".");
        await page.keyboard.press("2");
        await page.keyboard.press("Enter");
      });

      await test.step("正確な結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        // JavaScriptの通常の計算では 0.30000000000000004 になるが、
        // Decimal.js により正確に 0.3 になる
        await expect(display).toHaveText("0.3");
      });
    });

    test("小数点の乗算: 0.1 × 0.2 = 0.02", async ({ page }) => {
      await test.step("小数点を含む乗算", async () => {
        await page.keyboard.press("0");
        await page.keyboard.press(".");
        await page.keyboard.press("1");
        await page.keyboard.press("*");
        await page.keyboard.press("0");
        await page.keyboard.press(".");
        await page.keyboard.press("2");
        await page.keyboard.press("Enter");
      });

      await test.step("正確な結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0.02");
      });
    });

    test("小数点の除算: 2.5 ÷ 2 = 1.25", async ({ page }) => {
      await test.step("小数点を含む除算", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press(".");
        await page.keyboard.press("5");
        await page.keyboard.press("/");
        await page.keyboard.press("2");
        await page.keyboard.press("Enter");
      });

      await test.step("正確な結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("1.25");
      });
    });

    test("複雑な小数点計算: 1.5 × 2.4 = 3.6", async ({ page }) => {
      await test.step("複雑な小数点計算", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press(".");
        await page.keyboard.press("5");
        await page.keyboard.press("*");
        await page.keyboard.press("2");
        await page.keyboard.press(".");
        await page.keyboard.press("4");
        await page.keyboard.press("Enter");
      });

      await test.step("正確な結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("3.6");
      });
    });
  });

  test.describe("ゼロ除算エラーハンドリング", () => {
    test("ゼロ除算でErrorを表示: 5 ÷ 0 = Error", async ({ page }) => {
      await test.step("ゼロ除算を実行", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("/");
        await page.keyboard.press("0");
        await page.keyboard.press("Enter");
      });

      await test.step("Errorが表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("Error");
      });
    });

    test("ゼロ除算後のクリア操作", async ({ page }) => {
      await test.step("ゼロ除算を実行", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("0");
        await page.keyboard.press("/");
        await page.keyboard.press("0");
        await page.keyboard.press("Enter");
      });

      await test.step("Errorが表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("Error");
      });

      await test.step("クリアして正常に戻る", async () => {
        await page.keyboard.press("Escape");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });

      await test.step("クリア後に正常に計算できる", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });
  });
});

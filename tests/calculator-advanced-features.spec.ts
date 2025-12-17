import { test, expect } from "@playwright/test";

test.describe("高度な機能", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // 初期状態確認
    const display = page.locator('[role="status"]').nth(1);
    await expect(display).toHaveText("0");
  });

  test.describe("パーセント機能", () => {
    test("100の50%を計算: 100 × 50% = 50", async ({ page }) => {
      await test.step("100を入力", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("0");
        await page.keyboard.press("0");
      });

      await test.step("パーセントボタンを押す", async () => {
        await page.getByRole("button", { name: "パーセント" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("1");
      });
    });

    test("50の20%を計算: 50 × 20% = 10", async ({ page }) => {
      await test.step("50を入力", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("0");
      });

      await test.step("掛け算を選択", async () => {
        await page.keyboard.press("*");
      });

      await test.step("20%を入力", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("0");
        await page.keyboard.press("%");
      });

      await test.step("イコールで計算", async () => {
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("10");
      });
    });

    test("200の5%を計算: 200 × 5% = 10", async ({ page }) => {
      await test.step("200 × 5% を計算", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("0");
        await page.keyboard.press("0");
        await page.keyboard.press("*");
        await page.keyboard.press("5");
        await page.keyboard.press("%");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("10");
      });
    });
  });

  test.describe("符号反転機能 (+/-)", () => {
    test("正の数を負の数に変換: 5 → -5", async ({ page }) => {
      await test.step("5を入力", async () => {
        await page.keyboard.press("5");
      });

      await test.step("符号反転ボタンを押す", async () => {
        await page.getByRole("button", { name: "符号反転" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("-5");
      });
    });

    test("負の数を正の数に変換: -5 → 5", async ({ page }) => {
      await test.step("5を入力して符号反転", async () => {
        await page.keyboard.press("5");
        await page.getByRole("button", { name: "符号反転" }).click();
      });

      await test.step("さらに符号反転", async () => {
        await page.getByRole("button", { name: "符号反転" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });

    test("計算結果に符号反転: 2 + 3 = 5 → -5", async ({ page }) => {
      await test.step("2 + 3 を計算", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果が5であることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });

      await test.step("符号反転", async () => {
        await page.getByRole("button", { name: "符号反転" }).click();
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("-5");
      });
    });
  });

  test.describe("連続演算子押下", () => {
    test("演算子の上書き: 5 + → 5 - 3 = 2", async ({ page }) => {
      await test.step("5を入力して+を押す", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("+");
      });

      await test.step("-に変更して計算", async () => {
        await page.keyboard.press("-");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("2");
      });
    });

    test("演算子の連続押下: 5 ++ 3 = 8", async ({ page }) => {
      await test.step("5 ++ 3 を入力", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("+");
        await page.keyboard.press("+"); // 2回押す（上書きされる）
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("8");
      });
    });

    test("演算子の複数回変更: 10 + → × → - 5 = 5", async ({ page }) => {
      await test.step("10を入力して演算子を複数回変更", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("0");
        await page.keyboard.press("+");
        await page.keyboard.press("*");
        await page.keyboard.press("-");
      });

      await test.step("5を入力して計算", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });

    test("イコール後の演算子: 2 + 3 = 5, then + 4 = 9", async ({ page }) => {
      await test.step("最初の計算", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果が5であることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });

      await test.step("続けて計算", async () => {
        await page.keyboard.press("+");
        await page.keyboard.press("4");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("9");
      });
    });
  });

  test.describe("Backspace（一文字削除）機能", () => {
    test("数字の末尾を削除: 123 → 12 → 1 → 0", async ({ page }) => {
      await test.step("123を入力", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("2");
        await page.keyboard.press("3");
      });

      await test.step("123が表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("123");
      });

      await test.step("Backspaceで12", async () => {
        await page.keyboard.press("Backspace");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("12");
      });

      await test.step("Backspaceで1", async () => {
        await page.keyboard.press("Backspace");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("1");
      });

      await test.step("Backspaceで0", async () => {
        await page.keyboard.press("Backspace");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });
    });

    test("小数点の削除: 12.5 → 12.", async ({ page }) => {
      await test.step("12.5を入力", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("2");
        await page.keyboard.press(".");
        await page.keyboard.press("5");
      });

      await test.step("12.5が表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("12.5");
      });

      await test.step("Backspaceで5を削除", async () => {
        await page.keyboard.press("Backspace");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("12.");
      });
    });

    test("Errorが表示されている時はBackspaceが効かない", async ({ page }) => {
      await test.step("ゼロ除算でErrorを表示", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("/");
        await page.keyboard.press("0");
        await page.keyboard.press("Enter");
      });

      await test.step("Errorが表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("Error");
      });

      await test.step("BackspaceしてもErrorのまま", async () => {
        await page.keyboard.press("Backspace");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("Error");
      });
    });
  });
});

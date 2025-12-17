import { test, expect } from "@playwright/test";

test.describe("表示とUIの動作", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // 初期状態確認
    const display = page.locator('[role="status"]').nth(1);
    await expect(display).toHaveText("0");
  });

  test.describe("初期表示", () => {
    test("初期状態でディスプレイに0が表示される", async ({ page }) => {
      const display = page.locator('[role="status"]').nth(1);
      await expect(display).toHaveText("0");
    });

    test("初期状態で式表示が空", async ({ page }) => {
      const expression = page.locator('[role="status"]').first();
      await expect(expression).toBeEmpty();
    });
  });

  test.describe("式履歴の表示", () => {
    test("加算の式が表示される: 5 + 3 = 8", async ({ page }) => {
      await test.step("5 + 3を計算", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("式が表示されることを確認", async () => {
        const expression = page.locator('[role="status"]').first();
        await expect(expression).toContainText("5 + 3 = 8");
      });
    });

    test("減算の式が表示される: 10 - 4 = 6", async ({ page }) => {
      await test.step("10 - 4を計算", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("0");
        await page.keyboard.press("-");
        await page.keyboard.press("4");
        await page.keyboard.press("Enter");
      });

      await test.step("式が表示されることを確認", async () => {
        const expression = page.locator('[role="status"]').first();
        await expect(expression).toContainText("10 - 4 = 6");
      });
    });

    test("乗算の式が表示される: 7 × 6 = 42", async ({ page }) => {
      await test.step("7 × 6を計算", async () => {
        await page.keyboard.press("7");
        await page.keyboard.press("*");
        await page.keyboard.press("6");
        await page.keyboard.press("Enter");
      });

      await test.step("式が表示されることを確認", async () => {
        const expression = page.locator('[role="status"]').first();
        await expect(expression).toContainText("7 × 6 = 42");
      });
    });
  });

  test.describe("動的フォントサイズ変更", () => {
    test("短い値（1-8文字）でtext-4xlクラスが適用される", async ({ page }) => {
      await test.step("短い数値を入力", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("2");
        await page.keyboard.press("3");
      });

      await test.step("text-4xlクラスを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveClass(/text-4xl/);
      });
    });

    test("中程度の値（9-12文字）でtext-3xlクラスが適用される", async ({
      page,
    }) => {
      await test.step("9文字の数値を入力", async () => {
        for (let i = 0; i < 9; i++) {
          await page.keyboard.press("1");
        }
      });

      await test.step("text-3xlクラスを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveClass(/text-3xl/);
      });
    });

    test("長い値（13文字以上）でtext-2xlクラスが適用される", async ({
      page,
    }) => {
      await test.step("13文字の数値を入力", async () => {
        for (let i = 0; i < 13; i++) {
          await page.keyboard.press("1");
        }
      });

      await test.step("text-2xlクラスを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveClass(/text-2xl/);
      });
    });
  });

  test.describe("クリア機能（C / Escape）", () => {
    test("Cボタンで全状態がリセットされる", async ({ page }) => {
      await test.step("計算を実行", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果が8であることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("8");
      });

      await test.step("Cボタンでクリア", async () => {
        await page.getByRole("button", { name: "クリア" }).click();
      });

      await test.step("ディスプレイが0にリセット", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });

      await test.step("式表示が空になる", async () => {
        const expression = page.locator('[role="status"]').first();
        await expect(expression).toBeEmpty();
      });
    });

    test("Escapeキーで全状態がリセットされる", async ({ page }) => {
      await test.step("計算を実行", async () => {
        await page.keyboard.press("9");
        await page.keyboard.press("-");
        await page.keyboard.press("4");
        await page.keyboard.press("Enter");
      });

      await test.step("Escapeキーでクリア", async () => {
        await page.keyboard.press("Escape");
      });

      await test.step("ディスプレイが0にリセット", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });

      await test.step("式表示が空になる", async () => {
        const expression = page.locator('[role="status"]').first();
        await expect(expression).toBeEmpty();
      });
    });

    test("cキー（小文字）でもクリア可能", async ({ page }) => {
      await test.step("数値を入力", async () => {
        await page.keyboard.press("7");
        await page.keyboard.press("7");
        await page.keyboard.press("7");
      });

      await test.step("cキーでクリア", async () => {
        await page.keyboard.press("c");
      });

      await test.step("ディスプレイが0にリセット", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });
    });

    test("Cキー（大文字）でもクリア可能", async ({ page }) => {
      await test.step("数値を入力", async () => {
        await page.keyboard.press("8");
        await page.keyboard.press("8");
        await page.keyboard.press("8");
      });

      await test.step("Cキーでクリア", async () => {
        await page.keyboard.press("C");
      });

      await test.step("ディスプレイが0にリセット", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });
    });
  });

  test.describe("ARIAラベルとアクセシビリティ", () => {
    test("全てのボタンにARIAラベルが設定されている", async ({ page }) => {
      // 数字ボタン
      for (let i = 0; i <= 9; i++) {
        await expect(
          page.getByRole("button", { name: i.toString() }),
        ).toBeVisible();
      }

      // 演算子ボタン
      await expect(page.getByRole("button", { name: "足し算" })).toBeVisible();
      await expect(page.getByRole("button", { name: "引き算" })).toBeVisible();
      await expect(page.getByRole("button", { name: "掛け算" })).toBeVisible();
      await expect(page.getByRole("button", { name: "割り算" })).toBeVisible();

      // 機能ボタン
      await expect(page.getByRole("button", { name: "クリア" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "イコール" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "小数点" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "パーセント" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "符号反転" }),
      ).toBeVisible();
    });

    test("ディスプレイにrole=statusが設定されている", async ({ page }) => {
      const statusElements = page.locator('[role="status"]');
      await expect(statusElements).toHaveCount(2); // 式表示と値表示の2つ
    });

    test("ディスプレイにaria-live=politeが設定されている", async ({ page }) => {
      const display = page.locator('[aria-live="polite"]');
      await expect(display).toBeVisible();
    });
  });

  test.describe("モバイルビューポートでの表示", () => {
    test("iPhone SE サイズで正常に表示される", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await test.step("ディスプレイが表示される", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toBeVisible();
      });

      await test.step("ボタンがクリック可能", async () => {
        await page.getByRole("button", { name: "5" }).click();
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });

    test("iPad サイズで正常に表示される", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await test.step("計算が正常に動作する", async () => {
        await page.keyboard.press("3");
        await page.keyboard.press("+");
        await page.keyboard.press("7");
        await page.keyboard.press("Enter");

        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("10");
      });
    });
  });

  test.describe("式表示の動的フォントサイズ", () => {
    test("短い式（1-20文字）でtext-baseクラスが適用される", async ({
      page,
    }) => {
      await test.step("短い式を作成", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("text-baseクラスを確認", async () => {
        const expression = page.locator('[role="status"]').first();
        await expect(expression).toHaveClass(/text-base/);
      });
    });

    test("長い式（26文字以上）でtext-xsクラスが適用される", async ({
      page,
    }) => {
      await test.step("長い式を作成", async () => {
        // 999999 + 999999 = 1999998 (26文字)
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press("9");
        }
        await page.keyboard.press("+");
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press("9");
        }
        await page.keyboard.press("Enter");
      });

      await test.step("text-xsクラスを確認", async () => {
        const expression = page.locator('[role="status"]').first();
        await expect(expression).toHaveClass(/text-xs/);
      });
    });
  });
});

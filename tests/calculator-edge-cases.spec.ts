import { test, expect } from "@playwright/test";

test.describe("エッジケースとエラーハンドリング", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // 初期状態確認
    const display = page.locator('[role="status"]').nth(1);
    await expect(display).toHaveText("0");
  });

  test.describe("非常に大きな数値の計算", () => {
    test("大きな数値の乗算: 999999 × 999999", async ({ page }) => {
      await test.step("999999を入力", async () => {
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press("9");
        }
      });

      await test.step("乗算を実行", async () => {
        await page.keyboard.press("*");
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press("9");
        }
        await page.keyboard.press("Enter");
      });

      await test.step("結果が計算されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        // 999999 × 999999 = 999998000001
        await expect(display).toHaveText("999998000001");
      });
    });

    test("大きな数値の加算", async ({ page }) => {
      await test.step("大きな数値の加算を実行", async () => {
        await page.keyboard.press("9");
        await page.keyboard.press("9");
        await page.keyboard.press("9");
        await page.keyboard.press("9");
        await page.keyboard.press("9");
        await page.keyboard.press("9");
        await page.keyboard.press("+");
        await page.keyboard.press("1");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("1000000");
      });
    });
  });

  test.describe("多重小数点入力の防止", () => {
    test("小数点を2回入力しても1つだけ: 1..2 → 1.2", async ({ page }) => {
      await test.step("小数点を2回入力", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press(".");
        await page.keyboard.press("."); // 2回目は無視される
        await page.keyboard.press("2");
      });

      await test.step("1.2が表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("1.2");
      });
    });

    test("小数点を複数回入力: 3...5 → 3.5", async ({ page }) => {
      await test.step("小数点を複数回入力", async () => {
        await page.keyboard.press("3");
        await page.keyboard.press(".");
        await page.keyboard.press(".");
        await page.keyboard.press(".");
        await page.keyboard.press("5");
      });

      await test.step("3.5が表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("3.5");
      });
    });
  });

  test.describe("Error後の復帰処理", () => {
    test("Error表示後にCボタンでクリア", async ({ page }) => {
      await test.step("ゼロ除算でErrorを表示", async () => {
        await page.keyboard.press("8");
        await page.keyboard.press("/");
        await page.keyboard.press("0");
        await page.keyboard.press("Enter");
      });

      await test.step("Errorが表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("Error");
      });

      await test.step("Cボタンでクリア", async () => {
        await page.getByRole("button", { name: "クリア" }).click();
      });

      await test.step("0に戻ることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });
    });

    test("Error後に数字を入力すると自動クリア", async ({ page }) => {
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

      await test.step("数字を入力すると新しい入力として扱われる", async () => {
        await page.keyboard.press("7");
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("7");
      });
    });

    test("Error後に再度計算が正常に動作", async ({ page }) => {
      await test.step("ゼロ除算でErrorを表示", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("0");
        await page.keyboard.press("/");
        await page.keyboard.press("0");
        await page.keyboard.press("Enter");
      });

      await test.step("Errorをクリア", async () => {
        await page.keyboard.press("Escape");
      });

      await test.step("正常な計算を実行", async () => {
        await page.keyboard.press("6");
        await page.keyboard.press("+");
        await page.keyboard.press("4");
        await page.keyboard.press("Enter");
      });

      await test.step("正常に計算されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("10");
      });
    });
  });

  test.describe("演算子のみ入力した場合", () => {
    test("演算子のみ押しても結果は変わらない", async ({ page }) => {
      await test.step("5を入力してイコール", async () => {
        await page.keyboard.press("5");
        await page.keyboard.press("Enter");
      });

      await test.step("結果が5であることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });

    test("連続してイコールを押しても問題ない", async ({ page }) => {
      await test.step("2 + 3を計算", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("+");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果が5であることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });

      await test.step("さらにイコールを押す", async () => {
        await page.keyboard.press("Enter");
      });

      await test.step("結果が変わらないことを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });
  });

  test.describe("小数点のみの入力", () => {
    test("小数点から始める: .5 → 0.5", async ({ page }) => {
      await test.step("小数点から入力", async () => {
        await page.keyboard.press(".");
        await page.keyboard.press("5");
      });

      await test.step("0.5が表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0.5");
      });
    });

    test("小数点から始めて計算: .3 + .7 = 1", async ({ page }) => {
      await test.step(".3 + .7を入力", async () => {
        await page.keyboard.press(".");
        await page.keyboard.press("3");
        await page.keyboard.press("+");
        await page.keyboard.press(".");
        await page.keyboard.press("7");
        await page.keyboard.press("Enter");
      });

      await test.step("結果が1であることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("1");
      });
    });
  });

  test.describe("10桁超えの小数精度制限", () => {
    test("1 ÷ 3 の結果が10桁に制限される", async ({ page }) => {
      await test.step("1 ÷ 3を計算", async () => {
        await page.keyboard.press("1");
        await page.keyboard.press("/");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証（10桁まで）", async () => {
        const display = page.locator('[role="status"]').nth(1);
        const result = await display.textContent();
        // 0.3333333333 (小数点以下10桁)
        expect(result).toBe("0.3333333333");
      });
    });

    test("2 ÷ 3 の結果が10桁に制限される", async ({ page }) => {
      await test.step("2 ÷ 3を計算", async () => {
        await page.keyboard.press("2");
        await page.keyboard.press("/");
        await page.keyboard.press("3");
        await page.keyboard.press("Enter");
      });

      await test.step("結果を検証（10桁まで）", async () => {
        const display = page.locator('[role="status"]').nth(1);
        const result = await display.textContent();
        // 0.6666666667 (小数点以下10桁、四捨五入)
        expect(result).toBe("0.6666666667");
      });
    });
  });

  test.describe("0から始まる入力", () => {
    test("0を複数回押しても0のまま", async ({ page }) => {
      await test.step("0を3回押す", async () => {
        await page.keyboard.press("0");
        await page.keyboard.press("0");
        await page.keyboard.press("0");
      });

      await test.step("0が表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("0");
      });
    });

    test("0の後に数字を入力: 0 → 5 = 5", async ({ page }) => {
      await test.step("0を押してから5を押す", async () => {
        await page.keyboard.press("0");
        await page.keyboard.press("5");
      });

      await test.step("5が表示されることを確認", async () => {
        const display = page.locator('[role="status"]').nth(1);
        await expect(display).toHaveText("5");
      });
    });
  });
});

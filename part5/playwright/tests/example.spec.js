const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByLabel('username').fill("mluukkai")
    await page.getByLabel('password').fill("salainen")
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

    describe('Login', () => {
      test('succeeds with correct credentials', async ({ page }) => {
        await page.getByLabel('username').fill("mluukkai")
        await page.getByLabel('password').fill("salainen")
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      })

      test('fails with wrong credentials', async ({ page }) => {
        await page.getByLabel('username').fill("userwrong")
        await page.getByLabel('password').fill("wrong")
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = page.locator('.error')
        await expect(errorDiv).toContainText('wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
      })
  })

})
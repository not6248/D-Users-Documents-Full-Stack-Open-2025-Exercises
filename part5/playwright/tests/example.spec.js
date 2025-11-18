const { test, expect, beforeEach, describe } = require('@playwright/test')
import Blog from '../../bloglist-frontend/src/components/Blog';

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
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('userwrong')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(
        page.getByText('Matti Luukkainen logged in')
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByRole('textbox', { name: 'title:' }).fill("a blog created by playwright")
        await page.getByRole('textbox', { name: 'author:' }).fill("mluukkai")
        await page.getByRole('textbox', { name: 'url:' }).fill("www.playwright.com")
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByText("a blog created by playwright mluukkai viewhide").waitFor()
        await expect(page.getByText('a blog created by playwright mluukkai viewhide')).toBeVisible()

        const addNotiDiv = page.locator('.add')
        await expect(addNotiDiv).toContainText('a new blog a blog created by playwright')
    })
  })

    describe('When created blog', () => {
      beforeEach(async ({ page }) => {
        await page.getByLabel('username').fill('mluukkai')
        await page.getByLabel('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByRole('textbox', { name: 'title:' }).fill("a blog created by playwright")
        await page.getByRole('textbox', { name: 'author:' }).fill("mluukkai")
        await page.getByRole('textbox', { name: 'url:' }).fill("www.playwright.com")
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes')).toContainText('likes 0 like')
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText("likes 1 like").waitFor()
        await expect(page.getByText('likes')).toContainText('likes 1 like')
      })
  })

  //blog can be liked
})

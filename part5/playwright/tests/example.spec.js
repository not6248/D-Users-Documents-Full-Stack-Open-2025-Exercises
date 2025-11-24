const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen2',
        username: 'mluukkai2',
        password: 'salainen2',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'userwrong', 'wrong')

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
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created by playwright',
        'mluukkai',
        'www.playwright.com'
      )

      await expect(
        page.getByText('a blog created by playwright mluukkai')
      ).toBeVisible()

      const addNotiDiv = page.locator('.add')
      await expect(addNotiDiv).toContainText(
        'a new blog a blog created by playwright'
      )
    })

    describe('When created blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'a blog created by playwright',
          'mluukkai',
          'www.playwright.com'
        )
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes')).toContainText('likes 0 like')
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 1 like').waitFor()
        await expect(page.getByText('likes')).toContainText('likes 1 like')
      })

      test('blog can delete the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('a blog created by playwright mluukkai')).not.toBeVisible()
      })

      test('user who added the blog sees the blog delete button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'mluukkai2', 'salainen2')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})

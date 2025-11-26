const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { debug } = require('console')

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

      test('user who added the blog sees the blog delete button', async ({ page,request }) => {
        await request.post('/api/users', {
          data: {
            name: 'Matti Luukkainen2',
            username: 'mluukkai2',
            password: 'salainen2',
          },
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'mluukkai2', 'salainen2')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('order according to the likes', async ({ page }) => {
        await createBlog(
          page,
          'a blog created by playwright 2',
          'mluukkai',
          'www.playwright.com'
        )

        await createBlog(
          page,
          'a blog created by playwright 3',
          'mluukkai',
          'www.playwright.com'
        )
        const blog1 = page.getByText('a blog created by playwright mluukkai viewhidewww.playwright.com')
        const blog2 = page.getByText('a blog created by playwright 2 mluukkai viewhidewww.playwright.com')
        const blog3 = page.getByText('a blog created by playwright 3 mluukkai viewhidewww.playwright.com')
        await blog1.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'view' }).click()

        await blog1.getByRole('button', { name: 'like' }).click()
        await blog1.getByText('likes 1 like').waitFor()

        await blog1.getByRole('button', { name: 'like' }).click()
        await blog1.getByText('likes 2 like').waitFor()

        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 1 like').waitFor()
        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 2 like').waitFor()
        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 3 like').waitFor()
        
        const likesAll = await page.getByText('likes').all()
        await expect(likesAll[0]).toContainText('likes 3 like')
        await expect(likesAll[1]).toContainText('likes 2 like')
        await expect(likesAll[2]).toContainText('likes 0 like')
        
        const blogs = await page.getByText('a blog created by playwright').all() 
        await expect(blogs[0]).toContainText('playwright 3 mluukkai')
        await expect(blogs[1]).toContainText('playwright mluukkai')
        await expect(blogs[2]).toContainText('playwright 2 mluukkai')
      })
    })
  })
})

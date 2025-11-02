import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'title for test',
    author: 'author abc',
    url: 'www.example.com',
    likes: 123,
  }

  const { container } = render(<Blog blog={blog} />)

  const element = screen.getByText('title for test author abc')
  expect(element).toBeDefined()

  const div = container.querySelector('.showWhenVisible')
  expect(div).not.toBeVisible()
})

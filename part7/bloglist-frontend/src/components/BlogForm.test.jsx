import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('clicking the create blog calls event handler', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockHandler} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'title for test' )
  await user.type(authorInput, 'author abc' )
  await user.type(urlInput, 'www.example.com' )
  await user.click(sendButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('title for test')
  expect(mockHandler.mock.calls[0][0].author).toBe('author abc')
  expect(mockHandler.mock.calls[0][0].url).toBe('www.example.com')
})
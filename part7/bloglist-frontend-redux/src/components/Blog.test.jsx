import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'title for test',
    author: 'author abc',
    url: 'www.example.com',
    likes: 123,
  }

  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('renders content', () => {
    screen.getByText('title for test author abc')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.showWhenVisible')
    expect(div).not.toBeVisible()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.showWhenVisible')

    expect(div).toBeVisible()
  })
})

test('clicking the button calls event handler twice', async () => {
  const blog = {
    title: 'title for test',
    author: 'author abc',
    url: 'www.example.com',
    likes: 123,
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} addLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

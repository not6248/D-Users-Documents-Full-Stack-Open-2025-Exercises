var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumLikes = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(sumLikes, 0)
}

const favoriteBlog = (blogs) => {
  const max = Math.max(...blogs.map((blog) => blog.likes))
  return blogs.length === 0 ? 0 : blogs.find(({ likes }) => likes === max)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0

  const counts = _.countBy(blogs, 'author')
  const [name, count] = _.maxBy(
    Object.entries(counts),
    ([name, count]) => count
  )
  return {
    author: name,
    blogs: count,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0

  const groups = _.groupBy(blogs, 'author')
  const groupSumLikes = Object.entries(groups).map(([author, group]) => ({
    author,
    likes: _.sumBy(group, 'likes'),
  }))

  const mostLikes = _.maxBy(groupSumLikes,'likes') 
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}

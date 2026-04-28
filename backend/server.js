const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const sequelize = require('./config/database')
const { notFound, errorHandler } = require('./middleware/errorHandler')

require('./models/User')
require('./models/Task')

const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

app.use(
  cors({
    origin: ['http://localhost:5173', process.env.CLIENT_URL],
    credentials: true,
  }),
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')

    await sequelize.sync()
    console.log('Database synced')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

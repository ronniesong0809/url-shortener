const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message)
    })
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Resource already exists',
        details: 'A resource with these unique fields already exists'
      })
    }
    return res.status(500).json({
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }

  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
}

module.exports = errorHandler 
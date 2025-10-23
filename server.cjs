const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 3001;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
server.use(jsonServer.bodyParser);

// Add custom request handling
server.use((req, res, next) => {
  if (req.method === 'POST') {
    // Ensure createdAt is set for new resources
    req.body.createdAt = req.body.createdAt || new Date().toISOString();
    req.body.updatedAt = new Date().toISOString();
  }
  
  if (req.method === 'PUT' || req.method === 'PATCH') {
    // Update updatedAt timestamp
    req.body.updatedAt = new Date().toISOString();
  }
  
  // Continue to JSON Server router
  next();
});

// Use default router
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API URL: http://localhost:${port}`);
});
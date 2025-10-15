import { Router } from 'express';
import { serviceRegistry } from '../../../../src/core/service-registry';
import * as path from 'path';

const router = Router();

// Redirect to main Swagger UI
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// API documentation info
router.get('/info', (req, res) => {
  res.json({
    message: 'API Explorer',
    swaggerUI: '/api-docs',
    openAPISpec: '/api-docs-json',
    modules: 'All module APIs are documented in the main Swagger UI'
  });
});

export default router;
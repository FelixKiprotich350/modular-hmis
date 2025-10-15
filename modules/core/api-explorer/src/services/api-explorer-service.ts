export class ApiExplorerService {
  generateOpenAPISpec() {
    return {
      openapi: '3.0.0',
      info: {
        title: 'HMIS API',
        version: '1.0.0',
        description: 'Health Management Information System API Documentation',
        contact: {
          name: 'HMIS Support',
          email: 'support@hmis.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          LoginRequest: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: { type: 'string' },
              password: { type: 'string' }
            }
          },
          LoginResponse: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              token: { type: 'string' },
              user: { $ref: '#/components/schemas/User' }
            }
          },
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          }
        }
      },
      paths: {
        '/api/auth/login': {
          post: {
            tags: ['Authentication'],
            summary: 'User login',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginRequest' }
                }
              }
            },
            responses: {
              '200': {
                description: 'Login successful',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/LoginResponse' }
                  }
                }
              },
              '401': {
                description: 'Invalid credentials',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/api/auth/logout': {
          post: {
            tags: ['Authentication'],
            summary: 'User logout',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'Logout successful',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/auth/validate': {
          post: {
            tags: ['Authentication'],
            summary: 'Validate JWT token',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'Token is valid',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        valid: { type: 'boolean' },
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              },
              '401': {
                description: 'Invalid token',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/api/users/register': {
          post: {
            tags: ['Users'],
            summary: 'Register new user',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                      username: { type: 'string' },
                      email: { type: 'string', format: 'email' },
                      password: { type: 'string', minLength: 6 },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '201': {
                description: 'User created successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Invalid input',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/api/users': {
          get: {
            tags: ['Users'],
            summary: 'List all users',
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'List of users',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        users: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/User' }
                        }
                      }
                    }
                  }
                }
              },
              '401': { description: 'Unauthorized' },
              '403': { description: 'Insufficient privileges' }
            }
          }
        },
        '/api/users/{id}': {
          get: {
            tags: ['Users'],
            summary: 'Get user by ID',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': {
                description: 'User details',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              },
              '404': { description: 'User not found' }
            }
          },
          put: {
            tags: ['Users'],
            summary: 'Update user',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: { type: 'string', format: 'email' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'User updated successfully' },
              '400': { description: 'Invalid input' },
              '403': { description: 'Insufficient privileges' }
            }
          },
          delete: {
            tags: ['Users'],
            summary: 'Delete user',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': { description: 'User deleted successfully' },
              '403': { description: 'Insufficient privileges' },
              '404': { description: 'User not found' }
            }
          }
        },
        '/api/roles/users/{id}/roles': {
          post: {
            tags: ['Role Management'],
            summary: 'Assign role to user',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['roleName'],
                    properties: {
                      roleName: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Role assigned successfully' },
              '400': { description: 'Invalid input' },
              '403': { description: 'Insufficient privileges' }
            }
          }
        },
        '/api/roles/users/{id}': {
          get: {
            tags: ['Role Management'],
            summary: 'Get user roles and privileges',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': {
                description: 'User roles and privileges',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string' },
                        roles: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        privileges: {
                          type: 'array',
                          items: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/audit/logs': {
          get: {
            tags: ['Audit'],
            summary: 'Get audit logs',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'page',
                in: 'query',
                schema: { type: 'integer', default: 1 }
              },
              {
                name: 'limit',
                in: 'query',
                schema: { type: 'integer', default: 50 }
              },
              {
                name: 'action',
                in: 'query',
                schema: { type: 'string' }
              },
              {
                name: 'userId',
                in: 'query',
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': {
                description: 'Audit logs',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        logs: { type: 'array' },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
}
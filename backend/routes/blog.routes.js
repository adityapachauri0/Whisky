const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const blogController = require('../controllers/blog.controller');
const adminController = require('../controllers/admin.controller');

// Validation middleware
const validatePost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('excerpt')
    .trim()
    .notEmpty().withMessage('Excerpt is required')
    .isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['investment-guide', 'market-insights', 'whisky-education', 'company-news', 'case-studies'])
    .withMessage('Invalid category'),
  body('author.name')
    .trim()
    .notEmpty().withMessage('Author name is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('seo.metaTitle')
    .optional()
    .trim()
    .isLength({ max: 60 }).withMessage('Meta title should be under 60 characters'),
  body('seo.metaDescription')
    .optional()
    .trim()
    .isLength({ max: 160 }).withMessage('Meta description should be under 160 characters')
];

const validateSlug = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Invalid slug format')
];

// Public routes
// Get all published posts
router.get('/', blogController.getPublishedPosts);

// Get featured posts
router.get('/featured', blogController.getFeaturedPosts);

// Get categories
router.get('/categories', blogController.getCategories);

// Get popular tags
router.get('/tags', blogController.getPopularTags);

// Get single post by slug
router.get('/:slug', validateSlug, blogController.getPostBySlug);

// Admin routes (protected with auth middleware)
// Create new post
router.post(
  '/',
  adminController.verifyAdmin,
  validatePost,
  blogController.createPost
);

// Update post
router.put(
  '/:id',
  adminController.verifyAdmin,
  validatePost,
  blogController.updatePost
);

// Delete post
router.delete(
  '/:id',
  adminController.verifyAdmin,
  blogController.deletePost
);

module.exports = router;
const BlogPost = require('../models/BlogPost');
const { validationResult } = require('express-validator');

// Get all published blog posts
exports.getPublishedPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      tag,
      search,
      featured
    } = req.query;

    // Build query
    const query = { status: 'published' };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await BlogPost.find(query)
      .select('-content') // Exclude full content in list view
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    // console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve blog posts'
    });
  }
};

// Get single blog post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({ 
      slug, 
      status: 'published' 
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    // Get related posts
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      status: 'published',
      $or: [
        { category: post.category },
        { tags: { $in: post.tags } }
      ]
    })
    .select('title slug excerpt featuredImage publishedAt readTime')
    .limit(3)
    .sort({ publishedAt: -1 });

    res.json({
      success: true,
      data: {
        post,
        relatedPosts
      }
    });

  } catch (error) {
    // console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve blog post'
    });
  }
};

// Get featured posts for homepage
exports.getFeaturedPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({
      status: 'published',
      featured: true
    })
    .select('title slug excerpt featuredImage publishedAt category readTime')
    .sort({ publishedAt: -1 })
    .limit(3);

    res.json({
      success: true,
      data: posts
    });

  } catch (error) {
    // console.error('Get featured posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve featured posts'
    });
  }
};

// Get blog categories with post count
exports.getCategories = async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    // Format categories
    const formattedCategories = categories.map(cat => ({
      name: cat._id,
      slug: cat._id,
      count: cat.count,
      displayName: cat._id.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }));

    res.json({
      success: true,
      data: formattedCategories
    });

  } catch (error) {
    // console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories'
    });
  }
};

// Get popular tags
exports.getPopularTags = async (req, res) => {
  try {
    const tags = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: {
        _id: '$tags',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    });

  } catch (error) {
    // console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tags'
    });
  }
};

// Create new blog post (admin only)
exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Calculate read time based on content length
    const wordCount = req.body.content.split(' ').length;
    const readTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

    const postData = {
      ...req.body,
      readTime,
      publishedAt: req.body.status === 'published' ? new Date() : null
    };

    const post = await BlogPost.create(postData);

    res.status(201).json({
      success: true,
      data: post
    });

  } catch (error) {
    // console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create blog post'
    });
  }
};

// Update blog post (admin only)
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Recalculate read time if content changed
    if (req.body.content) {
      const wordCount = req.body.content.split(' ').length;
      req.body.readTime = Math.ceil(wordCount / 200);
    }

    // Update publishedAt if status changed to published
    if (req.body.status === 'published') {
      const existingPost = await BlogPost.findById(id);
      if (existingPost && existingPost.status !== 'published') {
        req.body.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    // console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update blog post'
    });
  }
};

// Delete blog post (admin only)
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    // console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete blog post'
    });
  }
};
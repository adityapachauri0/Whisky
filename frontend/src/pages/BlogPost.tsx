import React, { useState, useEffect } from 'react';
import logger from '../utils/logger';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  TagIcon,
  ArrowLeftIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { blogAPI, BlogPost as BlogPostType } from '../services/api';
import blogPostsData from '../data/blogPosts';
import SchemaMarkup from '../components/common/SchemaMarkup';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getPostBySlug(slug!);
      setPost(response.data.data.post);
      setRelatedPosts(response.data.data.relatedPosts);
    } catch (error) {
      logger.error('Error fetching post:', error);
      // Use rich mock data
      const foundPost = blogPostsData.find(p => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        // Get related posts from same category
        const related = blogPostsData
          .filter(p => p.category === foundPost.category && p._id !== foundPost._id)
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        setPost(mockPost);
        setRelatedPosts(mockRelatedPosts);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Silently fail and fall through to clipboard copy
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Mock data for demo
  const mockPost: BlogPostType = {
    _id: '1',
    title: 'The Complete Guide to Whisky Cask Investment',
    slug: 'complete-guide-whisky-cask-investment',
    excerpt: 'Everything you need to know about investing in whisky casks, from selection to exit strategies.',
    content: `
      <h2>Introduction to Whisky Cask Investment</h2>
      <p>Whisky cask investment has emerged as one of the most exciting alternative investment opportunities of the 21st century. As traditional markets face increasing volatility, savvy investors are turning to tangible assets that offer both passion and profit.</p>
      
      <h2>Why Invest in Whisky Casks?</h2>
      <p>The appeal of whisky cask investment lies in its unique combination of factors:</p>
      <ul>
        <li><strong>Tangible Asset:</strong> Unlike stocks or bonds, you own a physical asset</li>
        <li><strong>Natural Appreciation:</strong> Whisky improves with age, increasing in value</li>
        <li><strong>Limited Supply:</strong> As whisky evaporates (the "angel's share"), supply decreases</li>
        <li><strong>Growing Demand:</strong> Global whisky consumption continues to rise</li>
      </ul>
      
      <h2>Understanding the Investment Process</h2>
      <p>Investing in whisky casks involves several key steps:</p>
      <ol>
        <li>Research and select reputable distilleries</li>
        <li>Choose casks based on age, type, and potential</li>
        <li>Secure proper storage and insurance</li>
        <li>Monitor market conditions and maturation</li>
        <li>Execute exit strategy at optimal time</li>
      </ol>
      
      <h2>Risk Considerations</h2>
      <p>Like all investments, whisky casks come with risks:</p>
      <ul>
        <li>Market fluctuations can affect demand</li>
        <li>Storage costs and insurance are ongoing expenses</li>
        <li>Liquidity can be lower than traditional investments</li>
        <li>Requires patience - minimum 3-5 year investment horizon</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Whisky cask investment offers a unique opportunity to diversify your portfolio while owning a piece of liquid history. With proper guidance and careful selection, it can be both a rewarding and profitable venture.</p>
    `,
    featuredImage: {
      url: '/whisky/blog/distillery-investment-hero.webp',
      alt: 'Premium whisky distillery investment',
    },
    category: 'investment-guide',
    tags: ['investment', 'guide', 'beginners'],
    author: {
      name: 'John Smith',
      bio: 'Senior Investment Analyst at ViticultWhisky',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
    },
    publishedAt: new Date().toISOString(),
    readTime: 8,
    viewCount: 1250,
    status: 'published',
    featured: true,
    createdAt: '',
    updatedAt: '',
  };

  const mockRelatedPosts: BlogPostType[] = [
    {
      _id: '2',
      title: 'Top 5 Distilleries for Investment',
      slug: 'top-5-distilleries-investment',
      excerpt: 'Discover which distilleries offer the best investment potential.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3',
        alt: 'Distillery',
      },
      publishedAt: new Date().toISOString(),
      readTime: 5,
      category: 'market-insights',
      author: { name: 'Emma Wilson' },
      tags: [],
      status: 'published',
      viewCount: 0,
      featured: false,
      createdAt: '',
      updatedAt: '',
      content: ''
    },
    {
      _id: '3',
      title: 'Understanding Whisky Maturation',
      slug: 'understanding-whisky-maturation',
      excerpt: 'Learn how time and environment affect your whisky investment.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3',
        alt: 'Whisky aging',
      },
      publishedAt: new Date().toISOString(),
      readTime: 6,
      category: 'whisky-education',
      author: { name: 'Michael Chen' },
      tags: [],
      status: 'published',
      viewCount: 0,
      featured: false,
      createdAt: '',
      updatedAt: '',
      content: ''
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-2 text-charcoal mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn-secondary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - ViticultWhisky</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags?.join(', ') + ', whisky investment, cask investment'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://viticultwhisky.co.uk/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://viticultwhisky.co.uk/blog/${post.slug}`} />
        <meta property="og:image" content={post.featuredImage?.url} />
        <meta property="og:site_name" content="ViticultWhisky" />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:section" content={post.category} />
        {post.tags?.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.featuredImage?.url} />
        <meta name="twitter:creator" content="@viticultwhisky" />
      </Helmet>

      {/* Schema Markup for Individual Blog Post */}
      <SchemaMarkup 
        type="article" 
        data={{
          title: post.title,
          description: post.excerpt,
          image: post.featuredImage?.url || "https://viticultwhisky.co.uk/og-image.jpg",
          author: post.author.name,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          url: `https://viticultwhisky.co.uk/blog/${post.slug}`,
          keywords: post.tags?.join(', ') + ', whisky investment, cask investment, Scottish whisky',
          wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(' ').length : 1000
        }}
      />
      <SchemaMarkup 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://viticultwhisky.co.uk"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://viticultwhisky.co.uk/blog"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": post.title,
              "item": `https://viticultwhisky.co.uk/blog/${post.slug}`
            }
          ]
        }}
      />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.featuredImage?.url || '/whisky/blog/viticult_whisky_cask_investment32.webp'}
            alt={post.featuredImage?.alt || post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal/80" />
        </div>
        <div className="relative z-10 h-full flex items-end pb-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl w-full"
            >
              <Link
                to="/blog"
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Blog
              </Link>
              <h1 className="heading-2 text-white mb-6 break-words">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <span className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  {post.readTime} min read
                </span>
                <span className="flex items-center">
                  <TagIcon className="h-5 w-5 mr-2" />
                  {post.category.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Author Info */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-whisky-200">
                <div className="flex items-center space-x-4">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-charcoal">{post.author.name}</p>
                    {post.author.bio && (
                      <p className="text-sm text-charcoal/60">{post.author.bio}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-charcoal/60 hover:text-gold transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-whisky-200">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-charcoal/60 mr-2">Tags:</span>
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-whisky-100 text-charcoal/70 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section bg-whisky-50">
          <div className="container-custom">
            <h2 className="heading-2 text-charcoal text-center mb-12">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <motion.article
                  key={relatedPost._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="card group"
                >
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                      <img
                        src={relatedPost.featuredImage?.url || '/whisky/blog/viticult_whisky_cask_investment32.webp'}
                        alt={relatedPost.featuredImage?.alt || relatedPost.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-charcoal mb-2 group-hover:text-gold transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-charcoal/70 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-charcoal to-charcoal-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="heading-2 text-white mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Learn how whisky cask investment can enhance your portfolio
            </p>
            <Link to="/contact" className="btn-primary">
              Book Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BlogPost;
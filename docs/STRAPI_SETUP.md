# Strapi CMS Setup Guide for Global Treat Blog

This guide will walk you through setting up Strapi CMS for the Global Treat blog system.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Content Types Setup](#content-types-setup)
5. [Configuration](#configuration)
6. [Content Management](#content-management)
7. [API Integration](#api-integration)
8. [Deployment](#deployment)
9. [SEO Best Practices](#seo-best-practices)

## Overview

The blog system uses Strapi as a headless CMS to manage blog content, with the following architecture:

- **Frontend**: Astro static site generator with Thai language optimization
- **CMS**: Strapi headless CMS for content management
- **Database**: PostgreSQL (recommended) or SQLite for development
- **Deployment**: Frontend on Vercel, Strapi on Railway/Heroku/VPS

## Prerequisites

- Node.js 18+ and npm
- Database (PostgreSQL for production, SQLite for development)
- Basic knowledge of Strapi administration

## Installation

### 1. Create New Strapi Project

```bash
# Create new Strapi project
npx create-strapi-app@latest global-treat-cms --quickstart

# Navigate to the project
cd global-treat-cms

# Start development server
npm run develop
```

### 2. Initial Setup

1. Open http://localhost:1337/admin
2. Create your first admin user
3. Complete the initial setup wizard

## Content Types Setup

### 1. Blog Post Content Type

Create a new Content Type called `blog-post` with the following fields:

#### Basic Fields
- **title** (Text) - Required, Short text
- **slug** (Text) - Required, Short text, Unique
- **content** (Rich Text) - Required, Rich text editor
- **excerpt** (Text) - Optional, Long text (for manual excerpts)

#### Media Fields
- **featuredImage** (Media) - Single media, Images only
- **gallery** (Media) - Multiple media, Images only (optional)

#### Taxonomy Fields
- **category** (Relation) - Many-to-One relation with Category
- **tags** (Relation) - Many-to-Many relation with Tag (optional)
- **author** (Relation) - Many-to-One relation with Author

#### SEO Fields (Component)
Create a component called `seo` with:
- **metaTitle** (Text) - Optional, Short text
- **metaDescription** (Text) - Optional, Long text
- **keywords** (Text) - Optional, Short text
- **metaImage** (Media) - Single media, Images only

#### Status Fields
- **featured** (Boolean) - Default false
- **publishedAt** (DateTime) - Auto-generated
- **status** (Enumeration) - draft, published, archived

### 2. Category Content Type

Create `category` content type:
- **name** (Text) - Required, Short text
- **slug** (Text) - Required, Short text, Unique
- **description** (Text) - Optional, Long text
- **color** (Text) - Optional, Short text (hex color)
- **blog_posts** (Relation) - One-to-Many with Blog Post

### 3. Author Content Type

Create `author` content type:
- **name** (Text) - Required, Short text
- **email** (Email) - Optional
- **bio** (Text) - Optional, Long text
- **avatar** (Media) - Single media, Images only
- **social** (Component) - Social links component
- **blog_posts** (Relation) - One-to-Many with Blog Post

### 4. Tag Content Type (Optional)

Create `tag` content type:
- **name** (Text) - Required, Short text
- **slug** (Text) - Required, Short text, Unique
- **color** (Text) - Optional, Short text (hex color)
- **blog_posts** (Relation) - Many-to-Many with Blog Post

## Configuration

### 1. API Permissions

Go to **Settings > Roles > Public**:

Enable the following permissions:
- **Blog-post**: find, findOne
- **Category**: find, findOne
- **Author**: find, findOne
- **Tag**: find, findOne (if using tags)

### 2. Environment Variables

Add to your `.env` file:

```env
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=global_treat_cms
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret

# Cloudinary (for media)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

### 3. Media Upload Configuration

Install Cloudinary provider:

```bash
npm install @strapi/provider-upload-cloudinary
```

Configure in `config/plugins.js`:

```javascript
module.exports = {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
};
```

## Content Management

### 1. Creating Content

#### Blog Posts
1. Go to **Content Manager > Blog-post**
2. Click **Add New Blog-post**
3. Fill in all required fields:
   - **Title**: SEO-optimized title in Thai
   - **Slug**: URL-friendly slug (auto-generated from title)
   - **Content**: Rich text content with proper formatting
   - **Excerpt**: Brief summary (if not provided, auto-generated)
   - **Featured Image**: High-quality image (recommended 1200x630px)
   - **Category**: Select appropriate category
   - **Author**: Assign author
   - **SEO**: Fill meta title, description, keywords
4. Toggle **Featured** for homepage highlight
5. Set **Status** to Published when ready

#### Categories
Create categories for content organization:
- กำจัดปลวก (Termite Control)
- บำบัดน้ำเสีย (Wastewater Treatment)
- เทคนิคการป้องกัน (Prevention Techniques)
- ข่าวสาร (News & Updates)

#### Authors
Set up author profiles for content attribution and authority.

### 2. Content Guidelines

#### SEO Optimization
- **Title**: 50-60 characters, include primary keyword
- **Meta Description**: 150-160 characters, compelling summary
- **Keywords**: 5-10 relevant keywords separated by commas
- **Slug**: Short, descriptive, keyword-rich
- **Images**: Alt text for all images, optimized file sizes

#### Content Quality
- **Headings**: Use proper H2-H6 hierarchy
- **Content**: Minimum 300 words, comprehensive coverage
- **Links**: Include internal links to related content
- **Images**: High-quality, relevant images with captions
- **Language**: Professional Thai language, accessible to general audience

## API Integration

### 1. Frontend Environment Variables

Add to your Astro project's `.env`:

```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_api_token
```

### 2. API Token Creation

1. Go to **Settings > API Tokens**
2. Click **Create new API Token**
3. Name: "Frontend Blog Access"
4. Token type: Read-only
5. Token duration: Unlimited (for production)
6. Copy the token and add to your `.env` file

### 3. Testing API

Test the API endpoints:

```bash
# Get all blog posts
curl http://localhost:1337/api/blog-posts?populate=*

# Get single blog post
curl http://localhost:1337/api/blog-posts?filters[slug][$eq]=your-slug&populate=*

# Get categories
curl http://localhost:1337/api/categories
```

## Deployment

### 1. Database Setup (Production)

For production, use PostgreSQL:

```bash
# Install PostgreSQL client
npm install pg
```

Update `config/database.js`:

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    debug: false,
  },
});
```

### 2. Deployment Platforms

#### Railway (Recommended)
1. Push code to GitHub
2. Connect Railway to your repository
3. Add environment variables
4. Deploy automatically

#### Heroku
1. Create new Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy via Git

### 3. Frontend Configuration

Update your Astro `.env.production`:

```env
STRAPI_URL=https://your-strapi-domain.com
STRAPI_TOKEN=your_production_token
```

## SEO Best Practices

### 1. Content Optimization

- **Keyword Research**: Target Thai keywords related to pest control and wastewater treatment
- **Content Depth**: Create comprehensive, authoritative content
- **Internal Linking**: Link to related blog posts and service pages
- **External Links**: Link to authoritative sources when relevant

### 2. Technical SEO

- **Site Speed**: Optimize images, use CDN
- **Mobile Optimization**: Ensure responsive design
- **Schema Markup**: Implement Article schema (already included)
- **XML Sitemap**: Auto-generated by Astro
- **Canonical URLs**: Prevent duplicate content issues

### 3. Content Calendar

Plan content around:
- Seasonal pest activity patterns
- Industry news and regulations
- Customer frequently asked questions
- Service promotions and updates

### 4. Performance Monitoring

Use tools like:
- Google Search Console
- Google Analytics
- Page Speed Insights
- Core Web Vitals monitoring

## Maintenance

### 1. Regular Tasks

- **Content Updates**: Review and update older content
- **Image Optimization**: Compress and optimize images
- **SEO Monitoring**: Track search rankings and traffic
- **Security Updates**: Keep Strapi and dependencies updated

### 2. Backup Strategy

- **Database Backups**: Regular automated backups
- **Media Backups**: Cloudinary provides automatic backups
- **Code Backups**: Version control with Git

### 3. Content Workflow

1. **Planning**: Editorial calendar and keyword research
2. **Creation**: Content creation in Strapi
3. **Review**: Content review and SEO optimization
4. **Publishing**: Schedule and publish content
5. **Promotion**: Share on social media and newsletter
6. **Monitoring**: Track performance and engagement

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check STRAPI_URL and STRAPI_TOKEN
   - Verify API permissions
   - Check network connectivity

2. **Image Upload Issues**
   - Verify Cloudinary configuration
   - Check file size limits
   - Ensure proper image formats

3. **Content Not Displaying**
   - Check publication status
   - Verify API populate parameters
   - Review content type relations

4. **SEO Issues**
   - Validate structured data
   - Check canonical URLs
   - Verify meta tags

### Getting Help

- **Strapi Documentation**: https://docs.strapi.io/
- **Community Discord**: https://discord.strapi.io/
- **GitHub Issues**: Report bugs and feature requests

## Conclusion

This setup provides a robust, SEO-optimized blog system that will help boost your website's search rankings and provide valuable content to your audience. The system is designed to be user-friendly for content creators while providing powerful SEO features for search engine optimization.

Regular content creation and optimization following these guidelines will help establish Global Treat as an authority in pest control and wastewater treatment services in Thailand.
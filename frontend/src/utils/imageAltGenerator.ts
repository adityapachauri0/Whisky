/**
 * Automatic Alt Text Generation System for SEO Optimization
 * Generates descriptive alt text for images based on context and filename
 */

interface ImageContext {
  page?: string;
  section?: string;
  purpose?: 'hero' | 'gallery' | 'blog' | 'product' | 'testimonial' | 'cta' | 'icon' | 'logo';
  distillery?: string;
  caskType?: string;
  year?: string;
  category?: string;
  title?: string;
}

interface AltTextRule {
  pattern: RegExp;
  template: string;
  priority: number;
}

class ImageAltGenerator {
  private static readonly defaultAltText = 'ViticultWhisky premium whisky investment';
  
  private static readonly altTextRules: AltTextRule[] = [
    // Whisky and Cask Images
    {
      pattern: /(?:whisky|whiskey).*(?:cask|barrel)/i,
      template: 'Premium whisky casks for investment at bonded warehouse',
      priority: 10
    },
    {
      pattern: /(?:distillery|still)/i,
      template: 'Scottish whisky distillery for premium cask investments',
      priority: 9
    },
    {
      pattern: /(?:hero|main).*(?:1|2|3)/i,
      template: 'ViticultWhisky premium Scottish whisky cask investment platform',
      priority: 8
    },
    
    // Specific Distilleries
    {
      pattern: /macallan/i,
      template: 'Macallan whisky casks - premium investment opportunity',
      priority: 8
    },
    {
      pattern: /lagavulin/i,
      template: 'Lagavulin Islay whisky casks for investment portfolio',
      priority: 8
    },
    {
      pattern: /ardbeg/i,
      template: 'Ardbeg peated whisky casks - exclusive investment',
      priority: 8
    },
    {
      pattern: /glenfiddich/i,
      template: 'Glenfiddich Speyside whisky casks for investors',
      priority: 8
    },
    
    // Cask Types
    {
      pattern: /bourbon.*barrel/i,
      template: 'Ex-bourbon barrel for whisky maturation and investment',
      priority: 7
    },
    {
      pattern: /sherry.*cask/i,
      template: 'Sherry cask aged whisky for premium investment',
      priority: 7
    },
    {
      pattern: /port.*cask/i,
      template: 'Port wine cask finished whisky investment',
      priority: 7
    },
    {
      pattern: /virgin.*oak/i,
      template: 'Virgin oak cask for whisky maturation investment',
      priority: 7
    },
    
    // Investment and Business
    {
      pattern: /investment|portfolio|returns/i,
      template: 'Whisky cask investment portfolio with strong returns',
      priority: 6
    },
    {
      pattern: /warehouse|storage/i,
      template: 'HMRC bonded warehouse for secure whisky cask storage',
      priority: 6
    },
    {
      pattern: /calculator|chart|graph/i,
      template: 'Whisky investment calculator showing potential returns',
      priority: 6
    },
    
    // Blog and Educational
    {
      pattern: /blog|article|guide/i,
      template: 'Whisky investment educational content and market insights',
      priority: 5
    },
    {
      pattern: /expert|advisor|team/i,
      template: 'ViticultWhisky expert advisors for whisky investment guidance',
      priority: 5
    },
    
    // Regions
    {
      pattern: /speyside/i,
      template: 'Speyside whisky region casks for investment',
      priority: 4
    },
    {
      pattern: /islay/i,
      template: 'Islay peated whisky casks for investment portfolio',
      priority: 4
    },
    {
      pattern: /highlands/i,
      template: 'Highland Scottish whisky casks for premium investment',
      priority: 4
    },
    {
      pattern: /lowlands/i,
      template: 'Lowland whisky casks - accessible investment opportunity',
      priority: 4
    },
    
    // General whisky terms
    {
      pattern: /aged|maturation|years?/i,
      template: 'Aged whisky casks with proven maturation for investment',
      priority: 3
    },
    {
      pattern: /premium|luxury|exclusive/i,
      template: 'Premium whisky cask investment for discerning investors',
      priority: 3
    },
    {
      pattern: /scottish|scotland/i,
      template: 'Scottish whisky casks from premium distilleries',
      priority: 3
    }
  ];

  /**
   * Generate SEO-optimized alt text for images
   */
  static generateAltText(
    imagePath: string, 
    context: ImageContext = {},
    customAlt?: string
  ): string {
    // If custom alt text is provided and meaningful, use it
    if (customAlt && customAlt.trim() && !this.isGenericAlt(customAlt)) {
      return this.enhanceAltText(customAlt, context);
    }

    // Extract filename from path
    const filename = this.extractFilename(imagePath);
    
    // Try to match against alt text rules
    const matchedRule = this.findMatchingRule(filename + ' ' + JSON.stringify(context));
    
    if (matchedRule) {
      return this.contextualizeAltText(matchedRule.template, context, filename);
    }

    // Generate context-based alt text
    return this.generateContextualAlt(context, filename);
  }

  /**
   * Check if alt text is generic or placeholder
   */
  private static isGenericAlt(alt: string): boolean {
    const genericPatterns = [
      /^image$/i,
      /^photo$/i,
      /^picture$/i,
      /placeholder/i,
      /via\.placeholder/i,
      /unsplash/i,
      /lorem/i,
      /^img_\d+$/i,
      /^untitled$/i
    ];

    return genericPatterns.some(pattern => pattern.test(alt.trim()));
  }

  /**
   * Extract meaningful filename from image path
   */
  private static extractFilename(imagePath: string): string {
    return imagePath
      .split('/')
      .pop()
      ?.replace(/\.(webp|jpg|jpeg|png|gif|svg)$/i, '')
      ?.replace(/[-_]/g, ' ')
      ?.toLowerCase() || '';
  }

  /**
   * Find the best matching rule for the image
   */
  private static findMatchingRule(searchText: string): AltTextRule | null {
    return this.altTextRules
      .filter(rule => rule.pattern.test(searchText))
      .sort((a, b) => b.priority - a.priority)[0] || null;
  }

  /**
   * Add context-specific information to alt text
   */
  private static contextualizeAltText(
    template: string, 
    context: ImageContext, 
    filename: string
  ): string {
    let altText = template;

    // Add distillery name if available
    if (context.distillery) {
      altText = altText.replace(/whisky/i, `${context.distillery} whisky`);
    }

    // Add cask type if available
    if (context.caskType) {
      altText += ` - ${context.caskType} cask`;
    }

    // Add year if available
    if (context.year) {
      altText += ` ${context.year}`;
    }

    // Add page context
    if (context.page) {
      altText += ` | ${context.page} page`;
    }

    return this.cleanAltText(altText);
  }

  /**
   * Generate context-based alt text when no rules match
   */
  private static generateContextualAlt(context: ImageContext, filename: string): string {
    const parts = ['ViticultWhisky'];

    // Add purpose-specific context
    switch (context.purpose) {
      case 'hero':
        parts.push('premium Scottish whisky cask investment platform');
        break;
      case 'gallery':
        parts.push('whisky cask gallery');
        break;
      case 'blog':
        parts.push('whisky investment insights');
        break;
      case 'product':
        parts.push('whisky cask investment opportunity');
        break;
      case 'testimonial':
        parts.push('satisfied whisky investment client');
        break;
      case 'cta':
        parts.push('start your whisky investment journey');
        break;
      case 'icon':
      case 'logo':
        parts.push('logo');
        break;
      default:
        parts.push('whisky investment');
    }

    // Add specific context
    if (context.distillery) parts.push(`${context.distillery} distillery`);
    if (context.caskType) parts.push(`${context.caskType} cask`);
    if (context.year) parts.push(context.year);
    if (context.category) parts.push(context.category);

    // Add filename insights if meaningful
    if (filename && filename.length > 3) {
      const cleanFilename = filename.replace(/\d+/g, '').trim();
      if (cleanFilename.length > 3) {
        parts.push(cleanFilename);
      }
    }

    return this.cleanAltText(parts.join(' - '));
  }

  /**
   * Enhance existing alt text with context
   */
  private static enhanceAltText(altText: string, context: ImageContext): string {
    let enhanced = altText;

    // Add ViticultWhisky branding if not present
    if (!enhanced.toLowerCase().includes('viticult')) {
      enhanced = `${enhanced} | ViticultWhisky`;
    }

    // Add investment context if not present
    if (!enhanced.toLowerCase().includes('investment') && 
        !enhanced.toLowerCase().includes('invest')) {
      enhanced = enhanced.replace(/whisky/i, 'whisky investment');
    }

    return this.cleanAltText(enhanced);
  }

  /**
   * Clean and optimize alt text
   */
  private static cleanAltText(altText: string): string {
    return altText
      .replace(/\s+/g, ' ')
      .replace(/\s*-\s*-\s*/g, ' - ')
      .replace(/^[^a-zA-Z]+/, '')
      .replace(/[^a-zA-Z]+$/, '')
      .trim()
      .substring(0, 125) // Keep under 125 characters for optimal SEO
      .replace(/\s+$/, ''); // Remove trailing spaces
  }

  /**
   * Generate alt text for whisky cask images
   */
  static generateCaskAltText(
    imagePath: string,
    distillery?: string,
    caskType?: string,
    year?: string,
    customAlt?: string
  ): string {
    return this.generateAltText(imagePath, {
      purpose: 'product',
      distillery,
      caskType,
      year
    }, customAlt);
  }

  /**
   * Generate alt text for blog images
   */
  static generateBlogAltText(
    imagePath: string,
    title?: string,
    category?: string,
    customAlt?: string
  ): string {
    return this.generateAltText(imagePath, {
      purpose: 'blog',
      title,
      category
    }, customAlt);
  }

  /**
   * Generate alt text for hero section images
   */
  static generateHeroAltText(
    imagePath: string,
    page?: string,
    customAlt?: string
  ): string {
    return this.generateAltText(imagePath, {
      purpose: 'hero',
      page
    }, customAlt);
  }
}

export default ImageAltGenerator;
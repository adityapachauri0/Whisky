const fs = require('fs');
const path = require('path');

/**
 * Generate email content for investment inquiry responses
 * @param {Object} contact - Contact information
 * @param {string} contact.name - Contact's name
 * @param {string} contact.email - Contact's email
 * @param {string} contact.subject - Inquiry subject
 * @param {string} contact.message - Original message
 * @param {string} contact.investmentInterest - Investment level (starter/premium/luxury)
 * @returns {Object} Email content with subject and body
 */
function generateInvestmentInquiryEmail(contact) {
  // Load the HTML template
  const templatePath = path.join(__dirname, '../email-templates/investment-inquiry-response.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  // Determine investment level details
  let investmentLevel, investmentRange, investmentDescription;
  
  switch (contact.investmentInterest) {
    case 'starter':
      investmentLevel = 'Entry Level Investment';
      investmentRange = '£3,000 - £5,000';
      investmentDescription = 'Perfect for first-time investors. New make spirit from emerging distilleries with strong growth potential. Expected returns of 8-12% annually over 5-10 years.';
      break;
    case 'premium':
      investmentLevel = 'Premium Investment';
      investmentRange = '£10,000 - £30,000';
      investmentDescription = 'Established distilleries with 3-5 year aged stock. Balanced risk-return profile with expected returns of 12-15% annually. Most popular choice among our investors.';
      break;
    case 'luxury':
      investmentLevel = 'Luxury Investment';
      investmentRange = '£30,000+';
      investmentDescription = 'Rare casks from premium distilleries. For sophisticated investors seeking exceptional returns of 15-20%+ annually. Limited availability and strong collector interest.';
      break;
    default:
      investmentLevel = 'Whisky Cask Investment';
      investmentRange = '£3,000 - £50,000+';
      investmentDescription = 'We offer investment options for every budget and goal. Our specialists will help you find the perfect cask to match your investment objectives.';
  }

  // Generate personalized response based on their message
  let personalizedResponse = generatePersonalizedResponse(contact.message);

  // Replace placeholders
  const replacements = {
    '{{NAME}}': contact.name,
    '{{EMAIL}}': contact.email,
    '{{INQUIRY_SUBJECT}}': contact.subject,
    '{{PERSONALIZED_RESPONSE}}': personalizedResponse,
    '{{INVESTMENT_LEVEL}}': investmentLevel,
    '{{INVESTMENT_RANGE}}': investmentRange,
    '{{INVESTMENT_DESCRIPTION}}': investmentDescription,
    '{{CALENDAR_LINK}}': 'https://calendly.com/viticultwhisky/consultation',
    '{{DOWNLOAD_GUIDE_LINK}}': 'https://viticultwhisky.com/download/investment-guide.pdf',
    '{{UNSUBSCRIBE_LINK}}': `https://viticultwhisky.com/unsubscribe?email=${encodeURIComponent(contact.email)}`,
    '{{PRIVACY_LINK}}': 'https://viticultwhisky.com/privacy'
  };

  // Replace all placeholders
  Object.keys(replacements).forEach(placeholder => {
    htmlTemplate = htmlTemplate.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
  });

  return {
    subject: `Re: ${contact.subject} - Your Whisky Investment Journey Begins`,
    html: htmlTemplate,
    text: generatePlainTextVersion(contact, investmentLevel, investmentRange, personalizedResponse)
  };
}

/**
 * Generate personalized response based on inquiry message
 * @param {string} message - Original inquiry message
 * @returns {string} Personalized response
 */
function generatePersonalizedResponse(message) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('minimum') || messageLower.includes('start') || messageLower.includes('begin')) {
    return "I'm delighted to confirm that you can begin your whisky investment journey with as little as £3,000. This entry point allows you to own a complete cask while learning about this fascinating market. Many of our most successful investors started with a single entry-level cask.";
  }
  
  if (messageLower.includes('tax') || messageLower.includes('cgt') || messageLower.includes('capital gains')) {
    return "You've identified one of the key advantages of whisky cask investment. As a wasting asset, profits from cask sales are completely exempt from Capital Gains Tax in the UK. This tax efficiency, combined with strong historical returns, makes whisky casks particularly attractive for investors.";
  }
  
  if (messageLower.includes('risk') || messageLower.includes('safe') || messageLower.includes('guarantee')) {
    return "Your prudent approach to understanding investment risks is commendable. While whisky has shown consistent appreciation over decades, we believe in full transparency about market dynamics, storage costs, and optimal exit strategies. Our consultation will cover all aspects to ensure you make an informed decision.";
  }
  
  if (messageLower.includes('return') || messageLower.includes('profit') || messageLower.includes('roi')) {
    return "Historical data shows whisky casks have delivered average annual returns of 12-15%, with some premium casks achieving even higher appreciation. Your returns depend on factors like distillery selection, cask type, and holding period. We'll provide detailed projections based on your specific investment goals.";
  }
  
  if (messageLower.includes('storage') || messageLower.includes('warehouse') || messageLower.includes('insurance')) {
    return "Your cask will be stored in HMRC-regulated bonded warehouses with comprehensive insurance coverage. Annual storage costs typically range from £50-£100, and no duty is payable while your whisky remains in bond. You'll receive all documentation confirming your ownership and storage arrangements.";
  }
  
  if (messageLower.includes('sell') || messageLower.includes('exit') || messageLower.includes('cash out')) {
    return "Having a clear exit strategy is crucial for any investment. Whisky casks offer multiple exit options: selling back to distilleries, independent bottlers, through auction houses, or to private collectors. We'll discuss the optimal timing and method based on your specific cask and market conditions.";
  }
  
  // Default response for general inquiries
  return "Thank you for reaching out about whisky cask investment. Based on your inquiry, I believe we can create an investment strategy that perfectly aligns with your financial goals. Our specialists have extensive experience helping investors like you navigate this exciting market.";
}

/**
 * Generate plain text version of email
 */
function generatePlainTextVersion(contact, investmentLevel, investmentRange, personalizedResponse) {
  return `Dear ${contact.name},

Thank you for your interest in Scottish whisky cask investment. Your journey to owning a piece of Scotland's liquid gold heritage begins here.

WHY INVEST IN WHISKY CASKS?
- 12-15% Average Annual Returns
- CGT Exempt - No Capital Gains Tax on profits
- £3,000 Minimum Investment
- 100% Asset Ownership

YOUR INVESTMENT JOURNEY:
1. Choose Your Cask - Select from new-make or aged casks
2. Legal Ownership - Receive delivery order and bailment contract
3. Professional Storage - HMRC bonded warehouse with insurance
4. Value Appreciation - Whisky matures and increases in value
5. Exit Strategy - Multiple options for selling your investment

REGARDING YOUR INQUIRY: "${contact.subject}"

${personalizedResponse}

RECOMMENDED FOR YOU: ${investmentLevel}
Investment Range: ${investmentRange}

YOUR NEXT STEPS:
1. Schedule a free consultation with our specialists
2. Review available cask portfolio
3. Make an informed investment decision

Book Your Free Consultation: https://calendly.com/viticultwhisky/consultation
Download Investment Guide: https://viticultwhisky.com/download/investment-guide.pdf

Contact Us:
Phone: +44 20 1234 5678
Email: invest@viticultwhisky.com
Hours: Monday-Friday 9AM-6PM GMT, Saturday 10AM-4PM GMT

Best regards,
The ViticultWhisky Team

© 2025 ViticultWhisky. All rights reserved.
This email was sent to ${contact.email} because you expressed interest in whisky cask investment.
`;
}

module.exports = {
  generateInvestmentInquiryEmail
};
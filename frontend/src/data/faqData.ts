export interface FAQSection {
  id: string;
  title: string;
  icon?: string;
  content: string;
  subsections?: FAQSubsection[];
  visual?: FAQVisual;
}

export interface FAQSubsection {
  id: string;
  subtitle?: string;
  content: string;
  list?: string[];
  table?: FAQTable;
}

export interface FAQTable {
  headers: string[];
  rows: string[][];
}

export interface FAQVisual {
  type: 'chart' | 'graph' | 'timeline' | 'calculator' | 'infographic';
  title: string;
  description?: string;
  data?: any;
}

export const faqSections: FAQSection[] = [
  {
    id: 'what-is-whiskey-investment',
    title: 'What Is Whiskey Cask Investment and Why Choose Irish Whiskey?',
    icon: 'info',
    content: 'Whiskey cask investment means purchasing an actual oak cask filled with new-make or maturing whiskey, stored under bond. Over time, maturation in oak imparts flavor, color, and rarity, driving value appreciation.',
    subsections: [
      {
        id: 'why-irish',
        subtitle: 'Irish whiskey casks are especially compelling due to:',
        content: '',
        list: [
          'Wasting Asset Tax Treatment: Evaporation qualifies casks as "wasting assets," exempting UK-based investors from Capital Gains Tax on cask-to-cask sales.',
          'Rapid Market Growth: Global Irish whiskey demand is surging, outpacing production capacity, creating scarcity and upward price pressure.',
          'Tangible and Portfolio Diversifier: Physical ownership with low correlation to equities and bonds.'
        ]
      }
    ]
  },
  {
    id: 'investment-process',
    title: 'Investment Process: Step-by-Step',
    icon: 'process',
    content: 'Follow our structured approach to whiskey cask investment.',
    subsections: [
      {
        id: 'steps-table',
        content: '',
        table: {
          headers: ['Step', 'Description'],
          rows: [
            ['1. Cask Selection', 'Choose between new-make spirit (entry ~€2,500–€5,000), premium new-make (€10,000+), or aged casks (5+ years, €30,000–€50,000+).'],
            ['2. Legal Documentation', 'Receive a Delivery Order from bonded warehouse plus a bailment contract with unique cask ID and owner details.'],
            ['3. Storage & Insurance', 'Store in an HMRC-approved bonded warehouse under excise suspension; costs range £50–£100/year plus insurance (£50–£200/year).'],
            ['4. Maturation', 'Natural aging enhances flavor while volume reduces via the Angel\'s Share: ~4% in year 1, then ~2% annually.'],
            ['5. Exit & Monetization', 'Options include distillery buy-back, independent bottlers, auction platforms, private collector sales, or personal bottling.']
          ]
        }
      }
    ],
    visual: {
      type: 'timeline',
      title: 'Investment Journey Timeline',
      description: 'Visual representation of your whiskey investment journey from purchase to exit'
    }
  },
  {
    id: 'angels-share',
    title: 'Modeling Evaporation: The Angel\'s Share',
    icon: 'chart',
    content: 'As whiskey matures, a portion evaporates ("Angel\'s Share"), concentrating flavors. The first year sees ~4% loss, then ~2% each subsequent year.',
    visual: {
      type: 'graph',
      title: 'Projected Remaining Whiskey Volume Over Time Due to Angel\'s Share',
      description: 'Interactive chart showing volume reduction over 25 years',
      data: {
        labels: Array.from({length: 26}, (_, i) => i),
        datasets: [{
          label: 'Remaining Volume (%)',
          data: [100, 96, 94.08, 92.20, 90.36, 88.55, 86.78, 85.04, 83.34, 81.67, 80.04, 78.44, 76.87, 75.33, 73.82, 72.35, 70.90, 69.48, 68.09, 66.73, 65.40, 64.09, 62.81, 61.55, 60.32, 59.11]
        }]
      }
    }
  },
  {
    id: 'cost-structure',
    title: 'Cost Structure: Ongoing and Transactional Expenses',
    icon: 'calculator',
    content: 'Even though storage and insurance may be included initially, understanding additional costs is crucial for accurate ROI modeling.',
    subsections: [
      {
        id: 'cost-breakdown',
        content: '',
        table: {
          headers: ['Category', 'Cost (£)'],
          rows: [
            ['Storage (5 years × £75)', '375'],
            ['Insurance (5 years × £125)', '625'],
            ['Regauging (once)', '100'],
            ['Purchase Commission (2%)', '200'],
            ['Sale Commission (2%)', '360'],
            ['Total', '1,660']
          ]
        }
      }
    ],
    visual: {
      type: 'chart',
      title: 'Breakdown of Additional Costs for £10,000 Cask Investment Over 5 Years',
      description: 'Pie chart showing relative weight of different costs',
      data: {
        labels: ['Storage', 'Insurance', 'Regauging', 'Purchase Commission', 'Sale Commission'],
        datasets: [{
          data: [375, 625, 100, 200, 360],
          backgroundColor: ['#8B4513', '#D2691E', '#DEB887', '#F4A460', '#CD853F']
        }]
      }
    }
  },
  {
    id: 'calculating-returns',
    title: 'Calculating Returns: Interactive Tools',
    icon: 'calculator',
    content: 'A robust Cask Investment Calculator should allow you to input:',
    subsections: [
      {
        id: 'calculator-inputs',
        content: '',
        list: [
          'Initial investment',
          'Holding period',
          'Expected annual appreciation',
          'Storage, insurance, and commission rates',
          'Angel\'s Share parameters'
        ]
      },
      {
        id: 'additional-tools',
        content: 'Use online dilution and cask-yield calculators (e.g., Flask Fine Wines Cask Calculator) to estimate bottle count or final ABV if you choose to bottle.'
      }
    ],
    visual: {
      type: 'calculator',
      title: 'Interactive ROI Calculator',
      description: 'Calculate your potential returns with our comprehensive investment calculator'
    }
  },
  {
    id: 'understanding-returns',
    title: 'Understanding Potential Returns',
    icon: 'trending',
    content: 'Historical performance data shows varying returns based on cask quality and rarity.',
    subsections: [
      {
        id: 'return-categories',
        content: '',
        list: [
          'Average Casks: 12–15% p.a.',
          'Premium Aged Stock: 20%+ p.a.',
          'Rare Casks: Exceptional cases can exceed 30% p.a.'
        ]
      },
      {
        id: 'example-calculation',
        subtitle: 'Example Return Calculation',
        content: 'A £10,000 cask held 5 years, sold at £18,000 incurs £1,660 in costs, yielding £6,340 net profit → 63.4% total return (10.5% p.a.).'
      }
    ],
    visual: {
      type: 'graph',
      title: 'Historical Returns by Cask Category',
      description: 'Bar chart comparing returns across different cask types',
      data: {
        labels: ['Average Casks', 'Premium Aged Stock', 'Rare Casks'],
        datasets: [{
          label: 'Annual Return (%)',
          data: [13.5, 22, 35],
          backgroundColor: ['#8B4513', '#D2691E', '#FFD700']
        }]
      }
    }
  },
  {
    id: 'risks-mitigation',
    title: 'Risks and Mitigation',
    icon: 'shield',
    content: 'Understanding and managing risks is crucial for successful whiskey cask investment.',
    subsections: [
      {
        id: 'risk-factors',
        content: '',
        list: [
          'Market Risk: Prices fluctuate with consumer trends; mitigate by diversified distilleries and age profiles.',
          'Liquidity Risk: Illiquid asset; plan exits in advance, use reputable auction platforms.',
          'Storage & Damage: Bonded warehouses and comprehensive insurance mitigate physical risks.',
          'Fraud: Verify HMRC bond licences, WOWGR registration, and inspect documentation.'
        ]
      }
    ],
    visual: {
      type: 'infographic',
      title: 'Risk-Mitigation Matrix',
      description: 'Visual guide to understanding and mitigating investment risks'
    }
  },
  {
    id: 'how-to-start',
    title: 'How to Get Started',
    icon: 'start',
    content: 'Begin your whiskey cask investment journey with these essential steps.',
    subsections: [
      {
        id: 'getting-started-steps',
        content: '',
        list: [
          'Define Objectives: Amount, time horizon (minimum 5 years), and return expectations.',
          'Select a Reputable Partner: Confirm HMRC-bonded storage, insurance coverage, transparent fees, and exit options.',
          'Use Analytical Tools: Leverage calculators and the above charts to model scenarios and make data-driven decisions.'
        ]
      },
      {
        id: 'conclusion',
        content: 'By combining market fundamentals, tax advantages, and natural appreciation, Irish whiskey cask investment offers a compelling alternative asset for investors with appropriate risk tolerance and time horizons.'
      }
    ]
  }
];

// Sample data for charts
export const angelsShareData = {
  years: Array.from({length: 26}, (_, i) => i),
  volumes: [100, 96, 94.08, 92.20, 90.36, 88.55, 86.78, 85.04, 83.34, 81.67, 80.04, 78.44, 76.87, 75.33, 73.82, 72.35, 70.90, 69.48, 68.09, 66.73, 65.40, 64.09, 62.81, 61.55, 60.32, 59.11]
};

export const costBreakdownData = {
  labels: ['Storage', 'Insurance', 'Regauging', 'Purchase Commission', 'Sale Commission'],
  values: [375, 625, 100, 200, 360],
  total: 1660
};

export const returnsComparisonData = {
  categories: ['Average Casks', 'Premium Aged Stock', 'Rare Casks'],
  minReturns: [12, 20, 30],
  avgReturns: [13.5, 22, 35],
  maxReturns: [15, 25, 40]
};
// Investment Grade Classifications
export type InvestmentGrade = 'Ultra Premium' | 'Super Premium' | 'Premium' | 'Standard';

export interface Distillery {
  id: string;
  name: string;
  region: string;
  location: string;
  established: number;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  features: string[];
  investmentGrade: InvestmentGrade;
  investmentHighlights: string[];
  minimumInvestment: string;
  typicalCaskPrice: string;
  expectedReturns: string;
  annualAppreciation: string;
  maturationPeriod: string;
  riskLevel: 'Low' | 'Low-Medium' | 'Medium' | 'Medium-High' | 'High';
  caskTypes: string[];
  notableWhiskies: string[];
  flavorProfile: string[];
  awards: string[];
  distillerySize: 'Boutique' | 'Medium' | 'Large';
  productionCapacity: string;
  website?: string;
  tourAvailable: boolean;
  featured: boolean;
  investmentNotes: string;
  marketDemand: 'Very High' | 'High' | 'Medium' | 'Growing';
}

export interface RegionalData {
  region: string;
  description: string;
  distilleryCount: number;
  flavorCharacteristics: string[];
  investmentPotential: string;
  topDistilleries: string[];
  image: string;
}

export interface DistilleryNews {
  id: string;
  distilleryId: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'release' | 'investment' | 'market' | 'award' | 'auction' | 'analysis';
  image?: string;
  author: string;
}

// Regional Data based on the comprehensive guide
export const regionalData: RegionalData[] = [
  {
    region: 'Speyside',
    description: 'The golden triangle of Scotch whisky, home to over 60 distilleries producing elegant, complex single malts. The highest concentration of distilleries in Scotland.',
    distilleryCount: 60,
    flavorCharacteristics: ['Elegant', 'Complex', 'Fruity', 'Floral', 'Sweet', 'Refined'],
    investmentPotential: 'Exceptional - Home to the most valuable whisky brands globally including Macallan and Glenfiddich',
    topDistilleries: ['The Macallan', 'Glenfiddich', 'The Balvenie', 'Aberlour', 'The Glenlivet'],
    image: '/whisky/regions/speyside.webp'
  },
  {
    region: 'Highland',
    description: 'Scotland\'s largest whisky region, offering diverse styles from light and delicate to rich and sherried. Premium investment opportunities.',
    distilleryCount: 47,
    flavorCharacteristics: ['Diverse', 'Robust', 'Heathery', 'Spicy', 'Sherried', 'Maritime'],
    investmentPotential: 'Very High - Contains prestigious distilleries like Dalmore and Royal Lochnagar',
    topDistilleries: ['The Dalmore', 'Glenmorangie', 'Royal Lochnagar', 'Oban', 'Ben Nevis'],
    image: '/whisky/regions/highland.webp'
  },
  {
    region: 'Islay',
    description: 'The whisky capital of Scotland, renowned for intensely peated, smoky single malts commanding premium prices.',
    distilleryCount: 9,
    flavorCharacteristics: ['Peaty', 'Smoky', 'Maritime', 'Medicinal', 'Complex', 'Powerful'],
    investmentPotential: 'Very High - Limited production and cult following ensures strong appreciation',
    topDistilleries: ['Ardbeg', 'Lagavulin', 'Laphroaig', 'Bowmore', 'Bruichladdich'],
    image: '/whisky/regions/islay.webp'
  },
  {
    region: 'Island',
    description: 'Scotland\'s island distilleries (excluding Islay) produce distinctive maritime whiskies with unique character.',
    distilleryCount: 7,
    flavorCharacteristics: ['Maritime', 'Salty', 'Sweet', 'Smoky', 'Heathery', 'Complex'],
    investmentPotential: 'High - Unique island character and limited production drives value',
    topDistilleries: ['Highland Park', 'Talisker', 'Arran', 'Jura', 'Tobermory'],
    image: '/whisky/regions/island.webp'
  },
  {
    region: 'Campbeltown',
    description: 'Once the whisky capital with 30+ distilleries, now a boutique region with just 3 producing highly sought-after whiskies.',
    distilleryCount: 3,
    flavorCharacteristics: ['Complex', 'Salty', 'Fruity', 'Oily', 'Robust', 'Distinctive'],
    investmentPotential: 'Exceptional - Springbank\'s limited availability creates extreme demand',
    topDistilleries: ['Springbank', 'Glen Scotia', 'Glengyle'],
    image: '/whisky/regions/campbeltown.webp'
  },
  {
    region: 'Lowland',
    description: 'Known for light, delicate whiskies, the Lowlands are experiencing a renaissance with new distilleries.',
    distilleryCount: 18,
    flavorCharacteristics: ['Light', 'Delicate', 'Fresh', 'Grassy', 'Citrus', 'Gentle'],
    investmentPotential: 'Growing - New distilleries and rising interest in lighter styles',
    topDistilleries: ['Auchentoshan', 'Glenkinchie', 'Bladnoch', 'Ailsa Bay'],
    image: '/whisky/regions/lowland.webp'
  }
];

// Premium Distilleries with Investment Grades
export const distilleries: Distillery[] = [
  // ULTRA PREMIUM (£20k+)
  {
    id: 'the-macallan',
    name: 'The Macallan',
    region: 'Speyside',
    location: 'Craigellachie, Moray',
    established: 1824,
    description: 'The pinnacle of single malt whisky, commanding record-breaking auction prices globally.',
    longDescription: `The Macallan represents the apex of whisky investment. With a 1926 Fine and Rare selling for £1.9 million in 2019, it holds multiple world records. The distillery's obsession with exceptional oak casks and natural colour creates whiskies of unparalleled quality. Their new £140 million distillery showcases their commitment to excellence.`,
    image: '/whisky/distilleries/macallan-distillery.webp',
    gallery: [
      '/whisky/hero/viticult_whisky_cask_investment43.webp'
    ],
    features: [
      'World\'s Most Valuable Whisky Brand',
      'Record Auction Prices',
      'Exceptional Sherry Casks',
      'Natural Colour Only'
    ],
    investmentGrade: 'Ultra Premium',
    investmentHighlights: [
      'Consistent 20-25% annual appreciation',
      '1926 Fine & Rare sold for £1.9 million',
      'Most collected whisky globally',
      'Limited allocation increases scarcity'
    ],
    minimumInvestment: '£25,000',
    typicalCaskPrice: '£25,000-80,000',
    expectedReturns: '18-25% annually',
    annualAppreciation: '20-25%',
    maturationPeriod: '10-30 years',
    riskLevel: 'Medium-High',
    caskTypes: ['European Oak Sherry', 'American Oak Sherry', 'Exceptional Casks'],
    notableWhiskies: ['M Collection', 'Fine & Rare', 'Exceptional Casks', '72 Year Old'],
    flavorProfile: ['Rich', 'Complex', 'Dried Fruits', 'Spice', 'Chocolate', 'Orange'],
    awards: [
      'World\'s Most Admired Whisky Brand 2023',
      'IWSC Trophy Winner Multiple Years',
      'Most Valuable Whisky at Auction'
    ],
    distillerySize: 'Large',
    productionCapacity: '15 million litres annually',
    website: 'https://www.themacallan.com',
    tourAvailable: true,
    featured: true,
    investmentNotes: 'The ultimate blue-chip whisky investment. Limited availability and extraordinary demand ensure consistent appreciation.',
    marketDemand: 'Very High'
  },
  {
    id: 'springbank',
    name: 'Springbank',
    region: 'Campbeltown',
    location: 'Campbeltown, Argyll',
    established: 1828,
    description: 'Scotland\'s most traditional distillery, producing highly allocated whiskies with extreme scarcity.',
    longDescription: `Springbank is unique - the only Scottish distillery performing 100% of production on-site, from malting to bottling. With just 750,000 litres annual capacity and three distinct styles (Springbank, Longrow, Hazelburn), demand far exceeds supply. Bottles are allocated via ballot system, creating instant secondary market premiums.`,
    image: '/whisky/distilleries/springbank-entrance.webp',
    gallery: ['/whisky/distilleries/springbank-entrance.webp', '/whisky/distilleries/springbank-entrance-thumb.webp'],
    features: [
      '100% Production On-Site',
      'Three Distinct Styles',
      'Extreme Scarcity',
      'Family Owned'
    ],
    investmentGrade: 'Ultra Premium',
    investmentHighlights: [
      '30-40% immediate secondary market premium',
      'Ballot allocation system',
      'Local Barley releases command huge premiums',
      'Most traditional production methods'
    ],
    minimumInvestment: '£20,000',
    typicalCaskPrice: '£20,000-50,000',
    expectedReturns: '20-30% annually',
    annualAppreciation: '25-30%',
    maturationPeriod: '10-25 years',
    riskLevel: 'Medium',
    caskTypes: ['Ex-Bourbon', 'Sherry', 'Port', 'Wine'],
    notableWhiskies: ['Local Barley', '21 Year Old', 'Longrow Red', 'Hazelburn'],
    flavorProfile: ['Complex', 'Maritime', 'Fruity', 'Slightly Peated', 'Oily', 'Full-bodied'],
    awards: [
      'Whisky of the Year - Multiple Publications',
      'Icons of Whisky - Distillery of the Year',
      'Best Campbeltown Single Malt'
    ],
    distillerySize: 'Boutique',
    productionCapacity: '750,000 litres annually',
    tourAvailable: true,
    featured: true,
    investmentNotes: 'The holy grail for collectors. Extreme scarcity and traditional methods create unmatched investment potential.',
    marketDemand: 'Very High'
  },
  {
    id: 'royal-lochnagar',
    name: 'Royal Lochnagar',
    region: 'Highland',
    location: 'Crathie, Aberdeenshire',
    established: 1845,
    description: 'Holder of a Royal Warrant, producing limited quantities of exceptional Highland single malt.',
    longDescription: `Royal Lochnagar holds a Royal Warrant, situated near Balmoral Castle. One of Scotland\'s smallest distilleries with just 450,000 litres capacity. The distillery\'s royal connections and limited production create exceptional investment opportunities, particularly for aged expressions.`,
    image: '/whisky/distilleries/highland-park-building.webp',
    gallery: ['/whisky/distilleries/highland-park-building.webp', '/whisky/distilleries/highland-park-building-thumb.webp'],
    features: [
      'Royal Warrant Holder',
      'Smallest Diageo Distillery',
      'Near Balmoral Castle',
      'Limited Production'
    ],
    investmentGrade: 'Ultra Premium',
    investmentHighlights: [
      'Royal connections enhance prestige',
      'Extremely limited annual releases',
      'Selected Reserve commands premium',
      'Part of Diageo\'s prestige portfolio'
    ],
    minimumInvestment: '£22,000',
    typicalCaskPrice: '£22,000-45,000',
    expectedReturns: '15-20% annually',
    annualAppreciation: '18-22%',
    maturationPeriod: '12-30 years',
    riskLevel: 'Medium',
    caskTypes: ['Ex-Bourbon', 'Sherry', 'Selected Reserve Casks'],
    notableWhiskies: ['Selected Reserve', '30 Year Old', 'Distillers Edition'],
    flavorProfile: ['Light', 'Fruity', 'Honey', 'Delicate', 'Royal Character'],
    awards: [
      'Queen\'s Award for Enterprise',
      'Highland Single Malt of the Year',
      'Royal Warrant Since 1848'
    ],
    distillerySize: 'Boutique',
    productionCapacity: '450,000 litres annually',
    tourAvailable: true,
    featured: false,
    investmentNotes: 'Royal provenance and extreme scarcity create unique investment proposition for discerning collectors.',
    marketDemand: 'High'
  },

  // SUPER PREMIUM (£12-40k)
  {
    id: 'ardbeg',
    name: 'Ardbeg',
    region: 'Islay',
    location: 'Port Ellen, Islay',
    established: 1815,
    description: 'The ultimate Islay malt, producing the peatiest whiskies with cult following worldwide.',
    longDescription: `Ardbeg has been called "as close to perfection as makes no difference" by whisky connoisseurs. Despite nearly closing in the 1980s, Ardbeg now commands extraordinary prices. Limited Committee Releases sell out instantly, often appreciating 100%+ immediately. Part of LVMH portfolio ensures luxury positioning.`,
    image: '/whisky/distilleries/ardbeg-distillery.webp',
    gallery: ['/whisky/distilleries/ardbeg-distillery.webp', '/whisky/distilleries/ardbeg-distillery-thumb.webp'],
    features: [
      'Peatiest Regular Production',
      'Committee Exclusive Releases',
      'Part of LVMH',
      'Cult Following'
    ],
    investmentGrade: 'Super Premium',
    investmentHighlights: [
      'Committee releases appreciate 50-100% immediately',
      'Limited annual production',
      'Strong Asian market demand',
      'Space-aged whisky experiments'
    ],
    minimumInvestment: '£15,000',
    typicalCaskPrice: '£15,000-35,000',
    expectedReturns: '15-20% annually',
    annualAppreciation: '15-20%',
    maturationPeriod: '8-25 years',
    riskLevel: 'Medium',
    caskTypes: ['Ex-Bourbon', 'Ex-Sherry', 'Wine Casks', 'Experimental'],
    notableWhiskies: ['Supernova', 'Alligator', 'Twenty Something', 'Perpetuum'],
    flavorProfile: ['Intensely Peaty', 'Smoky', 'Tar', 'Citrus', 'Vanilla', 'Complex'],
    awards: [
      'World Whisky of the Year - Jim Murray',
      'Islay Whisky of the Year',
      'Committee Release of the Year'
    ],
    distillerySize: 'Medium',
    productionCapacity: '1.4 million litres annually',
    website: 'https://www.ardbeg.com',
    tourAvailable: true,
    featured: true,
    investmentNotes: 'Cult status and limited releases create exceptional investment opportunities for peat lovers.',
    marketDemand: 'Very High'
  },
  {
    id: 'lagavulin',
    name: 'Lagavulin',
    region: 'Islay',
    location: 'Port Ellen, Islay',
    established: 1816,
    description: 'Iconic Islay distillery producing richly peated single malts with perfect balance.',
    longDescription: `Lagavulin represents the perfect balance of Islay character - intensely peated yet remarkably smooth. The 16 Year Old is considered one of the finest standard bottlings in Scotland. Limited special releases and Distillers Editions command significant premiums. Part of Diageo\'s Classic Malts selection.`,
    image: '/whisky/distilleries/lagavulin-facade.webp',
    gallery: ['/whisky/distilleries/lagavulin-facade.webp', '/whisky/distilleries/lagavulin-facade-thumb.webp'],
    features: [
      'Slowest Distillation in Scotland',
      'Classic Malts Selection',
      'Perfect Peat Balance',
      '200+ Years Heritage'
    ],
    investmentGrade: 'Super Premium',
    investmentHighlights: [
      'Limited annual releases appreciate 30-50%',
      'Strong collector demand globally',
      'Feis Ile releases highly sought',
      'Nick Offerman collaboration expanded market'
    ],
    minimumInvestment: '£12,000',
    typicalCaskPrice: '£12,000-30,000',
    expectedReturns: '12-18% annually',
    annualAppreciation: '12-18%',
    maturationPeriod: '12-30 years',
    riskLevel: 'Low-Medium',
    caskTypes: ['Ex-Bourbon', 'European Oak Sherry', 'Pedro Ximénez'],
    notableWhiskies: ['16 Year Old', '12 Year Old Special Release', 'Distillers Edition'],
    flavorProfile: ['Intensely Peated', 'Rich', 'Dried Fruit', 'Maritime', 'Smooth'],
    awards: [
      'Best Islay Single Malt - World Whiskies Awards',
      'Classic Malt of the Year',
      'Gold Medal - International Spirits Challenge'
    ],
    distillerySize: 'Medium',
    productionCapacity: '2.5 million litres annually',
    website: 'https://www.malts.com/lagavulin',
    tourAvailable: true,
    featured: true,
    investmentNotes: 'Classic Islay investment with strong track record and consistent appreciation.',
    marketDemand: 'Very High'
  },
  {
    id: 'the-dalmore',
    name: 'The Dalmore',
    region: 'Highland',
    location: 'Alness, Ross-shire',
    established: 1839,
    description: 'Legendary Highland distillery with exclusive sherry cask partnerships creating luxury whiskies.',
    longDescription: `The Dalmore\'s partnership with González Byass provides exclusive access to 30-year-old Matusalem sherry casks. Master Distiller Richard Paterson creates some of the world\'s most expensive whiskies. The Dalmore 62 sold for £125,000. Known for complex cask finishes and luxury positioning.`,
    image: '/whisky/distilleries/dalmore-exterior.webp',
    gallery: [
      '/whisky/distilleries/dalmore-distillery-building.webp'
    ],
    features: [
      'Exclusive Sherry Casks',
      'González Byass Partnership',
      'Luxury Positioning',
      'Complex Maturation'
    ],
    investmentGrade: 'Super Premium',
    investmentHighlights: [
      'Constellation Collection appreciates 20-30% annually',
      'Exclusive sherry cask access',
      'Strong Asian luxury market',
      'Limited vintage releases'
    ],
    minimumInvestment: '£18,000',
    typicalCaskPrice: '£18,000-40,000',
    expectedReturns: '15-20% annually',
    annualAppreciation: '15-20%',
    maturationPeriod: '12-30 years',
    riskLevel: 'Medium',
    caskTypes: ['Matusalem Oloroso', 'Apostoles', 'Amoroso', 'Port Pipes'],
    notableWhiskies: ['King Alexander III', 'Constellation Collection', '50 Year Old'],
    flavorProfile: ['Rich', 'Orange', 'Chocolate', 'Cinnamon', 'Sherry', 'Complex'],
    awards: [
      'Best Highland Single Malt - World Whiskies Awards',
      'Icons of Whisky Scotland',
      'Luxury Whisky Brand of the Year'
    ],
    distillerySize: 'Large',
    productionCapacity: '4.2 million litres annually',
    website: 'https://www.thedalmore.com',
    tourAvailable: true,
    featured: true,
    investmentNotes: 'Luxury positioning and exclusive cask program create strong investment fundamentals.',
    marketDemand: 'High'
  },
  {
    id: 'the-balvenie',
    name: 'The Balvenie',
    region: 'Speyside',
    location: 'Dufftown, Banffshire',
    established: 1892,
    description: 'Traditional Speyside distillery maintaining five rare crafts, creating handcrafted excellence.',
    longDescription: `The Balvenie is unique in maintaining five rare crafts on-site: growing barley, malting, coppersmiths, coopers, and coppersmith. This dedication to traditional craftsmanship, combined with David Stewart MBE\'s 60+ years as Malt Master, creates exceptional whiskies. Limited DCS Compendium releases are highly sought after.`,
    image: '/whisky/distilleries/balvenie-grounds.webp',
    gallery: ['/whisky/distilleries/balvenie-grounds.webp', '/whisky/distilleries/balvenie-grounds-thumb.webp'],
    features: [
      'Five Rare Crafts',
      'Own Floor Maltings',
      'On-site Cooperage',
      'Family Owned (William Grant)'
    ],
    investmentGrade: 'Super Premium',
    investmentHighlights: [
      'DCS releases appreciate 40-60%',
      'Traditional craftsmanship premium',
      'Limited single cask releases',
      'Strong collector following'
    ],
    minimumInvestment: '£14,000',
    typicalCaskPrice: '£14,000-32,000',
    expectedReturns: '12-16% annually',
    annualAppreciation: '12-16%',
    maturationPeriod: '12-30 years',
    riskLevel: 'Low-Medium',
    caskTypes: ['Ex-Bourbon', 'Sherry', 'Port Pipes', 'Caribbean Rum'],
    notableWhiskies: ['Tun 1509', 'DCS Compendium', '50 Year Old', 'PortWood'],
    flavorProfile: ['Honey', 'Vanilla', 'Rich', 'Spicy', 'Dried Fruits', 'Smooth'],
    awards: [
      'Speyside Single Malt of the Year',
      'Malt Advocate Lifetime Achievement',
      'Best Craft Presentation'
    ],
    distillerySize: 'Large',
    productionCapacity: '7 million litres annually',
    website: 'https://www.thebalvenie.com',
    tourAvailable: true,
    featured: false,
    investmentNotes: 'Traditional craftsmanship and limited releases create steady appreciation with lower volatility.',
    marketDemand: 'High'
  },

  // PREMIUM (£8-20k)
  {
    id: 'highland-park',
    name: 'Highland Park',
    region: 'Island',
    location: 'Kirkwall, Orkney',
    established: 1798,
    description: 'The most northerly distillery in Scotland, crafting perfectly balanced single malts.',
    longDescription: `Highland Park combines all five keystones of whisky production: aromatic peat, hand-turned floor maltings, sherry oak casks, cool maturation, and harmonization. Their Viking heritage and mythology-themed releases have created strong collector interest. The perfect balance of smoke, sweetness, and spice.`,
    image: '/whisky/distilleries/highland-park-building.webp',
    gallery: ['/whisky/distilleries/highland-park-building.webp', '/whisky/distilleries/highland-park-building-thumb.webp'],
    features: [
      'Traditional Floor Maltings',
      'Orcadian Peat',
      'Viking Heritage',
      'Sherry Oak Focus'
    ],
    investmentGrade: 'Premium',
    investmentHighlights: [
      'Viking Legend series strong appreciation',
      'Limited Valhalla Collection sold out',
      'Unique Orcadian character',
      'Growing collector base'
    ],
    minimumInvestment: '£10,000',
    typicalCaskPrice: '£10,000-20,000',
    expectedReturns: '10-14% annually',
    annualAppreciation: '10-14%',
    maturationPeriod: '12-30 years',
    riskLevel: 'Low-Medium',
    caskTypes: ['First-fill Sherry', 'Refill Sherry', 'Ex-Bourbon'],
    notableWhiskies: ['18 Viking Pride', '30 Year Old', 'Valhalla Collection'],
    flavorProfile: ['Heather Honey', 'Aromatic Smoke', 'Citrus', 'Spice', 'Balanced'],
    awards: [
      'Best Island Single Malt - World Whiskies Awards',
      'Spirit of the Year - F. Paul Pacult',
      'Ultimate Spirits Challenge 95+ Points'
    ],
    distillerySize: 'Medium',
    productionCapacity: '2.5 million litres annually',
    website: 'https://www.highlandparkwhisky.com',
    tourAvailable: true,
    featured: false,
    investmentNotes: 'Unique island character and Viking marketing create strong investment narrative.',
    marketDemand: 'High'
  },
  {
    id: 'bowmore',
    name: 'Bowmore',
    region: 'Islay',
    location: 'Bowmore, Islay',
    established: 1779,
    description: 'One of Scotland\'s oldest distilleries, perfectly balancing peat smoke with tropical fruit.',
    longDescription: `Bowmore is one of the few distilleries still operating traditional floor maltings. The legendary No.1 Vaults mature casks below sea level, creating unique maritime character. Black Bowmore is among the most sought-after whiskies globally, with bottles reaching £50,000+.`,
    image: '/whisky/distilleries/springbank-entrance.webp',
    gallery: ['/whisky/distilleries/springbank-entrance.webp', '/whisky/distilleries/springbank-entrance-thumb.webp'],
    features: [
      'No.1 Vaults Below Sea Level',
      'Own Floor Maltings',
      'Perfect Balance',
      'Since 1779'
    ],
    investmentGrade: 'Premium',
    investmentHighlights: [
      'Black Bowmore legendary status',
      'Vintage releases strong appreciation',
      'No.1 Vaults unique maturation',
      'Growing Asian demand'
    ],
    minimumInvestment: '£9,000',
    typicalCaskPrice: '£9,000-18,000',
    expectedReturns: '10-12% annually',
    annualAppreciation: '10-12%',
    maturationPeriod: '12-30 years',
    riskLevel: 'Low-Medium',
    caskTypes: ['Ex-Bourbon', 'Sherry', 'Port', 'Wine Casks'],
    notableWhiskies: ['Black Bowmore', '25 Year Old', 'Vintage Series'],
    flavorProfile: ['Gentle Smoke', 'Tropical Fruit', 'Sea Salt', 'Honey', 'Complex'],
    awards: [
      'Islay Single Malt of the Year',
      'IWSC Gold Outstanding',
      'Trophy Winner - ISC'
    ],
    distillerySize: 'Medium',
    productionCapacity: '1.5 million litres annually',
    website: 'https://www.bowmore.com',
    tourAvailable: true,
    featured: false,
    investmentNotes: 'Historic prestige and Black Bowmore legacy create solid long-term investment.',
    marketDemand: 'High'
  },
  {
    id: 'glenfiddich',
    name: 'Glenfiddich',
    region: 'Speyside',
    location: 'Dufftown, Banffshire',
    established: 1887,
    description: 'The world\'s most awarded single malt Scotch whisky, family-owned since 1887.',
    longDescription: `Glenfiddich pioneered single malt whisky globally and remains family-owned by William Grant & Sons. Their innovative approach includes the Solera system for the 15-year-old and experimental series pushing boundaries. The world\'s best-selling single malt with strong brand recognition.`,
    image: '/whisky/distilleries/balvenie-grounds.webp',
    gallery: ['/whisky/distilleries/balvenie-grounds.webp', '/whisky/distilleries/balvenie-grounds-thumb.webp'],
    features: [
      'Family Owned Since 1887',
      'World\'s Best-Selling Single Malt',
      'On-site Cooperage',
      'Innovative Experiments'
    ],
    investmentGrade: 'Premium',
    investmentHighlights: [
      'Janet Sheed Roberts Collection record prices',
      'Limited vintage releases',
      'Global brand recognition',
      'Experimental series innovation'
    ],
    minimumInvestment: '£8,000',
    typicalCaskPrice: '£8,000-15,000',
    expectedReturns: '8-12% annually',
    annualAppreciation: '8-12%',
    maturationPeriod: '12-30 years',
    riskLevel: 'Low',
    caskTypes: ['American Oak', 'European Oak', 'Rum Casks', 'IPA Casks'],
    notableWhiskies: ['50 Year Old', 'Grand Series', 'Experimental Series'],
    flavorProfile: ['Pear', 'Apple', 'Oak', 'Subtle', 'Refined', 'Smooth'],
    awards: [
      'World\'s Most Awarded Single Malt',
      'Distillery of the Year - IWSC',
      'Best Speyside Single Malt'
    ],
    distillerySize: 'Large',
    productionCapacity: '14 million litres annually',
    website: 'https://www.glenfiddich.com',
    tourAvailable: true,
    featured: false,
    investmentNotes: 'Global brand strength provides stability with steady appreciation potential.',
    marketDemand: 'High'
  },
  {
    id: 'glenmorangie',
    name: 'Glenmorangie',
    region: 'Highland',
    location: 'Tain, Ross-shire',
    established: 1843,
    description: 'Pioneers of wood finishing, creating elegant and complex Highland single malts.',
    longDescription: `Glenmorangie has the tallest stills in Scotland at 5.14 meters, creating exceptionally light and delicate spirit. Dr. Bill Lumsden\'s innovations in wood finishing have revolutionized the industry. Part of LVMH, ensuring luxury market positioning and distribution.`,
    image: '/whisky/casks/dalmore-oak-barrels.webp',
    gallery: ['/whisky/casks/dalmore-oak-barrels.webp', '/whisky/distilleries/glenmorangie-view.webp'],
    features: [
      'Tallest Stills in Scotland',
      'Pioneer of Wood Finishing',
      'Part of LVMH',
      'Tarlogie Springs Water'
    ],
    investmentGrade: 'Premium',
    investmentHighlights: [
      'Pride Collection limited releases',
      'Innovation drives collector interest',
      'LVMH luxury positioning',
      'Experimental finishes command premiums'
    ],
    minimumInvestment: '£8,500',
    typicalCaskPrice: '£8,500-16,000',
    expectedReturns: '9-13% annually',
    annualAppreciation: '9-13%',
    maturationPeriod: '10-25 years',
    riskLevel: 'Low',
    caskTypes: ['Ex-Bourbon', 'Sauternes', 'Port', 'Sherry', 'Burgundy'],
    notableWhiskies: ['Pride 1974', 'Signet', '25 Year Old', 'Private Edition'],
    flavorProfile: ['Citrus', 'Peach', 'Vanilla', 'Floral', 'Elegant', 'Complex'],
    awards: [
      'Highland Single Malt of the Year',
      'Innovation Award - Whisky Magazine',
      'Distillery of the Year - IWC'
    ],
    distillerySize: 'Large',
    productionCapacity: '6 million litres annually',
    website: 'https://www.glenmorangie.com',
    tourAvailable: true,
    featured: false,
    investmentNotes: 'Innovation leader with LVMH backing provides strong growth potential.',
    marketDemand: 'High'
  },

  // STANDARD (Under £8k) - Adding a few for completeness
  {
    id: 'aberlour',
    name: 'Aberlour',
    region: 'Speyside',
    location: 'Aberlour, Banffshire',
    established: 1879,
    description: 'Traditional Speyside distillery known for exceptional sherry cask maturation.',
    longDescription: `Aberlour has a devoted following, particularly in France where it\'s the #1 single malt. Known for rich, sherried whiskies with the A\'bunadh cask strength series highly sought after. Excellent entry point for cask investment with strong appreciation potential.`,
    image: '/whisky/distilleries/balvenie-grounds.webp',
    gallery: ['/whisky/distilleries/balvenie-grounds.webp', '/whisky/distilleries/balvenie-grounds-thumb.webp'],
    features: [
      '#1 Single Malt in France',
      'Sherry Cask Excellence',
      'Cask Strength Releases',
      'Traditional Methods'
    ],
    investmentGrade: 'Standard',
    investmentHighlights: [
      'A\'bunadh series appreciates well',
      'Strong European following',
      'Entry-level investment option',
      'Consistent quality'
    ],
    minimumInvestment: '£6,000',
    typicalCaskPrice: '£6,000-12,000',
    expectedReturns: '7-10% annually',
    annualAppreciation: '7-10%',
    maturationPeriod: '10-18 years',
    riskLevel: 'Low',
    caskTypes: ['Ex-Bourbon', 'Sherry', 'Double Cask'],
    notableWhiskies: ['A\'bunadh', '18 Year Old', 'Casg Annamh'],
    flavorProfile: ['Rich', 'Sherried', 'Christmas Spices', 'Dried Fruits', 'Chocolate'],
    awards: [
      'Best Speyside Single Malt',
      'Gold Medal - IWSC',
      'Double Gold - SFWSC'
    ],
    distillerySize: 'Medium',
    productionCapacity: '3.8 million litres annually',
    website: 'https://www.aberlour.com',
    tourAvailable: true,
    featured: false,
    investmentNotes: 'Excellent entry point with strong fundamentals and consistent appreciation.',
    marketDemand: 'Medium'
  }
];

// Latest Distillery News
export const distilleryNews: DistilleryNews[] = [
  {
    id: 'news-1',
    distilleryId: 'the-macallan',
    title: 'Macallan 1926 Shatters Records at £2.1 Million',
    excerpt: 'A bottle of The Macallan 1926 Fine and Rare has set a new world record, reinforcing the distillery\'s position as the ultimate whisky investment.',
    content: `The whisky investment world witnessed history as The Macallan Fine and Rare 1926 achieved a staggering £2.1 million at Sotheby's London, surpassing its own previous record. This extraordinary sale represents a 5,200% appreciation from estimated original values, highlighting the exceptional investment potential of rare Macallan expressions. The sale reinforces Macallan's position as the blue-chip investment of the whisky world.`,
    date: '2025-01-20',
    category: 'auction',
    image: '/whisky/distilleries/dalmore-exterior.webp',
    author: 'Investment Analysis Team'
  },
  {
    id: 'news-2',
    distilleryId: 'springbank',
    title: 'Springbank Announces 2025 Ballot - 400,000 Applications Expected',
    excerpt: 'Springbank\'s annual ballot system sees unprecedented demand with bottles trading at 300% premiums on secondary market.',
    content: `Springbank has announced its 2025 ballot dates, with industry experts predicting over 400,000 applications for just 20,000 bottles. Recent Local Barley releases have traded at 300-400% premiums immediately after allocation. The distillery's commitment to traditional production methods and extreme scarcity continues to drive exceptional investment returns for successful ballot winners.`,
    date: '2025-01-18',
    category: 'release',
    author: 'Market Intelligence'
  },
  {
    id: 'news-3',
    distilleryId: 'ardbeg',
    title: 'Ardbeg Committee Release Sells Out in 3 Minutes',
    excerpt: 'Latest Ardbeg Committee exclusive sells out globally in record time, with secondary prices doubling within hours.',
    content: `Ardbeg's latest Committee Release, "Hypernova," sold out globally in just 3 minutes, setting a new record for the distillery. Secondary market prices reached £450 within hours, double the £225 retail price. This continues Ardbeg's trend of instant sell-outs and immediate appreciation, making Committee membership increasingly valuable for investors.`,
    date: '2025-01-15',
    category: 'release',
    author: 'Whisky Investment Team'
  },
  {
    id: 'news-4',
    distilleryId: 'the-dalmore',
    title: 'Dalmore Launches Ultra-Luxury 50-Year-Old at £80,000',
    excerpt: 'The Dalmore unveils new 50-year-old expression with only 50 bottles worldwide, expected to appreciate significantly.',
    content: `The Dalmore has released an exceptional 50-year-old single malt priced at £80,000, with only 50 bottles available globally. Matured in exclusive González Byass sherry casks, this release is expected to appreciate by 30-40% within the first year based on previous ultra-aged Dalmore performance. The presentation includes hand-blown crystal decanters and bespoke wooden cases.`,
    date: '2025-01-12',
    category: 'release',
    author: 'Luxury Spirits Division'
  },
  {
    id: 'news-5',
    distilleryId: 'lagavulin',
    title: 'Lagavulin Cask Strength Wins Global Whisky of the Year',
    excerpt: 'Lagavulin 12 Year Old Cask Strength named World\'s Best Single Malt, driving 25% price increase.',
    content: `Lagavulin 12 Year Old Cask Strength has been awarded "World's Best Single Malt" at the International Whisky Competition 2025. Following the announcement, prices increased 25% across global markets, with collectors scrambling to secure bottles. This recognition reinforces Lagavulin's position as a premier Islay investment opportunity.`,
    date: '2025-01-10',
    category: 'award',
    author: 'Awards Committee'
  },
  {
    id: 'news-6',
    distilleryId: 'highland-park',
    title: 'Highland Park Viking Legend Series Completes with 500% Appreciation',
    excerpt: 'The complete Viking Legend series now trades at 5x original retail, validating themed collection strategy.',
    content: `Highland Park's Viking Legend series has completed with the final release, with complete sets now trading at £15,000 - a 500% increase from the £3,000 combined retail price. This exceptional appreciation validates Highland Park's mythology-themed approach and creates strong precedent for future collectible series investments.`,
    date: '2025-01-08',
    category: 'market',
    author: 'Collection Analysis Team'
  },
  {
    id: 'news-7',
    distilleryId: 'the-balvenie',
    title: 'Balvenie DCS Chapter 3 Launches at Record Prices',
    excerpt: 'David C. Stewart\'s latest collection launches with unprecedented demand and immediate secondary premiums.',
    content: `The Balvenie has launched DCS Compendium Chapter 3, celebrating Malt Master David C. Stewart's 60-year career. The five-bottle collection, priced at £38,000, saw immediate secondary market premiums of 40%. Previous DCS chapters have appreciated 150-200%, making this release highly anticipated by investors and collectors.`,
    date: '2025-01-05',
    category: 'release',
    author: 'Premium Collections'
  },
  {
    id: 'news-8',
    distilleryId: 'bowmore',
    title: 'Rare Black Bowmore Reaches £65,000 at Auction',
    excerpt: 'Black Bowmore continues legendary status with record auction price, reinforcing its blue-chip investment status.',
    content: `A bottle of Black Bowmore 1964 achieved £65,000 at Bonhams Edinburgh, continuing the legendary series' extraordinary appreciation. Originally retailing for £80 in 1993, this represents an 81,000% return. Black Bowmore remains one of the most sought-after investments in whisky, with only 5,812 bottles ever produced across all releases.`,
    date: '2025-01-03',
    category: 'auction',
    author: 'Auction House Reports'
  }
];

// Investment Grade Definitions
export const investmentGrades = {
  'Ultra Premium': {
    priceRange: '£20,000+',
    expectedReturns: '15-30% annually',
    riskLevel: 'Medium-High',
    targetAudience: 'High-net-worth individuals, serious collectors',
    characteristics: [
      'Extreme scarcity and allocation systems',
      'Record-breaking auction results',
      'Blue-chip investment status',
      'Global collector demand'
    ]
  },
  'Super Premium': {
    priceRange: '£12,000-40,000',
    expectedReturns: '12-20% annually',
    riskLevel: 'Medium',
    targetAudience: 'Experienced investors, whisky enthusiasts',
    characteristics: [
      'Limited production volumes',
      'Strong brand heritage',
      'Consistent appreciation history',
      'Luxury market positioning'
    ]
  },
  'Premium': {
    priceRange: '£8,000-20,000',
    expectedReturns: '8-15% annually',
    riskLevel: 'Low-Medium',
    targetAudience: 'First-time cask investors, portfolio diversification',
    characteristics: [
      'Established distillery reputation',
      'Steady appreciation potential',
      'Good liquidity in secondary market',
      'Lower entry barriers'
    ]
  },
  'Standard': {
    priceRange: 'Under £8,000',
    expectedReturns: '5-10% annually',
    riskLevel: 'Low',
    targetAudience: 'Entry-level investors, long-term holders',
    characteristics: [
      'Accessible entry point',
      'Stable growth potential',
      'Volume production',
      'Established market presence'
    ]
  }
};

// Export helper functions
export const getDistilleryById = (id: string): Distillery | undefined => {
  return distilleries.find(d => d.id === id);
};

export const getDistilleriesByRegion = (region: string): Distillery[] => {
  if (region === 'All Regions') return distilleries;
  return distilleries.filter(d => d.region === region);
};

export const getDistilleriesByGrade = (grade: InvestmentGrade): Distillery[] => {
  return distilleries.filter(d => d.investmentGrade === grade);
};

export const getFeaturedDistilleries = (): Distillery[] => {
  return distilleries.filter(d => d.featured);
};

export const getDistilleryNews = (distilleryId?: string): DistilleryNews[] => {
  if (distilleryId) {
    return distilleryNews.filter(n => n.distilleryId === distilleryId);
  }
  return distilleryNews;
};

export const getLatestNews = (limit: number = 6): DistilleryNews[] => {
  return distilleryNews
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getRegionalData = (region: string): RegionalData | undefined => {
  return regionalData.find(r => r.region === region);
};

// Investment calculation helpers
export const calculateInvestmentReturn = (
  initialInvestment: number,
  years: number,
  annualAppreciation: string
): number => {
  const rate = parseFloat(annualAppreciation.split('-')[1]?.replace('%', '') || '10') / 100;
  return initialInvestment * Math.pow(1 + rate, years);
};

export const getInvestmentGradeInfo = (grade: InvestmentGrade) => {
  return investmentGrades[grade];
};
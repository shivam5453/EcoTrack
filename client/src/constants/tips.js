/**
 * EcoTrack Carbon Reduction Tips Constants (Frontend)
 * Stores 12+ highly-actionable carbon reduction tips.
 */
export const TIPS = [
  // 1. Transportation
  {
    id: 't-1',
    category: 'transport',
    title: 'Utilize Public Transit',
    description: 'Switch from driving a single-occupancy car to buses, trains, or subways for weekly commutes.',
    estimatedSavingKg: 800,
    effortLevel: 'medium',
    icon: 'bus',
    tags: ['Transit', 'Commute']
  },
  {
    id: 't-2',
    category: 'transport',
    title: 'Transition to an Electric Vehicle',
    description: 'When buying your next car, choose electric or hybrid models to eliminate tailpipe emissions entirely.',
    estimatedSavingKg: 2500,
    effortLevel: 'high',
    icon: 'car',
    tags: ['EV', 'Investment']
  },
  {
    id: 't-3',
    category: 'transport',
    title: 'Cycle or Walk for Short Trips',
    description: 'For distances under 3km, opt to walk or bike. It is carbon-free and improves physical cardiovascular health.',
    estimatedSavingKg: 300,
    effortLevel: 'low',
    icon: 'bike',
    tags: ['Health', 'Zero-Emission']
  },
  {
    id: 't-4',
    category: 'transport',
    title: 'Consolidate Aviation Travel',
    description: 'Avoid short-haul domestic flights by taking high-speed trains or using videoconferencing for business meetings.',
    estimatedSavingKg: 1200,
    effortLevel: 'medium',
    icon: 'plane',
    tags: ['Travel', 'Flights']
  },

  // 2. Home Energy
  {
    id: 'e-1',
    category: 'energy',
    title: 'Adopt High-Efficiency LEDs',
    description: 'Replace all remaining incandescent and CFL lightbulbs with premium, high-efficiency smart LED bulbs.',
    estimatedSavingKg: 150,
    effortLevel: 'low',
    icon: 'zap',
    tags: ['LED', 'Lighting']
  },
  {
    id: 'e-2',
    category: 'energy',
    title: 'Install Residential Solar Panels',
    description: 'Generate your own clean renewable electricity by placing solar panels on your house roof or balcony space.',
    estimatedSavingKg: 1800,
    effortLevel: 'high',
    icon: 'sun',
    tags: ['Solar', 'Renewables']
  },
  {
    id: 'e-3',
    category: 'energy',
    title: 'Optimise AC Thermostat Settings',
    description: 'Keep your cooling at 24°C or above. Every degree warmer saves up to 6% of active compressor power.',
    estimatedSavingKg: 250,
    effortLevel: 'low',
    icon: 'thermometer',
    tags: ['HVAC', 'Habits']
  },
  {
    id: 'e-4',
    category: 'energy',
    title: 'Eliminate Phantom Electric Loads',
    description: 'Unplug TVs, computer monitors, chargers, and kitchen appliances when going away, or use smart power strips.',
    estimatedSavingKg: 100,
    effortLevel: 'low',
    icon: 'plug',
    tags: ['Appliances', 'Phantom']
  },

  // 3. Dietary Choices
  {
    id: 'd-1',
    category: 'diet',
    title: 'Introduce Meat-Free Days',
    description: 'Commit to plant-based meals at least 2 or 3 days a week. Red meat production is majorly methane-intensive.',
    estimatedSavingKg: 400,
    effortLevel: 'low',
    icon: 'leaf',
    tags: ['Diet', 'Meat-Free']
  },
  {
    id: 'd-2',
    category: 'diet',
    title: 'Commit to a Vegan Lifestyle',
    description: 'Transition fully to plant-based diets, bypassing heavy emissions associated with livestock feeds.',
    estimatedSavingKg: 1200,
    effortLevel: 'high',
    icon: 'utensils',
    tags: ['Vegan', 'Lifestyle']
  },
  {
    id: 'd-3',
    category: 'diet',
    title: 'Establish a Kitchen Compost Bin',
    description: 'Separate kitchen food scraps. Composting organic waste prevents anaerobic decay in landfills, reducing methane emissions.',
    estimatedSavingKg: 150,
    effortLevel: 'medium',
    icon: 'recycle',
    tags: ['Compost', 'Waste']
  },
  {
    id: 'd-4',
    category: 'diet',
    title: 'Purchase Local and Seasonal Foods',
    description: 'Buy fresh food items produced by local growers to lower transport food-mile impacts.',
    estimatedSavingKg: 200,
    effortLevel: 'low',
    icon: 'shopping-bag',
    tags: ['Local', 'Produce']
  },

  // 4. Shopping & Lifestyle
  {
    id: 's-1',
    category: 'shopping',
    title: 'Support Pre-Owned Garments',
    description: 'Buy clothes from second-hand thrift stores instead of buying new fast-fashion, which depletes water and generates chemical waste.',
    estimatedSavingKg: 120,
    effortLevel: 'medium',
    icon: 'shirt',
    tags: ['Thrifting', 'Fashion']
  },
  {
    id: 's-2',
    category: 'shopping',
    title: 'Maintain and Repair Electronics',
    description: 'Keep your phones and laptops for at least 4-5 years. Repair hardware or upgrade software rather than buying new gadgets.',
    estimatedSavingKg: 240,
    effortLevel: 'medium',
    icon: 'cpu',
    tags: ['Gadgets', 'Circular']
  },
  {
    id: 's-3',
    category: 'shopping',
    title: 'Consolidate E-Commerce Orders',
    description: 'Group online orders to reduce delivery vehicle trips and minimize excess cardboard packaging.',
    estimatedSavingKg: 100,
    effortLevel: 'low',
    icon: 'package',
    tags: ['Delivery', 'Packaging']
  },
  {
    id: 's-4',
    category: 'shopping',
    title: 'Ditch Disposable Single-Use Plastics',
    description: 'Carry reusable water bottles, grocery bags, and coffee mugs. Reduce manufacturing carbon footprints.',
    estimatedSavingKg: 80,
    effortLevel: 'low',
    icon: 'trash',
    tags: ['Plastics', 'Eco-Friendly']
  }
];

export default TIPS;

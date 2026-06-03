export interface Developer {
  id: string
  name: string
  logo?: string
  overview: string
  signatureProjects: string[]
  constructionQuality: string
  reputation: string
  designPhilosophy: string
  deliveryTrackRecord: string
  strengths: string[]
  weaknesses: string[]
}

export interface Location {
  id: string
  name: string
  slug: string
  description: string
  heroImage: string
  overview: string
  lifestyle: string
  connectivity: string
  averagePricing: string
  futurePotential: string
  connectivityScore: number
  infrastructureScore: number
  lifestyleScore: number
  futureGrowthScore: number
  coordinates: [number, number]
  schools: string[]
  hospitals: string[]
  clubs: string[]
  hotels: string[]
  restaurants: string[]
  landmarks: string[]
  residentProfile: string
}

export interface Project {
  id: string
  name: string
  developerId: string
  developer: string
  locationId: string
  location: string
  heroImage: string
  images: string[]
  elevationImage: string
  possessionStatus: 'Ready To Move' | 'Under Construction' | 'New Launch' | 'OC Received'
  possessionDate?: string
  landParcel: string
  tenure: 'Freehold' | 'Leasehold'
  towers: number
  totalStoreys: number
  apartmentsPerFloor: number
  elevationExplained: string
  firstHabitableFloor: number
  ceilingHeight: string
  maintenance: string
  configurations: Configuration[]
  pricing: PricingEntry[]
  availableInventory: InventoryUnit[]
  viewTypes: ViewType[]
  amenities: string[]
  carParkType: string
  tags: ProjectTag[]
  floorPlans: string[]
  brochureUrl?: string
  masterLayoutUrl?: string
  googleMapEmbed?: string
  coordinates: [number, number]
  launchYear?: number
  currentPricePerSqFt: number
  historicalPricePerSqFt?: number
  appreciationPercentage?: number
  rentalYield?: string
  strengths: string[]
  weaknesses: string[]
  bestSuitedFor: ('End User' | 'Investor' | 'Family Office' | 'NRI')[]
  whyRecommend?: string
  investmentThesis?: string
  uniqueSellingPoints: string[]
  nearbyInfrastructure?: NearbyInfrastructure
}

export interface Configuration {
  type: string
  carpetArea: string
  price: string
  pricePerSqFt?: string
}

export interface PricingEntry {
  unit: string
  area: string
  price: string
  floor?: string
}

export interface InventoryUnit {
  id: string
  configuration: string
  floor: number
  carpetArea: string
  price: string
  status: 'Available' | 'Sold' | 'Reserved'
  view: string
}

export type ViewType =
  | 'Sea View'
  | 'Racecourse View'
  | 'City Skyline View'
  | 'Garden View'
  | 'Mixed View'
  | 'Arabian Sea Facing'
  | 'Creek View'

export type ProjectTag =
  | 'Sea View'
  | 'Racecourse View'
  | 'Arabian Sea Facing'
  | 'Corner Residence'
  | 'Bare Shell'
  | 'Designer Finished'
  | 'Private Lift'
  | 'Duplex'
  | 'Penthouse'
  | 'Branded Residence'
  | 'Sky Mansion'
  | 'Limited Inventory'
  | 'Ready To Move'
  | 'OC Received'
  | 'Ultra Luxury'

export interface NearbyInfrastructure {
  schools: string[]
  hospitals: string[]
  clubs: string[]
  hotels: string[]
  businessDistricts: string[]
  upcomingInfrastructure: string[]
}

export interface ClientProfile {
  id: string
  name: string
  budget: [number, number]
  preferredLocations: string[]
  configurations: string[]
  carpetAreaRange: [number, number]
  viewPreference: ViewType[]
  readyToMove: boolean
  possessionTimeline?: string
  developerPreference?: string[]
  minCeilingHeight?: string
  tenure?: 'Freehold' | 'Leasehold' | 'Any'
  purpose: 'End User' | 'Investor' | 'Family Office' | 'NRI'
  shortlistedProjects: string[]
  notes?: string
}

export interface MarketIntelligence {
  locationId: string
  developer: string
  launchYear: number
  possessionYear: number
  currentPricePerSqFt: number
  historicalData: { year: number; price: number }[]
  appreciationPercentage: number
  rentalYield: string
  occupancyStatus: string
}

export interface ConnectivityRoute {
  from: string
  to: string
  distance: string
  drivingTime: string
  peakHourTime: string
  alternateRoutes: string[]
}

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { projects as defaultProjects } from '@/data/projects'
import { Project } from '@/types'

// ─── Project overrides (admin edits) ────────────────────────────────────────
interface ProjectOverride {
  id: string
  name?: string
  developer?: string
  location?: string
  currentPricePerSqFt?: number
  possessionStatus?: string
  possessionDate?: string
  landParcel?: string
  tenure?: string
  towers?: number
  totalStoreys?: number
  apartmentsPerFloor?: number
  firstHabitableFloor?: number
  ceilingHeight?: string
  maintenance?: string
  carParkType?: string
  rentalYield?: string
  elevationExplained?: string
  masterLayoutDescription?: string
  whyRecommend?: string
  investmentThesis?: string
  configurations?: Project['configurations']
  amenities?: string[]
  tags?: Project['tags']
  viewTypes?: Project['viewTypes']
  coordinates?: [number, number]
  heroImage?: string
  images?: string[]
  floorPlans?: string[]
  brochureUrl?: string
}

// ─── Client collection ───────────────────────────────────────────────────────
export interface ClientCollection {
  id: string
  clientName: string
  slug: string
  projectIds: string[]
  notes: string
  objective: 'End User' | 'Investor' | 'Family Office' | 'NRI Buyer' | null
  createdAt: number
  updatedAt: number
}

// ─── Store ───────────────────────────────────────────────────────────────────
interface AppStore {
  // Project overrides
  projectOverrides: Record<string, ProjectOverride>
  updateProject: (id: string, overrides: Partial<ProjectOverride>) => void
  resetProject: (id: string) => void

  // Resolved projects (base + overrides)
  getProject: (id: string) => Project | undefined
  getAllProjects: () => Project[]

  // Client collections
  collections: ClientCollection[]
  createCollection: (clientName: string, objective?: ClientCollection['objective']) => ClientCollection
  updateCollection: (id: string, updates: Partial<ClientCollection>) => void
  deleteCollection: (id: string) => void
  addProjectToCollection: (collectionId: string, projectId: string) => void
  removeProjectFromCollection: (collectionId: string, projectId: string) => void
  reorderCollection: (collectionId: string, projectIds: string[]) => void
  getCollectionBySlug: (slug: string) => ClientCollection | undefined
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 40)
}

function mergeProject(base: Project, override: ProjectOverride): Project {
  return { ...base, ...Object.fromEntries(Object.entries(override).filter(([, v]) => v !== undefined)) } as Project
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      projectOverrides: {},
      collections: [],

      updateProject: (id, overrides) =>
        set(state => ({
          projectOverrides: {
            ...state.projectOverrides,
            [id]: { ...state.projectOverrides[id], id, ...overrides },
          },
        })),

      resetProject: (id) =>
        set(state => {
          const next = { ...state.projectOverrides }
          delete next[id]
          return { projectOverrides: next }
        }),

      getProject: (id) => {
        const base = defaultProjects.find(p => p.id === id)
        if (!base) return undefined
        const override = get().projectOverrides[id]
        return override ? mergeProject(base, override) : base
      },

      getAllProjects: () =>
        defaultProjects.map(p => {
          const override = get().projectOverrides[p.id]
          return override ? mergeProject(p, override) : p
        }),

      createCollection: (clientName, objective = null) => {
        const baseSlug = slugify(clientName) || 'client'
        const existing = get().collections.map(c => c.slug)
        let slug = baseSlug
        let n = 2
        while (existing.includes(slug)) { slug = `${baseSlug}-${n++}` }
        const collection: ClientCollection = {
          id: `col-${Date.now()}`,
          clientName,
          slug,
          projectIds: [],
          notes: '',
          objective,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set(state => ({ collections: [...state.collections, collection] }))
        return collection
      },

      updateCollection: (id, updates) =>
        set(state => ({
          collections: state.collections.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
          ),
        })),

      deleteCollection: (id) =>
        set(state => ({ collections: state.collections.filter(c => c.id !== id) })),

      addProjectToCollection: (collectionId, projectId) =>
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId && !c.projectIds.includes(projectId)
              ? { ...c, projectIds: [...c.projectIds, projectId], updatedAt: Date.now() }
              : c
          ),
        })),

      removeProjectFromCollection: (collectionId, projectId) =>
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId
              ? { ...c, projectIds: c.projectIds.filter(id => id !== projectId), updatedAt: Date.now() }
              : c
          ),
        })),

      reorderCollection: (collectionId, projectIds) =>
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId ? { ...c, projectIds, updatedAt: Date.now() } : c
          ),
        })),

      getCollectionBySlug: (slug) =>
        get().collections.find(c => c.slug === slug),
    }),
    {
      name: 'value-properties-store',
      partialize: state => ({
        projectOverrides: state.projectOverrides,
        collections: state.collections,
      }),
    }
  )
)

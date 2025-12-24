export const BRANCHES = [
  {
    name: "Nugegoda",
    slug: "nugegoda",
    location: "Nugegoda",
  },
  {
    name: "Matara",
    slug: "matara",
    location: "Matara",
  },
  {
    name: "Colombo",
    slug: "colombo",
    location: "Colombo",
  },
]

export const getBranchBySlug = (slug) => {
  if (!slug) return null
  const normalized = String(slug).trim().toLowerCase()
  return BRANCHES.find((branch) => branch.slug === normalized) || null
}

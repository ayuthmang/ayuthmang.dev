export const BREAKPOINTS = {
  phone: 600,
  tablet: 950,
  laptop: 1300,
} as const

export const QUERIES = {
  phoneAndSmaller: `(max-width: ${BREAKPOINTS.phone / 16}rem)`,
  tabletAndSmaller: `(max-width: ${BREAKPOINTS.tablet / 16}rem)`,
  laptopAndSmaller: `(max-width: ${BREAKPOINTS.laptop / 16}rem)`,
} as const

export const PROFILE_LINKS = {
  GITHUB: 'https://github.com/ayuthmang',
  MEDIUM: 'https://medium.com/@ayuthmang',
  DEV: 'https://dev.to/ayuthmang',
}

export * from './route.constants'

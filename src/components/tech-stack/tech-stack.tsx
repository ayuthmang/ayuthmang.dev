import React from 'react'
import {
  SiCss,
  SiCssHex,
  SiDocker,
  SiDockerHex,
  SiExpress,
  SiFlutter,
  SiFlutterHex,
  SiGooglecloud,
  SiGooglecloudHex,
  SiHtml5,
  SiHtml5Hex,
  SiKotlin,
  SiKotlinHex,
  SiKubernetes,
  SiKubernetesHex,
  SiMongodb,
  SiMongodbHex,
  SiNestjs,
  SiNestjsHex,
  SiNextdotjs,
  SiNodedotjs,
  SiNodedotjsHex,
  SiPostgresql,
  SiPostgresqlHex,
  SiPython,
  SiPythonHex,
  SiReact,
  SiReactHex,
  SiSpringboot,
  SiSpringbootHex,
  SiTypescript,
  SiTypescriptHex,
  SiVuedotjs,
  SiVuedotjsHex,
} from '@icons-pack/react-simple-icons'
import { Cloud } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/utils'

interface TechIconProps {
  className?: string
  style?: React.CSSProperties
  'aria-hidden'?: boolean
}

interface Tech {
  name: string
  Icon: React.ComponentType<TechIconProps>
  /** Brand color shown on hover; omit for black logos that need theme-aware currentColor instead. */
  color?: string
  iconClassName?: string
}

interface TechCategory {
  category: string
  techs: Tech[]
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    category: 'Frontend',
    techs: [
      { name: 'React', Icon: SiReact, color: SiReactHex },
      {
        name: 'Next.js',
        Icon: SiNextdotjs,
        iconClassName: 'text-black dark:text-white',
      },
      { name: 'Vue.js', Icon: SiVuedotjs, color: SiVuedotjsHex },
      { name: 'TypeScript', Icon: SiTypescript, color: SiTypescriptHex },
      { name: 'HTML5', Icon: SiHtml5, color: SiHtml5Hex },
      { name: 'CSS3', Icon: SiCss, color: SiCssHex },
    ],
  },
  {
    category: 'Backend',
    techs: [
      { name: 'Node.js', Icon: SiNodedotjs, color: SiNodedotjsHex },
      { name: 'Nest.js', Icon: SiNestjs, color: SiNestjsHex },
      {
        name: 'Express',
        Icon: SiExpress,
        iconClassName: 'text-black dark:text-white',
      },
      { name: 'Spring Boot', Icon: SiSpringboot, color: SiSpringbootHex },
      { name: 'Python', Icon: SiPython, color: SiPythonHex },
    ],
  },
  {
    category: 'Databases & Cloud',
    techs: [
      { name: 'PostgreSQL', Icon: SiPostgresql, color: SiPostgresqlHex },
      { name: 'MongoDB', Icon: SiMongodb, color: SiMongodbHex },
      // Simple Icons removed all Amazon marks, so AWS falls back to a filled lucide cloud.
      {
        name: 'AWS',
        Icon: Cloud,
        color: '#FF9900',
        iconClassName: 'fill-current',
      },
      { name: 'Google Cloud', Icon: SiGooglecloud, color: SiGooglecloudHex },
      { name: 'Docker', Icon: SiDocker, color: SiDockerHex },
      { name: 'Kubernetes', Icon: SiKubernetes, color: SiKubernetesHex },
    ],
  },
  {
    category: 'Mobile',
    techs: [
      { name: 'React Native', Icon: SiReact, color: SiReactHex },
      { name: 'Flutter', Icon: SiFlutter, color: SiFlutterHex },
      { name: 'Kotlin', Icon: SiKotlin, color: SiKotlinHex },
    ],
  },
]

function TechBadge({ tech }: { tech: Tech }) {
  const { name, Icon, color, iconClassName } = tech
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={name}
        className="group/tech flex size-12 items-center justify-center rounded-xl bg-gray-200 transition-all duration-300 ease-out outline-none hover:-translate-y-1 hover:bg-white hover:shadow-md focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:shadow-gray-950/50"
      >
        {/* `group/tech` is named so the tile ignores BentoCard's card-level `group` hover. */}
        <Icon
          aria-hidden
          style={color ? { color } : undefined}
          className={cn(
            'size-6 opacity-70 grayscale transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/tech:scale-125 group-hover/tech:-rotate-6 group-hover/tech:opacity-100 group-hover/tech:grayscale-0 group-focus-visible/tech:scale-125 group-focus-visible/tech:-rotate-6 group-focus-visible/tech:opacity-100 group-focus-visible/tech:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover/tech:scale-100 motion-reduce:group-hover/tech:rotate-0',
            iconClassName,
          )}
        />
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
}

export function TechStack() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {TECH_CATEGORIES.map(({ category, techs }) => (
        <div key={category}>
          <h4 className="mb-3 font-semibold">{category}</h4>
          <ul className="flex flex-wrap gap-2">
            {techs.map((tech) => (
              <li key={tech.name}>
                <TechBadge tech={tech} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default TechStack

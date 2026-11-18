import Link from 'next/link'
import Mascot from '@/components/mascot'

function FourOFour() {
  return (
    <div className="flex  min-h-96 w-full flex-col items-center justify-center">
      <Mascot
        pose="shell"
        size={160}
        label="Kala the frog hiding under a coconut shell"
      />
      <p className="mt-6 text-xl">Page does not exist</p>
      <div className="my-4"></div>
      <LinkText href="/">👉 Bring me home 👈</LinkText>
    </div>
  )
}

function LinkText({ children, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className="text-xl no-underline opacity-75 transition-opacity hover:underline hover:opacity-100"
      {...props}
    >
      {children}
    </Link>
  )
}
export default FourOFour

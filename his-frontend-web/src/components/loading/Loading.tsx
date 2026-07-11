import { LoadingState } from '@/components/loading/LoadingState'

interface LoadingProps {
  label?: string
}

export function Loading({ label }: LoadingProps) {
  return <LoadingState label={label} />
}

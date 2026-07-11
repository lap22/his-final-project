import { Card, CardContent, CardHeader, type CardProps } from '@mui/material'
import { type ReactNode } from 'react'

interface SectionCardProps extends CardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
}

export function SectionCard({ title, subtitle, action, children, ...props }: SectionCardProps) {
  return (
    <Card variant="outlined" {...props}>
      {(title || subtitle || action) && (
        <CardHeader title={title} subheader={subtitle} action={action} />
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}

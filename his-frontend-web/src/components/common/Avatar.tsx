import { Avatar as MuiAvatar, type AvatarProps as MuiAvatarProps } from '@mui/material'

interface AvatarProps extends MuiAvatarProps {
  name?: string
}

export function Avatar({ name, children, ...props }: AvatarProps) {
  const fallbackInitial = name?.trim().charAt(0).toUpperCase()

  return <MuiAvatar {...props}>{children ?? fallbackInitial}</MuiAvatar>
}

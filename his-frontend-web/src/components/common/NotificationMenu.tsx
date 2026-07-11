import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import {
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'

export function NotificationMenu() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorElement)

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          aria-label="Notifications"
          onClick={(event) => setAnchorElement(event.currentTarget)}
        >
          <Badge color="error" variant="dot">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElement}
        open={isOpen}
        onClose={() => setAnchorElement(null)}
        slotProps={{ paper: { sx: { width: 320, maxWidth: 'calc(100vw - 32px)' } } }}
      >
        <List dense disablePadding>
          <ListItem>
            <ListItemText
              primary="Notifications"
              secondary="TODO: Chua co API notifications."
              slotProps={{ primary: { sx: { fontWeight: 700 } } }}
            />
          </ListItem>
        </List>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', px: 2, pb: 1 }}
        >
          Notification UI is ready.
        </Typography>
      </Menu>
    </>
  )
}

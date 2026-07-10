import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { type ReactNode, useState } from 'react'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const SIDEBAR_WIDTH = 264
const COLLAPSED_SIDEBAR_WIDTH = 72
const TOPBAR_HEIGHT = 64

export interface DashboardNavItem {
  label: string
  path: string
  icon: ReactNode
}

interface DashboardLayoutProps {
  title: string
  navItems: readonly DashboardNavItem[]
}

export function DashboardLayout({ title, navItems }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const sidebarWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH
  const displayName = user?.fullName ?? 'User'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            overflowX: 'hidden',
            borderRightColor: 'divider',
            transition: (muiTheme) =>
              muiTheme.transitions.create('width', {
                duration: muiTheme.transitions.duration.shorter,
              }),
          },
        }}
      >
        <Toolbar sx={{ minHeight: TOPBAR_HEIGHT, px: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              minWidth: 0,
              width: '100%',
            }}
          >
            <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
              H
            </Avatar>
            {!isCollapsed && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                  HIS Portal
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {title}
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>

        <Divider />

        <List component="nav" sx={{ px: 1.5, py: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Tooltip key={item.path} title={isCollapsed ? item.label : ''} placement="right">
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    minHeight: 44,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 2,
                    mb: 0.5,
                    px: isCollapsed ? 1.5 : 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 0 : 40,
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            )
          })}
        </List>
      </Drawer>

      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: sidebarWidth,
          zIndex: (muiTheme) => muiTheme.zIndex.drawer - 1,
          height: TOPBAR_HEIGHT,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          transition: (muiTheme) =>
            muiTheme.transitions.create('left', {
              duration: muiTheme.transitions.duration.shorter,
            }),
        }}
      >
        <Toolbar sx={{ minHeight: TOPBAR_HEIGHT, justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Tooltip title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <IconButton
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setIsCollapsed((current) => !current)}
              >
                {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton aria-label="Notifications">
                <Badge color="error" variant="dot">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Avatar sx={{ width: 34, height: 34 }}>{displayName.charAt(0).toUpperCase()}</Avatar>
              <Typography variant="body2" noWrap sx={{ maxWidth: 160, fontWeight: 600 }}>
                {displayName}
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton aria-label="Logout">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Box>

      <Box
        component="main"
        sx={{
          ml: `${sidebarWidth}px`,
          pt: `${TOPBAR_HEIGHT}px`,
          minHeight: '100vh',
          transition: (muiTheme) =>
            muiTheme.transitions.create('margin-left', {
              duration: muiTheme.transitions.duration.shorter,
            }),
        }}
      >
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

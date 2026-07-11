import {
  Avatar,
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
import { type ReactNode, useState } from 'react'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { AppBreadcrumbs } from '@/components/common/AppBreadcrumbs'
import { NotificationMenu } from '@/components/common/NotificationMenu'
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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const sidebarWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH
  const isSidebarCollapsed = isCollapsed && !isMobileOpen
  const displayName = user?.fullName ?? 'User'

  const sidebarContent = (
    <>
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
          {!isSidebarCollapsed && (
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
            <Tooltip key={item.path} title={isSidebarCollapsed ? item.label : ''} placement="right">
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive}
                onClick={() => setIsMobileOpen(false)}
                sx={{
                  minHeight: 44,
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: 2,
                  mb: 0.5,
                  px: isSidebarCollapsed ? 1.5 : 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isSidebarCollapsed ? 0 : 40,
                    justifyContent: 'center',
                    color: isActive ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isSidebarCollapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>
    </>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
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
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: { xs: 0, md: sidebarWidth },
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
                onClick={() => {
                  if (window.matchMedia('(max-width: 899px)').matches) {
                    setIsMobileOpen(true)
                    return
                  }

                  setIsCollapsed((current) => !current)
                }}
              >
                {isCollapsed ? (
                  <MenuIcon />
                ) : (
                  <MenuOpenIcon sx={{ display: { xs: 'none', md: 'block' } }} />
                )}
                <MenuIcon sx={{ display: { xs: 'block', md: 'none' } }} />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationMenu />
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
          ml: { xs: 0, md: `${sidebarWidth}px` },
          pt: `${TOPBAR_HEIGHT}px`,
          minHeight: '100vh',
          transition: (muiTheme) =>
            muiTheme.transitions.create('margin-left', {
              duration: muiTheme.transitions.duration.shorter,
            }),
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <AppBreadcrumbs />
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

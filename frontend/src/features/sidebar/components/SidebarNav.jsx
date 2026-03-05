import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';

function SidebarNav({ menuItems, currentPath, expanded, isMobile, onNavigate }) {
  return (
    <List sx={{ flex: 1, px: 1, py: 1 }}>
      {menuItems.map((item) => (
        <Tooltip
          key={item.path}
          title={!expanded && !isMobile ? item.label : ''}
          placement="right"
        >
          <ListItemButton
            onClick={() => onNavigate(item.path)}
            selected={currentPath === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              justifyContent: expanded || isMobile ? 'flex-start' : 'center',
              px: expanded || isMobile ? 2 : 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '& .MuiListItemIcon-root': { color: 'white' },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: expanded || isMobile ? 36 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {(expanded || isMobile) && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      ))}
    </List>
  );
}

export default SidebarNav;

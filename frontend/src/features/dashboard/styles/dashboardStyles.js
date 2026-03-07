export const sectionHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  mb: 3,
};

export const sectionHeaderIconBoxSx = {
  width: 40,
  height: 40,
  borderRadius: 2,
  flexShrink: 0,
  bgcolor: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
};

export const sectionHeaderTextBoxSx = {
  minWidth: 0,
};

export const kpiGridSx = {
  mb: 3,
};

export const kpiCardBaseSx = {
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 4,
  },
  fontSize: {
    xs: '0.875rem',
    sm: '1rem',
    md: '1.125rem',
  }
};

export const kpiCardContentSx = {
  p: 2.5,
  padding: { xs: 2.5, md: 4 },
};

export const kpiCardInnerSx = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
};

export const kpiLabelSx = {
  mb: 0.5,
  fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
};

export const kpiIconBoxSx = (bgColor, color) => ({
  width: { xs: 48, md: 64 },
  height: { xs: 48, md: 64 },
  borderRadius: 3,
  bgcolor: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: color,
  // Ajuste opcional: hacer el icono de Lucide más grande vía strokeWidth o similar si fuera necesario
});

export const chartCardSx = {
  height: '100%',
};

export const chartHeaderSx = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  mb: 2,
};

export const chartHeaderTextBoxSx = {
  minWidth: 0,
};

export const chartContainerSx = {
  width: '100%',
  height: { xs: 200, sm: 280 },
};

export const tooltipContentStyle = {
  borderRadius: 12,
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  fontSize: 13,
};

export const activityCardSx = {
  height: '100%',
};

export const activityHeaderSx = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  mb: 2,
};

export const activityEmptyBoxSx = {
  py: 4,
  textAlign: 'center',
};

export const activityLogRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  py: 1.5,
};

export const activityLogIconBoxSx = (type) => ({
  width: 36,
  height: 36,
  borderRadius: 2,
  bgcolor: type === 'ALISTAMIENTO' ? '#e3f2fd' : '#fff3e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: type === 'ALISTAMIENTO' ? '#1976d2' : '#f57c00',
  flexShrink: 0,
});

export const activityLogTextBoxSx = {
  flex: 1,
  minWidth: 0,
};

export const activityHoursChipSx = {
  fontWeight: 700,
  fontSize: '0.7rem',
};

export const activityViewAllButtonSx = {
  mt: 2,
};

export const mobileFabSx = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  zIndex: 1000,
};

export const loadingContainerSx = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  py: 8,
};

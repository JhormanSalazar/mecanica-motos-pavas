export const pageContainerSx = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

export const headerContainerSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  mb: 2,
  flexShrink: 0,
};

export const headerIconBoxSx = {
  width: 40,
  height: 40,
  borderRadius: 2,
  flexShrink: 0,
  bgcolor: "primary.main",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};

export const headerTextBoxSx = {
  minWidth: 0,
};

export const alertSx = {
  mb: 2,
  flexShrink: 0,
};

export const formContainerSx = {
  overflowY: "auto",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  pb: 3,
};

export const serviceDataCardContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const checklistHeaderSx = (isExpanded) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  mb: isExpanded ? 2 : 0,
  "&:hover": { opacity: 0.7 },
  transition: "opacity 0.2s",
});

export const checklistItemRowSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 1,
  py: 1.5,
  justifyContent: "space-between",
};

export const itemNameSx = {
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: { xs: "normal", sm: "nowrap" },
  width: { xs: "100%", sm: "auto" },
};

export const itemControlsSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  justifyContent: "space-between",
  width: { xs: "100%", sm: "auto" },
};

export const toggleButtonSx = {
  px: 1.5,
  fontWeight: "bold",
  fontSize: "0.8rem",
};

export const observationIconButtonSx = (isExpanded) => ({
  border: 1,
  borderColor: isExpanded ? "primary.main" : "divider",
  borderRadius: 1,
  flexShrink: 0,
});

export const removeIconButtonSx = {
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
  flexShrink: 0,
};

export const observationBoxSx = {
  pb: 2,
};

export const customItemsInputRowSx = (hasItems) => ({
  display: "flex",
  gap: 1,
  mb: hasItems ? 2 : 0,
});

export const addButtonSx = {
  px: 3,
  minWidth: "auto",
};

export const actionsContainerSx = {
  display: "flex",
  gap: 2,
  flexWrap: { xs: "wrap", sm: "nowrap" },
  mt: 2,
};

export const saveButtonSx = {
  px: 4,
  flex: { xs: "1 1 100%", sm: "0 1 auto" },
};

export const terminateButtonSx = {
  px: 4,
  flex: { xs: "1 1 100%", sm: "0 1 auto" },
};

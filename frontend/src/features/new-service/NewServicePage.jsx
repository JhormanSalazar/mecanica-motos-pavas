import { Box, Alert, CircularProgress } from "@mui/material";
import useNewService from "./hooks/useNewService";
import NewServiceHeader from "./components/NewServiceHeader";
import ServiceDataCard from "./components/ServiceDataCard";
import ChecklistCard from "./components/ChecklistCard";
import CustomItemsCard from "./components/CustomItemsCard";
import ServiceActions from "./components/ServiceActions";
import { pageContainerSx, alertSx, formContainerSx } from "./styles/newServiceStyles";

export default function NewServicePage() {
  const {
    loading,
    isEditMode,
    error,
    success,
    pilots,
    pilotId,
    setPilotId,
    hours,
    setHours,
    type,
    setType,
    results,
    expandedObs,
    checklistExpanded,
    setChecklistExpanded,
    handleStatusChange,
    handleObsChange,
    toggleObservation,
    customItems,
    customItemName,
    setCustomItemName,
    expandedCustomObs,
    addCustomItem,
    removeCustomItem,
    handleCustomStatusChange,
    handleCustomObsChange,
    toggleCustomObservation,
    submitting,
    terminating,
    createdServiceId,
    allItemsCompleted,
    handleSubmit,
    handleTerminateService,
  } = useNewService();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={pageContainerSx}>
      <NewServiceHeader isEditMode={isEditMode} />

      {error && (
        <Alert severity="error" sx={alertSx}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={alertSx}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={formContainerSx}>
        <ServiceDataCard
          pilots={pilots}
          pilotId={pilotId}
          setPilotId={setPilotId}
          hours={hours}
          setHours={setHours}
          type={type}
          setType={setType}
        />

        {type === "ALISTAMIENTO" && (
          <ChecklistCard
            results={results}
            expandedObs={expandedObs}
            checklistExpanded={checklistExpanded}
            setChecklistExpanded={setChecklistExpanded}
            handleStatusChange={handleStatusChange}
            handleObsChange={handleObsChange}
            toggleObservation={toggleObservation}
          />
        )}

        <CustomItemsCard
          type={type}
          customItems={customItems}
          customItemName={customItemName}
          setCustomItemName={setCustomItemName}
          expandedCustomObs={expandedCustomObs}
          addCustomItem={addCustomItem}
          removeCustomItem={removeCustomItem}
          handleCustomStatusChange={handleCustomStatusChange}
          handleCustomObsChange={handleCustomObsChange}
          toggleCustomObservation={toggleCustomObservation}
        />

        <ServiceActions
          isEditMode={isEditMode}
          submitting={submitting}
          terminating={terminating}
          createdServiceId={createdServiceId}
          allItemsCompleted={allItemsCompleted}
          handleTerminateService={handleTerminateService}
        />
      </Box>
    </Box>
  );
}

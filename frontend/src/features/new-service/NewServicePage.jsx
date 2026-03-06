import { Box, CircularProgress } from "@mui/material";
import useNewService from "./hooks/useNewService";
import NewServiceHeader from "./components/NewServiceHeader";
import ServiceDataCard from "./components/ServiceDataCard";
import ChecklistCard from "./components/ChecklistCard";
import CustomItemsCard from "./components/CustomItemsCard";
import ServiceActions from "./components/ServiceActions";
import { pageContainerSx, formContainerSx } from "./styles/newServiceStyles";

export default function NewServicePage() {
  const {
    loading,
    isEditMode,
    worklogState,
    pilots,
    pilotId,
    setPilotId,
    hours,
    setHours,
    type,
    setType,
    previousHours,
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
    isInProcess,
    saving,
    lastSavedAt,
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
      <NewServiceHeader isEditMode={isEditMode} worklogState={worklogState} isInProcess={isInProcess} />

      <Box component="form" onSubmit={handleSubmit} sx={formContainerSx}>
        <ServiceDataCard
          pilots={pilots}
          pilotId={pilotId}
          setPilotId={setPilotId}
          hours={hours}
          setHours={setHours}
          type={type}
          setType={setType}
          previousHours={previousHours}
        />

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

        <ServiceActions
          isEditMode={isEditMode}
          submitting={submitting}
          terminating={terminating}
          createdServiceId={createdServiceId}
          isInProcess={isInProcess}
          saving={saving}
          lastSavedAt={lastSavedAt}
          allItemsCompleted={allItemsCompleted}
          disableSave={submitting || terminating || saving || (type === 'REPARACION' && customItems.length === 0)}
          handleTerminateService={handleTerminateService}
        />
      </Box>
    </Box>
  );
}

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchPilotsAndChecklistItems,
  createWorklog,
  updateWorklog,
  terminateWorklog,
} from "../api/newServiceApi";
import useNotifications from "../../../hooks/useNotifications";

export default function useNewService() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingLog = location.state?.editingLog;
  const isEditMode = !!editingLog;

  const [pilots, setPilots] = useState([]);
  const [, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [terminating, setTerminating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdServiceId, setCreatedServiceId] = useState(
    isEditMode ? editingLog.id : null
  );
  // Only set a state when editing an existing worklog. For new services
  // we keep it `null` so the UI (chip) doesn't reflect a non-real state.
  const [worklogState, setWorklogState] = useState(
    isEditMode ? (editingLog?.state || null) : null
  );

  

  const [pilotId, setPilotId] = useState("");
  const [hours, setHours] = useState("");
  const [type, setType] = useState("ALISTAMIENTO");
  const [results, setResults] = useState([]);
  const [expandedObs, setExpandedObs] = useState({});
  const [checklistExpanded, setChecklistExpanded] = useState(false);

  const [customItems, setCustomItems] = useState([]);
  const [customItemName, setCustomItemName] = useState("");
  const [expandedCustomObs, setExpandedCustomObs] = useState({});

  const { info, confirm } = useNotifications();
  const { success: notifySuccess, error: notifyError } = useNotifications();

  useEffect(() => {
    async function fetchData() {
      try {
        const { pilots: pilotsData, checklistItems: itemsData } =
          await fetchPilotsAndChecklistItems();
        setPilots(pilotsData);
        setChecklistItems(itemsData);

        if (isEditMode) {
          setPilotId(String(editingLog.pilotId));
          setHours(String(editingLog.hours));
          setType(editingLog.type);
          if (editingLog.state) setWorklogState(editingLog.state);

          const systemResults =
            editingLog.results?.filter((r) => !r.isCustom) || [];
          const customResults =
            editingLog.results?.filter((r) => r.isCustom) || [];

          const mappedResults = itemsData.map((item) => {
            const existingResult = systemResults.find(
              (r) => r.checklistItemId === item.id
            );
            return {
              itemId: item.id,
              name: item.name,
              status: existingResult?.status || "",
              obs: existingResult?.obs || "",
            };
          });
          setResults(mappedResults);

          setCustomItems(
            customResults.map((r) => ({
              id: r.id,
              name: r.name,
              status: r.status,
              obs: r.obs || "",
              isCustom: true,
            }))
          );
        } else {
          setResults(
            itemsData.map((item) => ({
              itemId: item.id,
              name: item.name,
              status: "",
              obs: "",
            }))
          );
        }
      } catch (err) {
        console.error(err);
        notifyError({ message: "Error cargando datos." });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleStatusChange(index, newStatus) {
    setResults((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });
    // schedule autosave when editing existing worklog
    if (isEditMode && createdServiceId) scheduleSave();
  }

  function handleObsChange(index, obs) {
    setResults((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], obs };
      return updated;
    });
  }

  function toggleObservation(index) {
    setExpandedObs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  function addCustomItem() {
    if (!customItemName.trim()) return;

    const newItem = {
      id: crypto.randomUUID(),
      name: customItemName.trim(),
      status: "",
      obs: "",
      isCustom: true,
    };

    setCustomItems((prev) => [...prev, newItem]);
    setCustomItemName("");
  }

  function removeCustomItem(id) {
    setCustomItems((prev) => prev.filter((item) => item.id !== id));
    setExpandedCustomObs((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  function handleCustomStatusChange(id, newStatus) {
    setCustomItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    if (isEditMode && createdServiceId) scheduleSave();
  }

  const buildResultsPayload = useCallback((resultsArray, customArray) => {
    return [
      ...(type === "ALISTAMIENTO" ? resultsArray : []),
      ...customArray.map((item) => ({
        itemId: item.itemId || null,
        name: item.name,
        status: item.status || null,
        obs: item.obs || "",
        isCustom: true,
      })),
    ].map((r) => ({ ...r, status: r.status === "" ? null : r.status }));
  }, [type]);

  function handleCustomObsChange(id, obs) {
    setCustomItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, obs } : item))
    );
  }

  function toggleCustomObservation(id) {
    setExpandedCustomObs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!pilotId || !hours || !type) {
      setError(
        "Selecciona un piloto, ingresa las horas y el tipo de servicio."
      );
      return;
    }

    if (type === "REPARACION" && customItems.length === 0) {
      setError("Debes agregar al menos un ítem propio para una reparación.");
      return;
    }

    setSubmitting(true);
    try {
      const allResults = [
        ...(type === "ALISTAMIENTO" ? results : []),
        ...customItems.map((item) => ({
          itemId: item.itemId || null,
          name: item.name,
          status: item.status || null,
          obs: item.obs || "",
          isCustom: true,
        })),
      ].map(r => ({
        ...r,
        // normalize empty string to null so backend treats as unprocessed
        status: r.status === "" ? null : r.status,
      }));

      const payload = {
        pilotId: Number(pilotId),
        hours: Number(hours),
        type,
        results: allResults,
      };

      if (isEditMode) {
        await updateWorklog(createdServiceId, {
          hours: Number(hours),
          type,
          results: allResults,
        });
        const msg = "Servicio actualizado correctamente. Puedes terminar el servicio cuando todos los ítems estén procesados.";
        setSuccess(msg);
        notifySuccess({ message: msg });
        // mark as in-process when editing and items are processed
        if (isInProcess) setWorklogState('EN_PROCESO');
      } else {
        await createWorklog(payload);
        const msg = "Servicio registrado correctamente.";
        setSuccess(msg);
        notifySuccess({ message: msg });
        setTimeout(() => navigate("/worklogs-pending"), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Error al guardar el servicio";
      setError(msg);
      notifyError({ message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const doAutoSave = useCallback(async () => {
    if (!isEditMode || !createdServiceId) return;
    setSaving(true);
    try {
      const allResults = buildResultsPayload(results, customItems);

      await updateWorklog(createdServiceId, {
        hours: Number(hours),
        type,
        results: allResults,
      });
      setLastSavedAt(new Date());
      info({ message: "Guardado automaticamente." });
    } catch (err) {
      const msg = err.response?.data?.error || "Error al guardar cambios";
      setError(msg);
      notifyError({ message: msg });
    } finally {
      setSaving(false);
    }
  }, [isEditMode, createdServiceId, buildResultsPayload, results, customItems, hours, type, info, notifyError]);

    // Auto-save logic (debounced)
  const saveTimeoutRef = useRef(null);
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      doAutoSave();
    }, 500);
  }, [doAutoSave]);

  // Listen to any change in the form to trigger autosave when editing
  useEffect(() => {
    if (isEditMode && createdServiceId) {
      scheduleSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pilotId, hours, type, results, customItems]);

  function allItemsCompleted() {
    const checklistComplete =
      type === "ALISTAMIENTO"
        ? results.every((r) => r.status === "SI" || r.status === "NO")
        : true;

    const customComplete =
      customItems.length > 0
        ? customItems.every((item) => item.status === "SI" || item.status === "NO")
        : true;

    return checklistComplete && customComplete;
  }

  const isInProcess = useMemo(() => {
    const anyChecklistMarked = results.some((r) => r.status === "SI" || r.status === "NO");
    const anyCustomMarked = customItems.some((r) => r.status === "SI" || r.status === "NO");
    return anyChecklistMarked || anyCustomMarked;
  }, [results, customItems]);

  // Keep worklogState in sync with in-memory `isInProcess` changes
  useEffect(() => {
    if (!isEditMode) return;
    if (isInProcess && worklogState === 'PENDIENTE') {
      setWorklogState('EN_PROCESO');
    } else if (!isInProcess && worklogState === 'EN_PROCESO') {
      setWorklogState('PENDIENTE');
    }
  }, [isInProcess, worklogState, isEditMode]);

  async function handleTerminateService() {
    if (!createdServiceId) {
      const msg = "Debes guardar el servicio primero.";
      setError(msg);
      notifyError({ message: msg });
      return;
    }

    // Ask for confirmation before terminating
    const ok = await confirm({ title: "Confirmar", message: "¿Deseas terminar el servicio?" });
    if (!ok) return;

    if (!allItemsCompleted()) {
      const msg = "Todos los ítems deben estar procesados para terminar el servicio.";
      setError(msg);
      notifyError({ message: msg });
      return;
    }

    setTerminating(true);
    try {
      await terminateWorklog(createdServiceId);
      const msg = "Servicio terminado correctamente.";
      setSuccess(msg);
      notifySuccess({ message: msg });
      setWorklogState('TERMINADO');
      setTimeout(() => navigate("/worklogs-completed"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Error al terminar el servicio";
      setError(msg);
      notifyError({ message: msg });
    } finally {
      setTerminating(false);
    }
  }

  return {
    // State
    isInProcess,
    // Loading / mode
    loading,
    isEditMode,

    // Feedback
    error,
    success,

    // Service data
    pilots,
    pilotId,
    setPilotId,
    hours,
    setHours,
    type,
    setType,

    // Checklist
    results,
    expandedObs,
    checklistExpanded,
    setChecklistExpanded,
    handleStatusChange,
    handleObsChange,
    toggleObservation,

    // Custom items
    customItems,
    customItemName,
    setCustomItemName,
    expandedCustomObs,
    addCustomItem,
    removeCustomItem,
    handleCustomStatusChange,
    handleCustomObsChange,
    toggleCustomObservation,

    // Actions
    submitting,
    saving,
    terminating,
    createdServiceId,
    lastSavedAt,
    allItemsCompleted,
    handleSubmit,
    handleTerminateService,
    worklogState,
  };
}

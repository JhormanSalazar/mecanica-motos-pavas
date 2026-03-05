import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchPilotsAndChecklistItems,
  createWorklog,
  updateWorklog,
  terminateWorklog,
} from "../api/newServiceApi";

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

  const [pilotId, setPilotId] = useState("");
  const [hours, setHours] = useState("");
  const [type, setType] = useState("ALISTAMIENTO");
  const [results, setResults] = useState([]);
  const [expandedObs, setExpandedObs] = useState({});
  const [checklistExpanded, setChecklistExpanded] = useState(false);

  const [customItems, setCustomItems] = useState([]);
  const [customItemName, setCustomItemName] = useState("");
  const [expandedCustomObs, setExpandedCustomObs] = useState({});

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
        setSuccess(
          "Servicio actualizado correctamente. Puedes terminar el servicio cuando todos los ítems estén procesados."
        );
      } else {
        await createWorklog(payload);
        setSuccess("Servicio registrado correctamente.");
        setTimeout(() => navigate("/worklogs"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar el servicio");
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
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  }, [isEditMode, createdServiceId, buildResultsPayload, results, customItems, hours, type]);

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
        ? results.every((r) => r.status === "SI")
        : true;

    const customComplete =
      customItems.length > 0
        ? customItems.every((item) => item.status === "SI")
        : true;

    return checklistComplete && customComplete;
  }

  const isInProcess = useMemo(() => {
    const anyChecklistMarked = results.some((r) => r.status === "SI" || r.status === "NO");
    const anyCustomMarked = customItems.some((r) => r.status === "SI" || r.status === "NO");
    return anyChecklistMarked || anyCustomMarked;
  }, [results, customItems]);

  async function handleTerminateService() {
    if (!createdServiceId) {
      setError("Debes guardar el servicio primero.");
      return;
    }

    if (!allItemsCompleted()) {
      setError(
        "Todos los ítems deben estar procesados para terminar el servicio."
      );
      return;
    }

    setTerminating(true);
    try {
      await terminateWorklog(createdServiceId);
      setSuccess("Servicio terminado correctamente.");
      setTimeout(() => navigate("/worklogs"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error al terminar el servicio");
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
  };
}

/**
 * Estados posibles para una orden de trabajo (WorkLog)
 */
const WORKLOG_STATES = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  TERMINADO: 'TERMINADO',
};

/**
 * Mapeo de estados para descripción amigable
 */
const WORKLOG_STATES_DESCRIPTION = {
  [WORKLOG_STATES.PENDIENTE]: 'Pendiente',
  [WORKLOG_STATES.EN_PROCESO]: 'En Proceso',
  [WORKLOG_STATES.TERMINADO]: 'Terminado',
};

/**
 * Estado por defecto para nuevas órdenes y órdenes existentes sin estado
 * Todas las órdenes existentes fue asignadas a TERMINADO en la migración
 */
const DEFAULT_WORKLOG_STATE = WORKLOG_STATES.PENDIENTE;

module.exports = {
  WORKLOG_STATES,
  WORKLOG_STATES_DESCRIPTION,
  DEFAULT_WORKLOG_STATE,
};

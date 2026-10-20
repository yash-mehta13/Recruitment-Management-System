import { STATUS } from '../constants';

const VARIANT = {
  [STATUS.IN_PROCESS]: 'badge-info',
  [STATUS.SELECTED]: 'badge-success',
  [STATUS.REJECTED]: 'badge-danger',
};

function StatusBadge({ status }) {
  return <span className={`badge ${VARIANT[status] ?? 'badge-neutral'}`}>{status || 'Unknown'}</span>;
}

export default StatusBadge;

import { useRendicionStore } from '../../store/useRendicionStore';
import {
  calcComparison,
  calcTotalContado,
  calcTotalEfectivoEsperado,
  formatCurrency,
} from '../../utils/calculations';
import styles from './ComparisonResult.module.css';

const STATUS_CONFIG = {
  exact: {
    label: '✓ Cuadra exacto',
    className: 'exact',
    description: 'El efectivo contado coincide con el efectivo esperado.',
  },
  short: {
    label: '✗ Faltante',
    className: 'short',
    description: 'El efectivo contado es menor al esperado.',
  },
  surplus: {
    label: '▲ Sobrante',
    className: 'surplus',
    description: 'El efectivo contado supera al esperado.',
  },
} as const;

export function ComparisonResult() {
  const days = useRendicionStore((s) => s.days);
  const bills = useRendicionStore((s) => s.bills);

  const expectedCash = calcTotalEfectivoEsperado(days);
  const countedCash = calcTotalContado(bills);
  const result = calcComparison(expectedCash, countedCash);
  const config = STATUS_CONFIG[result.status];

  const hasData = days.length > 0 || countedCash > 0;

  if (!hasData) {
    return (
      <section className={styles.container}>
        <h2 className={styles.title}>Comparación</h2>
        <p className={styles.empty}>
          Cargá al menos un día y billetes para ver la comparación.
        </p>
      </section>
    );
  }

  return (
    <section className={`${styles.container} ${styles[config.className]}`}>
      <div className={styles.statusBadge}>
        <span className={styles.statusLabel}>{config.label}</span>
      </div>

      <h2 className={styles.title}>Comparación</h2>

      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.itemLabel}>Efectivo esperado</span>
          <span className={styles.itemAmount}>
            {formatCurrency(expectedCash)}
          </span>
        </div>

        <div className={styles.divider}>vs</div>

        <div className={styles.item}>
          <span className={styles.itemLabel}>Efectivo contado</span>
          <span className={styles.itemAmount}>
            {formatCurrency(countedCash)}
          </span>
        </div>
      </div>

      <div className={styles.differenceBlock}>
        <span className={styles.differenceLabel}>Diferencia</span>
        <span className={styles.differenceAmount}>
          {result.difference > 0 ? '+' : ''}
          {formatCurrency(result.difference)}
        </span>
      </div>

      <p className={styles.description}>{config.description}</p>
    </section>
  );
}

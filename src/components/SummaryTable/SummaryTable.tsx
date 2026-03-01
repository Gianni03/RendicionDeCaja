import { useRendicionStore } from '../../store/useRendicionStore';
import {
  calcTotalEfectivoEsperado,
  calcTotalPosnet,
  formatCurrency,
  formatDateShort,
} from '../../utils/calculations';
import styles from './SummaryTable.module.css';

export function SummaryTable() {
  const days = useRendicionStore((s) => s.days);
  const removeDay = useRendicionStore((s) => s.removeDay);

  const totalPosnet = calcTotalPosnet(days);
  const totalEfectivo = calcTotalEfectivoEsperado(days);

  if (days.length === 0) {
    return (
      <section className={styles.container}>
        <h2 className={styles.title}>Resumen de Días</h2>
        <p className={styles.empty}>Aún no hay días cargados.</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Resumen de Días</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Fecha</th>
              <th className={`${styles.th} ${styles.right}`}>Total</th>
              <th className={`${styles.th} ${styles.right}`}>POSNET</th>
              <th className={`${styles.th} ${styles.right}`}>Efectivo</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.id} className={styles.row}>
                <td className={styles.td}>{formatDateShort(day.date)}</td>
                <td className={`${styles.td} ${styles.right}`}>
                  {formatCurrency(day.totalFacturado)}
                </td>
                <td className={`${styles.td} ${styles.right}`}>
                  {formatCurrency(day.posnet)}
                </td>
                <td
                  className={`${styles.td} ${styles.right} ${
                    day.efectivoDia < 0 ? styles.negative : styles.positive
                  }`}
                >
                  {formatCurrency(day.efectivoDia)}
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeDay(day.id)}
                    title="Eliminar día"
                    aria-label={`Eliminar día ${formatDateShort(day.date)}`}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.footerRow}>
              <td className={`${styles.td} ${styles.footerLabel}`}>TOTALES</td>
              <td
                className={`${styles.td} ${styles.right} ${styles.footerValue}`}
              >
                {formatCurrency(days.reduce((a, d) => a + d.totalFacturado, 0))}
              </td>
              <td
                className={`${styles.td} ${styles.right} ${styles.footerValue}`}
              >
                {formatCurrency(totalPosnet)}
              </td>
              <td
                className={`${styles.td} ${styles.right} ${styles.footerValue} ${styles.positive}`}
              >
                {formatCurrency(totalEfectivo)}
              </td>
              <td className={styles.td}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total POSNET acumulado</span>
          <span className={styles.summaryAmount}>
            {formatCurrency(totalPosnet)}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total efectivo esperado</span>
          <span className={`${styles.summaryAmount} ${styles.highlight}`}>
            {formatCurrency(totalEfectivo)}
          </span>
        </div>
      </div>
    </section>
  );
}

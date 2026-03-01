import { useRendicionStore } from '../../store/useRendicionStore';
import { formatCurrency } from '../../utils/calculations';
import styles from './BillCounter.module.css';

export function BillCounter() {
  const bills = useRendicionStore((s) => s.bills);
  const updateBillQuantity = useRendicionStore((s) => s.updateBillQuantity);

  const totalContado = bills.reduce((acc, b) => acc + b.subtotal, 0);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Contador de Billetes</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Denominación</th>
              <th className={`${styles.th} ${styles.center}`}>Cantidad</th>
              <th className={`${styles.th} ${styles.right}`}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.denomination} className={styles.row}>
                <td className={`${styles.td} ${styles.denom}`}>
                  $ {bill.denomination.toLocaleString('es-AR')}
                </td>
                <td className={`${styles.td} ${styles.center}`}>
                  <input
                    id={`bill-${bill.denomination}`}
                    type="number"
                    className={styles.input}
                    value={bill.quantity === 0 ? '' : bill.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      updateBillQuantity(
                        bill.denomination,
                        isNaN(val) || val < 0 ? 0 : val,
                      );
                    }}
                    min="0"
                    step="1"
                    placeholder="0"
                    aria-label={`Cantidad billetes $${bill.denomination}`}
                  />
                </td>
                <td
                  className={`${styles.td} ${styles.right} ${
                    bill.subtotal > 0 ? styles.filled : styles.zero
                  }`}
                >
                  {formatCurrency(bill.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.footerRow}>
              <td colSpan={2} className={`${styles.td} ${styles.footerLabel}`}>
                Total efectivo contado
              </td>
              <td
                className={`${styles.td} ${styles.right} ${styles.footerTotal}`}
              >
                {formatCurrency(totalContado)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

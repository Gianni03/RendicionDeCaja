import { useEffect } from 'react';
import { useRendicionStore } from './store/useRendicionStore';
import { DailyEntry } from './components/DailyEntry/DailyEntry';
import { SummaryTable } from './components/SummaryTable/SummaryTable';
import { BillCounter } from './components/BillCounter/BillCounter';
import { ComparisonResult } from './components/ComparisonResult/ComparisonResult';
import { PDFGenerator } from './components/PDFGenerator/PDFGenerator';
import styles from './App.module.css';

function App() {
  const hydrate = useRendicionStore((s) => s.hydrate);
  const clearRendicion = useRendicionStore((s) => s.clearRendicion);
  const days = useRendicionStore((s) => s.days);

  // Restore persisted state on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function handleClear() {
    if (
      window.confirm(
        '¿Confirmás que querés limpiar toda la rendición? Esta acción no se puede deshacer.',
      )
    ) {
      clearRendicion();
    }
  }

  return (
    <div className={styles.app}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>🧾</span>
            <div>
              <h1 className={styles.headerTitle}>Rendición de Caja</h1>
              <p className={styles.headerSubtitle}>
                Período de hasta 6 días — efectivo, POSNET y diferencia
              </p>
            </div>
          </div>
          {days.length > 0 && (
            <button
              className={styles.clearBtn}
              onClick={handleClear}
              title="Limpiar toda la rendición"
            >
              ← Limpiar todo
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className={styles.main}>
        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.leftCol}>
            <DailyEntry />
            <SummaryTable />
          </div>

          {/* Right column */}
          <div className={styles.rightCol}>
            <BillCounter />
            <ComparisonResult />
            <PDFGenerator />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p>Rendición de Caja — datos guardados en este dispositivo</p>
      </footer>
    </div>
  );
}

export default App;

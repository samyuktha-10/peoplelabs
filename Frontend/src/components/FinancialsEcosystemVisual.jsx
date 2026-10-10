import EcosystemDiagram from './EcosystemDiagram.jsx'

// Oracle Fusion Financials modules (careers page). Eight modules around the
// hub, with Intercompany beneath it.
const items = [
  {
    label: 'General Ledger',
    glyph: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  },
  {
    label: 'Accounts Payable',
    glyph: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /><path d="M14.5 9.5c0-1-1-1.5-2.5-1.5S9.5 8.5 9.5 9.5s1 1.5 2.5 1.5 2.5.5 2.5 1.5-1 1.5-2.5 1.5-2.5-.5-2.5-1.5" /></>,
  },
  {
    label: 'Accounts Receivable',
    glyph: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  },
  {
    label: 'Cash Management',
    glyph: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>,
  },
  {
    label: 'Fusion Tax',
    glyph: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h8" /></>,
  },
  {
    label: 'Fixed Assets',
    glyph: <><path d="M2 10l10-7 10 7z" /><path d="M3 21h18" /><path d="M5 21V10M9 21V10M15 21V10M19 21V10" /></>,
  },
  {
    label: 'Fusion Expenses',
    glyph: <><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18" /><path d="M16 15h2" /></>,
  },
  {
    label: 'Budgeting',
    glyph: <><path d="M21.2 15.9A10 10 0 1 1 8 2.8" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>,
  },
]

const bottomItem = {
  label: 'Intercompany',
  glyph: <><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="M16 21l4-4-4-4" /><path d="M20 17H4" /></>,
}

export default function FinancialsEcosystemVisual({ start = true }) {
  return (
    <EcosystemDiagram
      hubTitle="Oracle Fusion Financials"
      hubSubtitle="Connected finance operations"
      items={items}
      bottomItem={bottomItem}
      ariaLabel="Oracle Fusion Financials ecosystem: General Ledger, Accounts Payable, Accounts Receivable, Cash Management, Fusion Tax, Fixed Assets, Fusion Expenses, Budgeting and Intercompany"
      start={start}
    />
  )
}

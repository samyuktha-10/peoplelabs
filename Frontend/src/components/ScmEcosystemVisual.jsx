import EcosystemDiagram from './EcosystemDiagram.jsx'

// Oracle Fusion SCM subsidiaries (services page).
const items = [
  {
    label: 'Product Management',
    glyph: <><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></>,
  },
  {
    label: 'Inventory Management',
    glyph: <><path d="M3 21V9l9-6 9 6v12" /><path d="M7 21v-7h10v7" /><path d="M7 17h10" /></>,
  },
  {
    label: 'Order Management',
    glyph: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3h6v3H9z" /><path d="M9 11h6M9 15h6" /></>,
  },
  {
    label: 'Pricing',
    glyph: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  },
  {
    label: 'RSSP',
    glyph: <><path d="M2 6h12v10H2z" /><path d="M14 10h4l4 4v2h-8" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  },
  {
    label: 'Purchasing',
    glyph: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  },
  {
    label: 'Sourcing',
    glyph: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  },
  {
    label: 'Procurement Contracts',
    glyph: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></>,
  },
  {
    label: 'SQM',
    glyph: <><circle cx="12" cy="8" r="6" /><path d="M8.2 13.1 7 22l5-3 5 3-1.2-8.9" /></>,
  },
  {
    label: 'Cost Management',
    glyph: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8" /></>,
  },
]

export default function ScmEcosystemVisual({ start = true }) {
  return (
    <EcosystemDiagram
      hubTitle="Oracle Fusion SCM"
      hubSubtitle="Connected supply chain"
      items={items}
      ariaLabel="Oracle Fusion SCM ecosystem: Product Management, Inventory Management, Order Management, Pricing, RSSP, Purchasing, Sourcing, Procurement Contracts, SQM and Cost Management"
      start={start}
    />
  )
}

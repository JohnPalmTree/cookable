'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="shrink-0 border border-gray-200 text-sm text-gray-600 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
    >
      🖨️ Print
    </button>
  )
}
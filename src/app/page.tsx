import { supabase } from '@/src/lib/supabase'
import { Ingredient, Recipe } from '@/src/types'
import Link from 'next/link'

export default async function Home() {
  const [
    { data: ingredients },
    { data: recipes },
  ] = await Promise.all([
    supabase.from('ingredients').select('*'),
    supabase.from('recipes').select('*'),
  ])

  const ing = (ingredients ?? []) as Ingredient[]
  const rec = (recipes ?? []) as Recipe[]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiringSoon = ing.filter(i => {
    if (!i.expiry_date) return false
    const diff = Math.ceil((new Date(i.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 3
  })

  const expired = ing.filter(i => {
    if (!i.expiry_date) return false
    return new Date(i.expiry_date) < today
  })

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-1">Good to see you 👋</h1>
      <p className="text-gray-400 mb-8">Here's what's going on in your kitchen.</p>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Ingredients', value: ing.length, href: '/inventory', color: 'bg-blue-50 text-blue-700' },
          { label: 'Recipes', value: rec.length, href: '/recipes', color: 'bg-purple-50 text-purple-700' },
          { label: 'Expiring soon', value: expiringSoon.length, href: '/inventory', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Expired', value: expired.length, href: '/inventory', color: 'bg-red-50 text-red-700' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <p className={`text-2xl font-semibold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Expiring soon */}
      {expiringSoon.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-3">⚠️ Use these soon</h2>
          <div className="bg-white border border-yellow-200 rounded-xl divide-y divide-gray-100">
            {expiringSoon.map(i => {
              const diff = Math.ceil((new Date(i.expiry_date!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              return (
                <div key={i.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-800">{i.name}</span>
                  <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                    {diff === 0 ? 'Today' : `${diff}d left`}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Quick links */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/inventory', emoji: '🧊', label: 'Update inventory', sub: 'Add or edit fridge items' },
            { href: '/recipes', emoji: '📖', label: 'Browse recipes', sub: 'See what you can cook' },
            { href: '/shopping', emoji: '🛒', label: 'Shopping list', sub: 'Plan your next shop' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow flex items-start gap-3"
            >
              <span className="text-2xl">{link.emoji}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{link.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{link.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
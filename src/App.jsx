import { useState } from 'react'
import { Routes, Route, NavLink, Navigate, useParams } from 'react-router-dom'
import { Menu, Bell, X } from 'lucide-react'
import { modules } from './modules'
import { Block } from './ui'

function Page() {
  const { mod, sub } = useParams()
  const m = modules.find((x) => x.id === mod)
  if (!m) return <Navigate to="/dashboard/overview" replace />
  const s = m.subs.find((x) => x.id === sub) || m.subs[0]
  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">{m.label}</h1>
      <nav className="-mx-4 mt-3 flex gap-1 overflow-x-auto border-b border-slate-200 px-4 sm:mx-0 sm:px-0">
        {m.subs.map((x) => (
          <NavLink key={x.id} to={`/${m.id}/${x.id}`} className={({ isActive }) => `whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${isActive || x.id === s.id ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{x.label}</NavLink>
        ))}
      </nav>
      <div key={m.id + s.id} className="mt-5 grid gap-4 lg:grid-cols-2">
        {s.blocks.map((b, i) => <div key={i} className={['chart'].includes(b.type) ? '' : 'lg:col-span-2'}><Block b={b} /></div>)}
      </div>
    </div>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-slate-900 p-4 text-slate-300 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2 text-lg font-bold text-white"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">🍔</span> FoodDash</div><button className="lg:hidden" onClick={() => setOpen(false)}><X size={18} /></button></div>
        <nav className="space-y-1">
          {modules.map((m) => (
            <NavLink key={m.id} to={`/${m.id}/${m.subs[0].id}`} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}><m.icon size={18} />{m.label}</NavLink>
          ))}
        </nav>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
          <span className="hidden text-sm text-slate-500 lg:block">Admin Panel</span>
          <div className="flex items-center gap-4"><Bell size={20} className="text-slate-500" /><div className="flex items-center gap-2 text-sm font-medium"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">A</span>Super Admin</div></div>
        </header>
        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="/:mod/:sub?" element={<Page />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

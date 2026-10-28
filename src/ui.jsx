import { useState } from 'react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { Search, Plus, X, Check } from 'lucide-react'
import { orders } from './data'

const TONE = {
  green: 'bg-emerald-50 text-emerald-700', red: 'bg-red-50 text-red-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-sky-50 text-sky-700', gray: 'bg-slate-100 text-slate-600',
}
const MAP = {
  Active: 'green', Delivered: 'green', Success: 'green', Paid: 'green', Verified: 'green', Approved: 'green', Resolved: 'green', Published: 'green', Rewarded: 'green', Filed: 'green', Refunded: 'green', Sent: 'green', Completed: 'green', Closed: 'gray', Running: 'blue',
  Pending: 'amber', Open: 'amber', Scheduled: 'blue', Due: 'amber', Low: 'gray', Medium: 'amber', Unassigned: 'amber', Confirmed: 'blue', Preparing: 'blue', 'Out for Delivery': 'blue', 'In Transit': 'blue', 'In Progress': 'blue', 'Under Review': 'blue',
  Cancelled: 'red', Failed: 'red', Rejected: 'red', Blocked: 'red', Suspended: 'red', Expired: 'red', Flagged: 'red', High: 'red', Disabled: 'gray', Assigned: 'green',
}
export const Badge = ({ v }) => <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[MAP[v] || 'gray']}`}>{v}</span>
export const Card = ({ title, right, children, className = '' }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
    {(title || right) && <div className="mb-3 flex items-center justify-between gap-2"><h3 className="font-semibold">{title}</h3>{right}</div>}
    {children}
  </div>
)
const Switch = ({ on, set }) => (
  <button onClick={() => set(!on)} className={`relative h-5 w-9 rounded-full transition ${on ? 'bg-brand-500' : 'bg-slate-300'}`}>
    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? 'left-4' : 'left-0.5'}`} />
  </button>
)

export const Stats = ({ items }) => (
  <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
    {items.map(([l, v, d]) => (
      <Card key={l}><p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p>
        {d && <p className={`mt-1 text-xs font-medium ${d.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>{d} vs last week</p>}</Card>
    ))}
  </div>
)

const COLORS = ['#f97316', '#0ea5e9', '#10b981', '#8b5cf6', '#ef4444']
export const Chart = ({ kind = 'line', title, data, keys = ['orders'] }) => (
  <Card title={title}>
    <div className="h-64">
      <ResponsiveContainer>
        {kind === 'pie' ? (
          <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>{data.map((_, i) => <Cell key={i} fill={COLORS[i % 5]} />)}</Pie><Tooltip /><Legend /></PieChart>
        ) : kind === 'bar' ? (
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip />{keys.length > 1 && <Legend />}
            {keys.map((k, i) => <Bar key={k} dataKey={k} fill={COLORS[i]} radius={[4, 4, 0, 0]} />)}</BarChart>
        ) : (
          <LineChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip />{keys.length > 1 && <Legend />}
            {keys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i]} strokeWidth={2.5} dot={false} />)}</LineChart>
        )}
      </ResponsiveContainer>
    </div>
  </Card>
)

const PAGE = 10
export function DataTable({ title, rows: init, cols, actions = [], add, filterKey = 'status' }) {
  const [rows, setRows] = useState(init)
  const [q, setQ] = useState('')
  const [f, setF] = useState('All')
  const [page, setPage] = useState(0)
  const [sel, setSel] = useState(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({})
  const opts = ['All', ...new Set(init.map((r) => r[filterKey]).filter((x) => typeof x === 'string'))]
  const shown = rows.filter((r) => (f === 'All' || r[filterKey] === f) && JSON.stringify(Object.values(r)).toLowerCase().includes(q.toLowerCase()))
  const pages = Math.max(1, Math.ceil(shown.length / PAGE))
  const upd = (id, p) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)))
  const cell = (r, c) => {
    const v = r[c.k]
    if (c.t === 'status') return <Badge v={v} />
    if (c.t === 'toggle') return <Switch on={v} set={(x) => upd(r.id, { [c.k]: x })} />
    if (c.t === 'input') return <input className="inp !w-24 !py-1" value={v} onChange={(e) => upd(r.id, { [c.k]: e.target.value })} />
    if (c.t === 'stars') return <span className="text-amber-500">★ <span className="text-slate-700">{v}</span></span>
    if (c.t === 'bar') return <div className="h-2 w-28 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-500" style={{ width: v + '%' }} /></div>
    if (c.t === 'bool') return v ? 'Yes' : 'No'
    return v
  }
  const submit = () => {
    setRows((rs) => [{ id: Date.now(), status: 'Active', ...form }, ...rs]); setForm({}); setAdding(false); setPage(0)
  }
  return (
    <Card title={title} right={add && <button className="btn" onClick={() => setAdding(!adding)}><Plus size={16} /> {add.label}</button>}>
      {adding && (
        <div className="mb-4 grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {add.fields.map((fl) => (
            <label key={fl.k} className="text-xs font-medium text-slate-600">{fl.l}
              {fl.o ? <select className="inp mt-1" value={form[fl.k] || ''} onChange={(e) => setForm({ ...form, [fl.k]: e.target.value })}><option value="">Select</option>{fl.o.map((o) => <option key={o}>{o}</option>)}</select>
                : <input className="inp mt-1" type={fl.t || 'text'} value={form[fl.k] || ''} onChange={(e) => setForm({ ...form, [fl.k]: e.target.value })} />}
            </label>
          ))}
          <div className="flex items-end gap-2"><button className="btn" onClick={submit}>Save</button><button className="btn-o" onClick={() => setAdding(false)}>Cancel</button></div>
        </div>
      )}
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1"><Search size={16} className="absolute left-3 top-2.5 text-slate-400" /><input className="inp !pl-9" placeholder="Search..." value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} /></div>
        {opts.length > 2 && <select className="inp !w-auto" value={f} onChange={(e) => { setF(e.target.value); setPage(0) }}>{opts.map((o) => <option key={o}>{o}</option>)}</select>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500">{cols.map((c) => <th key={c.h} className="whitespace-nowrap px-3 py-2 font-medium">{c.h}</th>)}{actions.length > 0 && <th className="px-3 py-2">Actions</th>}</tr></thead>
          <tbody>
            {shown.slice(page * PAGE, page * PAGE + PAGE).map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                {cols.map((c, i) => <td key={c.h} onClick={() => i === 0 && setSel(r)} className={`whitespace-nowrap px-3 py-2.5 ${i === 0 ? 'cursor-pointer font-medium text-brand-700' : ''}`}>{cell(r, c)}</td>)}
                {actions.length > 0 && (
                  <td className="whitespace-nowrap px-3 py-2"><div className="flex gap-1.5">
                    {actions.filter((a) => !a.when || a.when.includes(r.status)).map((a) => (
                      <button key={a.label} onClick={() => upd(r.id, a.set)} className={`rounded-md px-2 py-1 text-xs font-medium ${a.danger ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>{a.label}</button>
                    ))}</div></td>
                )}
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={cols.length + 1} className="py-10 text-center text-slate-400">No records found</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{shown.length} records</span>
        <div className="flex items-center gap-2"><button className="btn-o !px-2 !py-1" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button><span>{page + 1} / {pages}</span><button className="btn-o !px-2 !py-1" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</button></div>
      </div>
      {sel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSel(null)}>
          <div className="h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold">Details</h3><button onClick={() => setSel(null)}><X size={18} /></button></div>
            <dl className="space-y-3 text-sm">{Object.entries(sel).filter(([k]) => k !== 'id').map(([k, v]) => (
              <div key={k}><dt className="text-xs uppercase text-slate-400">{k}</dt><dd className="font-medium">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</dd></div>
            ))}</dl>
          </div>
        </div>
      )}
    </Card>
  )
}

export function Settings({ title, fields }) {
  const [v, setV] = useState(Object.fromEntries(fields.map((f) => [f.k, f.v])))
  const [ok, setOk] = useState(false)
  return (
    <Card title={title}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.k} className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
            <span>{f.l}</span>
            {typeof f.v === 'boolean' ? <Switch on={v[f.k]} set={(x) => setV({ ...v, [f.k]: x })} />
              : <input className="inp !w-40" value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />}
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3"><button className="btn" onClick={() => { setOk(true); setTimeout(() => setOk(false), 2000) }}>Save changes</button>{ok && <span className="flex items-center gap-1 text-sm text-emerald-600"><Check size={16} /> Saved</span>}</div>
    </Card>
  )
}

export function Perms({ roles, modules }) {
  const [rs, setRs] = useState(roles)
  const tog = (i, j) => setRs(rs.map((r, x) => (x === i ? { ...r, perms: r.perms.map((p, y) => (y === j ? +!p : p)) } : r)))
  return (
    <Card title="Roles & Permissions">
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b text-xs uppercase text-slate-500"><th className="px-3 py-2 text-left">Role</th>{modules.map((m) => <th key={m} className="px-2 py-2">{m}</th>)}</tr></thead>
        <tbody>{rs.map((r, i) => <tr key={r.role} className="border-b border-slate-100"><td className="px-3 py-2.5 font-medium">{r.role}</td>
          {r.perms.map((p, j) => <td key={j} className="text-center"><input type="checkbox" className="h-4 w-4 accent-orange-600" checked={!!p} onChange={() => tog(i, j)} /></td>)}</tr>)}</tbody>
      </table></div>
    </Card>
  )
}

const STEPS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered']
export function OrderView({ mode }) {
  const [id, setId] = useState(orders[0].oid)
  const o = orders.find((x) => x.oid === id)
  const idx = STEPS.indexOf(o.status)
  return (
    <Card title={mode === 'track' ? 'Order Status Tracking' : 'Order Details'} right={<select className="inp !w-auto" value={id} onChange={(e) => setId(e.target.value)}>{orders.map((x) => <option key={x.oid}>{x.oid}</option>)}</select>}>
      {mode === 'track' ? (
        o.status === 'Cancelled' ? <p className="py-6 text-center text-red-600">This order was cancelled.</p> : (
          <ol className="grid gap-4 sm:grid-cols-5">{STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-3 sm:block sm:text-center">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold sm:mx-auto ${i <= idx ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{i < idx ? '✓' : i + 1}</span>
              <span className={`text-sm sm:mt-2 sm:block ${i <= idx ? 'font-semibold' : 'text-slate-400'}`}>{s}</span></li>))}</ol>
        )
      ) : (
        <div className="grid gap-4 text-sm sm:grid-cols-3">
          {[['Customer', o.customer], ['Restaurant', o.restaurant], ['Delivery partner', o.partner], ['Items', o.items], ['Payment', o.payment], ['Placed', o.placed], ['Total', o.amount]].map(([l, v]) => <div key={l}><p className="text-xs uppercase text-slate-400">{l}</p><p className="font-medium">{v}</p></div>)}
          <div><p className="text-xs uppercase text-slate-400">Status</p><Badge v={o.status} /></div>
        </div>
      )}
    </Card>
  )
}

export function Profiles({ rows }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.slice(0, 9).map((c) => (
        <Card key={c.id}><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">{c.name[0]}</div>
          <div><p className="font-semibold">{c.name}</p><p className="text-xs text-slate-500">{c.email}</p></div><div className="ml-auto"><Badge v={c.status} /></div></div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div><p className="text-base font-bold">{c.orders}</p>Orders</div><div><p className="text-base font-bold">{c.spent}</p>Spent</div><div><p className="text-base font-bold">{c.joined.slice(0, 6)}</p>Joined</div></div></Card>
      ))}
    </div>
  )
}

export function Block({ b }) {
  switch (b.type) {
    case 'stats': return <Stats items={b.items} />
    case 'chart': return <Chart {...b} />
    case 'table': return <DataTable {...b} />
    case 'settings': return <Settings {...b} />
    case 'perms': return <Perms {...b} />
    case 'order': return <OrderView mode={b.mode} />
    case 'profiles': return <Profiles rows={b.rows} />
    default: return null
  }
}

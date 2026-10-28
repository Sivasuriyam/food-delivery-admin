let s = 11
const r = () => (s = (s * 9301 + 49297) % 233280) / 233280
export const pick = (a) => a[Math.floor(r() * a.length)]
export const int = (a, b) => Math.floor(a + r() * (b - a + 1))
export const inr = (n) => '₹' + n.toLocaleString('en-IN')
const make = (n, f) => Array.from({ length: n }, (_, i) => ({ id: i + 1, ...f(i) }))
const day = (i) => `${String(1 + (i % 28)).padStart(2, '0')} Oct 2026`
const tm = () => `${int(10, 22)}:${String(int(0, 59)).padStart(2, '0')}`

export const CUST = ['Aarav Mehta', 'Priya Nair', 'Rohan Das', 'Sneha Iyer', 'Karthik Raj', 'Divya Menon', 'Arjun Patel', 'Meera Joshi', 'Vikram Singh', 'Ananya Rao']
export const REST = ['Spice Route', 'Pizza Palace', 'Burger Hub', 'Sushi Zen', 'Biryani House', 'Green Bowl', 'Taco Fiesta', 'Dosa Corner', 'Wok Express', 'Sweet Tooth']
export const PART = ['Ravi Kumar', 'Imran Khan', 'Suresh B', 'Manoj Pillai', 'Deepak Sharma', 'Faisal Ali', 'Naresh T', 'Gopal Reddy']
const CUIS = ['Indian', 'Italian', 'American', 'Japanese', 'Mexican', 'Chinese', 'Healthy', 'Desserts']
const area = () => pick(['Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'Guindy', 'Porur', 'Tambaram'])
const phone = () => `+91 9${int(100000000, 999999999)}`
const OS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Delivered', 'Delivered', 'Cancelled']

export const orders = make(48, (i) => ({
  oid: '#FD' + (1001 + i), customer: pick(CUST), restaurant: pick(REST), partner: pick(PART),
  items: int(1, 6), amount: inr(int(180, 1800)), payment: pick(['UPI', 'Card', 'COD', 'Wallet']),
  status: OS[i % OS.length], placed: day(i) + ', ' + tm(),
}))
export const byStatus = (...ss) => orders.filter((o) => ss.includes(o.status))

export const restaurants = make(24, (i) => ({
  name: REST[i % 10] + (i >= 10 ? ' ' + area() : ''), owner: pick(CUST), cuisine: pick(CUIS), area: area(), phone: phone(),
  rating: +(3.4 + r() * 1.5).toFixed(1), status: pick(['Active', 'Active', 'Active', 'Suspended']), commission: int(10, 25), open: true,
}))
export const pendingRest = make(8, (i) => ({ name: pick(REST) + ' ' + area(), owner: pick(CUST), cuisine: pick(CUIS), submitted: day(i), status: 'Pending' }))
export const docs = (who, types) => make(12, (i) => ({ name: pick(who), doc: pick(types), submitted: day(i), status: pick(['Pending', 'Pending', 'Verified', 'Rejected']) }))
export const menu = make(30, (i) => ({
  item: pick(['Paneer Tikka', 'Margherita', 'Veg Burger', 'Salmon Roll', 'Chicken Biryani', 'Caesar Salad', 'Nachos', 'Masala Dosa', 'Hakka Noodles', 'Brownie']),
  restaurant: pick(REST), category: pick(['Starters', 'Mains', 'Pizza', 'Rice', 'Desserts', 'Beverages']), price: int(80, 450), available: r() > 0.25,
}))
export const categories = ['Starters', 'Mains', 'Pizza', 'Rice', 'Desserts', 'Beverages', 'Salads', 'Combos'].map((n, i) => ({ id: i + 1, name: n, items: int(12, 90), status: 'Active' }))
export const hours = make(7, (i) => ({ day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i], opens: '10:00', closes: i > 4 ? '23:30' : '22:30', open: i !== 6 }))
export const ratings = make(14, (i) => ({ restaurant: REST[i % 10], rating: +(3.4 + r() * 1.5).toFixed(1), reviews: int(40, 900), food: +(3.5 + r() * 1.5).toFixed(1), delivery: +(3.5 + r() * 1.5).toFixed(1) }))

export const partners = make(20, (i) => ({
  name: PART[i % 8] + (i >= 8 ? ' ' + String.fromCharCode(65 + i) : ''), phone: phone(), vehicle: pick(['Bike', 'Scooter', 'Cycle']), zone: area(),
  online: r() > 0.4, rating: +(3.8 + r() * 1.2).toFixed(1), deliveries: int(120, 2400), earnings: inr(int(8000, 42000)), onTime: int(82, 99),
}))
export const assign = make(10, (i) => ({ oid: '#FD' + (1100 + i), restaurant: pick(REST), customer: pick(CUST), partner: 'Unassigned', status: 'Unassigned' }))
export const tracking = make(8, (i) => ({ oid: '#FD' + (1200 + i), partner: pick(PART), from: pick(REST), to: area(), eta: int(5, 35) + ' min', progress: int(10, 95), status: 'In Transit' }))
export const history = make(20, (i) => ({ oid: '#FD' + (900 + i), partner: pick(PART), distance: int(1, 12) + ' km', earned: inr(int(35, 140)), date: day(i), status: 'Delivered' }))

export const customers = make(30, (i) => ({
  name: pick(CUST) + (i >= 10 ? ' ' + String.fromCharCode(65 + (i % 26)) : ''), email: `user${i + 1}@mail.com`, phone: phone(), city: 'Chennai',
  orders: int(1, 80), spent: inr(int(500, 60000)), joined: day(i), status: pick(['Active', 'Active', 'Active', 'Blocked']),
}))
export const addresses = make(16, (i) => ({ customer: pick(CUST), label: pick(['Home', 'Work', 'Other']), address: `${int(1, 99)}, ${area()} Main Rd, Chennai`, pin: '6000' + int(10, 99), default: i % 3 === 0 }))
export const reviews = make(16, (i) => ({ customer: pick(CUST), restaurant: pick(REST), rating: int(1, 5), comment: pick(['Great taste!', 'Late delivery', 'Cold food', 'Loved it', 'Portion too small', 'Excellent packaging']), date: day(i), status: pick(['Published', 'Published', 'Flagged']) }))
export const complaints = make(14, (i) => ({ ticket: '#TK' + (500 + i), customer: pick(CUST), subject: pick(['Missing item', 'Late delivery', 'Wrong order', 'Payment issue', 'Rude partner']), priority: pick(['Low', 'Medium', 'High']), status: pick(['Open', 'In Progress', 'Resolved']), date: day(i) }))
export const refunds = make(14, (i) => ({ oid: '#FD' + (1001 + i), customer: pick(CUST), amount: inr(int(100, 900)), reason: pick(['Missing item', 'Late delivery', 'Wrong order', 'Quality issue']), mode: pick(['Original source', 'Wallet']), date: day(i), status: pick(['Pending', 'Approved', 'Rejected', 'Refunded']) }))

export const txns = make(30, (i) => ({ txn: 'TXN' + (80000 + i * 7), oid: '#FD' + (1001 + i), customer: pick(CUST), amount: inr(int(150, 1900)), method: pick(['UPI', 'Card', 'Wallet', 'COD']), date: day(i), status: pick(['Success', 'Success', 'Success', 'Failed', 'Pending']) }))
export const failed = make(10, (i) => ({ txn: 'TXN' + (90000 + i * 3), customer: pick(CUST), amount: inr(int(150, 1500)), method: pick(['UPI', 'Card']), reason: pick(['Bank declined', 'Timeout', 'Insufficient funds', 'Gateway error']), date: day(i), status: 'Failed' }))
export const settlements = make(10, (i) => ({ restaurant: REST[i], orders: int(80, 900), gross: inr(int(40000, 400000)), commission: inr(int(4000, 60000)), net: inr(int(30000, 340000)), period: '16–22 Oct', status: pick(['Pending', 'Paid', 'Pending']) }))
export const payouts = make(10, (i) => ({ partner: PART[i % 8], deliveries: int(40, 300), amount: inr(int(4000, 24000)), period: '16–22 Oct', status: pick(['Pending', 'Paid', 'Pending']) }))
export const commissions = make(10, (i) => ({ restaurant: REST[i], rate: int(10, 25) + '%', orders: int(80, 900), earned: inr(int(4000, 60000)), month: 'Oct 2026' }))
export const taxes = make(6, (i) => ({ type: ['GST on food (5%)', 'GST on delivery (18%)', 'GST on platform fee (18%)', 'TCS (1%)', 'TDS on partners (1%)', 'Packaging GST (12%)'][i], collected: inr(int(20000, 190000)), filed: inr(int(15000, 150000)), period: 'Oct 2026', status: pick(['Filed', 'Due']) }))

export const offers = make(10, (i) => ({ name: ['Weekend Feast', 'First Order', 'Lunch Combo', 'Midnight Munch', 'Free Delivery', 'Dessert Fest', 'Healthy Week', 'Biryani Bonanza', 'Pizza Party', 'Diwali Dhamaka'][i], type: pick(['Percentage', 'Flat', 'Free delivery']), value: pick(['20%', '₹100', '30%', 'Free']), minOrder: inr(int(1, 6) * 100), used: int(50, 3000), expiry: day(i + 10), status: pick(['Active', 'Active', 'Scheduled', 'Expired']) }))
export const campaigns = make(6, (i) => ({ name: ['Diwali Dhamaka', 'Monsoon Munch', 'Weekend Feast', 'New User Bonanza', 'Late Night Deals', 'Healthy Eats'][i], budget: inr(int(20, 200) * 1000), reach: int(5, 90) * 1000, redemptions: int(300, 6000), start: day(i), end: day(i + 14), status: pick(['Running', 'Scheduled', 'Completed']) }))
export const coupons = make(12, (i) => ({ code: pick(['SAVE', 'FEAST', 'NEW', 'FREED', 'YUM']) + int(10, 99), discount: pick(['10%', '₹50', '25%', '₹120']), minOrder: inr(int(1, 5) * 100), limit: int(100, 2000), used: int(10, 900), expiry: day(i + 5), status: pick(['Active', 'Active', 'Expired', 'Disabled']) }))
export const referrals = make(8, (i) => ({ referrer: pick(CUST), referred: pick(CUST) + ' ' + String.fromCharCode(65 + i), code: 'REF' + int(1000, 9999), reward: inr(100), date: day(i), status: pick(['Rewarded', 'Pending', 'Rewarded']) }))

export const tickets = make(18, (i) => ({ ticket: '#TK' + (700 + i), customer: pick(CUST), subject: pick(['Refund not received', 'App crash', 'Coupon not applied', 'Wrong charge', 'Account locked']), priority: pick(['Low', 'Medium', 'High']), assignee: pick(['Anita', 'Rahul', 'Sana']), status: pick(['Open', 'In Progress', 'Resolved', 'Closed']), date: day(i) }))
export const disputes = make(10, (i) => ({ case: '#DS' + (300 + i), oid: '#FD' + (1001 + i), between: pick(['Customer vs Restaurant', 'Customer vs Partner', 'Restaurant vs Partner']), amount: inr(int(150, 1200)), status: pick(['Open', 'Under Review', 'Resolved']), date: day(i) }))
export const notifications = make(8, (i) => ({ title: pick(['Weekend offer live', 'Maintenance notice', 'New restaurants near you', 'Order delay alert', 'App update available']), audience: pick(['All users', 'Customers', 'Partners', 'Restaurants']), channel: pick(['Push', 'Email', 'SMS']), sent: day(i), status: pick(['Sent', 'Scheduled', 'Sent']) }))
export const zones = make(7, (i) => ({ zone: ['Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'Guindy', 'Porur', 'Tambaram'][i], radius: int(3, 9) + ' km', fee: inr(int(20, 60)), partners: int(8, 40), active: i !== 6 }))
export const audit = make(20, (i) => ({ admin: pick(['Super Admin', 'Anita', 'Rahul', 'Sana']), action: pick(['Approved restaurant', 'Updated commission', 'Refunded order', 'Blocked customer', 'Created coupon', 'Changed role', 'Edited zone']), module: pick(['Restaurants', 'Payments', 'Orders', 'Customers', 'Offers', 'Settings']), ip: `192.168.1.${int(2, 250)}`, time: day(i) + ', ' + tm() }))

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const trend = days.map((d) => ({ name: d, orders: int(900, 2200), revenue: int(180, 520) }))
export const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m) => ({ name: m, revenue: int(30, 90), orders: int(20, 60), commission: int(5, 15) }))
export const peak = Array.from({ length: 14 }, (_, i) => ({ name: `${i + 9}:00`, orders: [40, 90, 260, 520, 380, 160, 120, 210, 430, 640, 720, 540, 260, 110][i] }))
export const byRest = REST.slice(0, 7).map((n) => ({ name: n, revenue: int(80, 420) }))
export const mix = [{ name: 'Delivered', value: 72 }, { name: 'Cancelled', value: 9 }, { name: 'Active', value: 14 }, { name: 'Refunded', value: 5 }]
export const activities = make(10, (i) => ({ event: pick(['New restaurant registered', 'Order cancelled', 'Partner went online', 'Refund requested', 'Coupon created', 'Payout processed', 'Complaint raised']), by: pick([...CUST, ...PART, 'System']), time: int(1, 59) + ' min ago' }))
export const roles = [
  { role: 'Super Admin', perms: [1, 1, 1, 1, 1, 1, 1, 1] }, { role: 'Operations Manager', perms: [1, 1, 1, 1, 1, 0, 0, 0] },
  { role: 'Finance Manager', perms: [1, 0, 0, 0, 0, 1, 0, 1] }, { role: 'Support Agent', perms: [0, 1, 0, 0, 1, 0, 0, 1] }, { role: 'Marketing Manager', perms: [1, 0, 0, 0, 0, 0, 1, 0] },
]

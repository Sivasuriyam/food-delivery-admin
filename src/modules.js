import { LayoutDashboard, ShoppingBag, Store, Bike, Users, Wallet, Percent, LifeBuoy } from 'lucide-react'
import * as d from './data'

const C = (s) => s.split('|').map((x) => { const [h, k, t] = x.split(':'); return { h, k, t } })
const T = (title, rows, cols, o = {}) => ({ type: 'table', title, rows, cols: C(cols), ...o })
const S = (items) => ({ type: 'stats', items })
const CH = (kind, title, data, keys) => ({ type: 'chart', kind, title, data, keys })
const A = (label, set, o = {}) => ({ label, set, ...o })
const F = (l, k, o = {}) => ({ l, k, ...o })
const P = { when: ['Pending'] }
const ORD = 'Order:oid|Customer:customer|Restaurant:restaurant|Partner:partner|Items:items|Amount:amount|Payment:payment|Placed:placed|Status:status:status'
const ordTable = (title, ...ss) => T(title, ss.length ? d.byStatus(...ss) : d.orders, ORD)
const approve = [A('Approve', { status: 'Approved' }, P), A('Reject', { status: 'Rejected' }, { ...P, danger: true })]
const verify = [A('Verify', { status: 'Verified' }, P), A('Reject', { status: 'Rejected' }, { ...P, danger: true })]
const pay = [A('Mark paid', { status: 'Paid' }, { when: ['Pending'] })]

export const modules = [
  { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard, subs: [
    { id: 'overview', label: 'Overview', blocks: [
      S([['Total Orders', '48,260', '+8.2%'], ['Revenue', '₹32.4L', '+12.5%'], ['Active Users', '12,840', '+4.1%'], ['Active Partners', '642', '-1.3%']]),
      CH('line', 'Orders this week', d.trend, ['orders']), CH('pie', 'Order status mix', d.mix) ] },
    { id: 'sales', label: 'Sales Analytics', blocks: [CH('bar', 'Monthly revenue (₹ lakh)', d.months, ['revenue', 'commission']), CH('bar', 'Revenue by restaurant (₹ thousand)', d.byRest, ['revenue'])] },
    { id: 'performance', label: 'Performance Charts', blocks: [CH('line', 'Orders vs revenue', d.trend, ['orders', 'revenue']), CH('line', 'Monthly orders (thousand)', d.months, ['orders'])] },
    { id: 'activities', label: 'Recent Activities', blocks: [T('Recent activities', d.activities, 'Event:event|By:by|Time:time')] },
    { id: 'peak', label: 'Peak Hours', blocks: [S([['Peak hour', '7 PM – 8 PM'], ['Busiest day', 'Saturday'], ['Avg orders / hour', '312'], ['Lowest hour', '3 PM']]), CH('bar', 'Orders by hour', d.peak, ['orders'])] },
  ] },
  { id: 'orders', label: 'Order Management', icon: ShoppingBag, subs: [
    { id: 'all', label: 'All Orders', blocks: [ordTable('All orders')] },
    { id: 'pending', label: 'Pending', blocks: [T('Pending orders', d.byStatus('Pending'), ORD, { actions: [A('Confirm', { status: 'Confirmed' }, P), A('Cancel', { status: 'Cancelled' }, { ...P, danger: true })] })] },
    { id: 'confirmed', label: 'Confirmed', blocks: [ordTable('Confirmed orders', 'Confirmed')] },
    { id: 'active', label: 'Active Deliveries', blocks: [ordTable('Active deliveries', 'Preparing', 'Out for Delivery')] },
    { id: 'delivered', label: 'Delivered', blocks: [ordTable('Delivered orders', 'Delivered')] },
    { id: 'cancelled', label: 'Cancelled', blocks: [ordTable('Cancelled orders', 'Cancelled')] },
    { id: 'details', label: 'Order Details', blocks: [{ type: 'order', mode: 'detail' }] },
    { id: 'tracking', label: 'Status Tracking', blocks: [{ type: 'order', mode: 'track' }] },
    { id: 'refunds', label: 'Refund Requests', blocks: [T('Refund requests', d.refunds, 'Order:oid|Customer:customer|Amount:amount|Reason:reason|Mode:mode|Date:date|Status:status:status', { actions: approve })] },
  ] },
  { id: 'restaurants', label: 'Restaurants & Menu', icon: Store, subs: [
    { id: 'list', label: 'Listing', blocks: [T('Restaurants', d.restaurants, 'Name:name|Owner:owner|Cuisine:cuisine|Area:area|Phone:phone|Rating:rating:stars|Status:status:status')] },
    { id: 'register', label: 'Registration', blocks: [T('Registered restaurants', d.restaurants.slice(0, 8), 'Name:name|Owner:owner|Cuisine:cuisine|Phone:phone|Status:status:status', { add: { label: 'Register restaurant', fields: [F('Restaurant name', 'name'), F('Owner', 'owner'), F('Cuisine', 'cuisine'), F('Area', 'area'), F('Phone', 'phone')] } })] },
    { id: 'approval', label: 'Approval', blocks: [T('Pending approvals', d.pendingRest, 'Name:name|Owner:owner|Cuisine:cuisine|Submitted:submitted|Status:status:status', { actions: approve })] },
    { id: 'verification', label: 'Verification', blocks: [T('Document verification (FSSAI, GST, PAN)', d.docs(d.REST, ['FSSAI License', 'GST Certificate', 'PAN Card', 'Bank Proof']), 'Restaurant:name|Document:doc|Submitted:submitted|Status:status:status', { actions: verify })] },
    { id: 'menu', label: 'Menu Management', blocks: [T('Menu items', d.menu, 'Item:item|Restaurant:restaurant|Category:category|Price (₹):price|Available:available:bool', { filterKey: 'category', add: { label: 'Add item', fields: [F('Item', 'item'), F('Restaurant', 'restaurant', { o: d.REST }), F('Category', 'category'), F('Price', 'price', { t: 'number' })] } })] },
    { id: 'categories', label: 'Food Categories', blocks: [T('Food categories', d.categories, 'Category:name|Items:items|Status:status:status', { add: { label: 'Add category', fields: [F('Category name', 'name')] } })] },
    { id: 'pricing', label: 'Pricing', blocks: [T('Edit prices', d.menu.slice(0, 15), 'Item:item|Restaurant:restaurant|Price (₹):price:input', { filterKey: 'restaurant' })] },
    { id: 'availability', label: 'Availability', blocks: [T('Item availability', d.menu.slice(0, 15), 'Item:item|Restaurant:restaurant|Available:available:toggle', { filterKey: 'restaurant' })] },
    { id: 'hours', label: 'Operating Hours', blocks: [T('Operating hours', d.hours, 'Day:day|Opens:opens:input|Closes:closes:input|Open:open:toggle')] },
    { id: 'ratings', label: 'Ratings', blocks: [T('Ratings overview', d.ratings, 'Restaurant:restaurant|Overall:rating:stars|Food:food:stars|Delivery:delivery:stars|Reviews:reviews', { filterKey: 'x' })] },
    { id: 'commission', label: 'Commission Settings', blocks: [T('Commission per restaurant (%)', d.restaurants.slice(0, 12), 'Restaurant:name|Cuisine:cuisine|Commission %:commission:input', { filterKey: 'cuisine' })] },
  ] },
  { id: 'partners', label: 'Delivery Partners', icon: Bike, subs: [
    { id: 'registration', label: 'Registration', blocks: [T('Partners', d.partners, 'Name:name|Phone:phone|Vehicle:vehicle|Zone:zone|Deliveries:deliveries', { filterKey: 'vehicle', add: { label: 'Register partner', fields: [F('Name', 'name'), F('Phone', 'phone'), F('Vehicle', 'vehicle', { o: ['Bike', 'Scooter', 'Cycle'] }), F('Zone', 'zone')] } })] },
    { id: 'documents', label: 'Document Verification', blocks: [T('Partner documents', d.docs(d.PART, ['Driving License', 'Aadhaar', 'Vehicle RC', 'Insurance']), 'Partner:name|Document:doc|Submitted:submitted|Status:status:status', { actions: verify })] },
    { id: 'status', label: 'Online / Offline', blocks: [S([['Online', d.partners.filter((p) => p.online).length], ['Offline', d.partners.filter((p) => !p.online).length], ['Total', d.partners.length], ['Avg rating', '4.5']]), T('Availability', d.partners, 'Partner:name|Zone:zone|Vehicle:vehicle|Online:online:toggle', { filterKey: 'zone' })] },
    { id: 'assignment', label: 'Order Assignment', blocks: [T('Assign orders', d.assign, 'Order:oid|Restaurant:restaurant|Customer:customer|Partner:partner|Status:status:status', { actions: [A('Assign', { status: 'Assigned', partner: 'Ravi Kumar' }, { when: ['Unassigned'] })] })] },
    { id: 'tracking', label: 'Delivery Tracking', blocks: [T('Live deliveries', d.tracking, 'Order:oid|Partner:partner|Pickup:from|Drop:to|ETA:eta|Progress:progress:bar|Status:status:status')] },
    { id: 'history', label: 'Delivery History', blocks: [T('History', d.history, 'Order:oid|Partner:partner|Distance:distance|Earned:earned|Date:date|Status:status:status')] },
    { id: 'earnings', label: 'Earnings', blocks: [CH('bar', 'Weekly partner earnings (₹ thousand)', d.trend, ['revenue']), T('Earnings', d.partners, 'Partner:name|Deliveries:deliveries|Earnings:earnings', { filterKey: 'vehicle' })] },
    { id: 'performance', label: 'Performance', blocks: [T('Performance', d.partners, 'Partner:name|Rating:rating:stars|On-time %:onTime|Deliveries:deliveries', { filterKey: 'zone' })] },
  ] },
  { id: 'customers', label: 'Customers', icon: Users, subs: [
    { id: 'list', label: 'Listing', blocks: [T('Customers', d.customers, 'Name:name|Email:email|Orders:orders|Spent:spent|Joined:joined|Status:status:status')] },
    { id: 'profiles', label: 'Profiles', blocks: [{ type: 'profiles', rows: d.customers }] },
    { id: 'contact', label: 'Contact Info', blocks: [T('Contact information', d.customers, 'Name:name|Email:email|Phone:phone|City:city', { filterKey: 'city' })] },
    { id: 'orders', label: 'Order History', blocks: [T('Order history', d.orders, 'Order:oid|Customer:customer|Restaurant:restaurant|Amount:amount|Placed:placed|Status:status:status')] },
    { id: 'addresses', label: 'Addresses', blocks: [T('Saved addresses', d.addresses, 'Customer:customer|Label:label|Address:address|PIN:pin|Default:default:bool', { filterKey: 'label' })] },
    { id: 'refunds', label: 'Refund History', blocks: [T('Refund history', d.refunds, 'Order:oid|Customer:customer|Amount:amount|Reason:reason|Date:date|Status:status:status')] },
    { id: 'reviews', label: 'Reviews', blocks: [T('Customer reviews', d.reviews, 'Customer:customer|Restaurant:restaurant|Rating:rating:stars|Comment:comment|Date:date|Status:status:status', { actions: [A('Remove', { status: 'Removed' }, { when: ['Flagged'], danger: true })] })] },
    { id: 'complaints', label: 'Complaints', blocks: [T('Complaints', d.complaints, 'Ticket:ticket|Customer:customer|Subject:subject|Priority:priority:status|Date:date|Status:status:status', { actions: [A('Resolve', { status: 'Resolved' }, { when: ['Open', 'In Progress'] })] })] },
    { id: 'status', label: 'Account Status', blocks: [T('Account status', d.customers, 'Name:name|Email:email|Orders:orders|Status:status:status', { actions: [A('Block', { status: 'Blocked' }, { when: ['Active'], danger: true }), A('Activate', { status: 'Active' }, { when: ['Blocked'] })] })] },
  ] },
  { id: 'payments', label: 'Payments & Finance', icon: Wallet, subs: [
    { id: 'overview', label: 'Overview', blocks: [S([['Gross Revenue', '₹32.4L', '+12.5%'], ['Commission', '₹5.8L', '+9.1%'], ['Pending Payouts', '₹2.1L'], ['Failed Payments', '184', '-3.2%']]), CH('bar', 'Revenue vs commission (₹ lakh)', d.months, ['revenue', 'commission'])] },
    { id: 'transactions', label: 'Transactions', blocks: [T('Transactions', d.txns, 'Txn ID:txn|Order:oid|Customer:customer|Amount:amount|Method:method|Date:date|Status:status:status')] },
    { id: 'failed', label: 'Failed Payments', blocks: [T('Failed payments', d.failed, 'Txn ID:txn|Customer:customer|Amount:amount|Method:method|Reason:reason|Date:date', { actions: [A('Retry', { status: 'Pending' }, { when: ['Failed'] })] })] },
    { id: 'settlements', label: 'Restaurant Settlements', blocks: [T('Settlements', d.settlements, 'Restaurant:restaurant|Orders:orders|Gross:gross|Commission:commission|Net:net|Period:period|Status:status:status', { actions: pay })] },
    { id: 'payouts', label: 'Partner Payouts', blocks: [T('Partner payouts', d.payouts, 'Partner:partner|Deliveries:deliveries|Amount:amount|Period:period|Status:status:status', { actions: pay })] },
    { id: 'commissions', label: 'Platform Commissions', blocks: [T('Commissions', d.commissions, 'Restaurant:restaurant|Rate:rate|Orders:orders|Earned:earned|Month:month', { filterKey: 'month' })] },
    { id: 'refunds', label: 'Refunds', blocks: [T('Refunds', d.refunds, 'Order:oid|Customer:customer|Amount:amount|Mode:mode|Date:date|Status:status:status', { actions: approve })] },
    { id: 'taxes', label: 'Taxes', blocks: [T('Tax summary', d.taxes, 'Tax:type|Collected:collected|Filed:filed|Period:period|Status:status:status')] },
    { id: 'reports', label: 'Financial Reports', blocks: [CH('line', 'Revenue trend (₹ lakh)', d.months, ['revenue']), T('Reports', ['Monthly P&L', 'Settlement summary', 'GST report', 'Commission report', 'Refund report'].map((n, i) => ({ id: i, report: n, period: 'Oct 2026', format: 'PDF / CSV', status: 'Ready' })), 'Report:report|Period:period|Format:format|Status:status:status')] },
  ] },
  { id: 'offers', label: 'Offers & Promotions', icon: Percent, subs: [
    { id: 'offers', label: 'Offers', blocks: [T('Offers', d.offers, 'Offer:name|Type:type|Value:value|Min order:minOrder|Used:used|Expiry:expiry|Status:status:status', { add: { label: 'Create offer', fields: [F('Offer name', 'name'), F('Type', 'type', { o: ['Percentage', 'Flat', 'Free delivery'] }), F('Value', 'value'), F('Min order', 'minOrder'), F('Expiry', 'expiry', { t: 'date' })] }, actions: [A('Disable', { status: 'Expired' }, { when: ['Active'], danger: true })] })] },
    { id: 'campaigns', label: 'Discount Campaigns', blocks: [T('Campaigns', d.campaigns, 'Campaign:name|Budget:budget|Reach:reach|Start:start|End:end|Status:status:status', { add: { label: 'New campaign', fields: [F('Campaign name', 'name'), F('Budget', 'budget'), F('Start', 'start', { t: 'date' }), F('End', 'end', { t: 'date' })] } })] },
    { id: 'coupons', label: 'Coupon Codes', blocks: [T('Coupons', d.coupons, 'Code:code|Discount:discount|Min order:minOrder|Limit:limit|Used:used|Expiry:expiry|Status:status:status', { add: { label: 'Create coupon', fields: [F('Code', 'code'), F('Discount', 'discount'), F('Min order', 'minOrder'), F('Usage limit', 'limit', { t: 'number' }), F('Expiry', 'expiry', { t: 'date' })] } })] },
    { id: 'referrals', label: 'Referral Programs', blocks: [{ type: 'settings', title: 'Referral program', fields: [F('Enable referrals', 'on', { v: true }), F('Referrer reward (₹)', 'a', { v: '100' }), F('New user reward (₹)', 'b', { v: '50' }), F('Min first order (₹)', 'c', { v: '199' })] }, T('Referrals', d.referrals, 'Referrer:referrer|Referred:referred|Code:code|Reward:reward|Date:date|Status:status:status')] },
    { id: 'limits', label: 'Limits & Expiry', blocks: [T('Minimum order, usage limit & expiry', d.coupons.slice(0, 10), 'Code:code|Min order:minOrder:input|Usage limit:limit:input|Expiry:expiry:input|Status:status:status')] },
    { id: 'analytics', label: 'Campaign Analytics', blocks: [S([['Redemptions', '18,420', '+14%'], ['Discount given', '₹4.2L'], ['Revenue influenced', '₹21.6L', '+9%'], ['Conversion', '6.8%']]), CH('bar', 'Redemptions by campaign', d.campaigns.map((c) => ({ name: c.name, redemptions: c.redemptions })), ['redemptions'])] },
  ] },
  { id: 'support', label: 'Support & Settings', icon: LifeBuoy, subs: [
    { id: 'tickets', label: 'Support Tickets', blocks: [T('Tickets', d.tickets, 'Ticket:ticket|Customer:customer|Subject:subject|Priority:priority:status|Assignee:assignee|Date:date|Status:status:status', { actions: [A('Resolve', { status: 'Resolved' }, { when: ['Open', 'In Progress'] })] })] },
    { id: 'disputes', label: 'Disputes', blocks: [T('Disputes', d.disputes, 'Case:case|Order:oid|Between:between|Amount:amount|Date:date|Status:status:status', { actions: [A('Resolve', { status: 'Resolved' }, { when: ['Open', 'Under Review'] })] })] },
    { id: 'notifications', label: 'Notifications', blocks: [T('Notifications', d.notifications, 'Title:title|Audience:audience|Channel:channel|Date:sent|Status:status:status', { add: { label: 'Send notification', fields: [F('Title', 'title'), F('Audience', 'audience', { o: ['All users', 'Customers', 'Partners', 'Restaurants'] }), F('Channel', 'channel', { o: ['Push', 'Email', 'SMS'] })] } })] },
    { id: 'reports', label: 'Sales Reports', blocks: [CH('bar', 'Sales by restaurant (₹ thousand)', d.byRest, ['revenue']), CH('line', 'Daily sales', d.trend, ['revenue'])] },
    { id: 'zones', label: 'Delivery Zones', blocks: [T('Delivery zones', d.zones, 'Zone:zone|Radius:radius|Fee:fee|Partners:partners|Active:active:toggle', { filterKey: 'radius', add: { label: 'Add zone', fields: [F('Zone', 'zone'), F('Radius', 'radius'), F('Delivery fee', 'fee')] } })] },
    { id: 'pricing', label: 'Pricing Settings', blocks: [{ type: 'settings', title: 'Pricing settings', fields: [F('Base delivery fee (₹)', 'a', { v: '30' }), F('Per km charge (₹)', 'b', { v: '8' }), F('Platform fee (₹)', 'c', { v: '5' }), F('Food GST (%)', 'd', { v: '5' }), F('Surge pricing', 'e', { v: false }), F('Free delivery above (₹)', 'f', { v: '499' })] }] },
    { id: 'roles', label: 'Roles & Permissions', blocks: [{ type: 'perms', roles: d.roles, modules: ['Dash', 'Orders', 'Rest.', 'Partners', 'Cust.', 'Finance', 'Offers', 'Support'] }] },
    { id: 'platform', label: 'Platform Settings', blocks: [{ type: 'settings', title: 'Platform settings', fields: [F('Platform name', 'a', { v: 'FoodDash' }), F('Support email', 'b', { v: 'help@fooddash.com' }), F('Support phone', 'c', { v: '1800 123 4567' }), F('Currency', 'd', { v: 'INR (₹)' }), F('Maintenance mode', 'e', { v: false }), F('Allow COD', 'f', { v: true }), F('Auto-assign partners', 'g', { v: true })] }] },
    { id: 'audit', label: 'Audit Logs', blocks: [T('Audit logs', d.audit, 'Admin:admin|Action:action|Module:module|IP:ip|Time:time', { filterKey: 'module' })] },
  ] },
]

import frappe
from frappe import _

@frappe.whitelist()
def execute(filters=None):
	columns = [
		{
			"fieldname": "item_code",
			"label": '<i class="fa fa-barcode" style="color: blue;"></i> Item Code',
			"fieldtype": "Link",
			"options": "Item",
			"width": 150
		},
		{
			"fieldname": "item_name",
			"label": '<i class="fa fa-tag" style="color: green;"></i> Item Name',
			"fieldtype": "Data",
			"width": 200
		},
		{
			"fieldname": "quantity_sold",
			"label": '<i class="fa fa-shopping-cart" style="color: orange;"></i> Quantity Sold',
			"fieldtype": "Float",
			"width": 100
		},
		{
			"fieldname": "valuation_rate",
			"label": '<i class="fa fa-money" style="color: purple;"></i> Valuation Rate',
			"fieldtype": "Currency",
			"width": 150
		},
		{
			"fieldname": "selling_price",
			"label": '<i class="fa fa-money" style="color: black;"></i> Selling Price',
			"fieldtype": "Currency",
			"width": 150
		},
		{
			"fieldname": "total_revenue",
			"label": '<i class="fa fa-money" style="color: black;"></i> Total Revenue',
			"fieldtype": "Currency",
			"width": 150
		},
		{
			"fieldname": "gross_profit",
			"label": '<i class="fa fa-money" style="color: green;"></i> Gross Profit',
			"fieldtype": "Currency",
			"width": 150
		},
	]

	data = []

	# Get filters
	start_date = filters.get('start_date')
	end_date = filters.get('end_date')
	item_code = filters.get('item_code')
	item_group = filters.get('item_group')
	show_zero_sales = filters.get('show_zero_sales')

	# Initialize query conditions list
	conditions = []
	if start_date:
		conditions.append(f"si.posting_date >= '{start_date}'")
	if end_date:
		conditions.append(f"si.posting_date <= '{end_date}'")
	if item_code:
		conditions.append(f"si_item.item_code = '{item_code}'")
	if item_group:
		conditions.append(f"i.item_group = '{item_group}'")

	# Create condition string for the SQL
	condition_str = " AND ".join(conditions)

	# SQL Query to fetch the relevant data
	query = f"""
		SELECT
			si_item.item_code,
			i.item_name,
			SUM(si_item.qty) AS quantity_sold,
			i.valuation_rate AS valuation_rate,
			ip.price_list_rate AS selling_price,
			SUM(si_item.amount) AS total_revenue
		FROM
			`tabSales Invoice Item` si_item
		JOIN
			`tabSales Invoice` si ON si.name = si_item.parent
		JOIN
			`tabItem` i ON i.name = si_item.item_code
		JOIN
			`tabItem Price` ip ON ip.item_code = si_item.item_code AND ip.price_list = 'Standard Selling'
		WHERE
			{condition_str}
		GROUP BY
			si_item.item_code
		ORDER BY
			quantity_sold DESC
	"""

	# Execute the query
	results = frappe.db.sql(query, as_dict=True)

	# Calculating cost and profit
	for row in results:
		total_cost = row.quantity_sold * row.valuation_rate
		gross_profit = (row.selling_price * row.quantity_sold) - total_cost

		data.append({
			"item_code": row.item_code,
			"item_name": row.item_name,
			"quantity_sold": row.quantity_sold,
			"valuation_rate": row.valuation_rate,
			"selling_price": row.selling_price,
			"total_revenue": row.total_revenue,
			"gross_profit": gross_profit,
		})

	return columns, data
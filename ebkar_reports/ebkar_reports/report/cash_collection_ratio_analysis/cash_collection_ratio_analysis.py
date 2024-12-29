# Copyright (c) 2024, Asofi and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):
	# العمود
	columns = get_columns()
	# البيانات
	data = get_data(filters)
	return columns, data

def get_columns():
    return [
        {
            "fieldname": "account_name",
            "label": '<i class="fa fa-credit-card" style="color: blue;"></i> Account', 
            "fieldtype": "Link",
            "options": "Account",
            "width": 150
        },
        {
            "fieldname": "cash_collection_a",
            "label": '<i class="fa fa-arrow-up" style="color: green;"></i> <i class="fa fa-arrow-up" style="color: red;"></i> Cash collections (A)', 
            "fieldtype": "Float",
            "width": 200
        },
        {
            "fieldname": "account_ratio",
            "label": '<i class="fa fa-percent" style="color: orange;"></i> Ratio',  
            "fieldtype": "Float",
            "width": 100
        },
        {
            "fieldname": "ratio_value",
            "label": '<i class="fa fa-arrow-up" style="color: green;"></i> <i class="fa fa-arrow-up" style="color: red;"></i> Ratio Value', 
            "fieldtype": "Float",
            "width": 150
        },
        {
            "fieldname": "branch",
            "label": '<i class="fa fa-building" style="color: blue;"></i> Branch',
            "fieldtype": "Link",
            "options": "Branch",
            "width": 150
        }
    ]


def get_data(filters):
    conditions = []
    values = []

    # تحقق من الفلاتر المرسلة
    if filters.account:
        conditions.append("gl.account = %s")
        values.append(filters.account)
    if filters.start_date and filters.end_date:
        conditions.append("gl.posting_date BETWEEN %s AND %s")
        values.extend([filters.start_date, filters.end_date])

    # صياغة الشرط
    where_clause = " AND ".join(conditions)

    # استعلام الحسابات المطلوبة مع الفلاتر
    query = f"""
        SELECT
            gl.account AS account_name,
            acc.custom_ratio,
            SUM(gl.debit) - SUM(gl.credit) AS net_balance,
            br.branch
        FROM `tabGL Entry` gl
        LEFT JOIN `tabAccount` acc ON gl.account = acc.name
        LEFT JOIN `tabBranch` br ON gl.branch = br.name
        WHERE acc.custom_included_in_the_ratio = 1
        {f"AND {where_clause}" if where_clause else ""}
        GROUP BY gl.account, acc.custom_ratio, br.branch
    """

    accounts = frappe.db.sql(query, values, as_dict=1)

    # إعداد البيانات للتقرير
    data = []
    for account in accounts:
        # حساب القيمة
        ratio_value = (account.net_balance or 0) * (account.custom_ratio or 0)

        # إضافة البيانات للتقرير
        data.append({
            "account_name": account.account_name,
            "cash_collection_a": account.net_balance or 0,
            "account_ratio": account.custom_ratio or 0,
            "ratio_value": ratio_value,
            "branch": account.branch or "No Branch",
        })

    return data    
   
import frappe

def get_delivery_status(invoice):
    # جلب عناصر Delivery Note المرتبطة بالفاتورة
    delivery_note_items = frappe.get_all('Delivery Note Item', filters={'against_sales_invoice': invoice}, fields=['parent', 'docstatus'])
    
    # التحقق من حالة التسليم بناءً على `docstatus`
    if not delivery_note_items:
        return "Not Delivered"
    
    fully_delivered = all(item.docstatus == 1 for item in delivery_note_items)
    if fully_delivered:
        return "Fully Delivered"
    else:
        return "Partially Delivered"

def execute(filters=None):
    columns = [
        {"fieldname": "invoice_number", "label": '<i class="fa fa-file-invoice"></i> Invoice Number', "fieldtype": "Link", "options": "Sales Invoice", "width": 150},
        {"fieldname": "customer_name", "label": '<i class="fa fa-user"></i> Customer Name', "fieldtype": "Link", "options": "Customer", "width": 200},
        {"fieldname": "posting_date", "label": '<i class="fa fa-calendar"></i> Invoice Date', "fieldtype": "Date", "width": 100},
        {"fieldname": "total_amount", "label": '<i class="fa fa-money-bill-wave"></i> Total Amount', "fieldtype": "Float", "width": 150},
        {"fieldname": "delivery_status", "label": '<i class="fa fa-truck"></i> Delivery Status', "fieldtype": "Data", "width": 150}
    ]
    
    # إنشاء شرط استعلام (conditions) بناءً على الفلاتر
    conditions = "WHERE i.docstatus = 1 AND i.posting_date BETWEEN %(start_date)s AND %(end_date)s"
    if filters.get('Customer'):
        conditions += " AND i.customer = %(Customer)s"
    
    # استعلام SQL لجلب بيانات الفواتير
    data = frappe.db.sql("""
        SELECT
            i.name AS invoice_number,
            i.customer AS customer_name,
            i.posting_date,
            i.grand_total AS total_amount
        FROM
            `tabSales Invoice` i
        {conditions}
    """.format(conditions=conditions), filters, as_dict=True)
    
    # تحديد حالة التسليم لكل فاتورة
    for row in data:
        row['delivery_status'] = get_delivery_status(row['invoice_number'])
    
    return columns, data
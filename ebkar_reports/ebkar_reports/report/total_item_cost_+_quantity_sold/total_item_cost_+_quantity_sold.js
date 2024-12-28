// Copyright (c) 2024, Asofi and contributors
// For license information, please see license.txt

frappe.query_reports["Total Item Cost + Quantity Sold"] = {
    "filters": [
        {
            "fieldname": "start_date",
            "label": __("Start Date"),
            "fieldtype": "Date",
            "reqd": 1,
			"default": frappe.datetime.month_start()

        },
        {
            "fieldname": "end_date",
            "label": __("End Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.month_end() 
        },
        {
            "fieldname": "item_code",
            "label": __("Item Code"),
            "fieldtype": "Link",
            "options": "Item",
            "default": "",
            "reqd": 0
        },
        {
            "fieldname": "item_group",
            "label": __("Item Group"),
            "fieldtype": "Link",
            "options": "Item Group",
            "default": "",
            "reqd": 0
        },
        {
            "fieldname": "show_zero_sales",
            "label": __("Show Items with Zero Sales"),
            "fieldtype": "Check",
            "default": 0
        }
    ],
	formatter: function(value, row, column, data) {
		let iconHTML = '';
		let color = 'black'; // اللون الافتراضي
	
		switch (column.fieldname) {
			case "item_code":
				iconHTML = `<i class="fa fa-barcode" style="color: blue;"></i>`;
				break;
			case "item_name":
				iconHTML = `<i class="fa fa-tag" style="color: green;"></i>`;
				break;
			case "quantity_sold":
				iconHTML = `<i class="fa fa-shopping-cart" style="color: orange;"></i>`;
				break;
			case "valuation_rate":
				iconHTML = `<i class="fa fa-money" style="color: purple;"></i>`;
				break;
			case "selling_price":
				iconHTML = `<i class="fa fa-money" style="color: black;"></i>`;
				break;
			case "total_revenue":
				iconHTML = `<i class="fa fa-money" style="color: black;"></i>`;
				break;
			case "gross_profit":
				color = value < 0 ? 'red' : 'green'; // أحمر إذا سالبة، أخضر إذا موجبة
				iconHTML = `<i class="fa fa-money" style="color: ${color};"></i>`;
				break;
			default:
				return value; // إرجاع القيمة الأصلية إذا لم يتم العثور على الحالة
		}
	
		// إضافة لون النص بجانب الأيقونة
		return `<span style="color: ${color};">${iconHTML} ${value}</span>`;
	},

    onload: function(report) {
        report.page.set_title(__("Total Item Cost + Quantity Sold"));
        
        report.filters.forEach(function(filter) {
            filter.input.on('change', function() {
                if (filter.fieldname === "start_date" || filter.fieldname === "end_date") {
                    let start_date = report.get_filter_value('start_date');
                    let end_date = report.get_filter_value('end_date');
                    
                    if (start_date && end_date && start_date > end_date) {
                        frappe.msgprint(__('Start Date cannot be greater than End Date'));
                    }
                }
            });
        });
    },
};

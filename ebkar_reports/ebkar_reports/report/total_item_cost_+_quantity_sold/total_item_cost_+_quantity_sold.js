// Copyright (c) 2024, Asofi and contributors
// For license information, please see license.txt

frappe.query_reports["Total Item Cost + Quantity Sold"] = {
    "filters": [
        {
            "fieldname": "start_date",
            "label": __("Start Date"),
            "fieldtype": "Date",
            "reqd": 1,
			"default": frappe.datetime.month_start() // أول يوم من الشهر الحالي

        },
        {
            "fieldname": "end_date",
            "label": __("End Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.month_end() // آخر يوم من الشهر الحالي
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
    onload: function(report) {
        // report.page.set_title(__("Total Item Cost + Quantity Sold"));
        
        // // إضافة رسائل تحقق من صحة الفلاتر
        // report.filters.forEach(function(filter) {
        //     filter.input.on('change', function() {
        //         if (filter.fieldname === "start_date" || filter.fieldname === "end_date") {
        //             let start_date = report.get_filter_value('start_date');
        //             let end_date = report.get_filter_value('end_date');
                    
        //             if (start_date && end_date && start_date > end_date) {
        //                 frappe.msgprint(__('Start Date cannot be greater than End Date'));
        //             }
        //         }
        //     });
        // });
	},
};

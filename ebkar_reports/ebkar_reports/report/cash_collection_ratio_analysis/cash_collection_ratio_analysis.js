// Copyright (c) 2024, Asofi and contributors
// For license information, please see license.txt
/* eslint-disable */
frappe.query_reports["Cash Collection Ratio Analysis"] = {
    "filters": [
        {
            "fieldname": "account",
            "label": __("Account"),
            "fieldtype": "Link",
            "options": "Account",
            "default": "",
            "reqd": 0
        },
        {
            "fieldname": "start_date",
            "label": __("Start Date"),
            "fieldtype": "Date",
            "reqd": 1
        },
        {
            "fieldname": "end_date",
            "label": __("End Date"),
            "fieldtype": "Date",
            "reqd": 1
        }
    ],
	"formatter": function(value, row, column, data) {
        let iconHTML = '';
        let color = 'black'; // اللون الافتراضي

        switch (column.fieldname) {
            case "cash_collection_a":
                // تنسيق لعرض الأيقونة بناءً على القيمة
                iconHTML = value < 0 ? `<i class="fa fa-arrow-down" style="color: red;"></i>` : `<i class="fa fa-arrow-up" style="color: green;"></i>`;
                break;
			case "account_name":
                iconHTML = `<i class="fa fa-credit-card" style="color: blue;"></i>`;
                break;				
            case "account_ratio":
                // تنسيق لعرض النسبة مع تغيير اللون بناءً على القيمة
                color = value > 1 ? 'green' : value < 1 ? 'red' : 'black';
                iconHTML = `<i class="fa fa-percent" style="color: ${color};"></i>`;
                break;
            case "ratio_value":
                // تنسيق لعرض القيمة بناءً على النتيجة
                color = value < 0 ? 'red' : 'green';
                iconHTML = value < 0 ? `<i class="fa fa-arrow-down" style="color: red;"></i>` : `<i class="fa fa-arrow-up" style="color: green;"></i>`;
                break;
            case "branch":
                // تنسيق لعرض الفرع
                iconHTML = `<i class="fa fa-building" style="color: blue;"></i>`;
                break;
            default:
                return value; // إرجاع القيمة الأصلية إذا لم يتم العثور على الحالة
        }

        // إضافة اللون بجانب الأيقونة
        return `<span style="color: ${color};">${iconHTML} ${value}</span>`;
    }
};
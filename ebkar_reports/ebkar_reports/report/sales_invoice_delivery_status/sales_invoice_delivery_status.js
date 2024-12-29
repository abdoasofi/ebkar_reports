frappe.query_reports["Sales Invoice Delivery Status"] = {
    "filters": [
        {
            "fieldname": "Customer",
            "label": __("Customer"),
            "fieldtype": "Link",
            "options": "Customer",
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
            case "invoice_number":
                iconHTML = `<i class="fa fa-file-invoice" style="color: blue;"></i>`; // أيقونة فاتورة
                break;
            case "customer_name":
                iconHTML = `<i class="fa fa-user" style="color: green;"></i>`; // أيقونة مستخدم
                break;
            case "total_amount":
                // إضافة الأيقونة بناءً على القيمة
                iconHTML = value < 0 
                    ? `<i class="fa fa-arrow-down" style="color: red;"></i>` 
                    : `<i class="fa fa-arrow-up" style="color: green;"></i>`;
                break;
            case "delivery_status":
                // إضافة أيقونات حالة التسليم
                if (value === "Fully Delivered") {
                    iconHTML = `<i class="fa fa-check-circle" style="color: green;"></i> Fully Delivered`;
                } else if (value === "Partially Delivered") {
                    iconHTML = `<i class="fa fa-exclamation-circle" style="color: orange;"></i> Partially Delivered`;
                } else {
                    iconHTML = `<i class="fa fa-times-circle" style="color: red;"></i> Not Delivered`;
                }
                break;
            default:
                return value; // إرجاع القيمة الأصلية إذا لم يتم العثور على الحالة
        }

        // إضافة اللون بجانب الأيقونة
        return `<span style="color: ${color};">${iconHTML} ${value}</span>`;
    },

    onload: function(report) {
        report.fields_dict['delivery_status'].formatter = function(value, row, column, data, default_formatter) {
            let iconHTML = '';
            let color = 'black'; // اللون الافتراضي

            // تخصيص الأيقونات بناءً على القيمة
            switch (column.fieldname) {
                case "delivery_status":
                    if (value === "Fully Delivered") {
                        iconHTML = `<i class="fa fa-check-circle" style="color: green;"></i> Fully Delivered`;
                    } else if (value === "Partially Delivered") {
                        iconHTML = `<i class="fa fa-exclamation-circle" style="color: orange;"></i> Partially Delivered`;
                    } else {
                        iconHTML = `<i class="fa fa-times-circle" style="color: red;"></i> Not Delivered`;
                    }
                    break;
                case "total_amount":
                    iconHTML = value < 0 ? `<i class="fa fa-arrow-down" style="color: red;"></i>` : `<i class="fa fa-arrow-up" style="color: green;"></i>`;
                    break;
                default:
                    return value; // إرجاع القيمة الأصلية إذا لم يتم العثور على الحالة
            }

            // إضافة الأيقونة واللون المناسبين
            return `<span style="color: ${color};">${iconHTML}</span>`;
        };
    }
};
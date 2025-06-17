import frappe
from frappe import _
import json
from frappe.utils import now

@frappe.whitelist()
def get_latest_locations():
    result = frappe.db.sql("""
        SELECT user as 'rider', last_latitude as 'lat', last_longitude as 'lng', MAX(last_updated) as timestamp
        FROM `tabRider`
        GROUP BY user
    """, as_dict=True)
    return result

def update_location(sid, msg):
    try:
        data = json.loads(msg)
        # rider = data.get("rider")
        lat = float(data.get("lat"))
        lng = float(data.get("lng"))

        # Optional: validate user/rider
        # if not rider:
        #     return

        doc = frappe.get_doc({
            "doctype": "Rider",
            # "user": rider,
            "last_latitude": lat,
            "last_longitude": lng,
            "last_updated": now()
        })
        doc.insert(ignore_permissions=True)
    except Exception as e:
        frappe.logger().error(f"[Socket] Error in update_location: {e}")

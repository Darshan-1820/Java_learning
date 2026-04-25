# PMS — Friend's Hotel Requirements (Raw)

*Date: 2026-04-26*
*Source: Darshan's friend (hotel owner's family member)*

---

## Context
- Family-owned business (friend doesn't run it directly)
- Single hotel, stay only — NO restaurant
- Medium level hotel
- Unknown current PMS (may be paying ~₹30K/month or similar)
- Friend is the tech-aware family member exploring options

---

## Requirements (As Stated)

1. **Room Management**
2. **Staff Management**
3. **Booking Management**
   - a. Online bookings
   - b. Walk-in bookings
4. **Partner Bookings**
   - MakeMyTrip integration
   - GoIbibo integration
5. **Payroll Management**
6. **Expense Management**
7. **Invoices**
   - Flexibility to select any product
   - GST slab should NOT be fixed — allow user to select slab
   - Discount options:
     - Product-wise discount
     - Invoice-level (total amount) discount
     - Discount in percentage OR fixed amount
     - Capability to select any option
8. **Booking Engine** (guest-facing)
9. **FAQs**

---

## Analysis Notes

### What's Core PMS:
- Room Management, Booking Management, Booking Engine, Invoices, FAQs

### What's Beyond PMS (ERP territory):
- Staff Management, Payroll Management, Expense Management

### What's High Complexity:
- Partner Bookings (OTA API integrations — MakeMyTrip, GoIbibo have specific partner programs)
- Payroll (PF, ESI, TDS, attendance, Indian labor compliance)
- Invoice GST flexibility (multiple slabs, product-wise selection)

### What's Low Complexity:
- FAQs (static content or simple CMS)
- Room Management (CRUD with status tracking)

---

*Raw requirements. Strategic scoping in discussion.*

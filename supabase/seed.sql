-- ==============================================================================
-- Seed Data for Business Management Platform
-- Run this in Supabase SQL Editor to populate sample products, suppliers,
-- customers, employees, finance records, and sales.
-- ==============================================================================

-- 1. Insert Sample Suppliers
INSERT INTO public.suppliers (id, name, contact_name, phone, email, address)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'Apex Hardware Ltd', 'Vikram Malhotra', '+91 98100 12345', 'sales@apexhardware.in', 'Plot 42, Okhla Ind Area, New Delhi'),
    ('11111111-1111-1111-1111-111111111102', 'PrintTek Paper Mills', 'Sanjay Gupta', '+91 98200 23456', 'orders@printtek.com', 'Sector 18, Gurugram, Haryana'),
    ('11111111-1111-1111-1111-111111111103', 'OmniPOS Devices Co', 'Meera Nair', '+91 98300 34567', 'meera@omnipos.co', 'Electronic City, Bengaluru, Karnataka')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Sample Products
INSERT INTO public.products (id, name, sku, category, selling_price, purchase_price, stock_quantity, minimum_stock, supplier_id)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'Wireless Barcode Scanner', 'WBS-102', 'POS Hardware', 4500.00, 3100.00, 3, 10, '11111111-1111-1111-1111-111111111103'),
    ('22222222-2222-2222-2222-222222222202', 'Thermal Receipt Paper (80mm x 50m)', 'TRR-080', 'Supplies', 120.00, 65.00, 4, 25, '11111111-1111-1111-1111-111111111102'),
    ('22222222-2222-2222-2222-222222222203', 'USB POS Interface Cable', 'CBL-USB-01', 'Accessories', 350.00, 140.00, 2, 8, '11111111-1111-1111-1111-111111111101'),
    ('22222222-2222-2222-2222-222222222204', 'Electronic Cash Drawer 24V', 'ECD-024', 'POS Hardware', 3200.00, 2100.00, 14, 5, '11111111-1111-1111-1111-111111111101'),
    ('22222222-2222-2222-2222-222222222205', 'Thermal Desktop Label Printer', 'TDL-400', 'POS Hardware', 11500.00, 8200.00, 8, 4, '11111111-1111-1111-1111-111111111103'),
    ('22222222-2222-2222-2222-222222222206', 'Bluetooth Mobile Card Swiper', 'BCS-050', 'POS Hardware', 2800.00, 1850.00, 12, 6, '11111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Sample Customers
INSERT INTO public.customers (id, name, phone, email, category, notes)
VALUES
    ('33333333-3333-3333-3333-333333333301', 'Acme Retailers Pvt Ltd', '+91 98765 43210', 'orders@acmeretail.com', 'high_value', 'Key wholesale buyer, purchases bi-weekly'),
    ('33333333-3333-3333-3333-333333333302', 'Rahul Sharma', '+91 98111 22334', 'rahul.s@gmail.com', 'regular', 'Walk-in retail client'),
    ('33333333-3333-3333-3333-333333333303', 'Priya Traders', '+91 97222 33445', 'contact@priyatraders.in', 'regular', 'Purchases thermal paper monthly in bulk'),
    ('33333333-3333-3333-3333-333333333304', 'Metro Store 14', '+91 99000 11223', 'mgr14@metro.in', 'at_risk', 'No repeat purchases in 45 days')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Sample Employees
INSERT INTO public.employees (id, name, email, phone, position, salary, joining_date, status)
VALUES
    ('44444444-4444-4444-4444-444444444401', 'Vikram Joshi', 'vikram@business.com', '+91 91234 56789', 'Store Manager', 38000.00, '2025-03-15', 'active'),
    ('44444444-4444-4444-4444-444444444402', 'Sunita Mehra', 'sunita@business.com', '+91 92345 67890', 'Sales Associate', 22000.00, '2025-06-01', 'active'),
    ('44444444-4444-4444-4444-444444444403', 'Amit Verma', 'amit@business.com', '+91 93456 78901', 'Inventory Clerk', 20000.00, '2025-08-10', 'active'),
    ('44444444-4444-4444-4444-444444444404', 'Ritu Sen', 'ritu@business.com', '+91 94567 89012', 'Accounts Assistant', 25000.00, '2025-11-20', 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Sample Attendance (Today)
INSERT INTO public.attendance (employee_id, date, status, check_in, check_out)
VALUES
    ('44444444-4444-4444-4444-444444444401', CURRENT_DATE, 'present', '09:00:00', '18:00:00'),
    ('44444444-4444-4444-4444-444444444402', CURRENT_DATE, 'present', '09:15:00', '18:15:00'),
    ('44444444-4444-4444-4444-444444444403', CURRENT_DATE, 'late', '09:45:00', NULL),
    ('44444444-4444-4444-4444-444444444404', CURRENT_DATE, 'half_day', '09:00:00', '13:30:00')
ON CONFLICT (employee_id, date) DO NOTHING;

-- 6. Insert Sample Income & Expenses
INSERT INTO public.income (category, amount, description, date)
VALUES
    ('Product Sales', 14500.00, 'Acme Retailers batch POS devices', CURRENT_DATE),
    ('Services', 2500.00, 'On-site installation and configuration fee', CURRENT_DATE - INTERVAL '1 day'),
    ('Product Sales', 8900.00, 'Thermal printer and paper bundle', CURRENT_DATE - INTERVAL '2 days'),
    ('Product Sales', 22100.00, 'Full POS counter hardware setup', CURRENT_DATE - INTERVAL '3 days');

INSERT INTO public.expenses (category, amount, description, date)
VALUES
    ('Inventory Supply', 4200.00, 'Wholesale paper restock invoice', CURRENT_DATE - INTERVAL '1 day'),
    ('Utilities', 3150.00, 'Store electricity and broadband bill', CURRENT_DATE - INTERVAL '2 days'),
    ('Salaries', 28000.00, 'Monthly store staff advance payout', CURRENT_DATE - INTERVAL '4 days'),
    ('Marketing', 1800.00, 'Local retail catalog printing', CURRENT_DATE - INTERVAL '5 days');

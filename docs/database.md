# Database Plan

This is the initial database plan. Keep it simple and expand only when implementation requires it.

## 1. profiles

Stores application user information.

Fields:
- id
- full_name
- email
- role
- created_at
- updated_at

Roles:
- owner
- manager
- employee
- admin

---

## 2. products

Fields:
- id
- name
- sku
- category
- selling_price
- purchase_price
- stock_quantity
- minimum_stock
- supplier_id
- created_at
- updated_at

---

## 3. suppliers

Fields:
- id
- name
- contact_name
- phone
- email
- address
- created_at

---

## 4. customers

Fields:
- id
- name
- phone
- email
- category
- notes
- created_at

Customer categories can initially be:
- regular
- high_value
- at_risk

Do not build complicated automatic segmentation unless required.

---

## 5. employees

Fields:
- id
- name
- email
- phone
- position
- salary
- joining_date
- status
- created_at

---

## 6. attendance

Fields:
- id
- employee_id
- date
- status
- check_in
- check_out
- created_at

---

## 7. sales

Fields:
- id
- customer_id
- created_by
- subtotal
- discount
- total_amount
- payment_status
- payment_method
- created_at

---

## 8. sale_items

Fields:
- id
- sale_id
- product_id
- quantity
- unit_price
- total
- created_at

---

## 9. income

Fields:
- id
- category
- amount
- description
- date
- created_by
- created_at

---

## 10. expenses

Fields:
- id
- category
- amount
- description
- date
- created_by
- created_at

---

## 11. stock_movements

Fields:
- id
- product_id
- type
- quantity
- reference_id
- notes
- created_by
- created_at

Types:
- stock_in
- stock_out
- adjustment

## Relationships

profiles
→ sales

customers
→ sales

sales
→ sale_items

products
→ sale_items

products
→ stock_movements

suppliers
→ products

employees
→ attendance

## Important Database Rules

- Use UUID primary keys.
- Use foreign keys.
- Add indexes only where useful.
- Use RLS.
- Never expose the service role key.
- Keep database calculations authoritative.
- Avoid storing values that can be safely calculated unless there is a clear reason.

This schema is intentionally simple for the college-project scope.

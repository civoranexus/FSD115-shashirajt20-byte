## Entity Relationship Diagram (ER Diagram)

The ER diagram represents the relationships between users, products, orders, and payments.

- A user can place multiple orders.
- A seller can list multiple products.
- Each order contains multiple products through order_items.
- Each order is associated with a single payment.
- Products are grouped under categories.



USER
 ├── id (PK)
 ├── name
 ├── email
 └── role
   |
   | 1
   |
   |─────────────── places ────────────────
   |                                       |
   |                                       | N
 ORDER                                PRODUCT
 ├── id (PK)                           ├── id (PK)
 ├── user_id (FK)                      ├── title
 ├── total_amount                      ├── price
 └── status                            ├── stock
                                       ├── category_id (FK)
                                       └── seller_id (FK → USER)

ORDER
  |
  | 1
  |
  |──────── contains ──────── N
  |
ORDER_ITEMS
 ├── id (PK)
 ├── order_id (FK)
 ├── product_id (FK)
 ├── quantity
 └── price


CATEGORY
 ├── id (PK)
 └── name
   |
   | 1
   |
   |────────────── has ─────────────── N
   |
 PRODUCT


ORDER
  |
  | 1
  |
  |────────────── paid by ─────────────── 1
  |
PAYMENT
 ├── id (PK)
 ├── order_id (FK)
 ├── payment_method
 └── payment_status

User, Product, Order, Payment tables are designed
with proper primary and foreign key relationships.


users
-----
id (PK)
name
email (unique)
password
role (user / admin / seller)
created_at
updated_at


categories
----------
id (PK)
name
description
created_at


products
--------
id (PK)
title
description
price
stock_quantity
category_id (FK)
seller_id (FK → users.id)
created_at
updated_at


orders
------
id (PK)
user_id (FK → users.id)
total_amount
order_status (pending / completed / cancelled)
created_at


order_items
-----------
id (PK)
order_id (FK → orders.id)
product_id (FK → products.id)
quantity
price


payments
--------
id (PK)
order_id (FK → orders.id)
payment_method
payment_status
transaction_id
created_at


User → Orders        (1 to Many)
Category → Products (1 to Many)
User → Products     (1 to Many) [Seller]
Orders → OrderItems (1 to Many)
Products → OrderItems (1 to Many)
Orders → Payments   (1 to 1)


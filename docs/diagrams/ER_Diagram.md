# ER Diagram (Entity-Relationship)

![ER Diagram](./er_diagram.png)

<details>
<summary>View Mermaid Code</summary>

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ ADDRESS : has
    USER ||--o{ CART : owns
    
    PRODUCT ||--o{ CART_ITEM : "included in"
    PRODUCT ||--o{ ORDER_ITEM : "ordered as"
    PRODUCT }|--|| CATEGORY : belongs_to
    
    CART ||--o{ CART_ITEM : contains
    
    ORDER ||--o{ ORDER_ITEM : includes
    ORDER ||--|| PAYMENT : "paid by"
    ORDER ||--|| SHIPMENT : "fulfilled by"

    USER {
        string id PK
        string email
        string password
        string name
        string role
    }

    PRODUCT {
        string id PK
        string name
        string description
        float price
        int stock_quantity
        string category_id FK
    }

    ORDER {
        string id PK
        string user_id FK
        datetime order_date
        float total_amount
        string status
    }

    ORDER_ITEM {
        string id PK
        string order_id FK
        string product_id FK
        int quantity
        float unit_price
    }

    CART {
        string id PK
        string user_id FK
    }

    PAYMENT {
        string id PK
        string order_id FK
        string payment_method
        string status
        string transaction_id
    }
```
</details>

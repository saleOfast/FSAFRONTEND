enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS'
}

enum OrderStatus {
    ORDERSAVED = 'ORDER_SAVED',
    ORDERPLACED = 'ORDER_PLACED',
    SHIPPED = 'SHIPPED',
    OUTFORDELIVERY = 'OUT_FOR_DELIVERY', 
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum SpecialDiscountStatus {
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
    PENDING = 'PENDING'
}


export {
    PaymentStatus,
    OrderStatus
}
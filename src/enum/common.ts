enum UserRole {
    ADMIN = "ADMIN",
    DIRECTOR = "DIRECTOR",
    RSM = "RSM",
    ASM = "ASM",
    SO = "SO",
    SSM = "SSM",
    MANAGER = "MANAGER",
    DISTRIBUTOR = "DISTRIBUTOR",
    RETAILER = "RETAILER",
    SUPER_ADMIN = "SUPER_ADMIN",
    CHANNEL = "CHANNEL"
}

enum GetUserRole {
    ADMIN = "Admin",
    DIRECTOR = "Sales Director",
    RSM = "Regional Sales Manager",
    ASM = "Area Sales Manager",
    SO = "Sales Officer",
    SSM = "Medical Representative",
    MANAGER = "Sales Manager",
    DISTRIBUTOR = "Distributor",
    RETAILER = "Retailer",
    SUPER_ADMIN = "Super Admin",
     CHANNEL = "Channel"
}

enum GetUserRoleById {
    ADMIN = "da693r1",
    SSM = "da693r2",
    MANAGER = "da693r3",
    RSM = "da693r4",
    DIRECTOR = "da693r5",
    RETAILER = "da693r6",
    DISTRIBUTOR = "da693r7",
    CHANNEL = "da693r8"
}

enum GetFeatureService {
    Retailer = "Retailer",
    FSA = "FSA",
    DMS = "DMS", 
}

enum DurationEnum {
    ALL = 'ALL',
    TODAY = 'TODAY',
    WEEK = 'WEEK'
}

enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    VALUE = "VALUE"
}

enum TimelineEnum {
    TODAY = 'TODAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    YEAR = 'YEAR',
    QUARTER = 'QUARTER'
}

enum VisitTypeEnum {
    PHYSICAL = "PHYSICAL",
    TELEVISIT = "TELEVISIT",
    RETAILER_ORDER = "RETAILER_ORDER"
}

enum ExpenseReportClaimType {
    TA = 'TA',
    DA = 'DA',
}
export {
    UserRole,
    GetUserRole,
    DurationEnum,
    DiscountType,
    TimelineEnum,
    VisitTypeEnum,
    GetUserRoleById,
    GetFeatureService,
    ExpenseReportClaimType
}
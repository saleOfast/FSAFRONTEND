import { ExpenseReportClaimType } from "enum/common";
import * as Yup from "yup";

const loginSchema = Yup.object({
  phone: Yup
    .string()
    .required("Please Enter User Id"),
  // password: Yup.string().required("Please enter a  password"),
  password: Yup.string().required('Please enter your password')
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  //   "Must Contain atleast 4 Characters."
  // )
});

// const forgotPasswordSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Please enter your email address"),
// });
const forgotPasswordSchema = Yup.object({
  phone: Yup.string().required('Please Enter Phone no.'),
  dob: Yup.string().required('Please Enter Date of Birth'),
});

const resetPasswordSchema = Yup.object({
  password: Yup.string().required("Please enter new password"),
  confirmPassword: Yup.string()
  .required('Please enter confirm password')
  .oneOf([Yup.ref('password')], 'Passwords must match'),


});


const storeCategorySchema = Yup.object({
  categoryName: Yup.string().required('Please Enter Store Category Name')
});

const beatSchema = Yup.object({
  beatName: Yup.string().required('Please Enter Beat Name'),
  area: Yup.string().optional().nullable(),
  country: Yup.string().required('Please Enter Country'),
  state: Yup.string().required('Please Enter State'),
  district: Yup.string().required('Please Enter State'),
  city: Yup.string().optional().nullable(),
  store: Yup.array().required('Please Select Store'),
  salesRep: Yup.string().required('Please Select Sales Representative'),
  beatType: Yup.string().notRequired(),

});

const targetSchema = Yup.object({
  SSMId: Yup.string().required('Please Enter Sales Executive'),
  amountTarget: Yup.string().required('Please Enter Amount'),
  storeTarget: Yup.string().required('Please Select Store Count.')
});

const yearTarget = Yup.object({
  amountTarget: Yup.string().optional().nullable(),
});


const productSchema = Yup.object({
  productName: Yup.string().required('Please Enter Product Name'),
  mrp: Yup.string().required('Please Enter MRP'),
  rlp: Yup.string().required('Please Select RLP'),
  brandId: Yup.string().required('Please Select Brand'),
  categoryId: Yup.string().optional().nullable(),
  caseQty: Yup.string().required('Please Enter Case Quantity'),
  discountType: Yup.string().optional().nullable(),
  discountValue: Yup.string().optional().nullable(),
  isDiscountActive: Yup.string().optional().nullable(),
  isActive: Yup.string().optional().nullable(),
  isFocused: Yup.boolean().optional().nullable(),
});

const visitSchema = Yup.object({
  beat: Yup.string().required('Please Select Beat'),
  visitDate: Yup.string().required('Please Select Date'),
  emp_id: Yup.string().required('Please Select Sales Person'),
  store: Yup.array().required('Please Select Sales Person')
});

const productBrandSchema = Yup.object({
  name: Yup.string().required('Please Enter Brand Name')
});

const productCategorySchema = Yup.object({
  name: Yup.string().required('Please Enter Category Name'),
  parentId: Yup.string().optional().nullable(),
  
});

const updateCategorySchema = Yup.object({
  name: Yup.string().required('Please Update Category Name'),
  parentId: Yup.string().optional().nullable()

});


const updateBrandSchema = Yup.object({
  name: Yup.string().required('Please Update Brand Name')
});


const createStoreSchema = Yup.object({
  "storeName": Yup.string().required('Field required'),
  "uid": Yup.string().required('Field required'),
  "emp_id": Yup.string().optional().nullable(),
  "assignToRetailor": Yup.string().optional().nullable(),
  "storeType": Yup.string().required('Field required'),
  "lat": Yup.string().optional().nullable(),
  "long": Yup.string().optional().nullable(),
  "addressLine1": Yup.string().required('Field required'),
  "addressLine2": Yup.string().notRequired(),
  "townCity": Yup.string().notRequired(),
  "state": Yup.string().required('Field required'),
  "district": Yup.string().required('Field required'),
  "email": Yup.string().notRequired(),
  "pinCode": Yup.string().required('Field required').matches(/^[0-9]{6}$/, 'Pin Code must be exactly 6 digits and contain only numbers'),
  "ownerName": Yup.string().required('Field required'),
  "mobileNumber": Yup.string().required('Field required').matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits and contain only numbers'),
  "alterMobile":  Yup.string().notRequired(),
  "openingTime": Yup.string().required('Field required'),
  "closingTime": Yup.string().required('Field required'),
  "openingTimeAmPm": Yup.string().required('Field required'),
  "closingTimeAmPm": Yup.string().required('Field required'),
  "paymentMode": Yup.string().notRequired(),
  "isPremiumStore": Yup.boolean(),
  "isActive": Yup.boolean(),
  "beat": Yup.string().notRequired(),
  "flatDiscountType": Yup.string().optional().nullable(),
  "flatDiscountValue": Yup.string().optional().nullable(),
  "isActiveFlatDiscount": Yup.boolean().optional().nullable(),
  "visibilityDiscountType": Yup.string().optional().nullable(),
  "visibilityDiscountValue": Yup.string().optional().nullable(),
  "isActiveVisibilityDiscount": Yup.boolean().optional().nullable(),

})

const createNewUserSchema =(isUpdate:any) => Yup.object({
  "firstname": Yup.string().required('Field required'),
  "lastname": Yup.string().optional().nullable(),
  "email": Yup.string().optional().nullable(),
  "password": isUpdate ? Yup.string().optional(): Yup.string().required('Field required'),
  "address": Yup.string().optional().nullable(),
  "city": Yup.string().optional().nullable(),
  "state": Yup.string().optional().nullable(),
  "pincode": Yup.string().optional().nullable(),

  // "age": Yup.string().required('Field required'),
  "dob": Yup.string().optional(),

  "phone": Yup.string().required('Field required').matches(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
  // "zone": Yup.string().required('Field required'),
  "joining_date": Yup.string().required('Field required'),
  "managerId": Yup.string().required('Field required'),
  "role": Yup.string().required('Field required'),
  // "learningRole": Yup.string().required('Field required')
})

const addCourseSchema = Yup.object({
  courseName: Yup.string().required('Please Enter Course Name'),
  description: Yup.string().required('Please Enter Description'),
  isActive: Yup.string().required('Please Select'),
  dueDate: Yup.string().required('Please Enter Due Date'),
  // videoLink: Yup.string().required('Please Enter Video Link'),
  targetAudience: Yup.array().required('Please Enter target Audience'),
  quizDuration: Yup.string().required('Please Enter Quiz Duration'),
  launchedDate: Yup.string().required('Please Enter Launch Date'),
});


const addQuizSchema = Yup.object({
  question: Yup.string().required('Please Enter Question'),
  marks: Yup.string().required('Please Enter Marks'),
  answer: Yup.string().required('Please Select Answer'),
  option1: Yup.string().required('Please Enter Option'),
  option2: Yup.string().required('Please Enter Option'),
  option3: Yup.string().required('Please Enter Option'),
  option4: Yup.string().required('Please Enter Option'),
});

const noOrderReasonSchema = Yup.object({
  description: Yup.string().required('Please Enter Description')
});

const paymentModeSchema = Yup.object({
  name: Yup.string().required('Please Enter Payment Mode')
});

const colourSchema = Yup.object({
  name: Yup.string().required('Please Enter Colour Name')
});
const sizeSchema = Yup.object({
  name: Yup.string().required('Please Enter Size Name')
});
const featureSchema = Yup.object({
  name: Yup.string().required('Please Enter Feature Name'),
  status: Yup.boolean().required('Please Select Status')

});
const roleSchema = Yup.object({
  name: Yup.string().required('Please Enter Role Name')
});

// policy
const policyHeadSchema = Yup.object({
  policy_name: Yup.string().required('Please Enter Policy Name'),
  // is_travel: Yup.boolean().optional()
});

const policyTypesSchema = Yup.object({
  policy_type_name: Yup.string().optional(),
  claim_type: Yup.string().required('Please select a Claim Type'), 
  cost_per_km: Yup.string().optional(),
});

const applyExpenseSchema = Yup.object({
policy_name: Yup.string().required('Please select a Policy Name'),
total_expence: Yup.string().required("Please Enter Total Expense"),
kms: Yup.string().optional(),
from_location: Yup.string().optional(),
detail: Yup.string().optional(),
policy_type_id: Yup.string().optional(),
to_location: Yup.string().optional(),
from_date: Yup.string().optional(),
to_date: Yup.string().optional(),
document: Yup.string().optional(),


});

const applyExpTravelSchema = Yup.object({
  policy_name: Yup.string().required('Please select a Policy Name'),
  total_expence: Yup.string().required("Please Enter Total Expense"),
  kms: Yup.string().optional(),
  from_location: Yup.string().optional(),
  detail: Yup.string().optional(),
  policy_type_id: Yup.string().required("Please Select Policy Type"),
  to_location: Yup.string().optional(),
  from_date: Yup.string().optional(),
  to_date: Yup.string().optional(),
  document: Yup.string().optional(),
  });
  
  // is_travel: Yup.boolean().optional()
  const leaveHeadSchema = Yup.object({
    head_leave_name: Yup.string().optional(),
    head_leave_short_name: Yup.string().optional()

  });
  const leaveHeadCountSchema = Yup.object({
    financial_end: Yup.string().optional(),
    financial_start: Yup.string().optional(),
    head_leave_cnt_id: Yup.string().optional(),
    head_leave_code: Yup.string().optional(),
    head_leave_id: Yup.string().optional(),
    head_leave_name: Yup.string().optional(),
    total_head_leave: Yup.number().required("Please Enter Total Leaves")
  });

  // Leave Management
  const leaveApplication = Yup.object({
    left_leave: Yup.string().optional(),
    from_date: Yup.string().required('Please Select From Date'),
    to_date: Yup.string().required('Please Select To Date'),
    no_of_days: Yup.number().optional(),
    reason: Yup.string().required('Please Enter Reason'),
    leave_type: Yup.string().optional()
  
  });

  // holiday Management
  const holidaySchema = Yup.object({
    name: Yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Only letters are allowed") // Restrict numbers
        .required("Holiday name is required"),
    date: Yup.date().required('please enter date'),
    day: Yup.string().required('Please Enter day'),
  });

export {
  loginSchema,
  storeCategorySchema,
  beatSchema,
  productBrandSchema,
  createStoreSchema,
  updateBrandSchema,
  createNewUserSchema,
  visitSchema,
  productSchema,
  productCategorySchema,
  updateCategorySchema,
  addCourseSchema,
  addQuizSchema,
  targetSchema,
  yearTarget,
  forgotPasswordSchema,
  resetPasswordSchema,
  noOrderReasonSchema,
  colourSchema,
  sizeSchema,
  featureSchema,
  roleSchema,
  paymentModeSchema,
  policyHeadSchema,
  policyTypesSchema,
  applyExpenseSchema,
  applyExpTravelSchema,
  leaveHeadSchema,
  leaveHeadCountSchema,
  leaveApplication,
  holidaySchema
}
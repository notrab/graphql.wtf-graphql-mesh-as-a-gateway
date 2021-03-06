const { buildSchema, Source } = require('graphql');

const source = new Source(/* GraphQL */`
schema {
  query: Query
  mutation: Mutation
}

directive @cacheControl(maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | OBJECT | INTERFACE

type Query {
  """Use this to get a cart by a custom ID. If a cart doesn't exist with this ID, it will be created for you."""
  cart(id: ID!, currency: CurrencyInput): Cart
  node(id: ID!, currency: CurrencyInput): Node
}

input CurrencyInput {
  code: CurrencyCode
  symbol: String
  thousandsSeparator: String
  decimalSeparator: String
  decimalDigits: Int
}

enum CurrencyCode {
  AED
  AFN
  ALL
  AMD
  ANG
  AOA
  ARS
  AUD
  AWG
  AZN
  BAM
  BBD
  BDT
  BGN
  BHD
  BIF
  BMD
  BND
  BOB
  BRL
  BSD
  BTC
  BTN
  BWP
  BYR
  BZD
  CAD
  CDF
  CHF
  CLP
  CNY
  COP
  CRC
  CUC
  CUP
  CVE
  CZK
  DJF
  DKK
  DOP
  DZD
  EGP
  ERN
  ETB
  EUR
  FJD
  FKP
  GBP
  GEL
  GHS
  GIP
  GMD
  GNF
  GTQ
  GYD
  HKD
  HNL
  HRK
  HTG
  HUF
  IDR
  ILS
  INR
  IQD
  IRR
  ISK
  JMD
  JOD
  JPY
  KES
  KGS
  KHR
  KMF
  KPW
  KRW
  KWD
  KYD
  KZT
  LAK
  LBP
  LKR
  LRD
  LSL
  LYD
  MAD
  MDL
  MGA
  MKD
  MMK
  MNT
  MOP
  MRO
  MTL
  MUR
  MVR
  MWK
  MXN
  MYR
  MZN
  NAD
  NGN
  NIO
  NOK
  NPR
  NZD
  OMR
  PAB
  PEN
  PGK
  PHP
  PKR
  PLN
  PYG
  QAR
  RON
  RSD
  RUB
  RWF
  SAR
  SBD
  SCR
  SDD
  SDG
  SEK
  SGD
  SHP
  SLL
  SOS
  SRD
  STD
  SVC
  SYP
  SZL
  THB
  TJS
  TMT
  TND
  TOP
  TRY
  TTD
  TVD
  TWD
  TZS
  UAH
  UGX
  USD
  UYU
  UZS
  VEB
  VEF
  VND
  VUV
  WST
  XAF
  XCD
  XBT
  XOF
  XPF
  YER
  ZAR
  ZMW
  WON
}

"""Carts are the core concept of CartQL. Bring your own PIM and use CartQL to calculate your Cart and Checkout."""
type Cart implements Node {
  """A custom unique identifer for the cart provided by you."""
  id: ID!
  """The current currency details of the cart."""
  currency: Currency!
  """The customer for the cart"""
  email: String
  """The number of total items in the cart"""
  totalItems: Int
  """The number of total unique items in the cart."""
  totalUniqueItems: Int
  """The items currently in the cart."""
  items: [CartItem!]!
  """Sum of all SKU items, excluding discounts, taxes, shipping, including the raw/formatted amounts and currency details"""
  subTotal: Money!
  """The cart total for all items with type SHIPPING, including the raw/formatted amounts and currency details."""
  shippingTotal: Money!
  """The cart total for all items with type TAX, including the raw/formatted amounts and currency details."""
  taxTotal: Money!
  """The grand total for all items, including shipping, including the raw/formatted amounts and currency details."""
  grandTotal: Money!
  """A simple helper method to check if the cart is empty."""
  isEmpty: Boolean
  """A simple helper method to check if the cart hasn't been updated in the last 2 hours."""
  abandoned: Boolean
  """Custom key/value attributes array for the cart."""
  attributes: [CustomCartAttribute!]!
  """Custom meta object for the cart"""
  metadata: Json
  """Any notes related to the cart/checkout"""
  notes: String
  """The date and time the cart was created."""
  createdAt: Date!
  """The date and time the cart was updated."""
  updatedAt: Date!
}

interface Node {
  id: ID!
}

"""Cart and Cart Items use the currency object to format their unit/line totals."""
type Currency {
  """The currency code, e.g. USD, GBP, EUR"""
  code: CurrencyCode
  """The currency smybol, e.g. \$, ??, ???"""
  symbol: String
  """The thousand separator, e.g. ',', '.'"""
  thousandsSeparator: String
  """The decimal separator, e.g. '.'"""
  decimalSeparator: String
  """The decimal places for the currency"""
  decimalDigits: Int
}

"""A Cart Item is used to store data on the items inside the Cart. There are no strict rules about what you use the named fields for."""
type CartItem {
  """A custom unique identifer for the item provided by you."""
  id: ID!
  """Name for the item."""
  name: String
  """Description for the item."""
  description: String
  """The type of cart item this is."""
  type: CartItemType!
  """Array of image URLs for the item."""
  images: [String]
  """Unit total for the individual item."""
  unitTotal: Money!
  """Line total (quantity * unit price)."""
  lineTotal: Money!
  """Quantity for the item."""
  quantity: Int!
  """Custom key/value attributes array for the item."""
  attributes: [CustomCartAttribute!]!
  """Custom metadata for the item."""
  metadata: Json
  """The date and time the item was created."""
  createdAt: Date!
  """The date and time the item was updated."""
  updatedAt: Date!
}

"""Use these enums to group cart items. Cart totals will reflect these enums."""
enum CartItemType {
  SKU
  TAX
  SHIPPING
}

"""The Money type is used when describing the Cart and Cart Item unit/line totals."""
type Money {
  """The raw amount in cents/pence"""
  amount: Int
  """The current currency details of the money amount"""
  currency: Currency!
  """The formatted amount with the cart currency."""
  formatted: String!
}

"""Custom Cart Attributes are used for any type of custom data you want to store on a Cart. These are transferred to Orders when you checkout."""
type CustomCartAttribute {
  key: String!
  value: String
}

scalar Json

scalar Date

type Mutation {
  """Use this to add items to the cart. If the item already exists, the provided input will be merged and quantity will be increased."""
  addItem(input: AddToCartInput!): Cart!
  """Use this to set all the items at once in the cart. This will override any existing items."""
  setItems(input: SetCartItemsInput!): Cart!
  """Use this to update any existing items in the cart. If the item doesn't exist, it'll return an error."""
  updateItem(input: UpdateCartItemInput!): Cart!
  """Use this to increase the item quantity of the provided item ID. If the item doesn't exist, it'll throw an error."""
  incrementItemQuantity(input: UpdateItemQuantityInput!): Cart!
  """Use this to decrease the item quantity of the provided item ID. If the item doesn't exist, it'll throw an error."""
  decrementItemQuantity(input: UpdateItemQuantityInput!): Cart!
  """Use this to remove any items from the cart. If it doesn't exist, it'll throw an error."""
  removeItem(input: RemoveCartItemInput!): Cart!
  """Use this to empty the cart. If the cart doesn't exist, it'll throw an error."""
  emptyCart(input: EmptyCartInput!): Cart!
  """Use this to update the cart currency or metadata. If the cart doesn't exist, it'll throw an error."""
  updateCart(input: UpdateCartInput!): Cart!
  """Use this to delete a cart. If the cart doesn't exist, it'll throw an error."""
  deleteCart(input: DeleteCartInput!): DeletePayload!
  """Use this to convert a cart to an unpaid order."""
  checkout(input: CheckoutInput!): Order
}

input AddToCartInput {
  cartId: ID!
  id: ID!
  name: String
  description: String
  type: CartItemType = SKU
  images: [String]
  price: Int!
  currency: CurrencyInput
  quantity: Int = 1
  attributes: [CustomAttributeInput]
  metadata: Json
}

input CustomAttributeInput {
  key: String!
  value: String
}

input SetCartItemsInput {
  cartId: ID!
  items: [SetCartItemInput!]!
}

input SetCartItemInput {
  id: ID!
  name: String
  description: String
  type: CartItemType = SKU
  images: [String]
  price: Int!
  currency: CurrencyInput
  quantity: Int = 1
  attributes: [CustomAttributeInput]
  metadata: Json
}

input UpdateCartItemInput {
  cartId: ID!
  id: ID!
  name: String
  description: String
  type: CartItemType
  images: [String]
  price: Int
  quantity: Int
  metadata: Json
}

input UpdateItemQuantityInput {
  """The ID of the Cart in which the CartItem belongs to."""
  cartId: ID!
  """The ID of the CartItem you wish to update."""
  id: ID!
  """The amount (as Int) you wish to increment the Cart item quantity by."""
  by: Int!
}

input RemoveCartItemInput {
  """The ID of the Cart in which the CartItem belongs to."""
  cartId: ID!
  """The ID of the CartItem you wish to remove."""
  id: ID!
}

input EmptyCartInput {
  """The ID of the Cart you wish to empty."""
  id: ID!
}

input UpdateCartInput {
  id: ID!
  currency: CurrencyInput
  email: String
  notes: String
  attributes: [CustomAttributeInput]
  metadata: Json
}

input DeleteCartInput {
  """The ID of the Cart you wish to delete."""
  id: ID!
}

type DeletePayload {
  success: Boolean!
  message: String
}

input CheckoutInput {
  cartId: ID!
  email: String!
  notes: String
  shipping: AddressInput!
  billing: AddressInput
  metadata: Json
}

input AddressInput {
  company: String
  name: String!
  line1: String!
  line2: String
  city: String!
  state: String
  postalCode: String!
  country: String!
}

"""Orders are immutable. Once created, you can't change them. The status will automatically reflect the current payment status."""
type Order {
  id: ID!
  """The ID of the cart you want to "checkout"."""
  cartId: ID!
  """The email of the recipient. Can be used later for cart recovery emails."""
  email: String!
  """The orders shipping address."""
  shipping: Address!
  """The orders billing address."""
  billing: Address!
  """The order items that were in the cart."""
  items: [OrderItem!]!
  """Sum of all SKU items, excluding discounts, taxes, shipping, including the raw/formatted amounts and currency details"""
  subTotal: Money!
  """The total for all items with type SHIPPING, including the raw/formatted amounts and currency details."""
  shippingTotal: Money!
  """The total for all items with type TAX, including the raw/formatted amounts and currency details."""
  taxTotal: Money!
  """The grand total for all items, including shipping, including the raw/formatted amounts and currency details."""
  grandTotal: Money!
  """The total item count."""
  totalItems: Int!
  """The total unique item count."""
  totalUniqueItems: Int!
  """The notes set at checkout."""
  notes: String
  """The custom attributes set at checkout"""
  attributes: [CustomAttribute!]!
  """The metadata set at checkout"""
  metadata: Json
  """The current order status. This will reflect the current payment status. The first stage is 'unpaid'."""
  status: OrderStatus!
  """The date and time the order was created."""
  createdAt: Date!
  """The date and time the order status was updated."""
  updatedAt: Date!
}

"""Addresses are associated with Orders. They can either be shipping or billing addresses."""
type Address {
  """Use this to keep an optional company name for addresses."""
  company: String
  """Use this to keep the name of the recipient."""
  name: String!
  """Use this to keep the first line of the address."""
  line1: String!
  """Use this to keep the apartment, door number, etc."""
  line2: String
  """Use this to keep the city/town name."""
  city: String!
  """Use this to keep the state/county name."""
  state: String
  """Use this to keep the post/postal/zip code."""
  postalCode: String!
  """Use this to keep the country name."""
  country: String!
}

"""
Orders contain items that were converted from the Cart at 'checkout'.

Order items are identical to the CartItem type.
"""
type OrderItem {
  id: ID!
  name: String
  description: String
  type: CartItemType!
  images: [String]
  unitTotal: Money!
  lineTotal: Money!
  quantity: Int!
  createdAt: Date!
  updatedAt: Date!
  attributes: [CustomCartAttribute!]!
  metadata: Json
}

type CustomAttribute {
  key: String!
  value: String
}

enum OrderStatus {
  UNPAID
  PAID
}

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

"""The \`Upload\` scalar type represents a file upload."""
scalar Upload

`, `.mesh/sources/CartQL/schema.graphql`);

module.exports = buildSchema(source, {
  assumeValid: true,
  assumeValidSDL: true
});
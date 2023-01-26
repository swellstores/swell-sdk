# @swell/js

## Description

`@swell/js` is a JavaScript SDK that connects to Swell's Front-end API, providing helper methods for common data transforms and for the actions needed to create storefronts and purchase flows.

## Getting Started

The first step in setting up @swell/js for usage is to initialize your client.

```typescript
const options: SwellClientInitOptions = {
	store: "test-store",
	key: "test-key",
};
const client = init(options);
```

### Client Options

- store (required): string

  Your store's ID. Can be found inside your store's admin dashboard, under Developer > API keys.

- key (required): string

  A public key from your store. Can likewise be found in your store's admin dashboard, under Developer > API keys.

- url (optional): string

  Your storefront's URL.

- vaultUrl (optional): string

  The URL for your credit card token's vault.

- useCamelCase (optional): boolean

  Whether or not to convert the response syntax to camel case.

- previewContent (optional): boolean

  Should be set to true when retrieving preview editor data.

- locale (optional): string

  The locale to use when fetching data.

- currency (optional): string

  The currency to use when fetching pricing data.

- sessionToken (optional): string

  The @swell/js client already managed user sessions through cookies, but this property can be set to override the session used to fetch data.

## Methods

### `getProduct`

Fetches a product using the passed-in identifier, which can be either the product's ID or the product's slug.

#### Example

```typescript
const product = getProduct(client, "my-product", {
	locale: "en",
	currency: "USD",
});
```

#### API

```typescript
const product = getProduct(client, id, requestOptions);
```

- `client` (SwellClient): The client returned from the `init` function.
- `id` (string): Identifier for the product. Can be either the product's slug or the product's id.
- `options`: (object, optional): Options for expanding and setting custom request options for the request.
  - `expand` (object, optional): An array of the fields to expand. See [Expandable fields]() for a list of the possible expand options.
  - `requestOptions` (object, optional): Overwrites the client options for the current request. Parameters:
    - `locale` (string, optional): The requested product's locale.
    - `currency` (string, optional): The requested product's currency.
    - `sessionToken` (string, optional): The token from the session to be used.

### `getProductList`

Returns a paginated list of the store's products, which can optionally be filtered by the passed-in attributes.

#### Example

```typescript
const products = getProductList(client, {
  filters: {
    category: 'books'
    search: 'ring',
    author: 'J.R.R. Tolkien'
  },
})
```

In this example, the `getProductList` function will attempt to retrieve a list of products that satisfies the following conditions (if any):

- The products must be inside of a category 'books'.
- Either the product title, the product slug or the product SKU must contain the term 'ring'.
- The product must have an 'author' attribute with the value of 'J.R.R. Tolkien'. Author is a custom product attribute specific to this store.

#### API

```typescript
const products = getProductList(client, options);
```

- `client`: See SwellClient.
- `options` (object, optional): Options for filtering and paginating the response.
  - `filters` (object, optional): Properties by which to narrow down the product list. Attributes to filter by:
    - `price` (number tuple, optional): Lower and upper bounds of the desired price range of the products to be retrieved. Example: `[10, 100]`
    - `category` (string, optional): The ID or slug of the category to filter by.
    - `attributes` (object, optional): A key-value object of attributes to filter by. The key is the attribute's name, and the value is the attribute's value (`string | number`) or an array representing the different allowed values (`(string | number)[]`).
  - `requestOptions`: See requestOptions
  - `page` (number, optional): For pagination purposes. The products retrieved will start at the pointer specified by this field.
  - `limit` (number, optional): Max number of products to return per page. Defaults to 15, with a maximum of 100.
  - `sort` (string, optional): Field to sort responses by.

### `getActiveVariant`

Normalizes and returns the price data for a product based on the customer's selected options, alongside the rest of the matching variant's data, if found.

#### Example

```typescript
const activeVariant = getActiveVariant(
	// Product
	{
		// ...
		id: "product-1",
		purchaseOptions: {
			standard: {
				price: 30,
			},
			subscription: {
				plans: [
					{
						id: "plan-1",
						name: "Monthly",
						price: 25,
					},
					{
						id: "plan-2",
						name: "Weekly",
						price: 20,
					},
				],
			},
		},
		options: [
			{
				id: "option-1",
				name: "Size",
				values: [
					{
						id: "option-value-1",
						name: "S",
					},
					{
						id: "option-value-2",
						name: "M",
					},
				],
			},
		],
		variants: {
			results: [
				{
					id: "variant-1",
					optionValueIds: ["option-value-1"],
					price: 30,
				},
				{
					id: "variant-2",
					optionValueIds: ["option-value-2"],
					price: 35,
				},
			],
		},
	},
	// Selected product options
	[
		{
			optionId: "option-1",
			valueId: "option-value-2",
		},
	],
	// Selected purchase option (subscription plan id)
	"plan-2",
);
```

In this case, activeVariant will look something like

```JSON
{
  productId: "product-1",
  id: "variant-2",
  priceData: {
    standard: {
      price: 35,
      // ...
    },
    subscription: {
      id: "plan-2",
      name: "Weekly",
      price: 20,
      // ...
    },
  },
  // ...
};
```

#### API

```typescript
const activeVariant = getActiveVariant(
	product,
	selectedOptions,
	selectedPlanId,
);
```

- `product`: See [Product](). Should be expanded to include the product's variants.
- `selectedOptions`: (SelectedOption[] | null | undefined): The selected options for the product. Can be left empty if no options are selected.
  - `optionId` (string): The ID of the option.
  - `valueId` (string): The ID of the option's value.
- `selectedPlan` (string | null | undefined): The ID of the selected plan. Can be left empty if no plan is selected.

Returned object

- activeVariant: The resolved price data for the product and selected options (under a `priceData` field) merged with the matching variant, if found.

# @swell/react

## Description

`@swell/react` is a wrapper around `@swell/js` that provides the hooks and other utils needed to quickly and easily build a storefront with Swell and React.

## Getting Started

The only setup needed for `@swell/react` is to wrap your components within a Swell provider.

```tsx
import { SwellContextProvider } from "@swell/react";

<SwellContextProvider storeKey={storeKey} store={store}>
	<App />
</SwellContextProvider>;
```

The hooks described below will now connect automatically to your store.

## Hooks

### `useProduct`

Fetches a product using the passed-in identifier, which can be either the product's ID or the product's slug.

#### Example

```typescript
const { product } = useProduct("my-product");
```

#### API

```typescript
const { product, activeVariant, loading, error } = useProduct(id, {
	expand,
	selectedOptions,
	planId,
	requestOptions,
});
```

The hook will listen to changes in the id and trigger a refetch, updating the `loading` boolean and the other returned values if necessary.

Alternatively you can pass an existing product as the first argument. This is useful when the product is fetched ahead of time (for example server-side) but you'd still like to make use of the activeVariant helpers.

```typescript
import { getProduct } from "@swell/js";

const product = getProduct("my-product");

const { activeVariant } = useProduct(product, {
	selectedOptions: [{ optionId: "option-id", valueId: "value-id" }],
	planId: "plan-2",
});
```

Arguments:

- `id` (string): Identifier for the product. Can be either the product's slug or the product's id.
- `options`: (object, optional): Options for calculating the activeVariant and customizing the requests.
  - `expand` (object, optional): An array of the fields to expand. See [Expandable fields]() for a list of the possible expand options.
  - `selectedOptions` (array, optional): The user's selected product options. Used to calculate the activeVariant.
  - `planId`: (string, optional): The selected subscription plan id (if any), used to calculate the activeVariant.
  - `requestOptions` (object, optional): Overwrites the client options for the current request. Parameters:
    - `locale` (string, optional): The requested product's locale.
    - `currency` (string, optional): The requested product's currency.
    - `sessionToken` (string, optional): The token from the session to be used.

Returns:

- `product`: The fetched product data.
- `activeVariant`: A variant that matches the passed-in user selections with resolved price data. See the [`@swell/js` docs](https://github.com/swellstores/swell-sdk/tree/feat/products-module/packages/js) for more information.
- `loading` (boolean): `true` while fetching, `false` otherwise.
- `error` (string | null): The error message for request errors, if any.

### `useProductList`

Returns a paginated list of the store's products, which can optionally be filtered by the passed-in attributes.

#### Example

```typescript
const { products, loading, error } = useProductList({
  filters: {
    category: 'books'
    search: 'ring',
    author: 'J.R.R. Tolkien'
  },
})
```

In this example, the `useProductList` hook will attempt to retrieve a list of products that satisfies the following conditions (if any):

- The products must be inside of a category 'books'.
- Either the product title, the product slug or the product SKU must contain the term 'ring'.
- The product must have an 'author' attribute with the value of 'J.R.R. Tolkien'. Author is a custom product attribute specific to this store.

Changes to the filters will trigger a refetch and update the returned values accordingly.

#### API

```typescript
const products = getProductList(client, options);
```

Arguments:

- `options` (object, optional): Options for filtering and paginating the response. See the [`@swell/js` docs](https://github.com/swellstores/swell-sdk/tree/feat/products-module/packages/js) for more information.

Returns:

- `products`: List of products
- `loading` (boolean)
- `error` (string | null)

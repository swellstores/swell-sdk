# @swell/react

## 0.1.0

### Minor Changes

- 030513a: 0.1.0 Product module

  New Provider

  - `SwellContextProvider`: Injects the client into the component tree to simplify hooks usage.

  New hooks

  - `useProduct`: Fetches a product using the product's slug or ID. Will also calculate the active variant using the selected product options.
  - `useProductList`: Returns a paginated list of the store's products, which can be optionally filtered.

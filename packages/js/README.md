# Swell-JS

## Description

Swell-js is a JavaScript SDK that connects to Swell's Front-end API, providing helper methods for common data transforms and for the actions needed to create storefronts and purchase flows.

## Getting Started

The first step in setting up swell-js for usage is to initialize your client.

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

  The swell-js client already managed user sessions through cookies, but this property can be set to override the session used to fetch data.

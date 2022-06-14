# GraphQL Document Generator

documentation generator for GraphQL API

![image](https://user-images.githubusercontent.com/48206623/173492450-57fd030c-4380-4769-83c2-1cbcdef1e7c8.png)



## Usage

the first argument receives a path to find the schema source, and second argument receives a path to export the markdown file.

```sh
$ npx gql-docgen [schema-source] [out-dir]
```

### GrahqhQL endpoint

GraphQL endpoints are also supported.

```sh
$ npx gql-docgen https://your-gql-api/graphql ./out
```

### With file system

if you want to use a local file or folder as a schema source, enter that path.

```sh
# folder
$ npx gql-docgen ./typeDefs ./out

# file
$ npx gql-docgen ./schema.gql ./out
```

### Reserved tags

the informations can be expressed by attaching a reserved tag in the docstring of the schema file.

**@req**

The `@req` tag inside the docstring is shown as a block of code in the paragraph "Request"

```graphql
type Query {
    """
    @req
    ```graphql
        query GetGuestCart($input: GetCartByGuestInput!) {
            guestCart(input: $input) {
                items {
                    _id
                    name
                    quantity
                }
                total
            }
        }
    ```
    """
    guestCart(input: GetCartByGuestInput!): GetCartPayload!
}
```

**@res**

The `@res` tag inside the docstring is shown as a block of code in the paragraph "Response"

```graphql
type Query {
    """
    @res
    ```json
    {
        "data:: {
            "items": {
                ...
            }
        }
    }
    ```
    """
    guestCart(input: GetCartByGuestInput!): GetCartPayload!
}
```

**@desc**

The `@desc` tag adds a description just below the resolver name.

```graphql
type Query {
    """
    @desc Gets the list of customer's cart items
    """
    guestCart(input: GetCartByGuestInput!): GetCartPayload!
}
```

### Options

**headers**

when you fetch schemas from your graphql api, you might need to set your authorization key. if you attach `headers` option, you can.

```sh
$ npx gql-docgen https://your-gql-api/graphql ./out --header "Authorization=[your token]"
```

**title**

you can set your filename with `title` option.

```sh
# generated "commerce.mdx"
$ npx gql-docgen ./schema.graphql ./out --title Commerce
```

const { buildSchema, Source } = require('graphql');

const source = new Source(/* GraphQL */`
schema {
  query: Query
}

directive @cacheControl(maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | OBJECT | INTERFACE

type Query {
  continents(filter: ContinentFilterInput): [Continent!]!
  continent(code: ID!): Continent
  countries(filter: CountryFilterInput): [Country!]!
  country(code: ID!): Country
  languages(filter: LanguageFilterInput): [Language!]!
  language(code: ID!): Language
}

input ContinentFilterInput {
  code: StringQueryOperatorInput
}

input StringQueryOperatorInput {
  eq: String
  ne: String
  in: [String]
  nin: [String]
  regex: String
  glob: String
}

type Continent {
  code: ID!
  name: String!
  countries: [Country!]!
}

type Country {
  code: ID!
  name: String!
  native: String!
  phone: String!
  continent: Continent!
  capital: String
  currency: String
  languages: [Language!]!
  emoji: String!
  emojiU: String!
  states: [State!]!
}

type Language {
  code: ID!
  name: String
  native: String
  rtl: Boolean!
}

type State {
  code: String
  name: String!
  country: Country!
}

input CountryFilterInput {
  code: StringQueryOperatorInput
  currency: StringQueryOperatorInput
  continent: StringQueryOperatorInput
}

input LanguageFilterInput {
  code: StringQueryOperatorInput
}

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

"""The \`Upload\` scalar type represents a file upload."""
scalar Upload

`, `.mesh/sources/Countries/schema.graphql`);

module.exports = buildSchema(source, {
  assumeValid: true,
  assumeValidSDL: true
});
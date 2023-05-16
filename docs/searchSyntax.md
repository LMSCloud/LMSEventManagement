#### Advanced Search Syntax

##### Field Equality Matches

Syntax: `fieldname:value`

This will match results where the given field name matches the specified value.

**Example:** `age:25` will return results where the age field equals 25.

##### Complex Matching Clauses

Syntax: `fieldname:operator value`

This allows the use of various matching clauses including `>`, `<`, `>=`, `<=`, `~`, and `!~`.

**Example:** `age:>25` will return results where the age field is greater than 25.

##### Multi-field Filtering

Syntax: `field1:value1 AND field2:value2`

This will filter the response to only those results where both field1 contains value1 AND field2 contains value2.

**Example:** `name:John AND age:25` will return results where the name field is John AND the age field equals 25.

##### OR Queries

Syntax: `fieldname:value1 OR value2`

This will return results where the fieldname is either value1 OR value2.

**Example:** `surname:Acevedo OR Bernardo` will return any result whose surname is "Acevedo" OR "Bernardo".

##### Exact Matches

If you quote the search term in double quotes, it will find only exact matches.

**Example:** `name:"John Doe"` will return results where the name field is exactly "John Doe".

##### Wildcard Matches

If a value is not quoted, it will perform a search with wildcard matches, meaning it will return results where the field contains the specified value.

**Example:** `name:John` will return results where the name field contains "John" (such as "John Doe", "Johnny", etc.).

##### Nested Data Query

If you are requesting related data be embedded into the response one can query on the related data using dot notation in the field names.

**Example:** `extended_attributes.code:internet AND extended_attributes.attribute:1` will return results where the code field of extended_attributes is "internet" AND the attribute field of extended_attributes is 1.

##### Bare Search

A bare search without keywords will search all fields with forward and backward truncation meaning \*SEARCH_TERM\*. This can be used for broad queries where the specific field isn't known.

**Example:** John will return any result that contains "John" in any of the fields.

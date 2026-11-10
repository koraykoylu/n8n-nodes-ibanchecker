# n8n-nodes-ibanchecker

This is an n8n community node. It lets you use the [ibanchecker.cash](https://ibanchecker.cash) API in your n8n workflows.

ibanchecker.cash validates IBANs (country, length, national structure and MOD-97 check digits), names the bank behind an IBAN when it is in the directory, finds IBANs in free text, and looks up BIC/SWIFT codes. Typical uses: checking a supplier's IBAN before it enters the accounting system, cleaning a customer list, or pulling the IBANs out of incoming invoices and emails.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-ibanchecker`.

## Operations

| Resource | Operation | What it does | API endpoint |
|---|---|---|---|
| IBAN | Validate | Validates one IBAN and returns its country, bank, BIC, bank code, account number and SEPA flag when available | `POST /validate` |
| IBAN | Validate Bulk | Validates up to 100 IBANs in one request | `POST /validate/bulk` |
| IBAN | Extract From Text | Finds every IBAN in a block of text (up to 50,000 characters) and validates each one | `POST /extract` |
| IBAN Format | Get | Returns a country's IBAN format: length, structure, BBAN fields and an example | `GET /formats/{country}` |
| BIC | Look Up | Returns the bank behind an 8 or 11 character BIC/SWIFT code | `GET /swift/{bic}` |

Validate Bulk and Extract From Text return one item per IBAN by default. Turn off **Split Results Into Items** to get a single item with `count`, `valid_count`, `invalid_count` and the `results` array instead.

An IBAN that fails validation is not an error: the node returns `valid: false` with an `error` and an `error_code`, so a workflow can branch on it with an If node.

The node can also be used as a tool by n8n's AI Agent node.

## Credentials

The node needs an ibanchecker.cash API key.

1. Get a free key at [ibanchecker.cash/api-docs](https://ibanchecker.cash/api-docs). It arrives by email.
2. In n8n, create a new **IBAN Checker API** credential and paste the key (it starts with `iban_`).

The key is sent as `Authorization: Bearer <key>`. Testing the credential in n8n validates one sample IBAN, which counts as one request.

What a key can call follows its plan:

| Operation | Free key | Free key with a verified account | Basic / Starter | Growth / Enterprise |
|---|---|---|---|---|
| Validate | yes | yes | yes | yes |
| Validate Bulk | no | up to 10 IBANs a call | up to 100 | up to 100 |
| Look Up (BIC) | no | yes | yes | yes |
| Extract From Text | no | up to 5,000 characters a call | trial with a verified account | up to 50,000 |
| Get (IBAN Format) | yes | yes | yes | yes |

A free key covers 100 requests a month. A free account on the same address, at [ibanchecker.cash/dashboard](https://ibanchecker.cash/dashboard), opens the trials. Validate Bulk counts one request per IBAN, and Extract From Text one per IBAN found (at least one per call). Plans for higher volumes are on [ibanchecker.cash/pricing](https://ibanchecker.cash/pricing).

## Compatibility

Built and tested with n8n 2.x (see the version history for the exact version each release was tested on). The node is declarative and has no runtime dependencies.

## Usage

- **Validate an IBAN from a form or a spreadsheet row:** add the node after your trigger, choose IBAN > Validate, and map the IBAN field. Follow it with an If node on `{{ $json.valid }}`.
- **Check a whole column:** collect the IBANs into one list (for example with an Aggregate node), choose IBAN > Validate Bulk, and pass the list as an expression. The field also accepts IBANs separated by commas, semicolons or new lines.
- **Read IBANs out of an email:** choose IBAN > Extract From Text and map the message body.

When the API refuses a call, the node fails with the API's own message and error code: `401` for a missing or wrong key, `403` for an operation outside the key's plan, `404` for an unknown country or BIC, and `429` when the monthly quota is used up. With **Split Results Into Items** on, a text with no IBAN in it returns no items.

No IBAN is logged or stored by the API; validation runs in memory. See the [security page](https://ibanchecker.cash/security).

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [ibanchecker.cash API documentation](https://ibanchecker.cash/api-docs)
* [OpenAPI specification](https://ibanchecker.cash/openapi.json)

## Version history

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT. See [LICENSE](./LICENSE).

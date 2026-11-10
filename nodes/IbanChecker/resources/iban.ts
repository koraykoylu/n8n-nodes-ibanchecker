import type { INodeProperties } from 'n8n-workflow';
import { raiseApiError } from '../shared/errors';

const toIbanList =
	'={{ (Array.isArray($value) ? $value : String($value).split(/[\\n,;]+/)).map((v) => String(v).trim()).filter((v) => v) }}';

export const ibanDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['iban'] },
		},
		options: [
			{
				name: 'Extract From Text',
				value: 'extract',
				action: 'Extract every IBAN from text',
				description: 'Find every IBAN in a block of text and validate each one',
				routing: {
					request: {
						method: 'POST',
						url: '/extract',
					},
					output: {
						postReceive: [raiseApiError],
					},
				},
			},
			{
				name: 'Validate',
				value: 'validate',
				action: 'Validate IBAN',
				description:
					'Check the country, length, national structure and MOD-97 check digits of one IBAN, with bank details when available',
				routing: {
					request: {
						method: 'POST',
						url: '/validate',
					},
					output: {
						postReceive: [raiseApiError],
					},
				},
			},
			{
				name: 'Validate Bulk',
				value: 'validateBulk',
				action: 'Validate IBAN list in bulk',
				description: 'Validate up to 100 IBANs in one request',
				routing: {
					request: {
						method: 'POST',
						url: '/validate/bulk',
					},
					output: {
						postReceive: [raiseApiError],
					},
				},
			},
		],
		default: 'validate',
	},
	{
		displayName: 'IBAN',
		name: 'iban',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. DE89 3704 0044 0532 0130 00',
		displayOptions: {
			show: { resource: ['iban'], operation: ['validate'] },
		},
		description: 'The IBAN to validate, with or without spaces',
		routing: {
			send: {
				type: 'body',
				property: 'iban',
			},
		},
	},
	{
		displayName: 'IBANs',
		name: 'ibans',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		placeholder: 'e.g. DE89370400440532013000, GB29NWBK60161331926819',
		displayOptions: {
			show: { resource: ['iban'], operation: ['validateBulk'] },
		},
		description:
			'Up to 100 IBANs, separated by commas, semicolons or new lines. An expression that returns an array of strings also works. Each IBAN counts as one request.',
		routing: {
			send: {
				type: 'body',
				property: 'ibans',
				value: toIbanList,
			},
		},
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: { rows: 6 },
		default: '',
		required: true,
		displayOptions: {
			show: { resource: ['iban'], operation: ['extract'] },
		},
		description:
			'Free text to scan for IBANs, such as an email or an invoice, up to 50,000 characters. Each IBAN found counts as one request, and a call that finds none counts as one.',
		routing: {
			send: {
				type: 'body',
				property: 'text',
			},
		},
	},
	{
		displayName: 'Split Results Into Items',
		name: 'splitResults',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: { resource: ['iban'], operation: ['validateBulk', 'extract'] },
		},
		description:
			'Whether to return one item per IBAN. When turned off, the node returns a single item with the counts and the results array.',
		routing: {
			output: {
				postReceive: [
					{
						type: 'rootProperty',
						enabled: '={{$value}}',
						properties: {
							property: 'results',
						},
					},
				],
			},
		},
	},
];

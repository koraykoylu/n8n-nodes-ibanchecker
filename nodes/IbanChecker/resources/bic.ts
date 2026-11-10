import type { INodeProperties } from 'n8n-workflow';
import { raiseApiError } from '../shared/errors';

export const bicDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['bic'] },
		},
		options: [
			{
				name: 'Look Up',
				value: 'lookUp',
				action: 'Look up BIC',
				description: 'Look up the bank behind a BIC/SWIFT code',
				routing: {
					request: {
						method: 'GET',
						url: '=/swift/{{ String($parameter.bic).replace(/\\s+/g, "").toUpperCase() }}',
					},
					output: {
						postReceive: [raiseApiError],
					},
				},
			},
		],
		default: 'lookUp',
	},
	{
		displayName: 'BIC',
		name: 'bic',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. DEUTDEFF',
		displayOptions: {
			show: { resource: ['bic'], operation: ['lookUp'] },
		},
		description: 'The 8 or 11 character BIC/SWIFT code',
	},
];

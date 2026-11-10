import type { INodeProperties } from 'n8n-workflow';
import { raiseApiError } from '../shared/errors';

export const ibanFormatDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['ibanFormat'] },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get IBAN format',
				description: 'Get the IBAN format of a country: length, structure, BBAN fields and an example',
				routing: {
					request: {
						method: 'GET',
						url: '=/formats/{{ String($parameter.country).trim().toLowerCase() }}',
					},
					output: {
						postReceive: [raiseApiError],
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Country Code',
		name: 'country',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. DE',
		displayOptions: {
			show: { resource: ['ibanFormat'], operation: ['get'] },
		},
		description: 'Two-letter ISO 3166-1 country code',
	},
];

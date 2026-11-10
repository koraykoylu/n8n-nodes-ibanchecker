import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { ibanDescription } from './resources/iban';
import { ibanFormatDescription } from './resources/ibanFormat';
import { bicDescription } from './resources/bic';

export class IbanChecker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IBAN Checker',
		name: 'ibanChecker',
		icon: { light: 'file:ibanchecker.svg', dark: 'file:ibanchecker.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Validate IBANs and look up BIC/SWIFT codes with the ibanchecker.cash API',
		defaults: {
			name: 'IBAN Checker',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'ibanCheckerApi', required: true }],
		requestDefaults: {
			baseURL: 'https://ibanchecker.cash/api/v1',
			ignoreHttpStatusErrors: true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': 'n8n-nodes-ibanchecker',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'BIC',
						value: 'bic',
					},
					{
						name: 'IBAN',
						value: 'iban',
					},
					{
						name: 'IBAN Format',
						value: 'ibanFormat',
					},
				],
				default: 'iban',
			},
			...ibanDescription,
			...ibanFormatDescription,
			...bicDescription,
		],
	};
}

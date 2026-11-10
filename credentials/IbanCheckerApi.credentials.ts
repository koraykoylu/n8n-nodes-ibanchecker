import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class IbanCheckerApi implements ICredentialType {
	name = 'ibanCheckerApi';

	displayName = 'IBAN Checker API';

	icon: Icon = { light: 'file:ibanchecker.svg', dark: 'file:ibanchecker.dark.svg' };

	documentationUrl = 'https://github.com/koraykoylu/n8n-nodes-ibanchecker?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'iban_...',
			description:
				'Your ibanchecker.cash API key. Get a free one at https://ibanchecker.cash/api-docs; your keys are listed at https://ibanchecker.cash/dashboard.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// The API has no free endpoint that checks a key, so the test validates one sample IBAN
	// and counts as one request against the key's monthly quota.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://ibanchecker.cash/api/v1',
			url: '/validate',
			method: 'POST',
			body: { iban: 'DE89370400440532013000' },
			json: true,
		},
	};
}

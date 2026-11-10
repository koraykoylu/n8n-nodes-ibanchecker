import {
	NodeApiError,
	type IExecuteSingleFunctions,
	type IN8nHttpFullResponse,
	type INodeExecutionData,
	type JsonObject,
} from 'n8n-workflow';

// The API explains every refusal in its body (which plan an operation needs, when the quota
// resets); n8n's default error for a 4xx drops that text, so it is raised here instead.
export async function raiseApiError(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (response.statusCode < 400) return items;

	const body = (response.body ?? {}) as JsonObject;
	const message =
		typeof body.error === 'string' ? body.error : `Request failed with status code ${response.statusCode}`;

	throw new NodeApiError(this.getNode(), body, {
		message,
		description: typeof body.error_code === 'string' ? body.error_code : undefined,
		httpCode: String(response.statusCode),
	});
}

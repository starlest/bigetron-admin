import { Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';

/**
 * Converts a JSON object to URL encoded format
 * @param data Data to be encoded
 * @returns {string} URL encoded format data
 */
export function toUrlEncodedString(data: any) {
	let body = "";
	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			if (body.length) body += "&";
			body += key + "=";
			body += encodeURIComponent(data[key]);
		}
	}
	return body;
}

/**
 * Creates a viable RequestOptions object to handle Json requests
 * @returns {RequestOptions} Object to handle JSON requests
 */
export function getRequestOptions() {
	return new RequestOptions({
		headers: new Headers({
			"Content-Type": "application/json"
		})
	});
}

/**
 * Handle HTTP response error
 * @param error HTTP response error
 * @returns {Observable<any>} Rxjs Observable encapsulating the error
 */
export function handleError(error: Response): Observable<any> {
	// output errors to the console.
	console.error(error);
	return Observable.throw(error.json().error || "Server error");
}

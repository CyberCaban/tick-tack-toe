/**
 *
 * @param url
 * @param method
 * @param body
 * @param token - jwt token
 * @returns res.json()
 */

export default async function customFetch(
  url: string,
  method: string,
  body: object,
  token: string,
) {
  const response = await fetch(url, {
    method,
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(body),
  });
  return response.json();
}

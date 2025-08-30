export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const search = url.search;

    const targetUrl = `http://numbersapi.com${path}${search}`;

    try {
      if (path === '/' || path === '/index.html') {
        return new Response(`<h1>Numbers API Proxy</h1>`, {
          status: 404,
        body: 'Not found',
        });
      }
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': 'NumbersAPI-Proxy/1.0',
          'Accept': request.headers.get('Accept') || '*/*',
          'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
      responseHeaders.set('X-Proxy-By', 'NumbersAPI-Proxy');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      return new Response(`Proxy error: ${error.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

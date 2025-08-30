export default {
  async fetch(request, _env, _ctx) {
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

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('Method not allowed', {
          status: 405,
          body: 'Not allowed',
        });
      }

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': 'NumbersAPI-Proxy/1.0',
          'Accept': request.headers.get('Accept') || '*/*',
          'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
        },
      });

      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', 'text/plain');
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
      responseHeaders.set('X-Proxy-By', 'NumbersAPI-Proxy');

      responseHeaders.set('X-Content-Type-Options', 'nosniff');
      responseHeaders.set('X-Frame-Options', 'DENY');
      responseHeaders.set('X-XSS-Protection', '1; mode=block');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      return new Response(`Proxy error: ${error.message}`, {
        status: 500,
        body: 'Error',
      });
    }
  },
};

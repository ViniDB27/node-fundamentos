import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  );

  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;
    req.query = query ? extractQueryParams(query) : {};
    req.params = params;
    return route.handler(req, res);
  }

  res.writeHead(404).end();
});

server.listen(3333, () => {
  console.log("Server is running on port http://localhost:3333");
});

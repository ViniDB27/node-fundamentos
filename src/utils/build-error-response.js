export function buildErrorResponse(req, res, error) {
  switch (error.message) {
    case `Row with id not found`:
      return res.writeHead(404).end(error.message);
    case `Cannot destructure property 'title' of 'req.body' as it is null.`:
    case `Cannot destructure property 'description' of 'req.body' as it is null.`:
      return res.writeHead(400).end('Title and description are required');
    default:
      return res.writeHead(500).end(error.message);
  }
}

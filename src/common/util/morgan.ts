import * as morgan from 'morgan';

morgan.token('status', (req, res) => {
  let color = '32';

  if (res.statusCode >= 500) {
    color = '31';
  } else if (res.statusCode >= 400) {
    color = '33';
  } else if (res.statusCode >= 300) {
    color = '36';
  }

  return `\x1b[${color}m${res.statusCode}\x1b[0m`;
});

morgan.token('date', () => {
  return `\x1b[90m${new Date().toISOString().split('.')[0]}\x1b[0m`;
});

morgan.token('method', (req) => {
  let backgroundColor = '47';

  switch (req.method) {
    case 'GET':
      backgroundColor = '48;5;75';
      break;
    case 'POST':
      backgroundColor = '48;5;119';
      break;
    case 'PUT':
      backgroundColor = '48;5;214';
      break;
    case 'PATCH':
      backgroundColor = '48;5;194';
      break;
    case 'DELETE':
      backgroundColor = '41';
      break;
  }

  return `\x1b[${backgroundColor}m\x1b[30m ${req.method} \x1b[0m`;
});

export default morgan(
  ':date :method :url :status :total-time ms - :res[content-length]',
);

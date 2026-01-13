const React = require('react');

module.exports = {
  useNavigate: () => () => {},
  useParams: () => ({}),
  BrowserRouter: ({ children }) => React.createElement('div', null, children),
  Routes: ({ children }) => React.createElement('div', null, children),
  Route: ({ children }) => React.createElement('div', null, children),
};
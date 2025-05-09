import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
function previousPage() {
  history.back();
}

export default previousPage;
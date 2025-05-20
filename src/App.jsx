import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import UploadPage from "./pages/upload-page";
import InvoiceDetail from './pages/invoice-page';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/invoice-detail" element={<InvoiceDetail  />} />
      </Routes>
    </Router>
  );
}

export default App;
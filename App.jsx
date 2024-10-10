import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Users from './Users';
import CreateUser from './CreateUser';
import CreateUnit from './CreateUnit';
import Dashboard from './Dashboard';
import Tenants from './Tenants';
import UpdateUser from './UpdateUser';
import UpdateContract from './UpdateContract';
import BillingPayment from './BillingPayment'; // New component

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Users />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="update/:id" element={<UpdateUser />} />
            <Route path="updateContract/:id" element={<UpdateContract />} />
            <Route path="billing" element={<BillingPayment />} /> {/* New Route */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

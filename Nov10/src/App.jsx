import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Users from './Users';
import CreateUser from './CreateUser';
import CreateUnit from './CreateUnit';
import Dashboard from './Dashboard';
import CreateContract from './CreateContract'
import Tenants from './Tenants';
import UpdateUser from './UpdateUser';
import UpdateContract from './UpdateContract';
import BillingPayment from './BillingPayment';
import Units from './Units';
import CreateUnitType from './CreateUnitType';
import UpdateUnit from './UpdateUnit';
import Maintenance from './Maintenance';
import CreateMaintenance from './CreateMaintenance';
import Login from './Login';
import Signup from './Signup';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Users />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="unit/:id" element={<CreateUnit />} />
              <Route path="create" element={<CreateUser />} />
              <Route path='contract/:id' element={<CreateContract />}></Route>
              <Route path="update/:id" element={<UpdateUser />} />
              <Route path="updateContract/:id" element={<UpdateContract />} />
              <Route path="billing" element={<BillingPayment />} />
              <Route path="units" element={<Units />} />
              <Route path="unittype" element={<CreateUnitType />} />
              <Route path="editUnit/:id" element={<UpdateUnit />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="newmaintenance" element={<CreateMaintenance />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

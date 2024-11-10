require('dotenv').config();
const express = require('express')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./models/Users')
const UnitModel = require('./models/Unit')
const ContractModel = require('./models/Contract')
const PaymentModel = require('./models/Payment')
const BillingModel = require('./models/Billing')
const BalanceModel = require('./models/Balance')
const UnitTypeModel = require('./models/UnitType')
const MaintenanceModel = require('./models/Maintenance')
const MaintenanceBalModel = require('./models/MaintenanceBal')
const EmployeeModel = require('./models/Employee')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/crud")

app.get('/users', (req, res) => {
    UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.get('/unit', (req, res) => {
    UnitModel.find({})
    .then(unit => res.json(unit))
    .catch(err => res.json(err))
})

app.get('/unittype', (req, res) => {
    UnitTypeModel.find({})
    .then(unittype => res.json(unittype))
    .catch(err => res.json(err))
})

app.get('/contract', (req, res) => {
    ContractModel.find({})
    .then(contract => res.json(contract))
    .catch(err => res.json(err))
})

app.get('/balance', (req, res) => {
    BalanceModel.find({})
    .then(bal => res.json(bal))
    .catch(err => res.json(err))
})

app.get('/maintenance', (req, res) => {
    MaintenanceModel.find({})
    .then(rec => res.json(rec))
    .catch(err => res.json(err))
})

app.get('/maintenanceBal', (req, res) => {
    MaintenanceBalModel.find({})
    .then(bal => res.json(bal))
    .catch(err => res.json(err))
})

app.get('/getUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById({_id:id})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.get('/getUnit/:id', (req, res) => {
    const id = req.params.id;
    UnitModel.findById({_id:id})
    .then(unit => res.json(unit))
    .catch(err => res.json(err))
})

app.get('/getUnitType/:id', (req, res) => {
    const id = req.params.id;
    UnitTypeModel.findById({_id:id})
    .then(unittype => res.json(unittype))
    .catch(err => res.json(err))
})

app.get('/getContract/:id', (req, res) => {
    const id = req.params.id;
    ContractModel.findById({_id:id})
    .then(contract => res.json(contract))
    .catch(err => res.json(err))
})

app.get('/getPayment/:id', (req, res) => {
    const id = req.params.id;
    PaymentModel.find({contract:id})
    .then(payment => res.json(payment))
    .catch(err => res.json(err))
})

app.get('/getBilling/:id', (req, res) => {
    const id = req.params.id;
    BillingModel.find({contract:id})
    .then(bill => res.json(bill))
    .catch(err => res.json(err))
})

app.get('/getBalance/:id', (req, res) => {
    const id = req.params.id;
    BalanceModel.find({contract:id})
    .then(bal => res.json(bal))
    .catch(err => res.json(err))
})

app.put('/updateBalance/:id', (req, res) => {
    const id = req.params.id;
    BalanceModel.findOneAndUpdate(
        {contract:id},
        {balance: req.body.balance},
        {new:true})
    .then(bal => res.json(bal))
    .catch(err => res.json(err))
})
  
app.put('/updateUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndUpdate({_id:id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        currentAddress: req.body.currentAddress,
        emergencyName: req.body.emergencyName,
        emergencyNumber: req.body.emergencyNumber})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.put('/updateUnit/:id', (req, res) => {
    const id = req.params.id;
    UnitModel.findByIdAndUpdate({_id:id}, {
        unitType: req.body.unitType,
        unitNumber: req.body.unitNumber,
        rentAmount: req.body.rentAmount})
    .then(units => res.json(units))
    .catch(err => res.json(err))
})

app.delete('/deleteUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({_id:id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})

app.delete('/deleteUnit/:id', (req, res) => {
    const id = req.params.id;
    UnitModel.findByIdAndDelete({_id:id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})

app.delete('/deleteUnitType/:id', (req, res) => {
    const id = req.params.id;
    UnitTypeModel.findByIdAndDelete({_id:id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})

app.post("/createUser", (req, res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post("/createUnit", (req, res) => {
    UnitModel.create(req.body)
    .then(unit => res.json(unit))
    .catch(err => res.json(err))
})

app.post("/createUnitType", (req, res) => {
    UnitTypeModel.create(req.body)
    .then(unittype => res.json(unittype))
    .catch(err => res.json(err))
})

app.post("/createContract", (req, res) => {
    ContractModel.create(req.body)
    .then(contract => res.json(contract))
    .catch(err => res.json(err))
})

app.post("/createPayment", (req, res) => {
    PaymentModel.create(req.body)
    .then(payment => res.json(payment))
    .catch(err => res.json(err))
})

app.post("/createBill", (req, res) => {
    BillingModel.create(req.body)
    .then(bill => res.json(bill))
    .catch(err => res.json(err))
})

app.post("/createBalance", (req, res) => {
    BalanceModel.create(req.body)
    .then(bal => res.json(bal))
    .catch(err => res.json(err))
})

app.post("/createMaintenance", (req, res) => {
    MaintenanceModel.create(req.body)
    .then(m => res.json(m))
    .catch(err => res.json(err))
})

app.post("/maintenanceBal", (req, res) => {
    MaintenanceBalModel.create(req.body)
    .then(m => res.json(m))
    .catch(err => res.json(err))
})

app.get('/unitExists/:unitType', async (req, res) => {
    try {
        const { unitType } = req.params;
        const unit = await UnitTypeModel.findOne({ unitType });
        if (unit) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

app.get('/unitExists/:unitNumber/:unitType', async (req, res) => {
    try {
        const { unitNumber, unitType } = req.params;
        const unit = await UnitModel.findOne({ unitNumber, unitType });
        if (unit) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

app.post('/register', (req, res) => {
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    EmployeeModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                const token = jwt.sign(
                    { email }, // Payload with user info
                    process.env.JWT_SECRET, // Secret key from .env
                    { expiresIn: '1h' } // Token expiry (1 hour in this case)
                );
                res.json({ message: "Success", token });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.json("No record existed")
        }
    })
})

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        
        req.user = user; // Attach the decoded payload to the request
        next(); // Pass control to the next middleware/handler
    });
};

app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the dashboard", user: req.user });
});

app.listen(3001, () => {
    console.log("Server is Running")
})
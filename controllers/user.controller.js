const {getUsersData, writeUserData, rewriteUserData} = require("../utils/file.utils");
const bcrypt = require("bcrypt");

async function checkUserData(data, role) {
    const existingData = await getUsersData();
    const userGroup = (role === "admin") ? existingData.admins : existingData.customers;
    return userGroup.find(u => u.email === data.email) || null;
}

async function userLookupWithID(id, role) {
    const existingData = await getUsersData();
    const userGroup = (role === "admin") ? existingData.admins : existingData.customers;
    return userGroup.find(u => u.id === id) || null;
}

exports.addCustomer = async (req, res) => {

    const present = await checkUserData(req.body, "customer");

    if (present) {
        return res.status(400).json({
            message: "Account already exists!"
        });
    }

    const newUser = {
        id: crypto.randomUUID(),
        ...req.body,
        role: "customer"
    };

    const response = await writeUserData(newUser);
    if (!response.json()) {
        return res.status(500).json({
            message: "Error creating user"
        });
    }

    return res.status(201).json({
        message: "User created successfully"
    });
};

exports.fetchCustomer = async (req, res) => {
    const isEmailPresent = await checkUserData(req.body.email, "customer");

    if (isEmailPresent) {
        // Email match found, now trying to match hash
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            // Hash matched, user logged in succesfully
            const sessionData =  {
                "name" : user.name, 
                "email" : user.email, 
                "userType" : "customer",
                "sessionID" : crypto.randomUUID()
            };
            return res.status(200).json({ sessionData });
        }
        else {
            return res.status(400).json({ message: "Incorrect password" });
        }
    }
    else {
        return res.status(400).json({ message: "No account found with the provided email!" });
    }
};

exports.addAdmin = async (req, res) => {

    const present = checkUserData(req.body, "admin");

    if (present) {
        return res.status(400).json({
            message: "Account already exists!"
        });
    }

    const newAdmin = {
        id: crypto.randomUUID(),
        ...req.body
    };

    await writeUserData(newAdmin);

    return res.status(200).json({
        message : "Admin created successfully!"
    })
};


exports.getCustomers = (req, res) => {
    if (req.userType !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    const existingData = getUsersData();
    const customersDataWithoutPassword = existingData.customers.map(customer => {
        return {
            name: customer.name,
            email: customer.email
        }
    });
    if (customersDataWithoutPassword.length === 0) {
        return res.status(404).json({ message: "No customers found" });
    }
    return res.status(200).json({data : customersDataWithoutPassword});
}

exports.getAdmins = (req, res) => {
    if (req.userType !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    const existingData = getUsersData();
    const adminsNames = existingData.admins.map(admin => admin.name);
    if (adminsNames.length === 0) {
        return res.status(404).json({ message: "No admins found" });
    }
    return res.status(200).json({data : adminsNames});
}

exports.changeCustomerInfo = (req, res) => {
    const email = req.body.email;
    const existingData = getUsersData();
    for(let user of existingData) {
        if (user.email === email) {
            user.name = req.body.name;
            user
        }
    }
}

exports.removeCustomerAccount = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message : "Invalid email!"})
    }
    const isPresent = await userLookupWithID(id, "customer");
    if (!isPresent) {
        return res.status(400).json({message : "User does not exist!"});
    }

    const data = await getUsersData();
    
    const filteredData = data.customers.filter(u => u.id !== id);

    try {
        await rewriteUserData({
            ...data,
            customers: filteredData
        });
    }
    catch (err) {
        return res.status(400).json({ message : "Data write failed!"});
    }
    return res.status(200).json({ message : "User removed successfully!"});
}
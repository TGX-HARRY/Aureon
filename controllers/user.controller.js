const {getUsersData, writeUserData, rewriteUserData, getMoviesData} = require("../utils/file.utils");
const bcrypt = require("bcrypt");

let sessionID;
exports.getSessionID = () => {
    return sessionID;
}

function generateSessionID (){
    sessionID = crypto.randomUUID();
    return sessionID;
} 

async function checkUserData(email, role) {
    const existingData = await getUsersData();
    const userGroup = (role === "admin") ? existingData.admins : existingData.subscribers;
    return userGroup.find(u => u.email === email) || null;
}

async function userLookupWithID(id, role) {
    const existingData = await getUsersData();
    const userGroup = (role === "admin") ? existingData.admins : existingData.subscribers;
    return userGroup.find(u => u.id === id) || null;
}

exports.addSubscriber = async (req, res) => {

    const present = await checkUserData(req.body, "subscriber");

    if (present) {
        return res.status(400).json({
            message: "Account already exists!"
        });
    }

    const newUser = {
        id: crypto.randomUUID(),
        ...req.body,
        role: "subscriber"
    };

    try {
        await writeUserData(newUser);
    } catch (err) {
        return res.status(500).json({
            message: "Error creating user"
        });
    }

    return res.status(201).json({
        message: "User created successfully"
    });
};

exports.fetchSubscriber = async (req, res) => {
    const isEmailPresent = await checkUserData(req.body.email, "subscriber");

    if (isEmailPresent) {
        // Email match found, now trying to match hash
        const isMatch = await bcrypt.compare(req.body.password, isEmailPresent.password);
        if (isMatch) {
            // Hash matched, user logged in succesfully
            const sessionData =  {
                "name" : isEmailPresent.name, 
                "id" : isEmailPresent.id, 
                "userType" : "subscriber",
                "sessionID" : generateSessionID()
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
    const customersDataWithoutPassword = existingData.subscribers.map(subscriber => {
        return {
            name: subscriber.name,
            email: subscriber.email
        }
    });
    if (customersDataWithoutPassword.length === 0) {
        return res.status(404).json({ message: "No subscribers found" });
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

exports.changeSubscriberInfo = (req, res) => {
    const email = req.body.email;
    const existingData = getUsersData();
    for(let user of existingData.subscribers) {
        if (user.email === email) {
            user.name = req.body.name;
            user.phone = req.body.phone;
            user.address = req.body.address;
        }
    }
}

exports.removeSubscriberAccount = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message : "Invalid email!"})
    }
    const isPresent = await userLookupWithID(id, "subscriber");
    if (!isPresent) {
        return res.status(400).json({message : "User does not exist!"});
    }

    const data = await getUsersData();
    
    const filteredData = data.subscribers.filter(u => u.id !== id);

    try {
        await rewriteUserData({
            ...data,
            subscribers: filteredData
        });
    }
    catch (err) {
        return res.status(400).json({ message : "Data write failed!"});
    }
    return res.status(200).json({ message : "Subscriber removed successfully!"});
}

exports.fetchMoviesData = async (req, res) => {
    const data = await getMoviesData();
    return (!data)?res.status(200).json({message : "Movies not found"}) : res.status(200).json({data});
}

exports.getUsersDataByID = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message : "Invalid ID!"})
    }
    const data = await userLookupWithID(id, "subscriber");
    if (!data) {
        return res.status(400).json({message : "Data couldn't be fetched!"});
    }
    return res.status(200).json({fetchedData: data});
}
const {getUsersData, writeUserData, rewriteUserData, getMoviesData, getUserMovies} = require("../utils/file.utils");
const bcrypt = require("bcrypt");

let sessionID;
exports.getSessionID = () => {
    return sessionID;
}

function generateSessionID (){
    sessionID = crypto.randomUUID();
    return sessionID;
} 

async function checkUserData(email) {
    const existingData = await getUsersData();
    const userGroup = existingData.subscribers;
    return userGroup.find(u => u.email === email) || null;
}

async function userLookupWithID(id) {
    const existingData = await getUsersData();
    const userGroup = existingData.subscribers;
    return userGroup.find(u => u.id === id) || null;
}

exports.addSubscriber = async (req, res) => {

    const present = await checkUserData(req.body.email);

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
    const isEmailPresent = await checkUserData(req.body.email);

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

exports.getSubscribers = async (req, res) => {
    const adminid = req.params.id;
    if (!adminid) {
        return res.status(400).json({message : "ID not provided!"});
    }

    const validID = await userLookupWithID(adminid, "admin");
    if (!validID) {
        return res.status(401).json({message : "Permission Denied"});
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

exports.changeSubscriberInfo = async (req, res) => {
    const email = req.body.email;
    const existingData = await getUsersData();
    const user = existingData.subscribers.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!req.body.id) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    if (req.body.id !== user.id) {
        return res.status(403).json({ message: "Access denied" });
    }

    if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.fullName = req.body.fullName || user.fullName;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.dob = req.body.dob || user.dob;
    user.avatar = req.body.avatar || user.avatar;
}
    
    try {
        await rewriteUserData(existingData);
    } catch (err) {
        return res.status(500).json({ message: "Error updating user data" });
    }

    return res.status(200).json({ message: "User data updated successfully" });
}

exports.removeSubscriberAccount = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message : "Invalid ID!"})
    }
    const isPresent = await userLookupWithID(id);
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

exports.fetchUserMovieList = async (req, res) => {
    const response = await getUserMovies(req.params.id);
    return res.status(200).json({movieList : response}); 
}

exports.changeSubscriberPassword = async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({message : "User email not found!"});
    }

    const existingUserData = await getUsersData();
    const user = existingUserData.subscribers.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({message : "User not found!"})
    }

    if (user) {
        user.password = await bcrypt.hash(req.body.password, 10);
    }
        
    try {
        await rewriteUserData(existingUserData);
    }
    catch (err) {
        res.status(400).json({messae: "Could rewrite data, due to error : " + err});
    }

    // if no error
    return res.status(200).json({message :  "User password changed successfully!"});
}

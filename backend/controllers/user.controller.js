const { getUsersData, writeUserData, rewriteUserData } = require("../utils/file.utils");
const bcrypt = require("bcrypt");

async function userLookupWithID(id) {
    const existingData = await getUsersData();
    const userGroup = existingData.subscribers;
    return userGroup.find(u => u.id === id) || null;
}

const addSubscriber = async (req, res) => {

    const present = await checkUserByEmail(req.body.email);
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

const fetchSubscriber = async (req, res) => {
    const {email, password} = req.body;
    const user = await getUser(email, password);

    if (user != null) {
            const {userId, username} = user;
            // create token
            const token = jwt.sign(
                { userId, username },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            // set cookie
            res.cookie("token", token, {
                httpOnly: true,       // prevents JS access (XSS protection)
                secure: false,        // true in production (HTTPS)
                sameSite: "lax",      // or "none" for cross-site
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
    }
    else {
        return res.status(400).json({ message: "No account found with the provided email!" });
    }
};

const getSubscribers = async (req, res) => {
    const adminid = req.params.id;
    if (!adminid) {
        return res.status(400).json({ message: "ID not provided!" });
    }

    const validID = await userLookupWithID(adminid, "admin");
    if (!validID) {
        return res.status(401).json({ message: "Permission Denied" });
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
    return res.status(200).json({ data: customersDataWithoutPassword });
}

const changeSubscriberInfo = async (req, res) => {
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
        return res.status(401).json({ message: "Access denied" });
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

const removeSubscriberAccount = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Invalid ID!" })
    }

    const isPresent = await userLookupWithID(id);
    if (!isPresent) {
        return res.status(400).json({ message: "User does not exist!" });
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
        return res.status(400).json({ message: "Data write failed!" });
    }
    return res.json("Subscriber removed successfully!");
}


const getUsersDataByID = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Invalid ID!" })
    }
    const data = await userLookupWithID(id, "subscriber");
    if (!data) {
        return res.status(400).json({ message: "Data couldn't be fetched!" });
    }
    return res.json(data);
}

const changeSubscriberPassword = async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: "User email not found!" });
    }

    const existingUserData = await getUsersData();
    const user = existingUserData.subscribers.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: "User not found!" })
    }

    if (user) {
        user.password = await bcrypt.hash(req.body.password, 10);
    }

    try {
        await rewriteUserData(existingUserData);
    }
    catch (err) {
        return res.status(400).json({ message: "Could not rewrite data, due to error : " + err });
    }

    // if no error
    return res.status(200).json({ message: "User password changed successfully!" });
}

module.exports = {
    addSubscriber, 
    fetchSubscriber, 
    getSubscribers, 
    changeSubscriberInfo, 
    removeSubscriberAccount, 
    getUsersDataByID, 
    changeSubscriberPassword
};
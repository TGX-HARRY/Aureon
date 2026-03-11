const {getUsersData, writeUserData, rewriteUserData, getMoviesCount, userLookupWithID, checkUserData} = require("../utils/file.utils");

const crypto = require("crypto");

exports.addAdmin = async (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).json({message : "No ID provided!"});
    }
    const validID = await userLookupWithID(id, "admin");
    if (!validID) {
        return res.status(401).json({message : "Access Denied!"});
    }

    const present = await checkUserData(req.body.email, "admin");

    if (present) {
        return res.status(400).json({
            message: "Account already exists!"
        });
    }

    const newAdmin = {
        id: crypto.randomUUID(),
        ...req.body,
        role : "admin"
    };

    await writeUserData(newAdmin);

    return res.status(200).json({
        message : "Admin created successfully!"
    })
};

exports.getAdmins = async (req, res) => {
    const adminid = req.params.id;
    if (!adminid) {
        return res.status(400).json({message : "ID not provided!"});
    }
    
    const validID = await userLookupWithID(adminid, "admin");
    if (!validID) {
        return res.status(401).json({message : "Permission Denied"});
    }

    const existingData = await getUsersData();
    const adminsNames = (existingData.admins || []).map(admin => admin.name);
    if (adminsNames.length === 0) {
        return res.status(404).json({ message: "No admins found" });
    }
    return res.status(200).json({data : adminsNames});
}

exports.getMovieCount = async (req, res) => {
    const movieCount = await getMoviesCount();
    if(!movieCount) {
        res.status(400).json({message : "Error fetching movie count!"});
    }
    else {
        return res.status(200).json({count : movieCount});
    }
}

exports.checkAdminID = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message : "ID not provided!"});
    }

    const data = await getUsersData();
    const presence = data.admins.find(u => u.id === id) || null;
    if (!presence) {
        return res.status(401).json({message : "Access denied!"});
    }

    return res.status(200).json({message : "Admin verified successfully!"});
}
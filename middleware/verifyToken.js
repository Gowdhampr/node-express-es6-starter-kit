// Config
const config = require("../config");

// Models
import models from "../db/models";

// Roles
import {
    USER_ROLE_ID_SUPER_ADMIN,
    USER_ROLE_ID_MANAGER,
    USER_ROLE_ID_CUSTOMER,
    USER_ROLE_ID_EXPERT,
    USER_ROLE_ID_CUSTOMER_ADMIN,
    USER_ROLE_ID_CUSTOMER_MEMBER,
    USER_ROLE_ID_PARTNER,
} from "../routes/userRoute/roles";

// Models
const { user } = models;

module.exports = (req, res, next) => {
    const token = req.header("authorization") || req.query.token;
    // Validate if token is null
    if (!token) {
        return res
            .status(401)
            .send({ message: "Missing authorization header" });
    }

    const currentUrl = req.route.path;

    const defaultKeyRoutes = [];
    // Validate current url is found in the default url
    if (defaultKeyRoutes.indexOf(currentUrl) > -1) {
        // Validate token is not equal to default API key
        if (token !== config.defaultApiKey) {
            return res.status(401).send({ message: "Invalid Token" });
        }
        return next();
    }

    // Get user details
    user.findOne({
        attributes: ["id", "first_name", "last_name", "email", "role_id"],
        where: { token },
    }).then(user => {
        if (!user && token !== config.defaultApiKey) {
            return res.status(401).send({ message: "Invalid Token" });
        }

        if (!user && token === config.defaultApiKey) {
            return next();
        }

        // Validate if user is null
        if (!user) {
            return res.status(401).send({ message: "Unauthorized Token" });
        }

        user = user.get();

        const names = [];
        if (user.first_name) {
            names.push(user.first_name);
        }
        if (user.last_name) {
            names.push(user.last_name);
        }

        user.name = names.join(" ");
        const roleId = parseInt(user.role_id, 10);
        // set value in user
        req.user = user;
        req.isAdmin = roleId === USER_ROLE_ID_SUPER_ADMIN;
        req.isManager = roleId === USER_ROLE_ID_MANAGER;
        req.isCustomer = roleId === USER_ROLE_ID_CUSTOMER;
        req.isExpert = roleId === USER_ROLE_ID_EXPERT;
        req.isCustomerAdmin = roleId === USER_ROLE_ID_CUSTOMER_ADMIN;
        req.isCustomerMember = roleId === USER_ROLE_ID_CUSTOMER_MEMBER;
        req.isPartner = roleId === USER_ROLE_ID_PARTNER;

        return next();
    });
};

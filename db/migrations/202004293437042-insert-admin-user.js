const config = require("../../config");
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize
            .query('SELECT * FROM "user" WHERE email = ? ', {
                replacements: [config.defaultAdminEmail],
                type: queryInterface.sequelize.QueryTypes.SELECT,
            })
            .then(users => {
                if (Object.keys(users).length === 0) {
                    return queryInterface.bulkInsert(
                        "user",
                        [
                            {
                                email: config.defaultAdminEmail,
                                first_name: "Admin",
                                last_name: "Vtronics Automation",
                                role_id: 1,
                                password: "$2b$08$emWmKZhuBiAkOLTZtEVEy./WHsgP7BwmQnO./u.KZWfA5BodM6YdS",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ],
                        {}
                    );
                }
            });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("user");
    },
};

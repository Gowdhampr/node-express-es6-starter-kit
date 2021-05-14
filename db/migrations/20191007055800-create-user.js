export function up(queryInterface, Sequelize) {
    console.log("Creating user table");
    return queryInterface.createTable("user", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        email: {
            type: Sequelize.STRING,
        },
        first_name: {
            type: Sequelize.STRING,
        },
        last_name: {
            type: Sequelize.STRING,
        },
        avatar: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        role_id: {
            type: Sequelize.INTEGER,
        },
        token: {
            type: Sequelize.STRING,
        },
        last_loggedin_at: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        password_token: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        google_auth_token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        linkedin_auth_token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        office365_auth_token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        salesforce_auth_token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        status_updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        email_verification_token: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email_verification: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        verifiedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
        },
    });
}
export function down(queryInterface, Sequelize) {
    console.log("Dropping user table");
    return queryInterface.dropTable("user");
}

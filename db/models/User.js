export default (sequelize, DataTypes) => {
    const user = sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            avatar: DataTypes.STRING,
            token: DataTypes.STRING,
            role_id: DataTypes.INTEGER,
            password_token: DataTypes.STRING,
            last_loggedin_at: DataTypes.DATE,
            google_auth_token: DataTypes.TEXT,
            linkedin_auth_token: DataTypes.TEXT,
            office365_auth_token: DataTypes.TEXT,
            salesforce_auth_token: DataTypes.TEXT,
            email_verification_token: DataTypes.STRING,
            email_verification: DataTypes.INTEGER,
            verifiedAt: DataTypes.DATE,
            status: DataTypes.INTEGER,
            status_updated_at: DataTypes.DATE,
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );

    return user;
};

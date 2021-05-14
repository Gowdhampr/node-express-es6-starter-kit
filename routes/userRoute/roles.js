const roles = (module.exports = {
    USER_ROLE_ID_SUPER_ADMIN: 1,
    USER_ROLE_SUPER_ADMIN: "Super Admin",

    /**
     * Get Role Name By Role
     */
    getRoleNameByRoleId: roleId => {
        if (roleId === roles.USER_ROLE_ID_SUPER_ADMIN) {
            return roles.USER_ROLE_SUPER_ADMIN;
        }

        return "";
    },
});

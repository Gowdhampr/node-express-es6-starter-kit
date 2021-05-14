import models from "../../db/models";
import Sequelize from "sequelize";

// Utils
import {
    defaultDateFormat,
    concatName,
} from "../../lib/utils";

// Constants
import {
    USER_ROLE_ID_SUPER_ADMIN,
    getRoleNameByRoleId,
} from "./roles";

// Models
const { user } = models;

export default (req, res, next) => {
    let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        roleId,
        roleIds,
    } = req.query;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        return res.status(400).send({ message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 10;
    if (isNaN(pageSize)) {
        return res.status(400).send({ message: "Invalid page size" });
    }

    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
        id: "id",
        first_name: "first_name",
        lastName: "last_name",
        email: "email",
        roleId: "role_id",
        last_loggedin_at: "last_loggedin_at",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "createdAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        return res
            .status(400)
            .send({ message: `Unable to sort experts by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        return res.status(400).send({ message: "Invalid sort order" });
    }

    const where = {};

    // Search by Role Id
    if (roleId) {
        where.role_id = roleId;
    }

    // Search by Role Id
    if (roleIds) {
        where.role_id = { $in: roleIds.split(",") };
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            Sequelize.where(
                Sequelize.fn(
                    "concat",
                    Sequelize.col("first_name"),
                    " ",
                    Sequelize.col("last_name")
                ),
                {
                    $ilike: `%${searchTerm}%`,
                }
            ),
            {
                email: {
                    $ilike: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "avatar",
            "last_loggedin_at",
            "role_id",
            "createdAt",
            "updatedAt",
            "status",
        ],
        order: [[sortParam, sortDirParam]],
        where,
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get user list and count
    Promise.all([
        user.findAndCountAll(query),
        user.count({
            where: {
                role_id: {
                    $in: [
                        USER_ROLE_ID_SUPER_ADMIN.toString(),
                    ],
                },
            },
        }),
    ]).then(([results, superAdminCount]) => {
        // Return user is null
        if (results.count === 0) {
            return res.send(null);
        }

        const data = [];
        results.rows.forEach(user => {
            const {
                id,
                first_name,
                last_name,
                email,
                role_id,
                avatar,
                last_loggedin_at,
                createdAt,
                updatedAt,
                status,
            } = user.get();

            const name = concatName(first_name, last_name);

            data.push({
                id,
                name,
                firstName: first_name,
                lastName: last_name,
                email,
                avatar,
                roleId: role_id,
                roleName: getRoleNameByRoleId(parseInt(role_id, 10)),
                lastLoggedinAt: defaultDateFormat(last_loggedin_at),
                createdAt: defaultDateFormat(createdAt),
                updatedAt: defaultDateFormat(updatedAt),
                status,
            });
        });

        res.send({
            totalCount: results.count,
            superAdminCount,
            currentPage: page,
            pageSize,
            data,
            sort: sortParam,
            sortDir: sortDirParam,
        });
    });
};

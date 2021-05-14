import { isUndefined } from "../utils/validator";
const bcrypt = require("bcrypt");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const momentTime = require("moment-timezone");
const config = require("../config");
const timeZone = require("../config").defaultTimeZone;

import { passwordSaltKey } from "../config";

const utils = (module.exports = {
    /**
     * Date Format
     */
    dateFormat: "DD-MM-YYYY",

    /**
     *  Frontend Time
     */
    frontEndTime: "h:mm A",

    /**
     * Default Date Format
     */
    defaultFormat: "MM/DD/YYYY",

    /**
     * Formatted Date Format
     */
    formattedDateFormat: "MMM DD, YYYY",

    /**
     * Formatted Full Date Format
     */
    formattedFullDateFormat: "MMMM DD, YYYY",

    /**
     * MySQL Date Format
     */
    mySQLDateFormat: "YYYY-MM-DD",

    /**
     *
     */
    FrontEndDateTimeFormat: "DD-MM-YYYY hh:mm:ss A",

    /**
     * Frontend 12 hours Date Time format
     */
    frontendDateTime12HoursFormat: "DD MMM, Y h:mm A",

    /**
     * Get Last Page
     *
     * @param count
     * @param pageSize
     * @returns {Number}
     */
    getLastPage: (count, pageSize) => {
        let lastPage = parseInt(count / pageSize, 10);
        lastPage += count % pageSize === 0 ? 0 : 1;

        return lastPage;
    },

    /**
     * Raw URL Decode
     *
     * @param str
     * @returns {*}
     */
    rawURLDecode: str => {
        if (!str) {
            return null;
        }

        try {
            return decodeURIComponent(
                str.replace(/%(?![\da-f]{2})/gi, () => "%25")
            );
        } catch (e) {
            return null;
        }
    },

    /**
     * Remove Undefined Keys
     *
     * @param object
     */
    removeUndefinedKeys: object => {
        const returnObject = {};

        Object.keys(object).forEach(key => {
            if (!isUndefined(object[key])) {
                returnObject[key] = object[key];
            }
        });

        return returnObject;
    },

    /**
     * Get Random String
     *
     * @param str
     */
    getRandomString: str => str || Math.floor(Date.now()).toString(),

    /**
     * Generate Random String
     */
    randomString: (length = 32) => {
        const possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let text = "";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }

        return text;
    },

    /**
     *  Compare new data with old data
     *
     * @param data
     * @param encdata
     * @returns {boolean}
     */
    hasher: (data, encdata) => {
        // if encrypted data is passed, check it against input (data)
        if (encdata) {
            if (bcrypt.compareSync(data, encdata.substr(0, 60))) {
                return true;
            }
            return false;
        }
    },

    /**
     * Get Hash Password
     */
    getHashPassword: (password, callback) => {
        if (!password) {
            return callback();
        }

        // Generate the salt key
        bcrypt.genSalt(8, (err, salt) => {
            if (err) {
                return callback(err);
            }

            let saltKey = "";
            if (passwordSaltKey) {
                saltKey = salt.replace(passwordSaltKey, "");
            }

            // Generate the hash password using password and salt
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return callback;
                }

                return callback(null, password, hash + saltKey);
            });
        });
    },

    /**
     * Generate Random Password
     */
    randomPassword: callback => {
        const password = utils.randomString(8);
        bcrypt.genSalt(8, (err, salt) => {
            if (err) {
                return callback(err);
            }

            const saltKey = salt.replace("$2b$08$", "");
            bcrypt.hash(password, salt, "", (err, hash) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, password, hash + saltKey);
            });
        });
    },

    /**
     * Degree to Radiant
     *
     * @param degree
     * @returns {number}
     */
    degToRad: degree => {
        const pi = Math.PI;

        return Math.abs(Math.cos(degree * (pi / 180)) * 69);
    },

    /**
     * Convert object numeric to string
     *
     * @param object
     * @returns {{}}
     */
    convertObjectNumericToString: object => {
        const convertedObject = {};
        Object.keys(object).forEach(param => {
            convertedObject[param] =
                object[param] !== null && object[param] !== undefined
                    ? object[param].toString()
                    : object[param];
        });

        return convertedObject;
    },

    /**
     * Convert object value to string
     *
     * @param object
     * @returns {{}}
     */
    convertObjectValueToString: object => {
        const convertedObject = {};
        Object.keys(object).forEach(param => {
            convertedObject[param] =
                object[param] !== null && object[param] !== undefined
                    ? object[param].toString().trim()
                    : "";
        });

        return convertedObject;
    },

    /**
     * Get SQl Current Date Time
     */
    getSQlCurrentDateTime: () => moment.utc().format(),

    /***
     * Get Page Details
     *
     * @param count
     * @param currentPage
     * @param pageSize
     * @param currentPageLength
     * @returns {{count: *, currentPage: *, lastPage: Number, pageStart: number, pageEnd: *}}
     */
    getPageDetails: (count, currentPage, pageSize, currentPageLength) => {
        if (typeof count === "object") {
            count = count.length;
        }
        const pageStart = count > 0 ? pageSize * (currentPage - 1) + 1 : 0;
        const pageEnd = count > 0 ? pageStart - 1 + currentPageLength : 0;

        let lastPage = parseInt(count / pageSize, 10);
        lastPage += count % pageSize === 0 ? 0 : 1;

        lastPage = lastPage > 0 ? lastPage : 1;

        return { count, currentPage, lastPage, pageStart, pageEnd };
    },

    /**
     * Custom Date
     *
     * @param date
     * @param fromFormat
     * @param format
     */
    customDate: (date, fromFormat, format = utils.dateFormat) => {
        if (!date) {
            return null;
        }

        return moment(date, fromFormat).format(format);
    },

    /**
     * Get Extension By Type
     *
     * @param fileType
     * @returns {*}
     */
    getExtensionByType: fileType => {
        switch (fileType) {
            case "image/png":
                return "png";
            case "image/jpeg":
            case "image/jpg":
                return "jpg";
            case "image/gif":
                return "gif";
            case "image/bmp":
                return "bmp";
            default:
                return "";
        }
    },

    /**
     * Format Date
     *
     * @param date
     * @param format
     * @returns {string|null}
     */
    formatDate: (date, format = utils.dateFormat) => {
        if (!date) {
            return null;
        }

        return moment(date).format(format);
    },

    /**
     * Default Date Format
     *
     * @param date
     * @param format
     * @returns {null|*}
     */
    defaultDateFormat: (date, format = utils.defaultFormat) => {
        if (!date) {
            return null;
        }

        return moment(date).format(format);
    },

    /**
     * Formatted Date
     *
     * @param date
     * @param format
     * @returns {string|null}
     */
    formattedDate: (date, format = utils.formattedDateFormat) => {
        if (!date) {
            return null;
        }

        return moment(date).format(format);
    },

    /**
     * Get Ago
     *
     * @param date
     */
    ago: date => moment(date).fromNow(),

    /**
     * Get Concat Name
     *
     * @param firstName
     * @param lastName
     * @returns {*}
     */
    concatName: (firstName, lastName) => {
        let name = [];

        if (firstName) {
            name.push(firstName);
        }

        if (lastName) {
            name.push(lastName);
        }

        if (name) {
            return name.join(" ");
        }

        return "";
    },

    /**
     * Get Profile Initials
     *
     * @param firstName
     * @param lastName
     * @returns {string}
     */
    getInitials: (firstName, lastName) => {
        const initial = [];

        if (firstName) {
            initial.push(firstName[0]);
        }

        if (lastName) {
            initial.push(lastName[0]);
        }

        if (initial.length === 1 && firstName) {
            initial.push(firstName[1]);
        }

        return initial.join(" ");
    },

    /**
     * Get SQl Formatted Date
     *
     * @param date
     * @param format
     */
    getSQlFormattedDate: (date = "", format = utils.mySQLDateFormat) => {
        if (date) {
            return moment(date).format(format);
        }
        return moment().format(format);
    },

    /**
     * Format Local Date
     *
     * @param date
     * @param format
     */
    formatLocalDate: (date, format = utils.dateFormat) => {
        if (!date) {
            return null;
        }

        return momentTime(date)
            .tz(timeZone)
            .format(format);
    },

    /**
     * Formatted date time
     *
     * @param date
     * @returns {null|*}
     */
    formatDateTime: date => {
        if (!date) {
            return null;
        }

        return moment(date).format(utils.frontEndTime);
    },

    /**
     * Is Base64
     *
     * @param string
     * @returns {boolean}
     */
    isBase64: string => {
        const base64RegEx = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!\$&',\(\)\*\+,;=\-\._~:@\/\?%\s]*\s*$/i;
        if (!base64RegEx.test(string)) {
            return false;
        }

        return true;
    },

    /**
     * Get days difference
     *
     * @param startDate
     * @param endDate
     */
    getDateDiffInDays: (startDate, endDate) => {
        startDate = moment(startDate, "MMM DD, YYYY");
        endDate = moment(endDate, "MMM DD, YYYY");

        return endDate.diff(startDate, "days");
    },

    /**
     * get IP Address from request
     *
     * @param req
     * @returns {String}
     */
    getIpFromRequest: req => {
        const ip =
            (req.headers["x-forwarded-for"] || "")
                .split(",")
                .pop()
                .trim() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            "";
        return ip;
    },
});

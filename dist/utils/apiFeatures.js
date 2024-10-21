"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(dbQuery, queryString) {
        this.dbQuery = dbQuery;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        const queryStr = JSON.stringify(queryObj);
        const filterOptions = JSON.parse(queryStr.replace(/\b(gt|gte|ls|lte)\b/g, (match) => `$${match}`));
        this.dbQuery = this.dbQuery.find(filterOptions);
        return this;
    }
    sort() {
        let sortOptions;
        if (this.queryString.sort) {
            sortOptions = String(this.queryString.sort).split(",").join(" ");
        }
        else {
            sortOptions = "createdAt";
        }
        console.log(sortOptions);
        this.dbQuery = this.dbQuery.sort(sortOptions);
        return this;
    }
    limitFields() {
        let fieldsOptions;
        if (this.queryString.fields) {
            fieldsOptions = String(this.queryString.fields)
                .split(",")
                .join(" ");
        }
        else {
            fieldsOptions = "-__v";
        }
        this.dbQuery = this.dbQuery.select(fieldsOptions);
        return this;
    }
    paginate() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 100;
        const skip = (page - 1) * limit;
        this.dbQuery = this.dbQuery.skip(skip).limit(limit);
        return this;
    }
}
exports.default = APIFeatures;

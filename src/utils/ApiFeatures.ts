import { Query } from "mongoose";

export default class APIFeatures<T> {
    dbQuery: Query<T[], T>;
    queryString: Record<string, any>;
    constructor(dbQuery: Query<T[], T>, queryString: Record<string, any>) {
        this.dbQuery = dbQuery;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        const queryStr = JSON.stringify(queryObj);
        const filterOptions = JSON.parse(
            queryStr.replace(/\b(gt|gte|ls|lte)\b/g, (match) => `$${match}`)
        );
        this.dbQuery = this.dbQuery.find(filterOptions);
        return this;
    }
    sort() {
        let sortOptions: string;
        if (this.queryString.sort) {
            sortOptions = String(this.queryString.sort).split(",").join(" ");
        } else {
            sortOptions = "createdAt";
        }
        this.dbQuery = this.dbQuery.sort(sortOptions);
        return this;
    }
    limitFields() {
        let fieldsOptions: string;
        if (this.queryString.fields) {
            fieldsOptions = String(this.queryString.fields)
                .split(",")
                .join(" ");
        } else {
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

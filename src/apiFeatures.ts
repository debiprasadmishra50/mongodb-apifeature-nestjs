import { Query } from "mongoose";

export class APIFeatures {
    /**
     * Takes a Query and request query Parameters as input and returns the Required filtered query with sorting, pagination and field limits
     * @param {Query} query Query --> Model.find()
     * @param queryParams Request Parameter Object --> req.query
     * @returns Formatted Query
     */
    constructor(private _query: Query<any, any>, private queryParams: any) {
        // this.query = query;
        // this.queryParams = queryParams;
    }
    public get query(): Query<any, any> {
        return this._query;
    }
    public set query(value: Query<any, any>) {
        this._query = value;
    }

    /**
     * This method filters the page, sort, limit and field functionality and creates appropriate query based on your query filter object
     * @returns filtered query parameters
     */
    filter() {
        let queryObj = { ...this.queryParams };

        // 1. FILTERING
        const excludeFields = ["page", "sort", "limit", "fields"]; // remove these fields as they're functionalities
        excludeFields.forEach((el) => delete queryObj[el]);

        // 2. ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        // prettier-ignore
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        queryObj = JSON.parse(queryStr);

        // BUILD QUERY
        // let query = Tour.find(queryObj, "-_id");
        this.query = this.query.find(queryObj);

        return this;
    }

    /**
     * Sorts the documents according the the sorting field provided,
     * @default sort by id field
     * @returns query with sorting functionality
     */
    sort() {
        if (this.queryParams.sort) {
            const sortBy = this.queryParams.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("_id");
        }

        return this;
    }

    /**
     * Creates query by filtering the fields that you wish to see
     * @returns field limited query
     */
    limitFields() {
        if (this.queryParams.fields) {
            const fields = this.queryParams.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }

        return this;
    }

    /**
     * Returns query giving results as per the paginated values
     * @default page = 1, limit = 100
     * @returns paginated query
     */
    paginate() {
        const page = +this.queryParams.page || 1;
        const limit = +this.queryParams.limit || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

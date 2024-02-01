class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Search features for a specific query string
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"  // for case insensitive
            }
        } : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    // Filter for categories
    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = ['keyword', 'pagination', 'limit'];
        removeFields.forEach(key => delete queryCopy[key]);

        // Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
 
  // Pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this.query;
}


}

module.exports = ApiFeatures;

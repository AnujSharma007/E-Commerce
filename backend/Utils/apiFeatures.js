class ApiFeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.querystr };

    console.log("checkHere  --->>>>", queryCopy);

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => {
      delete queryCopy[key];
    });

    // Filter for price and rating
    console.log("before", queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    console.log("after", queryStr);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // this.query = this.query.find(queryCopy);

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.querystr.page) || 1;

    const stuffsToBeSkkiped = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(stuffsToBeSkkiped); // this --> this.query = productSchema.find() and these limit and skip is just mongo aggregation

    return this;
  }
}

module.exports = ApiFeatures;

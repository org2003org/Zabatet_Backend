class ApiResponse {
    constructor(statusCode, data = null, message = null, total = null, page = null, limit = null, totalPages = null) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        if (page) {
            this.currentPage = page;
            this.limit = limit;
            this.totalProducts = total;
            this.totalPages = totalPages;
        }
    }
}

export default ApiResponse;
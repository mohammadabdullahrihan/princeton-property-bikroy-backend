const mongoose = require("mongoose");

/**
 * Base Controller for handling generic CRUD operations.
 * This ensures you don't have to write basic Add/Update/Delete/Get functions
 * for every new module.
 */
class BaseController {
  constructor(model, searchFields = [], populateFields = []) {
    this.model = model;
    this.searchFields = searchFields; // Fields to search on (e.g., ['name', 'description'])
    this.populateFields = populateFields; // Fields to populate
  }

  /**
   * Get all documents with pagination, sorting, and filtering
   */
  getAll = async (req, res, next) => {
    try {
      let query;
      const reqQuery = { ...req.query };

      // Fields to exclude from normal matching
      const removeFields = ["select", "sort", "page", "limit", "search"];
      removeFields.forEach((param) => delete reqQuery[param]);

      // Create initial query
      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`,
      );
      query = this.model.find(JSON.parse(queryStr));

      // Search functionality
      if (req.query.search && this.searchFields.length > 0) {
        const searchRegex = new RegExp(req.query.search, "i");
        const searchConditions = this.searchFields.map((field) => ({
          [field]: searchRegex,
        }));
        query = query.or(searchConditions);
      }

      // Select specific fields
      if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
      }

      // Sort
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt"); // Default sort
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await this.model.countDocuments(query.getFilter());

      query = query.skip(startIndex).limit(limit);

      // Populate related fields
      if (this.populateFields && this.populateFields.length > 0) {
        this.populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const results = await query;

      // Pagination result details
      const pagination = {};
      if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
      }
      if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
      }

      res.status(200).json({
        success: true,
        count: results.length,
        pagination,
        total,
        data: results,
      });
    } catch (error) {
      this.handleError(res, error, next);
    }
  };

  /**
   * Get a single document by ID
   */
  getOne = async (req, res, next) => {
    try {
      let query = this.model.findById(req.params.id);

      if (this.populateFields && this.populateFields.length > 0) {
        this.populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const doc = await query;

      if (!doc) {
        return res
          .status(404)
          .json({ success: false, message: "Resource not found" });
      }

      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      this.handleError(res, error, next);
    }
  };

  /**
   * Create a new document
   */
  create = async (req, res, next) => {
    try {
      const doc = await this.model.create(req.body);

      res.status(201).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      this.handleError(res, error, next);
    }
  };

  /**
   * Update an existing document
   */
  update = async (req, res, next) => {
    try {
      let doc = await this.model.findById(req.params.id);

      if (!doc) {
        return res
          .status(404)
          .json({ success: false, message: "Resource not found" });
      }

      doc = await this.model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      this.handleError(res, error, next);
    }
  };

  /**
   * Delete a document
   */
  delete = async (req, res, next) => {
    try {
      const doc = await this.model.findById(req.params.id);

      if (!doc) {
        return res
          .status(404)
          .json({ success: false, message: "Resource not found" });
      }

      await doc.deleteOne();

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      this.handleError(res, error, next);
    }
  };

  /**
   * Generic error handler
   */
  handleError = (res, error, next) => {
    console.error(error);
    if (next && typeof next === "function") {
      return next(error);
    }
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  };
}

module.exports = BaseController;

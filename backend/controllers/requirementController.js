const requirementModel = require('../models/requirementModel');
const scholarshipModel = require('../models/scholarshipModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const requirementController = {
  getAll: async (req, res, next) => {
    try {
      const requirements = await requirementModel.findAll();
      return successResponse(res, 'Requirements retrieved successfully', requirements);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const requirement = await requirementModel.findById(id);
      if (!requirement) {
        return errorResponse(res, 'Requirement not found', [], 404);
      }
      return successResponse(res, 'Requirement retrieved successfully', requirement);
    } catch (error) {
      next(error);
    }
  },

  getByScholarship: async (req, res, next) => {
    try {
      const { scholarshipId } = req.params;
      const requirement = await requirementModel.findByScholarshipId(scholarshipId);
      if (!requirement) {
        return errorResponse(res, 'Requirement for this scholarship not found', [], 404);
      }
      return successResponse(res, 'Requirement retrieved successfully', requirement);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { beasiswa_id, ipk_minimum, semester_minimum, dokumen_persyaratan } = req.body;

      // Verify scholarship exists
      const scholarship = await scholarshipModel.findById(beasiswa_id);
      if (!scholarship) {
        return errorResponse(res, 'Referenced scholarship does not exist', [], 404);
      }

      // Prevent duplicate requirement for the same scholarship
      const existing = await requirementModel.findByScholarshipId(beasiswa_id);
      if (existing) {
        return errorResponse(res, 'Requirements for this scholarship already exist', [], 400);
      }

      const insertId = await requirementModel.create({
        beasiswa_id,
        ipk_minimum,
        semester_minimum,
        dokumen_persyaratan,
      });

      const newRequirement = await requirementModel.findById(insertId);
      return successResponse(res, 'Requirement created successfully', newRequirement, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { beasiswa_id, ipk_minimum, semester_minimum, dokumen_persyaratan } = req.body;

      const existing = await requirementModel.findById(id);
      if (!existing) {
        return errorResponse(res, 'Requirement not found', [], 404);
      }

      // Verify scholarship exists if beasiswa_id changed
      if (parseInt(beasiswa_id, 10) !== existing.beasiswa_id) {
        const scholarship = await scholarshipModel.findById(beasiswa_id);
        if (!scholarship) {
          return errorResponse(res, 'Referenced scholarship does not exist', [], 404);
        }

        // Prevent duplicate if moving to another scholarship
        const dupCheck = await requirementModel.findByScholarshipId(beasiswa_id);
        if (dupCheck) {
          return errorResponse(res, 'Requirements for this scholarship already exist', [], 400);
        }
      }

      await requirementModel.update(id, {
        beasiswa_id,
        ipk_minimum,
        semester_minimum,
        dokumen_persyaratan,
      });

      const updated = await requirementModel.findById(id);
      return successResponse(res, 'Requirement updated successfully', updated);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await requirementModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Requirement not found', [], 404);
      }

      await requirementModel.delete(id);
      return successResponse(res, 'Requirement deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = requirementController;

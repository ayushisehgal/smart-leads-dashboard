import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';
import { AuthRequest, LeadFilterOptions, PaginationMeta } from '../types';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort = 'latest', page = 1, limit = 10 } =
      req.query as LeadFilterOptions & Record<string, string>;

    const query: Record<string, unknown> = {};
    if (req.user?.role === 'sales') query.createdBy = req.user.id;
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(query),
    ]);

    const meta: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    };

    res.json({ success: true, data: leads, meta });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied' }); return;
    }
    res.json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ success: false, message: errors.array()[0].msg }); return; }
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ success: false, message: errors.array()[0].msg }); return; }
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied' }); return;
    }
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied' }); return;
    }
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: Record<string, unknown> = {};
    if (req.user?.role === 'sales') query.createdBy = req.user.id;
    const leads = await Lead.find(query).populate('createdBy', 'name email').lean();
    const fields = ['name', 'email', 'status', 'source', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(leads);
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch {
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};
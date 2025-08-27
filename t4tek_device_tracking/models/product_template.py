import logging

from odoo import fields, models, api, _
from odoo.exceptions import ValidationError, UserError
_logger = logging.getLogger(__name__)

class ProductTemplate(models.Model):
    _inherit = 'product.template'
    product_type_id = fields.Many2one('product.type', string='Loại sản phẩm')

    # tracking = fields.Selection(
    #     selection=[('serial', 'By Unique Serial Number')],
    #     string="Tracking",
    #     default='serial',
    #     required=True
    # )

    
    @api.onchange('tracking')
    def _onchange_tracking(self):
        if self.tracking != 'serial':
            self.tracking = 'serial'
        else:
            raise UserError(_("Chỉ được phép chọn 'serial' cho sản phẩm này."))


        
    @api.model
    def write(self, vals):
        # Nếu có logic với is_storable thì thêm ở đây
        if "is_storable" in vals and not vals["is_storable"]:
            # Nếu không cho lưu kho thì buộc tracking về none
            vals["is_storable"] = True
        # Nếu có truyền field tracking
        if "tracking" in vals:
            # Chỉ cho phép các giá trị hợp lệ
            valid_values = ["none", "lot", "serial"]
            if vals["tracking"] != "serial":
                # Nếu sai thì đưa về default (none)
                vals["tracking"] = "serial"
        return super(ProductTemplate, self).write(vals)
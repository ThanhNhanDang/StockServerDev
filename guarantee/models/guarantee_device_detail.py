from odoo import models, fields, api
import logging
_logger = logging.getLogger(__name__)

class GuaranteeDeviceDetail(models.Model):
      _name = 'guarantee.device.detail'
      
      general_id = fields.Many2one('guarantee.device.genaral', string='Guarantee General', required=True)
      
      guarantee_reason = fields.Text(string='Lý do BH', required=False)
      guarantee_loacation = fields.Char(string='Khu vực BH', required=True)

      receive_date = fields.Date(string='Ngày nhận', required=False)
      repair = fields.Text(string='Sữa chữa', required=False)
      repair_time = fields.Date(string='Thời gian sửa', required=False)
      repair_done = fields.Boolean(string='Xong', default=False)
      handover_date = fields.Date(string='Ngày hoàn trả', required=False)

      note = fields.Text(string='Ghi chú', required=False)

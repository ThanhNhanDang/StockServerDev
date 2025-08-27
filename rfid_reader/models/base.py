# -*- coding: utf-8 -*-

from odoo import _, _lt, api, fields, models
from odoo.osv.expression import AND
from odoo.exceptions import UserError
import json
import logging
_logger = logging.getLogger(__name__)

SEARCH_PANEL_ERROR_MESSAGE = _lt("Too many items to display.")

SEARCH_PANEL_LIMIT = 1000


# todo: Use monkey patch to process in web modules, without affecting subsequent inheritance
class Base(models.AbstractModel):
    _inherit = 'base'

    def rfid_save_record(self):
        _logger.info(self)
        return

   
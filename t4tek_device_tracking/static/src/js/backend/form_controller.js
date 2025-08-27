/* @odoo-module */

import { patch } from '@web/core/utils/patch';
import { utils } from '@web/core/ui/ui_service';
import { useBus, useService } from '@web/core/utils/hooks';
import { onWillRender, onPatched, useState, useEffect, onMounted } from '@odoo/owl';
import { FormController } from '@web/views/form/form_controller';

patch(FormController.prototype, {
    setup() {
        super.setup();
    },
});
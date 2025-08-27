{# Part of Odoo. See LICENSE file for full copyright and licensing details.
 # Tên module
    'name': 'guarantee',
    'version': '18.0',

    # Loại module
    'category': 'guarantee',


    # Độ ưu tiên module trong list module
    # Số càng nhỏ, độ ưu tiên càng cao
    #### Chấp nhận số âm
    #'sequence': 5,

    # Mô tả module
    "summary": "Bảo hành thiết bị theo Stact ID",
    'description': 'Bảo hành thiết bị theo Stact ID',
    'author': 'GinGa GX',

    "depends": [
        "base", "product", "account", "sale" ],
    
    
    "data": [
        # 'security/access_user.xml',
        'security/ir.model.access.csv',
        'views/guarantee_device.xml',
        # 'views/invoice_report.xml',
        # 'views/wallet_contact.xml',
        # 'data/cron_invoice.xml',
        # 'views/menu_item.xml',
       
        
        
    ],

    'assets': {
        'web.assets_backend':
        [
            'guarantee/static/src/js/**/*',
            'guarantee/static/src/xml/**/*',
        ],
#         
    },
    "installable": True,
    "license": "LGPL-3",
}

/* @odoo-module */

import { patch } from '@web/core/utils/patch';
import { useState, onWillStart } from '@odoo/owl';
import { StatusBarButtons } from '@web/views/form/status_bar_buttons/status_bar_buttons';
import { useService } from "@web/core/utils/hooks";
import { CardPaymentPopupV2 } from "./card_payment_popup_v2";

patch(StatusBarButtons.prototype, {
    setup() {
        super.setup();
        this.scanState = useState({
            is_loading: false
        });
        this.isShowScanButton = this.env.model.config.context.show_scan_button;
        this.dialog = useService("dialog");
        this.action = useService("action");

        // Reference để lưu trữ methods từ CardPaymentPopupV2
        this.cardPaymentRef = null;

        onWillStart(() => {
            if (this.isShowScanButton) {
                this.dialog.add(CardPaymentPopupV2, {
                    // Callback functions
                    onScanResult: this.handleScanResult.bind(this),
                    onStopResult: this.handleStopResult.bind(this),
                    // Expose reference để có thể gọi methods
                    exposeRef: (ref) => {
                        this.cardPaymentRef = ref;
                    }
                }, {
                    // Dialog options
                });
            }
        })
    },

    // Logic hiển thị button "Quét" 
    get showScanButton() {
        return !this.scanState.is_loading;
    },

    // Logic hiển thị button "Dừng quét"
    get showStopButton() {
        return this.scanState.is_loading;
    },

    // Khi nhấn "Quét" - gọi hàm trong CardPaymentPopupV2
    async onClickScan() {
        if (await this.env.model.root.save()) {
            if (!this.cardPaymentRef) {
                console.error("CardPaymentPopupV2 reference not available");
                return;
            }

            this.scanState.is_loading = true;

            try {
                if (this.env.model.config.context.generate_cards)
                    // Gọi hàm startScan trong CardPaymentPopupV2
                    await this.cardPaymentRef.startScan({
                        "type": "generate_cards",
                        "id": this.env.model.root.resId,
                        "model": this.env.model.resModel,
                    });

                else if (this.env.model.config.context.scan_cards) {
                    await this.cardPaymentRef.startScan({
                        "type": "scan_cards",
                        "id": this.env.model.root.resId,
                        "model": this.env.model.resModel,
                    });
                }
            } catch (error) {
                console.error("Error starting scan:", error);
                this.scanState.is_loading = false;
            }
        }
    },

    // Khi nhấn "Dừng quét" - gọi hàm trong CardPaymentPopupV2
    async onClickStop() {
        if (!this.cardPaymentRef) {
            console.error("CardPaymentPopupV2 reference not available");
            return;
        }

        try {
            // Gọi hàm stopScan trong CardPaymentPopupV2
            const result = await this.cardPaymentRef.stopScan();
            console.log("Scan stopped:", result);
        } catch (error) {
            console.error("Error stopping scan:", error);
        } finally {
            this.scanState.is_loading = false;
        }
    },

    // Callback khi có kết quả từ quá trình quét
    handleScanResult(result) {

        if (result.success) {
            // Xử lý khi quét thành công
            this.env.model.load();
            // Có thể hiển thị notification, update UI, etc.
        } else {
            // Xử lý khi quét thất bại
            console.error("Scan failed:", result.error);
            // Có thể hiển thị error message
        }
    },

    // Callback khi có kết quả từ việc dừng quét
    handleStopResult(result) {
        console.log("Stop result received:", result);

        if (result.success) {
            if (result.isAutoStop) {
                console.log("Auto-stopped after 30 seconds:", result.message);
                // Có thể hiển thị notification đặc biệt cho auto-stop
            } else {
                console.log("Manually stopped:", result.message);
            }
        } else {
            console.error("Stop failed:", result.error);
        }

        // Đảm bảo loading state được reset
        this.scanState.is_loading = false;
    }
});
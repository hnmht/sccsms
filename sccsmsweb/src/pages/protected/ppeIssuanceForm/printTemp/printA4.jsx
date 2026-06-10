import { forwardRef } from "react";
import { DateTimeFormat } from "../../../../i18n/dayjs";
import { ConvertFloatFormat } from "../../../../utils/tools";
import "./printA4.css";

// SUM PPE Issuance Form Data 
const sumVoucherData = (voucherData) => {
    const ppeCount = [];
    let ppeMap = new Map();
    let countMap = new Map();
    voucherData.body.forEach(row => {
        if (!ppeMap.get(row.ppe.id)) {
            ppeMap.set(row.ppe.id, row.ppe);
            countMap.set(row.ppe.id, row.quantity);
        } else {
            let count = countMap.get(row.ppe.id);
            countMap.set(row.ppe.id, row.quantity + count);
        }
    });
    countMap.forEach((v, k) => {
        const lpC = { ppe: ppeMap.get(k), quantity: v };
        ppeCount.push(lpC);
    });

    return ppeCount;
};
// Print PPE Issuance Form Register
export const PPEIFPrintRegFormA4 = forwardRef((props, ref) => {
    const { voucherData, t } = props;
    return (
        <div ref={ref} className="printContent">
            <header><h2>{t("ppeIssuanceRegister")}</h2></header>
            <div className="voucherHeader">
                <p className="headColumn">{t("billNumber")}:{voucherData.billNumber}</p>
                <p className="headColumn">{t("billDate")}:{DateTimeFormat(voucherData.billDate,"L")}</p>
                <p className="headColumn">{t("department")}:{voucherData.department.name}</p>
                <p className="headColumn">{t("period")}:{t(voucherData.period) + " (" + DateTimeFormat(voucherData.startDate,"L") + "-" + DateTimeFormat(voucherData.endDate,"L") + ")"}</p>
                <p className="headColumn">{t("description")}:{voucherData.description}</p>
            </div>
            <div className="voucherBody">
                <table style={{ width: "100%" }}>
                    <thead style={{ width: "100%" }}>
                        <tr style={{ width: "100%" }}>
                            <th className="rowNumber">{t("rowNumber")}</th>
                            <th className="recipient">{t("recipient")}</th>
                            <th className="opName">{t("position")}</th>
                            <th className="deptName">{t("department")}</th>
                            <th className="lpName">{t("ppeName")}</th>
                            <th className="lpModel">{t("ppeModel")}</th>
                            <th className="lpUnit">{t("ppeUnit")}</th>
                            <th className="quantity">{t("quantity")}</th>
                            <th className="sign">{t("sign")}</th>
                            <th className="description">{t("description")}</th>
                        </tr>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                        {voucherData.body.map((row, index) => {
                            return <tr key={index} style={{ width: "100%" }}>
                                <td className="rowNumber">{row.rowNumber}</td>
                                <td className="recipient">{row.recipient.name}</td>
                                <td className="opName">{row.positionName}</td>
                                <td className="deptName">{row.deptName}</td>
                                <td className="lpName">{row.ppe.name}</td>
                                <td className="lpModel">{row.ppe.model}</td>
                                <td className="lpUnit">{row.ppe.unit}</td>
                                <td className="quantityBody">{ConvertFloatFormat(row.quantity)}</td>
                                <td className="sign"></td>
                                <td className="description">{row.description}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <footer>
                    <p>{t("issuer")}:___________</p>
                    <p>{t("date")}:____________________</p>
                </footer>
            </div>
        </div>
    )
});

// Print PPE Issucance Form Delivery Note
export const PPEIFPrintDeliveryA4 = forwardRef((props, ref) => {
    const { voucherData, t } = props;
    const countData = sumVoucherData(voucherData);

    return (
        <div ref={ref} className="printContent">
            <header><h2>{t("ppeDeliveryNote")}</h2></header>
            <div className="voucherHeader">
                <p className="headColumn">{t("billNumber")}:{voucherData.billNumber}</p>
                <p className="headColumn">{t("billDate")}:{DateTimeFormat(voucherData.billDate,"L")}</p>
                <p className="headColumn">{t("department")}:{voucherData.department.name}</p>
                <p className="headColumn">{t("period")}:{t(voucherData.period) + " (" + DateTimeFormat(voucherData.startDate,"L") + "-" + DateTimeFormat(voucherData.endDate,"L")+ ")"}</p>
                <p className="headColumn">{t("description")}:{voucherData.description}</p>
            </div>
            <div className="voucherBody">
                <table style={{ width: "100%" }}>
                    <thead style={{ width: "100%" }}>
                        <tr style={{ width: "100%" }}>
                            <th className="deptName">{t("ppeCode")}</th>
                            <th className="lpName">{t("ppeName")}</th>
                            <th className="lpModel">{t("ppeModel")}</th>
                            <th className="lpUnit">{t("ppeUnit")}</th>
                            <th className="quantity">{t("quantity")}</th>
                            <th className="description">{t("description")}</th>
                        </tr>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                        {countData.map((row, index) => {
                            return <tr key={index} style={{ width: "100%" }}>
                                <td className="rowNumber">{row.ppe.code}</td>
                                <td className="recipient">{row.ppe.name}</td>
                                <td className="opName">{row.ppe.model}</td>
                                <td className="lpUnit">{row.ppe.unit}</td>
                                <td className="quantityBody">{ConvertFloatFormat(row.quantity)}</td>
                                <td className="description"></td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <footer>
                    <p>{t("issuer")}:___________</p>
                    <p>{t("date")}:____________________</p>
                </footer>
            </div>
        </div>
    )
});



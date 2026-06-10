import { Card, MD3Theme, Text } from "react-native-paper";
import { DateTimeFormat } from "../../i18n/dayjs";
import { VoucherStatus } from "../../constant/voucherStatus";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { TFunction } from "i18next";

interface EOCardContentProps {
    eo: ExecutionOrder;
    isLocal: boolean;
    t: TFunction;
    theme: MD3Theme;
}

function EOCardContent({ eo, isLocal, t, theme }: EOCardContentProps) {
    return (
        <Card.Content key={`cardcontent${eo.id}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("billNumber")} : {isLocal ? `LE${eo.id}` : eo.billNumber}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("billDate")} : {DateTimeFormat(eo.billDate, "LL")}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("csa")} : {eo.csa.name}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("ept")} : {eo.ept.name}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("startTime")} : {DateTimeFormat(eo.startTime, "LLL")}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("endTime")} : {DateTimeFormat(eo.endTime, "LLL")}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("status")} : {VoucherStatus[eo.status]}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("executor")} : {eo.creator.name}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("department")} : {eo.department.name}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("description")} : {eo.description}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceType")} : {eo.sourceType}</Text>
            {eo.sourceType !== "UA"
                ? <>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceBillNumber")} : {eo.sourceBillNumber}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceRowNumber")} : {eo.sourceRowNumber}</Text>
                </>
                :null
            }       
        </Card.Content>
    );
};

export default EOCardContent;
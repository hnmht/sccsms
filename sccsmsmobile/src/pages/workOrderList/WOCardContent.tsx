import { Card, MD3Theme, Text } from "react-native-paper";
import { DateTimeFormat } from "../../i18n/dayjs";
import { VoucherStatus } from "../../constant/voucherStatus";
import { WorkOrder } from "../../dataType/types/workOrder";
import { TFunction } from "i18next";

interface WOCardContentProps {
    wo: WorkOrder;
    isLocal: boolean;
    t: TFunction;
    theme: MD3Theme;
}

const WOCardContent = ({ wo, isLocal, t, theme }: WOCardContentProps) => {
    return (
        <Card.Content key={`wocardcontent${wo.id}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("billNumber")} : {isLocal ? `LW${wo.id}` : wo.billNumber}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("billDate")} : {DateTimeFormat(wo.billDate, "LL")}</Text>
            {isLocal
                ? <Text variant="bodyMedium" style={{ width: "100%" }}>{t("lineCount")} :{wo.body.length}</Text>
                : null
            }
            <Text variant="bodyMedium" style={{ width: "100%" }}>{t("operationDate")} : {DateTimeFormat(wo.workDate, "LL")}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>{t("status")} : {t(VoucherStatus[wo.status])}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>{t("creator")} : {wo.creator.name}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>{t("department")} : {wo.department.name}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>{t("description")} : {wo.description}</Text>
        </Card.Content>
    );
};

export default WOCardContent;
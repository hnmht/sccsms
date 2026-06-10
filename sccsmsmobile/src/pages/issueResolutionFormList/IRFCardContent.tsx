import { Card, MD3Theme, Text } from "react-native-paper";
import { View } from "react-native";
import { DateTimeFormat } from "../../i18n/dayjs";
import { VoucherStatus } from "../../constant/voucherStatus";
import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { TFunction } from "i18next";

interface IRFCardContentProps {
    irf: IssueResolutionForm;
    isLocal: boolean;
    t: TFunction;
    theme: MD3Theme;
}

function IRFCardContent({ irf, isLocal, t, theme }: IRFCardContentProps) {
    return (
        <Card.Content key={`ddcardcontent${irf.id}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("billNumber")} : {isLocal ? `LD${irf.id}` : irf.billNumber}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("status")} : {VoucherStatus[irf.status]}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("csa")} : {irf.csa.name}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("epa")} : {irf.epa.name}</Text>
            <View style={{ width: "100%", height: 24, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                <Text variant="titleMedium" maxFontSizeMultiplier={1.4} selectable>{t("riskLevel")} : {irf.riskLevel.name} </Text>
                <View style={{ height: "100%", width: 48, backgroundColor: irf.riskLevel.color, borderRadius: 8 }}></View>
            </View>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("executionValueDisp")} : {irf.executionValueDisp}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("eoDescription")} : {irf.eoDescription}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("billDate")} : {DateTimeFormat(irf.billDate, "LL")}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("creator")} : {irf.creator.name}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("startTime")} : {DateTimeFormat(irf.startTime, "LLL")}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("endTime")} : {DateTimeFormat(irf.endTime, "LLL")}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("description")} : {irf.description}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("department")} : {irf.department.name}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceType")} : {irf.sourceType}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceBillNumber")} : {irf.sourceBillNumber}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceRowNumber")} : {irf.sourceRowNumber}</Text>
        </Card.Content>
    );
};

export default IRFCardContent;
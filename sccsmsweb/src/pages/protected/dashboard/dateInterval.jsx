import { useState } from "react";
import { Card, CardHeader, Divider, CardContent, CardActions, Button, Typography } from "@mui/material";
import { dayjs } from "../../../i18n/dayjs";
import ScInput from "../../../component/ScInput";

const checkErr = (interval) => {
    let errMsg = { isErr: false, errMsg: "" };
    if (!dayjs(interval.startDate).isValid()) {
        errMsg = { isErr: true, errMsg: "invalidStartDate" }
        return errMsg;
    }
    if (!dayjs(interval.endDate).isValid()) {
        errMsg = { isErr: true, errMsg: "invalidEndDate" }
        return errMsg;
    }
    if (dayjs(interval.endDate).isBefore(interval.startDate)) {
        errMsg = { isErr: true, errMsg: "startDateLateThanEndDate" }
        return errMsg;
    }
    return errMsg;
}

const DateInterval = ({ initValue, onOk, onCancel, t }) => {
    const [interval, setInterval] = useState(initValue);
    const err = checkErr(interval);

    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (interval === undefined) {
            return
        }
        setInterval((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value
            });
        });
    };

    return (
        <Card>
            <CardHeader title={t("dateRange")} />
            <Divider />
            <CardContent>
                <ScInput
                    dataType={306}
                    allowNull={false}
                    isEdit={true}
                    itemShowName="startDate"
                    itemKey="startDate"
                    initValue={interval.startDate}
                    pickDone={handleGetValue}
                    isBackendTest={false}
                    key="startDate"
                    positionID={0}
                    rowIndex={-1}
                />
                <ScInput
                    dataType={306}
                    allowNull={false}
                    isEdit={true}
                    itemShowName="endDate"
                    itemKey="endDate"
                    initValue={interval.endDate}
                    pickDone={handleGetValue}
                    isBackendTest={false}
                    key="endDate"
                    positionID={0}
                    rowIndex={-1}
                />
                {err.isErr
                    ? <Typography color="error">{t(err.errMsg)}</Typography>
                    : null
                }
            </CardContent>
            <Divider />
            <CardActions>
                <Button variant="contained" sx={{ m: 2 }} onClick={() => onOk(interval)} disabled={err.isErr}>{t("ok")}</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={onCancel}>{t("cancel")}</Button>
            </CardActions>
        </Card>
    );
};

export default DateInterval;
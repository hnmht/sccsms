import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
    InputLabel,
    TextField,
    InputBase,
} from "@mui/material";
import { EpochTime, DateTimeFormat, CheckTimeZero } from "../../../i18n/dayjs";

// 308 Seacloud Date Display component
const ScDateDisplay = ({
    positionID = -1,
    rowIndex = -1,
    allowNull = false,
    itemShowName = "",
    itemKey,
    initValue = EpochTime,  
}) => {
    const isZero = CheckTimeZero(initValue);
    const content = isZero ? "" : DateTimeFormat(initValue, "L");
    const id = `308_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    return (positionID !== 1
        ? <>
            <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
            <TextField
                fullWidth
                type={"text"}
                id={id}
                name={id}
                disabled={true}
                value={content}
            />
        </>
        : <InputBase
            fullWidth
            type={"text"}
            id={id}
            disabled={true}
            name={id}
            value={content}
        />
    );
};

export default memo(ScDateDisplay);
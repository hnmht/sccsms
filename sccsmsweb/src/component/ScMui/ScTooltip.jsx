import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

const ScTooltip = ({
    children,
    title,
    ...restProps
}) => {
    const { t } = useTranslation();
    return (
        <Tooltip {...restProps} title={t(title)}>
            <span>
                {children}
            </span>
        </Tooltip>
    )
};
export default ScTooltip;
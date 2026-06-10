import { Input } from "@mui/material";
import { useTranslation } from "react-i18next";

const ScInput = ({
    placeholder,
    ...restProps
}) => {
    const { t } = useTranslation();
    return <Input {...restProps} placeholder={t(placeholder)} />;
};
export default ScInput;
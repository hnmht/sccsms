import { useState, useEffect, memo } from "react";
import {
    List as MuiList,
    Checkbox,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    InputLabel,
    Tooltip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { cloneDeep } from "lodash";
import { reqGetRoles } from "../../../api/role";

const List = styled(MuiList)`
    ${spacing};   
`;
// Convert the standard list component array to the array used by this commponent,
// adding a selected field.
function transRoles(roles, initValue) {
    if (initValue && initValue.length > 0) {
        roles.map(role => {
            let index = initValue.findIndex(item => item.id === role.id);
            return role.selected = (index >= 0);
        })
    }
    return roles;
}
// 501 Seacloud Role Multiple Select Input Component
const ScRoleSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `501_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    const tRoles = transRoles(roles, selectedRoles);
    useEffect(() => {
        async function reqRoles() {
            handleReqRoles();
        }
        reqRoles();
    }, []);

    // Get the role list from the server
    const handleReqRoles = async () => {
        let newRoles = [];
        // Request role list from server
        const res = await reqGetRoles();
        if (!res.status) {
            return
        }
        newRoles = res.data;
        setRoles(newRoles);
    };

    // Transmit data to the parent component.
    const handleTransfer = async (items = selectedRoles) => {
        let err = { isErr: false, msg: "" };
        if (items.length === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(items);
        }
        setErrInfo(err);
        pickDone(items, itemKey, positionID, rowIndex, err);
    }
    // Action after selecting the role
    const handleSelect = (item) => {
        if (!isEdit) {
            return
        }
        let newSelectedRoles = cloneDeep(selectedRoles);
        let i = selectedRoles.findIndex(role => role.id === item.id);
        if (i < 0) {
            newSelectedRoles.push(item);
        } else {
            newSelectedRoles.splice(i, 1);
        }
        setSelectedRoles(newSelectedRoles);
        handleTransfer(newSelectedRoles);
    };

    return (
        <>
            <InputLabel component={"div"} htmlFor={id} sx={{ color: allowNull ? "primary" : "blue", marginBottom: 1.25 }}>
                {t(itemShowName)}
                {errInfo.isErr
                    ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                    : null
                }
            </InputLabel>
            <List
                id={id}
                dense
                component="div"
                role="list"
                sx={{ width: "100%", height: 192, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider" }}
            >
                {tRoles.map((role, index) => {
                    return (
                        <ListItem
                            key={index}
                            disablePadding
                        >
                            <ListItemButton disabled={role.allUserFlag === 1 || !isEdit} onClick={() => handleSelect(role)}>
                                <ListItemIcon>
                                    <Checkbox
                                        id={`rolecheckbox${itemKey}${positionID}${rowIndex}${index}`}
                                        disabled={role.allUserFlag === 1}
                                        checked={role.selected}
                                        size="medium"
                                    />
                                </ListItemIcon>
                                <ListItemText primary={role.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })
                }
            </List>
        </>
    );
};

export default memo(ScRoleSelect);
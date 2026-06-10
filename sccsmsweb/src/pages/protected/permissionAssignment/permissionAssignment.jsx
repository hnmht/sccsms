import React, { useState, useEffect } from "react";
import {
    Grid,
    Paper,
    Stack,
} from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";
import { Divider, Button } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import RoleList from "./roleList";
import AuthTree from "./authTree";

import { reqGetRoles, reqGetRoleAuths, reqUpdateRoleAuths } from "../../../api/role";
import { reqMenu } from "../../../api/menu";
import { cloneDeep } from "lodash";

// Assign menu permissions to role
function PermissionAssignment() {
    const [roles, setRoles] = useState([]); // Role list
    const [menus, setMenus] = useState([]); // All menus
    const [currentRole, setCurrentRole] = useState(undefined) // Current role
    const [auths, setAuths] = useState([]);
    const [roleAuths, setRoleAuths] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        async function reqRoles() {
            let newRoles = [];
            let newMenus = [];
            const resRoles = await reqGetRoles();
            if (resRoles.status) {
                newRoles = resRoles.data;
            }
            const resMenus = await reqMenu();
            if (resMenus.status) {
                newMenus = resMenus.data;
            }
            setRoles(newRoles);
            setMenus(newMenus);
        }
        reqRoles();
    }, []);

    // Actions after auths selected
    const handelAuthsSelectedOk = (auths) => {
        let newAuths = [];
        auths.forEach(auth => {
            if (auth.selected) {
                newAuths.push(auth);
            }
        })
        setAuths(newAuths);
    };


    // Actions after select the role.
    const handleRoleSelectOk = async (role) => {
        // Get permissions list for the currently seleted role
        const roleAuthsRes = await reqGetRoleAuths(role);
        let roleAuths = [];
        if (roleAuthsRes.status) {
            roleAuths = roleAuthsRes.data;
        }

        // Update all permission list display data based on the permission list 
        let newMenus = cloneDeep(menus);
        if (roleAuths.length > 0) {
            roleAuths.forEach(auth => {
                for (let i = 0; i < newMenus.length; i++) {
                    if (auth.id === newMenus[i].id) {
                        // console.log("auth.id:",auth.id);
                        newMenus[i].selected = auth.selected;
                        newMenus[i].indeterminate = auth.indeterminate;
                        break
                    }
                }
            })
        }

        setCurrentRole(role);
        setRoleAuths(newMenus);
    };

    // Actions after click save button in the head
    const handleSave = async () => {
        // Request permission changes from the server
        const res = await reqUpdateRoleAuths({ role: currentRole, auths: auths });
        if (res.status) {
            message.success(t("modifySuccessful"));
        }
        // Modify the current interface to be non-editable
        setIsEdit(false);
        // Refresh role list
        let newRoles = [];
        const resRoles = await reqGetRoles();
        if (resRoles.status) {
            newRoles = resRoles.data;
        }
        setRoles(newRoles);
        // Find currentRole in the new role list
        let newCurrentRole = undefined;
        newRoles.forEach(role => {
            if (role.id === currentRole.id) {
                newCurrentRole = role;
            }
        });
        setCurrentRole(newCurrentRole);
        // Refresh current role permission
        handleRoleSelectOk(newCurrentRole);
    };
    // Action after click the cancel button
    const handleCancel = () => {
        // Modify the current interface to be non-editable
        setIsEdit(false);
        // Refresh current role permission
        handleRoleSelectOk(currentRole);
    }

    return (
        <React.Fragment>
            <PageTitle pageName={t("MenuPA")} displayHelp={false} />
            <Divider my={1} />
            <Paper sx={{ width: '100%', overflow: 'hidden', height: "100%", bgcolor: "background.default" }}>
                <Stack
                    direction={"row"}
                    justifyContent="right"
                    alignItems={"center"}
                    sx={{ p: 1, bgcolor: "background.default", height: 55 }}
                >
                    <Button
                        variant="contained"
                        m={1}
                        disabled={currentRole === undefined || (currentRole === undefined && !isEdit) || isEdit}
                        onClick={() => setIsEdit(true)}
                    >
                        {t("edit")}
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isEdit}
                        m={1}
                        onClick={handleSave}
                    >
                        {t("save")}
                    </Button>
                    <Button
                        variant="contained"
                        m={1}
                        disabled={!isEdit}
                        onClick={handleCancel}
                    >
                        {t("cancel")}
                    </Button>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <RoleList roles={roles} roleSelectOk={handleRoleSelectOk} isEdit={isEdit} />
                    </Grid>
                    <Grid item xs={8}>
                        <AuthTree menus={roleAuths} selectedOk={handelAuthsSelectedOk} isEdit={isEdit} />
                    </Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    );
}

export default PermissionAssignment;
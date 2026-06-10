import { useState } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ExpandMoreIcon, ExpandLessIcon, CheckIcon } from "../../PubIcon/PubIcon";
import { toTree } from "../../../utils/tree";

const PubTree = ({
    docName = "archiveTree",
    isDisplayAll = false,
    oriDocs = [],
    onDocClick = () => { },
    selectDocIDs = [],
    onDocDoubleClick = () => { },
    isEdit = true
}) => {
    const [openAll, setOpenAll] = useState(true);
    const docTree = toTree(oriDocs, 0);

    const handleClickItem = (item, event, type) => {//type 0 child 1 parent 3 all
        switch (event.detail) {
            case 1: { //Click
                onDocClick(item, type);
                break;
            }
            case 2: { //double Click
                onDocDoubleClick(item, type);
                break;
            }
            case 3: { //triple Click
                break;
            }
            default: {
                break;
            }
        }
    };

    const RenderItem = ({ item, level }) => {
        const [open, setOpen] = useState(true);
        const handleExpandClick = () => {
            setOpen(!open);
        };
        const { t } = useTranslation();
        const status = item.status ? item.status : 0;
        const disabled = status === 1;
        const name = disabled ? `${item.name}(${t("disable")})` : item.name;

        return (
            item.children
                ? <>
                    <ListItem disablePadding key={"parentItem" + item.id} sx={{ p: 0, m: 0, paddingLeft: level + 1, width: "100%", pr: 2 }}>
                        <IconButton key={"parenticonbutton" + item.id} sx={{ padding: 0, margin: 0 }} onClick={handleExpandClick}>
                            {open ? <ExpandLessIcon key={"parentexpandless" + item.id} fontSize="small" /> : < ExpandMoreIcon key={"expandMore" + item.id} fontSize="small" />}
                        </IconButton>
                        <ListItemButton
                            key={"parentitembutton" + item.id}
                            onClick={(event) => handleClickItem(item, event, 1)}
                            disabled={!isEdit}
                        >
                            <ListItemText key={"parentitemtext" + item.id} primary={name}
                                primaryTypographyProps={{ color: disabled ? "warning.main" : "defalut" }} />
                        </ListItemButton>
                        {selectDocIDs.includes(item.id) ? <CheckIcon fontSize="small" color="success" /> : null}
                    </ListItem>
                    <Collapse key={"collapse" + item.id} in={open} sx={{ p: 0, m: 0 }}>
                        <RenderList data={item.children} listKey={item.id} level={level} />
                    </Collapse></>
                : <ListItem key={"child" + item.id} disablePadding sx={{ p: 0, m: 0, paddingLeft: level + 1, width: "100%", pr: 2 }}>
                    <ExpandLessIcon key={"childexpandless" + item.id} fontSize="small" sx={{ opacity: 0 }} />
                    <ListItemButton
                        key={"childitembutton" + item.id}
                        onClick={(event) => handleClickItem(item, event, 0)}
                        disabled={!isEdit}
                    >
                        <ListItemText key={"childitemtext" + item.id} primary={name}
                            primaryTypographyProps={{ color: disabled ? "warning.main" : "default" }} />
                    </ListItemButton>
                    {selectDocIDs.includes(item.id) ? <CheckIcon fontSize="small" color="success" /> : null}
                </ListItem>
        );
    };
    const RenderList = ({ data, listKey, level }) => {
        const levelA = level + 1;
        return (
            <List key={listKey} component="div" dense sx={{ p: 0, m: 0, paddingLeft: level + 2, width: "100%" }}>
                {data.map((item) => (
                    <RenderItem item={item} key={item.id} level={levelA} />
                ))}
            </List>
        );
    };

    return (
        <List
            key="top"
            dense
            component="div"
        >
            {isDisplayAll
                ? <>
                    <ListItem disablePadding key={"allitem"} sx={{ p: 0, m: 0, width: "100%", pr: 2 }}>
                        <IconButton key="openAllIconButton" sx={{ p: 0, m: 0 }} onClick={() => setOpenAll(!openAll)}>
                            {openAll ? <ExpandLessIcon key="openAllExpandless" fontSize="small" /> : <ExpandMoreIcon key="openAllExpandMore" fontSize="small" />}
                        </IconButton>
                        <ListItemButton key="openAllItemButton" onClick={(event) => handleClickItem(oriDocs, event, 3)} disabled={!isEdit}>
                            <ListItemText key="openAllItemText" primary={docName} />
                        </ListItemButton>
                        {oriDocs.length <= selectDocIDs.length && oriDocs.length !== 0 ? <CheckIcon fontSize="small" color="success" /> : null}
                    </ListItem>
                    <Collapse key="collapseAll" in={openAll} sx={{ p: 0, m: 0 }}>
                        <RenderList data={docTree} listKey={0} level={0} />
                    </Collapse>
                </>
                : <RenderList data={docTree} listKey={0} level={0} />
            }
        </List>
    );
}
export default PubTree;


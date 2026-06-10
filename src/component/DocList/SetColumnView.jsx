import { useState } from "react";
import {
    Card,
    CardHeader,
    Button,
    CardActions,
    List,
    ListItem,
    ListItemText,
    Switch,
    Grid,
    Tooltip,
    IconButton,
    ListItemButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Divider } from "../ScMui/ScMui";
import { DownOneIcon, UpOneIcon, ToBottomIcon, ToTopIcon } from "../PubIcon/PubIcon";
import { cloneDeep } from "lodash";
import { ArrayElementDownOne, ArrayElementToTop, ArrayElementUpOne, ArrayElementToBottom } from "../../utils/tools";

function SetColumnView({ tableColumns, setColumnOk, setColumnCancel, originColumns }) {
    const { t } = useTranslation();
    const [columns, setColumns] = useState(tableColumns);
    const [currentItem, setCurrentItem] = useState(null);
    // Actions after click Item
    const handleItemClick = (column, index) => {
        setCurrentItem(column);
    };
    // Actions after item switch value change
    const handleDisplayChange = (event, index) => {
        let newColumns = cloneDeep(columns);
        newColumns[index].visible = event.target.checked;
        setColumns(newColumns);
    };
    // Actions after Reset column
    const handleRestColumn = () => {
        setColumns(originColumns);
    };
    // Actions after click the down button
    const handleDownOne = () => {
        setColumns(ArrayElementDownOne(columns, currentItem, "id"));
    };
    // Actions after click the up button
    const handleUpOne = () => {
        setColumns(ArrayElementUpOne(columns, currentItem, "id"));
    };
    // Actions after click the to top button
    const handleToTop = () => {
        setColumns(ArrayElementToTop(columns, currentItem, "id"));
    };
    // Actions after click the to bottom button
    const handleToBottom = () => {
        setColumns(ArrayElementToBottom(columns, currentItem, "id"));
    };

    return (
        <Card sx={{ minWidth: 384, maxHeight: 512 }}>
            <CardHeader title={t("columnSettings")} />
            <Divider />
            <Grid container>
                <Grid container>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Tooltip title={t("down")} placement="top">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[columns.length - 1].id} m={1}
                                    onClick={handleDownOne}
                                >
                                    <DownOneIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title={t("moveToBottom")} placement="bottom">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[columns.length - 1].id} m={1}
                                    onClick={handleToBottom}
                                >
                                    <ToBottomIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={8}>
                        <List id="setColumnList" dense component="div" role="list" sx={{ maxHeight: 384, overflow: "auto" }}>
                            {
                                columns.map((column, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            disablePadding
                                            secondaryAction={
                                                <Switch
                                                    id={`switch${index}`}
                                                    checked={column.visible}
                                                    onChange={(event) => handleDisplayChange(event, index)}
                                                    size="small"
                                                />
                                            }
                                        >
                                            <ListItemButton onClick={() => handleItemClick(column, index)} sx={{ bgcolor: currentItem && currentItem.id === column.id ? "divider" : "transparent" }}>
                                                <ListItemText primary={t(column.label)} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })
                            }
                        </List>
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Tooltip title={t("up")} placement="top">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[0].id} m={1}
                                    onClick={handleUpOne}
                                >
                                    <UpOneIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title={t("moveToTop")} placement="bottom">
                            <span style={{ margin: 5 }}>
                                <IconButton size="small" color="secondary" disabled={currentItem === null || currentItem.id === columns[0].id} m={1}
                                    onClick={handleToTop}
                                >
                                    <ToTopIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Divider />
            <CardActions sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Button variant="text" sx={{ m: 2 }} onClick={handleRestColumn}>{t("reset")}</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={() => setColumnOk(columns)}>{t("ok")}</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={setColumnCancel}>{t("cancel")}</Button>
            </CardActions>
        </Card>
    );
}

export default SetColumnView;
import { useState } from "react";
import {
    Card,
    CardHeader,
    CardActions,
    Grid,
    Button,
    ListItem,
    ListItemText,
    ListItemButton,
    TableSortLabel,
    IconButton,
    Tooltip,
    ListItemIcon,
    Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { Divider, List } from "../ScMui/ScMui";
import { DownOneIcon, UpOneIcon, ToBottomIcon, ToTopIcon } from "../PubIcon/PubIcon";
import { getSortColumns } from "./tools";
import { ArrayElementDownOne, ArrayElementToTop, ArrayElementUpOne, ArrayElementToBottom } from "../../utils/tools";

const SetSortView = ({
    sortColumns,
    sortOk,
    sortCancel,
    originColumns
}) => {
    const { t } = useTranslation();
    const [currentItem, setCurrentItem] = useState(null);
    const [columns, setColumns] = useState(sortColumns);

    // Actions after click sort label
    const handleSortLabeClick = (sortDirection, column, index) => {
        let newColumns = cloneDeep(columns);
        newColumns[index].direction = sortDirection === "asc" ? "desc" : "asc";
        setColumns(newColumns);
    };
    // Actions after click the column item
    const handleColumnClick = (column, index) => {
        setCurrentItem(column);
        let newColumns = cloneDeep(columns);
        newColumns[index].sort = !newColumns[index].sort;
        setColumns(newColumns);
    };
    // Actions after click the reset button
    const handleReset = () => {
        const resetSort = getSortColumns(originColumns);
        setColumns(resetSort);
    };
    // Actions after click the down button
    const handleDownOne = () => {
        setColumns(ArrayElementDownOne(columns, currentItem, "id"));
    };
    // Actions after click the up button
    const handleUpOne = () => {
        setColumns(ArrayElementUpOne(columns, currentItem, "id"));
    };
    // Actions afer click the to top button
    const handleToTop = () => {
        setColumns(ArrayElementToTop(columns, currentItem, "id"));
    };
    // Actions after click the to bottom button
    const handleToBottom = () => {
        setColumns(ArrayElementToBottom(columns, currentItem, "id"));
    };

    return (
        <Card sx={{ minWidth: 384, maxHeight: 512 }}>
            <CardHeader
                title={t("sortingSettings")}
            />
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
                    <Grid item xs={8} >
                        <List dense component="div" role="list" sx={{ maxHeight: 256, minWidth: 192, overflow: "auto" }}>
                            {
                                columns.map((column, index) => {
                                    return (
                                        <ListItem
                                            key={column.id}
                                            disablePadding
                                            secondaryAction={
                                                <TableSortLabel
                                                    active={column.sort}
                                                    direction={column.direction}
                                                    onClick={() => handleSortLabeClick(column.direction, column, index)}
                                                />
                                            }
                                        >
                                            <ListItemButton onClick={() => handleColumnClick(column, index)} sx={{ bgcolor: currentItem && currentItem.id === column.id ? "divider" : "transparent" }}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        id={`checkbox${index}`}
                                                        edge="start"
                                                        checked={column.sort}
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                </ListItemIcon>
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
                <Button variant="text" sx={{ m: 2 }} onClick={handleReset}>{t("reset")}</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={() => sortOk(columns)}>{t("ok")}</Button>
                <Button variant="text" sx={{ m: 2 }} onClick={sortCancel}>{t("cancel")}</Button>
            </CardActions>
        </Card>
    );
};

export default SetSortView;
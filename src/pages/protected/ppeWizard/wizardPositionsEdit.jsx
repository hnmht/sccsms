import { useState, memo } from "react";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Checkbox,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { notObj, intersectionObj, unionObj } from "./constructor";

//  Wizard step for Edit Positons
const WizardPositionsEdit = ({ allOps, initOps, backAction, nextAction, t, height }) => {
    const [checked, setChecked] = useState([]);
    const [selectedOps, setSelectedOps] = useState(initOps);
    const waitOps = notObj(allOps, selectedOps);
    const leftChecked = intersectionObj(checked, waitOps);
    const rightChecked = intersectionObj(checked, selectedOps);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    // Actions after click right button 
    const handleCheckedRight = () => {
        setSelectedOps(selectedOps.concat(leftChecked));
        setChecked(notObj(checked, leftChecked));
    };

    // Actions after click left button
    const handleCheckedLeft = () => {
        setSelectedOps(notObj(selectedOps, rightChecked));
        setChecked(notObj(checked, rightChecked));
    };
    const numberOfChecked = (items) => intersectionObj(checked, items).length;

    // Actions after Select all Items
    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(notObj(checked, items));
        } else {
            setChecked(unionObj(checked, items));
        }
    };
    // Position List
    const positionList = (title, items) => (
        <Card sx={{ display: "flex", flexDirection: "column", width: "100%", height: height - 64 }}>
            <CardHeader
                sx={{ paddingTop: 2, paddingBottom: 2 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={t(title)}
                subheader={`${numberOfChecked(items)}/${items.length} ${t("selected")}`}
            />
            <Divider />
            <List
                sx={{ width: "100%", overflow: 'auto' }}
                dense
                component="div"
                role="list"
            >
                {items.map((op) => {
                    const labelId = `transfer-list-all-item-${op.id}-label`
                    return (
                        <ListItemButton
                            key={labelId}
                            role="listitem"
                            onClick={handleToggle(op)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(op) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={op.name} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <>
            <Box sx={{ width: "90%", display: "flex", flexDirection: "row", flex: 1, marginTop: 4, height: height }} >
                <Box sx={{ width: "40%", height: "100%" }}>{positionList("unSelectedPositions", waitOps)}</Box>
                <Box sx={{ width: "20%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Button
                        sx={{ my: 2 }}
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 2 }}
                        variant="contained"
                        size="large"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Box>
                <Box sx={{ width: "40%", height: "100%" }}>{positionList("selectedPositions", selectedOps)}</Box>
            </Box>
            <Box sx={{ width: "100%", height: 48, paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={backAction}
                        sx={{ mr: 1 }}
                    >
                        {t("previousStep")}
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" onClick={() => nextAction(selectedOps)} disabled={selectedOps.length === 0}>
                        {t("nextStep")}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default memo(WizardPositionsEdit);
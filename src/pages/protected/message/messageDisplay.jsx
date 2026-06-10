import { Grid, Button, Typography, Avatar } from "@mui/material";
import { DateTimeFormatSpec } from "../../../i18n/dayjs";
import ScInput from "../../../component/ScInput";

const MessageDisplay = ({ msg, toReadAction, t }) => {
    const readTime = DateTimeFormatSpec(msg.readTime, "LLL");
    const sendTime = DateTimeFormatSpec(msg.sendTime, "LLL");
    const msgTitle = t("messageTitle",{
        billNumber:msg.billNumber,
        rowNumber:msg.rowNumber,
        csaName: msg.csaName,
        epaName:msg.epaName,
        executionValue:msg.executionValueDisp
    })
    return (
        <Grid item xs={12} key={`messagedisp${msg.id}`}>
            <Grid container spacing={2} p={1}>
                <Grid item>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs zeroMinWidth>
                            <Typography align="left" variant="h6" color="secondary">
                                {sendTime}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Avatar color="info" src={msg.creator.avatar.fileUrl} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs zeroMinWidth >
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Grid container spacing={4}>
                                <Grid item xs={10}>
                                    <Typography component="div" align="left" variant="subtitle1">                                    
                                        {msg.isRead === 1 ? t("readMessageAt", { sender: msg.creator.name, readTime: readTime }) : msg.creator.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={902}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="eoFiles"
                                        itemKey="eoFiles"
                                        initValue={msg.eoFiles}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="eoFiles"
                                        positionID={1}
                                        rowIndex={msg.id}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item zeroMinWidth>
                                    <Typography component="div" align="left" variant="subtitle2">
                                        {msgTitle}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="secondary" align="left" variant="caption">
                                {msg.content}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {msg.isRead === 0
                    ? <Grid item>
                        <Button variant="outlined" size="small" sx={{ mr: 6 }} onClick={() => toReadAction(msg)}>{t("markAsRead")}</Button>
                    </Grid>
                    : null
                }
            </Grid>
        </Grid>
    )
};

export default MessageDisplay;
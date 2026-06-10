import { Typography, Grid, Avatar, Button } from "@mui/material";
import { UnreadOutlinedIcon, ReadOutlinedIcon } from "../../../../component/PubIcon/PubIcon";
import { DateTimeFormat } from "../../../../i18n/dayjs";
const emptyFunc = () => { };

const CommentsList = ({ comments, t, onClickItemButton = emptyFunc }) => {
    return (
        <>
            <Grid container spacing={2} alignItems="center" p={1}>
                {comments.map(comment => {
                    return (
                        <Grid item xs={12} key={comment.id}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Avatar alt="commentuser" src={comment.creator.avatar.fileUrl} />
                                </Grid>
                                <Grid item xs>
                                    <Typography align="left" variant="subtitle2">
                                        {comment.creator.name},  {DateTimeFormat(comment.createDate, "LLL")},
                                        <Button variant="text" size="small" onClick={onClickItemButton}> {t("line", { rowNumber: comment.rowNumber })}</Button>
                                    </Typography>
                                    <Typography align="left" variant="subtitle2">
                                        {t("sendToSomeone", { name: comment.sendTo.name })}
                                    </Typography>
                                    <Typography align="left" variant="caption" color="secondary" overflow="inherit">
                                        {comment.content}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {comment.isRead === 0
                                        ? <UnreadOutlinedIcon />
                                        : <ReadOutlinedIcon />
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    );
};

export default CommentsList;
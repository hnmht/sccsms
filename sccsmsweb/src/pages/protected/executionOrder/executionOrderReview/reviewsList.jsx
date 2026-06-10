import { 
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
} from "@mui/material";
import { DateTimeFormat } from "../../../../i18n/dayjs";

const ReviewsList = ({ reviews,t }) => {
    return (
        <TableContainer sx={{height:"100%"}}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">{t("person")}</TableCell>
                        <TableCell align="center">{t("startTime")}</TableCell>
                        <TableCell align="center">{t("endTime")}</TableCell>
                        <TableCell align="center">{t("timeSeconds")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reviews.map(review => {
                        return (
                            <TableRow key={review.id}>
                                <TableCell align="center">{review.creator.name}</TableCell>
                                <TableCell align="center">{DateTimeFormat(review.startTime,"LLL")}</TableCell>
                                <TableCell align="center">{DateTimeFormat(review.endTime,"LLL")}</TableCell>
                                <TableCell align="center">{review.consumeSeconds}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReviewsList;
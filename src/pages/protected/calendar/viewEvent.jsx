import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Button
} from "@mui/material";

import { Divider } from "../../../component/ScMui/ScMui";
import Loader from "../../../component/Loader/Loader"
import ScInput from "../../../component/ScInput";

const viewEvent = ({ currentEvent, onCancel,t }) => {
    return currentEvent !== undefined
        ? <>
            <DialogTitle>{t("detail")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="billNumber"
                            itemKey="billNumber"
                            initValue={currentEvent.billNumber}
                            pickDone={() => { }}
                            key="billNumber"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="rowNumber"
                            itemKey="rowNumber"
                            initValue={currentEvent.rowNumber}
                            pickDone={() => { }}
                            key="rowNumber"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={405}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="status"
                            itemKey="status"
                            initValue={currentEvent.status}
                            pickDone={() => { }}
                            key="status"
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="title"
                            itemKey="title"
                            initValue={currentEvent.title}
                            pickDone={() => { }}
                            key="title"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="hDescription"
                            itemKey="hDescription"
                            initValue={currentEvent.hDescription}
                            pickDone={() => { }}
                            key="hDescription"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="bDescription"
                            itemKey="bDescription"
                            initValue={currentEvent.bDescription}
                            pickDone={() => { }}
                            key="bDescription"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={307}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="startTime"
                            itemKey="start"
                            initValue={currentEvent.start}
                            pickDone={() => { }}
                            key="start"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={307}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="endTime"
                            itemKey="end"
                            initValue={currentEvent.end}
                            pickDone={() => { }}
                            key="end"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={570}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="csa"
                            itemKey="csa"
                            initValue={currentEvent.csa}
                            pickDone={() => { }}
                            key="csa"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={580}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="ept"
                            itemKey="ept"
                            initValue={currentEvent.ept}
                            pickDone={() => { }}
                            key="ept"
                        />
                    </Grid>
                    {
                        currentEvent.billType === "EO"
                            ? <>
                                <Grid item xs={6}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="epa"
                                        itemKey="epaName"
                                        initValue={currentEvent.epaName}
                                        pickDone={() => { }}
                                        key="epaName"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="executionValue"
                                        itemKey="epaValueDisp"
                                        initValue={currentEvent.epaValueDisp}
                                        pickDone={() => { }}
                                        key="epaValueDisp"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={902}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="files"
                                        itemKey="files"
                                        initValue={currentEvent.files}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="files"                                       
                                    />
                                </Grid>
                            </>
                            : null
                    }
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="creator"
                            itemKey="creator"
                            initValue={currentEvent.creator}
                            pickDone={() => { }}
                            key="creator"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                <Button variant='contained' onClick={onCancel}>{t("back")}</Button>
            </DialogActions>
        </>
        : <Loader />
};

export default viewEvent;
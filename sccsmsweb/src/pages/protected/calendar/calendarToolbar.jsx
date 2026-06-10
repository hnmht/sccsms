import { useState, useEffect, memo } from 'react';
import { useMediaQuery, Button, ButtonGroup, Grid, Stack, Tooltip, Typography, IconButton } from '@mui/material';
import MonthIcon from '@mui/icons-material/CalendarViewMonthOutlined';
import DayIcon from '@mui/icons-material/CalendarViewDayOutlined';
import WeekIcon from '@mui/icons-material/CalendarViewWeekOutlined';
import ListIcon from '@mui/icons-material/FormatListNumberedOutlined';
import RightIcon from '@mui/icons-material/ChevronRightOutlined';
import LeftIcon from '@mui/icons-material/ChevronLeftOutlined';
import { dayjs, DateTimeFormatSpec } from '../../../i18n/dayjs';
import ScInput from "../../../component/ScInput";
import { useTranslation } from 'react-i18next';

const viewOptions = [
    {
        label: 'month',
        value: 'dayGridMonth',
        icon: MonthIcon
    },
    {
        label: 'week',
        value: 'timeGridWeek',
        icon: WeekIcon
    },
    {
        label: 'day',
        value: 'timeGridDay',
        icon: DayIcon
    },
    {
        label: 'list',
        value: 'listWeek',
        icon: ListIcon
    }
];

const CalendarToolbar = ({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView, onPersonChange, person, ...others }) => {
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [viewFilter, setViewFilter] = useState(viewOptions);
    const dateDisp = DateTimeFormatSpec(date, "LLLLL");
    const { t } = useTranslation();

    useEffect(() => {
        if (matchDownSM) {
            const filter = viewOptions.filter((item) => item.value !== 'dayGridMonth' && item.value !== 'timeGridWeek');
            setViewFilter(filter);
        } else {
            setViewFilter(viewOptions);
        }
    }, [matchDownSM]);

    return (
        <Grid alignItems="center" container justifyContent="space-between" spacing={matchDownSM ? 1 : 3} {...others} sx={{ pb: 3 }}>
            <Grid item>
                <Stack direction="row" alignItems="center" spacing={matchDownSM ? 1 : 3}>
                    <Button variant="outlined" onClick={onClickToday} size={matchDownSM ? 'small' : 'medium'}>
                        {t("today")}
                    </Button>
                    <ScInput
                        dataType={510}
                        allowNull={false}
                        isEdit={true}
                        itemKey="currentPerson"
                        initValue={person}
                        pickDone={onPersonChange}
                        placeholder="choosePersonPlaceholder"
                        isBackendTest={false}
                        positionID={1}
                        key="currentPerson"
                    />
                </Stack>
            </Grid>
            <Grid item>
                <Stack direction="row" alignItems="center" spacing={matchDownSM ? 1 : 3}>
                    <IconButton onClick={onClickPrev} size={matchDownSM ? 'small' : 'large'}>
                        <LeftIcon />
                    </IconButton>
                    <Typography variant={matchDownSM ? 'h5' : 'h3'} color="textPrimary">
                        {dateDisp}
                    </Typography>
                    <IconButton onClick={onClickNext} size={matchDownSM ? 'small' : 'large'}>
                        <RightIcon />
                    </IconButton>
                </Stack>
            </Grid>
            <Grid item>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    {viewFilter.map((viewOption) => {
                        const Icon = viewOption.icon;
                        return (
                            <Tooltip title={t(viewOption.label)} key={viewOption.value}>
                                <Button
                                    size={matchDownSM ? 'small' : 'medium'}
                                    disableElevation
                                    variant={viewOption.value === view ? 'contained' : 'outlined'}
                                    onClick={() => onChangeView(viewOption.value)}
                                >
                                    <Icon style={{ fontSize: '1.3rem' }} />
                                </Button>
                            </Tooltip>
                        );
                    })}
                </ButtonGroup>
            </Grid>
        </Grid>
    );
};

export default memo(CalendarToolbar);
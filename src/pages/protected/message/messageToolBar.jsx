import { memo } from 'react';
import { useMediaQuery, Button, ButtonGroup, Grid, Stack, Tooltip, Typography, IconButton } from '@mui/material';
import { RefreshIcon, FilterIcon, UnreadOutlinedIcon, ReadOutlinedIcon } from '../../../component/PubIcon/PubIcon';

const viewOptions = [
    {
        label: 'unreadMessages',
        value: 'unread',
        icon: UnreadOutlinedIcon
    },
    {
        label: 'readMessages',
        value: 'read',
        icon: ReadOutlinedIcon
    }
];

const MessageToolbar = ({ viewIndex, viewChangeAction, refreshAciton, filterAction, t }) => {
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    return (
        <Grid alignItems="center" container justifyContent="space-between" spacing={matchDownSM ? 1 : 3} sx={{ pb: 3 }}>
            <Grid item>
                <Stack direction="row" alignItems="center" spacing={matchDownSM ? 1 : 3}>
                    <Typography variant='h4'>{t(viewOptions[viewIndex].label)}</Typography>
                    {viewIndex === 0
                        ?
                        <Tooltip title={t("refresh")} placement="top">
                            <IconButton onClick={refreshAciton}>
                                <RefreshIcon color='primary' />
                            </IconButton>
                        </Tooltip>
                        : <Tooltip title={t("filter")} placement="top">
                            <IconButton onClick={filterAction}>
                                <FilterIcon color='primary' />
                            </IconButton>
                        </Tooltip>
                    }
                </Stack>
            </Grid>
            <Grid item>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    {viewOptions.map((viewOption, index) => {
                        const Icon = viewOption.icon;
                        return (
                            <Tooltip title={t(viewOption.label)} placement='top' key={viewOption.value}>
                                <span>
                                    <Button
                                        size={matchDownSM ? 'small' : 'medium'}
                                        disableElevation
                                        variant={index === viewIndex ? 'contained' : 'outlined'}
                                        onClick={() => viewChangeAction(index)}
                                    >
                                        <Icon style={{ fontSize: '1.3rem' }} />
                                    </Button>
                                </span>
                            </Tooltip>
                        );
                    })}
                </ButtonGroup>
            </Grid>
        </Grid>
    );
};

export default memo(MessageToolbar);
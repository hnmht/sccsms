import { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, Dialog } from "@mui/material";
import { dayjs } from "../../../i18n/i18n";
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import ReactPerfectScrollbar from "react-perfect-scrollbar";
// import zhcnLocale from "@fullcalendar/core/locales/zh-cn";
import allLocales from "@fullcalendar/core/locales-all";

import { Divider } from '../../../component/ScMui/ScMui';
import PageTitle from "../../../component/PageTitle/PageTitle";
import ExperimentalStyled from "./calendarStyled";
import CalendarToolbar from "./calendarToolbar";
import { reqGetEvents } from "../../../api/event";
import { getCurrentPerson } from '../pub/pubFunction';
import { GetCacheDocById } from '../../../storage/db/db';
import ViewEvent from './viewEvent';
import useContentHeight from '../../../hooks/useContentHeight';

const localeMap = new Map([
    ["en-US", "en"],
    ["zh-CN", "zh-cn"]
]);

const renderEventContent = (eventInfo) => {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <b>{" "}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
};

const Calendar = () => {
    const calendarRef = useRef(null);
    const [date, setDate] = useState(new Date());
    const [currentPerson, setCurrentPerson] = useState(getCurrentPerson());
    const [events, setEvents] = useState([]);
    const [duration, setDuration] = useState({ start: dayjs().weekday(0), end: dayjs().weekday(6) });
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        currentEvent: undefined,
    });
    const { i18n, t } = useTranslation();
    const [locale, setLocale] = useState(localeMap[i18n.language] || 'en');
    const calendarKey = useMemo(() => locale, [locale]);
    useEffect(() => {
        let newLocal = "en";
        if (localeMap.has(i18n.language)) {
            newLocal = localeMap.get(i18n.language);
        }
        setLocale(newLocal);
    }, [i18n.language]);

    const contentHeight = useContentHeight();
    // Choose Person
    const handlePersonSelect = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        setCurrentPerson(value);
        handleRequesEvents(value, duration);
    };

    // Change Duration
    const handleChangeDuration = async () => {
        const calendarEl = calendarRef.current;
        let newDuration = duration;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            newDuration = {
                start: dayjs(calendarApi.view.activeStart),
                end: dayjs(calendarApi.view.activeEnd)
            };
        }
        setDuration(newDuration);
        handleRequesEvents(currentPerson, newDuration);
    };
    // Request Events from backend
    const handleRequesEvents = async (person = currentPerson, dur = duration) => {
        let newEvents = [];
        if (person.id !== 0 && dur !== undefined) {
            const res = await reqGetEvents({ userID: person.id, start: dur.start, end: dur.end });
            if (res.status) {
                newEvents = res.data.events;
                newEvents.map((event => {
                    if (event.billType === "WO") {
                        event.title = t("executeInstruction") + ": " + event.csa.name + "<" + event.ept.name + ">";
                    } else {
                        event.title = t("handleIssue") + ": " + event.csa.name + "<" + event.epaName + ">";
                    }
                    return event;
                }));
            }
        }
        setEvents(newEvents);
    }
    // Actions after Calendar View Change
    const handleViewChange = (newView) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.changeView(newView);
        }
        // Change Duration
        handleChangeDuration();
    };

    // Actions after click Date Prev button in Calendar view
    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
        // Change Duration
        handleChangeDuration();
    };
    // Actions after click Date Next button in Calendar view
    const handleDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.next();
            setDate(calendarApi.getDate());
        }
        // Change Duration
        handleChangeDuration();
    };

    // Actions after click today button in Calendar view
    const handleDateToday = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.today();
            setDate(calendarApi.getDate());
        }
        // Change Duration
        handleChangeDuration();
    };
    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            currentEvent: undefined,

        });
    };

    const handleEventSelect = async (arg) => {
        const ept = await GetCacheDocById("ept", arg.event.extendedProps.ept.id);
        const eventDetail = {
            id: parseInt(arg.event.id),
            title: arg.event.title,
            csa: arg.event.extendedProps.csa,
            ept: ept,
            start: dayjs(arg.event.start),
            end: dayjs(arg.event.end),
            status: arg.event.extendedProps.status,
            billType: arg.event.extendedProps.billType,
            hid: arg.event.extendedProps.hid,
            billNumber: arg.event.extendedProps.billNumber,
            rowNumber: arg.event.extendedProps.rowNumber,
            hDescription: arg.event.extendedProps.hDescription,
            bDescription: arg.event.extendedProps.bDescription,
            creator: arg.event.extendedProps.creator,
            epaName: arg.event.extendedProps.epaName,
            epaValueDisp: arg.event.extendedProps.epaValueDisp,
            files: arg.event.extendedProps.files
        };

        setDiagStatus({
            isOpen: true,
            currentEvent: eventDetail,
        });
    };

    return (
        <>
            <PageTitle pageName={t("MenuCalendar")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <Card mb={6} sx={{ mt: 2, height: contentHeight, width: "100%", overflow: "auto" }}>
                <ReactPerfectScrollbar>
                    <CardContent p={6}>
                        <ExperimentalStyled>
                            <CalendarToolbar
                                date={date}
                                onClickNext={handleDateNext}
                                onClickPrev={handleDatePrev}
                                onClickToday={handleDateToday}
                                onChangeView={handleViewChange}
                                onPersonChange={handlePersonSelect}
                                person={currentPerson}
                            />
                            <FullCalendar
                                key={calendarKey}
                                weekends
                                editable={false}
                                droppable={false}
                                stickyHeaderDates
                                selectable
                                weekNumbers
                                ref={calendarRef}
                                locales={allLocales}
                                locale={locale}
                                events={events}
                                eventDisplay="block"
                                initialView="timeGridWeek"
                                initialDate={dayjs(new Date()).format("YYYY-MM-DD")}
                                eventContent={renderEventContent}
                                eventClick={handleEventSelect}
                                plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                                headerToolbar={false}
                            />
                        </ExperimentalStyled>
                    </CardContent>
                </ReactPerfectScrollbar>
            </Card>
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                maxWidth="md"
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <ViewEvent
                    currentEvent={diagStatus.currentEvent}
                    onCancel={handleDiagClose}
                    t={t}
                />
            </Dialog>
        </>
    );
}
export default Calendar;



import { formDataType } from "../../types";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import "dayjs/locale/de";
import dayjs, { Dayjs } from "dayjs";
import Grow from "@mui/material/Grow";
import { DayCalendarSkeleton } from "@mui/x-date-pickers";
import { getAllDaysInMonth } from "../../utils";
import fetchData from "@/app/api/api";
import moment from "moment-timezone";

interface DateSelectorTypes {
  userInputs: formDataType;
  onSubmit: (data: formDataType) => void;
  calendarId: string;
}

interface slotType {
  time: string;
  calendarId: null | string;
}

const Calendar: React.FC<DateSelectorTypes> = ({
  calendarId,
  userInputs,
  onSubmit,
}) => {
  console.log(calendarId)
  const [calendarStartDay, setCalendarStartDay] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const [timezone] = useState<string>("Europe/Amsterdam");
  const [slotAvailableDays, setSlotAvailableDays] = useState<string[]>([]);
  const [updateCal, setUpdateCal] = useState(false);
  const [renderSlots, setRenderSlots] = useState(false);
  const [disableUntil, setDisableUntil] = useState<Dayjs | null>(null);
  const [slots, setSlots] = useState<slotType[]>([]);
  const [availableSlots, setAvailableSlots] = useState<slotType[]>([]);
  const [activeDate, setActiveDate] = useState(dayjs());

  const getSlots = async () => {
    setSlotAvailableDays([]);
    setAvailableSlots([]);
    setLoading(true);
    try {
      const fetchedSlots = await fetchData(
        `get-slots/?calendarId=${calendarId}&startDate=${calendarStartDay.valueOf()}&endDate=${calendarStartDay
          .clone()
          .add(30, "days")
          .valueOf()}&category=${userInputs.category}&treatment=${
          userInputs.treatment
        }&location=${userInputs.location}`
      );
      if (fetchedSlots) {
        const fsd = dayjs(
          fetchedSlots[Object.keys(fetchedSlots)[0]]["slots"][0].time
        );
        setCalendarStartDay(fsd);
        const allSlots: any = [];
        Object.keys(fetchedSlots).forEach((item: any) => {
          fetchedSlots[item].slots.forEach((date: any) => {
            allSlots.push({
              calendarId: calendarId,
              time: date.time,
              room: date.room,
            });
          });
        });
        setSlots([...slots, ...allSlots]);
        allSlots.map((slot: any) => {
          setSlotAvailableDays(() => {
            const oldSlots = slotAvailableDays;
            oldSlots.push(dayjs(slot.time).format("YYYY-MM-DD"));
            return oldSlots;
          });
        });
        setDisableUntil(dayjs(allSlots[allSlots.length - 1].time));
      } else {
        setCalendarStartDay(calendarStartDay.add(90, "days"));
        setUpdateCal(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const showSlots = (date: Dayjs) => {
    setRenderSlots(false);
    setAvailableSlots([]);
    const nas: slotType[] = [];
    if (slots.length) {
      slots.map((slot) => {
        if (date.isSame(dayjs(slot.time), "day")) {
          nas.push(slot);
        }
      });
      setRenderSlots(true);
      setAvailableSlots(nas);
    }
  };

  const changeHandler = (date: Dayjs) => {
    showSlots(date);
  };

  const changeHandlerMonth = (date: Dayjs) => {
    const localDate = date.locale("de");
    if (disableUntil) {
      const localDate2 = disableUntil.locale("de");
      const fullMonth = getAllDaysInMonth(localDate.format("YYYY-MM-DD"));

      for (const date of fullMonth) {
        if (slotAvailableDays.includes(date)) {
          const fsd = dayjs(date);
          setCalendarStartDay(fsd);
          break;
        }
      }

      if (localDate.isAfter(localDate2)) {
        setCalendarStartDay(date.locale("de"));
        setUpdateCal(true);
      }
    }
  };

  useEffect(() => {
    setRenderSlots(false);
    if (updateCal) {
      getSlots();
      setUpdateCal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCal]);

  const calendarProps = {
    minDate: dayjs(),
    loading: loading,
    onChange: (value: any) => changeHandler(value),
    onMonthChange: (value: Dayjs) => changeHandlerMonth(value),
    renderLoading: () => <DayCalendarSkeleton />,
    showDaysOutsideCurrentMonth: true,
    value: activeDate,
    shouldDisableDate: (day: Dayjs) => {
      return (
        !slotAvailableDays.includes(day.format("YYYY-MM-DD")) && true
        // !day.isAfter(disableUntil)
      );
    },
  };

  useEffect(() => {
    setRenderSlots(false);
    getSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInputs]);

  const getCalendarProps = () => {
    return calendarProps;
  };

  const slotClicked = (slot: any) => {
    (window.top ?? window.parent).postMessage(
      {
        event: "SlotSelected",
        info: slot?.time,
      },
      "*"
    );
    const handleMessage = (event: any) => {
      // Check if the received message is of type 'CategorySelected'
      if (event.data.event) {
        // console.log({ event: event.data.event, value: event.data.info });
      }
    };

    // Add an event listener to listen for 'message' events
    window.addEventListener("message", handleMessage);
    onSubmit({ ...userInputs, slot, timezone });
  };

  useEffect(() => {
    (window.top ?? window.parent).postMessage(
      {
        event: "CalendarPageVisited",
        info: "",
      },
      "*"
    );
  }, []);

  return (
    <>
      <div className="flex w-full">
        <div className={renderSlots ? "" : "w-full"}>
          {!renderSlots && (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DateCalendar
                {...getCalendarProps()}
                className="!w-full !h-[390px] !sm:h-[450px] !overflow-visible"
              />
            </LocalizationProvider>
          )}
        </div>
        {renderSlots && (
          <div className="flex flex-col w-full">
            <button
              onClick={() => setRenderSlots(false)}
              className="w-16 h-10 ml-2 text-2xl border rounded-md hover:bg-gray-300 flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                />
              </svg>
            </button>
            <Grow
              in={renderSlots}
              style={{ transformOrigin: "0 0 0" }}
              {...(renderSlots ? { timeout: 1000 } : {})}
            >
              <div className="text-center text-2xl max-h-[375px] overflow-auto customScroll">
                {availableSlots && (
                  <div>
                    <ul
                      role="list"
                      className="grid grid-cols-1 gap-5 p-2 mt-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2"
                    >
                      {availableSlots.map((slot) => (
                        <li
                          key={slot.time}
                          className={`col-span-1 flex rounded-md shadow-sm cursor-pointer hover:shadow ${
                            userInputs.slot &&
                            userInputs.slot.time === slot.time
                              ? "selected-slot"
                              : ""
                          }brand-font`}
                          onClick={() => slotClicked(slot)}
                        >
                          <div className="relative flex items-center justify-between flex-1 bg-white border border-gray-200 rounded-r-md">
                            <div
                              className="flex-1 px-4 py-2 text-center text-md"
                              data-slot={slot.time}
                            >
                              {moment
                                .tz(slot.time, "Europe/Amsterdam")
                                .format("HH:mm")}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Grow>
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;

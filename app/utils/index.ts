import dayjs from "dayjs";
import { NextResponse } from "next/server";
import CalendarData from "../calanderData";

export const hasValue = (value: any) => {
  return value !== null && value !== undefined && value !== "";
};

export const getAllDaysInMonth = (firstDateOfMonth: string): string[] => {
  const parsedFirstDate = dayjs(firstDateOfMonth);
  const year = parsedFirstDate.year();
  const month = parsedFirstDate.month();
  const daysInMonth = parsedFirstDate.daysInMonth();

  const daysArray = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    return dayjs().year(year).month(month).date(dayNumber).format("YYYY-MM-DD");
  });

  return daysArray;
};

const eventBus = {
  on: (event: any, callback: any) =>
    document.addEventListener(event, (e) => callback(e.detail)),
  dispatch: (event: any, data: any) =>
    document.dispatchEvent(new CustomEvent(event, { detail: data })),
  remove: (event: any, callback: any) =>
    document.removeEventListener(event, callback),
};

export default eventBus;

export const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ error: message }, { status });
};

export const getSlotsWithRoomSync = (data: {
  calendarId: string;
  endDate?: number | null;
  startDate?: number | null;
  roomId?: string;
}) => {};

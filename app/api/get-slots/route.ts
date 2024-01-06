import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getSlots } from "@/app/apRequest";
import CalendarData from "@/app/calanderData";
import moment from "moment-timezone";

interface SlotTypeRes {
  [key: string]: {
    slots: SlotType[];
  };
}
interface SlotType {
  time: string;
  room: string | null;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const data = {
    calendarId: searchParams.get("calendarId") as string,
    startDate: Number(searchParams.get("startDate") ?? null),
    endDate: Number(searchParams.get("endDate") ?? null),
  };

  let category = null,
    treatment = null,
    location = null;

  if (searchParams.get("category") && searchParams.get("treatment")) {
    category = searchParams.get("category") as string;
    treatment =
      CalendarData[category][
        searchParams.get("treatment") as unknown as number
      ];
    if (treatment && treatment.locations) {
      location = treatment.locations.find(
        (loc) => loc.id === (searchParams.get("location") as string)
      );
      if (!location) {
        console.log("====================================");
        console.log("Location not found");
        console.log("====================================");
      }
    }
  }

  if (!treatment || !location) {
    return NextResponse.json({
      status: 400,
      message: "Treatment or location not found",
    });
  }

  if (!data.calendarId) {
    return NextResponse.json({
      status: 400,
      message: "CalendarId is required",
    });
  }

  if (location.name == "Frankenthal") {
    console.log('Get slots payload', data)
    const slots: any = await getSlots(data);
    if (slots) {
      const fn = async () => {
        let resSlots: SlotTypeRes = {};
        for (const date in slots) {
          resSlots[date] = {
            slots: [],
          };
          for (const spot of slots[date].slots) {
            resSlots[date]["slots"].push({
              time: spot,
              room: null,
            });
          }
        }
        return resSlots;
      };
      return await fn().then((r: any) => {
        return NextResponse.json(r);
      });
    }
  } else {
    const slot = await getHeidelbergSlots(data, treatment, location);
    return NextResponse.json(slot);
  }
}

const getHeidelbergSlots = async (
  calendar: {
    calendarId: string;
    endDate?: number | null | undefined;
    startDate?: number | null | undefined;
  },
  treatment: any,
  location: any
) => {
  interface SlotGroupType {
    [key: string]: {
      [key: string]: {
        slots: string[];
      };
    } | null;
  }
  const roomsSlots: SlotGroupType = {};
  const calendarSlots = await getSlots(calendar);
  if (location.roomId) {
    roomsSlots[location.roomId] = await getSlots({
      ...calendar,
      calendarId: location.roomId,
    });
    if (location.rooms) {
      for (const room of location.rooms) {
        roomsSlots[room] = await getSlots({ ...calendar, calendarId: room });
      }
    }
  }

  const roomGroupSlots: { time: string; room: string }[] = [];
  const fResults: {
    [key: string]: {
      slots: { room: string; time: string }[];
    };
  } = {};

  if (Object.keys(roomsSlots).length > 0) {
    Object.keys(roomsSlots).forEach(async (roomId) => {
      const rSloots = roomsSlots[roomId];
      if (rSloots && Object.keys(rSloots).length > 0) {
        for (const date in rSloots) {
          if (calendarSlots && calendarSlots.hasOwnProperty(date)) {
            const dateSlots = rSloots[date];
            if (dateSlots && Object.keys(dateSlots).length > 0) {
              for (const spot of dateSlots.slots) {
                if (treatment && treatment.duration && treatment.duration > 0) {
                  const st = moment
                    .tz(spot, "Europe/Amsterdam")
                    .add(treatment.duration, "minutes");
                  if (dateSlots.slots.includes(st.format())) {
                    if (calendarSlots && calendarSlots.hasOwnProperty(date)) {
                      const _date = calendarSlots[date]?.slots;
                      if (_date && _date.includes(spot)) {
                        if (!fResults[date]) {
                          fResults[date] = { slots: [] };
                        }
                        const fs = fResults[date].slots.find(
                          (fsr) => fsr.time === spot
                        );
                        if (!fs) {
                          fResults[date]["slots"].push({
                            time: spot,
                            room: roomId,
                          });
                        }
                      }
                    }
                  }
                } else {
                  if (calendarSlots && calendarSlots.hasOwnProperty(date)) {
                    const _date = calendarSlots[date]?.slots;
                    if (_date && _date.includes(spot)) {
                      if (!fResults[date]) {
                        fResults[date] = { slots: [] };
                      }
                      const fs = fResults[date].slots.find(
                        (fsr) => fsr.time === spot
                      );
                      if (!fs) {
                        fResults[date]["slots"].push({
                          time: spot,
                          room: roomId,
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  } else {
    console.log("====================================");
    console.log("No slot", calendar, treatment, location);
    console.log("====================================");
  }
  return fResults;
};

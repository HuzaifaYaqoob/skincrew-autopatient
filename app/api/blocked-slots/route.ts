import { NextResponse, type NextRequest } from "next/server";

import {
    getBookedSlots,
} from "@/app/apRequest";


export async function GET(req:NextRequest ) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const LocationId = searchParams.get("LocationId") as string
        const calendarId = searchParams.get("calendarId") as string
        const startTime = searchParams.get("startTime") as string
        const endTime = searchParams.get("endTime") as string

        if (
            !LocationId ||
            !calendarId ||
            !startTime ||
            !endTime
        ){
            return new NextResponse(JSON.stringify({message : 'LocationId, calendarId, startTime and endTime is required'}));
        }
        let contacts = await getLocationCalendarBlockedSlots(LocationId, calendarId, startTime, endTime)
        return new NextResponse(JSON.stringify(contacts));
    } catch (error) {
        if (error){
            return new NextResponse(JSON.stringify(error))
        }
        return NextResponse.error()
    }
  }


const getLocationCalendarBlockedSlots = async (locid:string, calendarId:string, startTime:string, endTime:string) => {
    const slots = await getBookedSlots(locid, calendarId, startTime, endTime);
    return slots
}
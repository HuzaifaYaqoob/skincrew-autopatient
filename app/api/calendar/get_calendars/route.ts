import { NextResponse, type NextRequest } from "next/server";

import {
    getCalendars,
  } from "@/app/apRequest";


export async function GET(req:NextRequest ) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const LocationId = searchParams.get("LocationId") as string
        if (!LocationId){
            return new NextResponse(JSON.stringify({message : 'LocationId is required'}));
        }
        let calendars = await getLocationCalendars(LocationId)
        return new NextResponse(JSON.stringify(calendars));
    } catch (error) {
        if (error){
            return new NextResponse(JSON.stringify(error))
        }
        return NextResponse.error()
    }
  }


const getLocationCalendars = async (locid:string) => {
    const calendarSlots = await getCalendars(locid);
    return calendarSlots
}

export const dynamic = 'force-dynamic'
import { NextResponse, type NextRequest } from "next/server";

import {
    getContacts,
  } from "@/app/apRequest";


export async function GET(req:NextRequest ) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const LocationId = searchParams.get("LocationId") as string
        if (!LocationId){
            return new NextResponse(JSON.stringify({message : 'LocationId is required'}));
        }
        let contacts = await getLocationContacts(LocationId)
        return new NextResponse(JSON.stringify(contacts));
    } catch (error) {
        if (error){
            return new NextResponse(JSON.stringify(error))
        }
        return NextResponse.error()
    }
  }


const getLocationContacts = async (locid:string) => {
    const calendarSlots = await getContacts(locid);
    return calendarSlots
}
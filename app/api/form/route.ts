import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import {
  upsertContact,
  bookAppointment,
  createNote,
  createBlock,
  deleteBlock,
  getCustomFields,
} from "@/app/apRequest";
import { errorResponse } from "@/app/utils";
import moment from "moment-timezone";
import CalendarData from "@/app/calanderData";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const treatment = CalendarData[body.category][body.treatment];
  const location = treatment.locations.find((loc) => loc.id === body.location);
  const payload: any = {
    tags: [],
    firstName: body.vorname,
    lastName: body.nachname,
    email: body.email,
    phone: body.mobiltelefon.toString().replace(/[^+0-9]/g, ""),
    gender: body.geschelcht == "Frau" ? "female" : "male",
    address1: body.adresse,
    source: "Booking widget",
    postalCode: body.plz,
    city: body.stadt,
    customFields: [],
  };

  // Removing Null Values
  Object.keys(payload).forEach((key) => {
    if (!payload[key]) delete payload[key];
  });
  payload.tags.push(`${treatment.name} gebucht`);
  if (location) {
    payload.tags.push(location?.name);
    const cf = await getCustomFields("Standort");
    if (cf && cf.id) {
      payload.customFields.push({
        id: cf.id,
        field_value: location.name,
      });
    }
    const gender = await getCustomFields("Geschlecht");
    if (gender && gender.id) {
      payload.customFields.push({
        id: gender.id,
        field_value: body.geschelcht,
      });
    }
  }
  payload.tags.push(body.geschelcht);
  if (body.patiententyp) {
    payload["tags"].push(body.patiententyp);
    const pt = await getCustomFields("Patient Type");
    if (pt && pt.id) {
      payload.customFields.push({
        id: pt.id,
        field_value: body.patiententyp,
      });
    }
  }
  try {
    const calName = await getCustomFields("Last appointment booked in");
    if (calName && calName.id && treatment.name) {
      payload.customFields.push({
        id: calName.id,
        field_value: treatment.name,
      });
    }
    const message = await getCustomFields("Besondere Wünsche");
    if (message && message.id) {
      payload.customFields.push({
        id: message.id,
        field_value: body.besondereWunsche,
      });
    }
  } catch (error) {}

  try {
    const contact = await upsertContact(payload);
    if (contact && contact.id) {
      try {
        const end = moment
          .tz(body.slot.time, "Europe/Amsterdam")
          .add(treatment.duration ?? 30, "minutes");
        const block: any = await createBlock({
          title: `Appointment booked for ${contact.firstName} ${contact.lastName}`,
          startTime: body.slot.time,
          endTime: end.format(),
          // calendarId: body.slot.room,
          calendarId: body.calendar,
        });
        try {
          if (block) {
            let dt : any = {}
            if (body?.slot?.endtime){
              dt.endTime = body?.slot?.endtime
            }
            console.log('Appointment Ent Time')
            console.log(dt)
            const appt = await bookAppointment({
              calendarId: body.slot.calendarId,
              contactId: contact.id,
              startTime: body.slot.time,
              title: `${payload.firstName} ${payload.lastName} booked for ${treatment.name} in ${location?.name}`,
              ...dt
            });
            if (appt && appt.id) {
              try {
                await createNote(
                  contact.id,
                  `Besondere Wünsche: \n ${body.besondereWunsche} \n Appointment Date: ${body.slot.time}`
                );
              } catch (error) {
                console.log("====================================");
                console.log(`Unable to create note: ${JSON.stringify(error)}`);
                console.log("====================================");
              }
              return NextResponse.json({
                status: 200,
                contact,
                appointment: appt,
              });
            }
          }
        } catch (error) {
          await deleteBlock(block?.id);
        }
      } catch (error: any) {
        return errorResponse(
          error.error || error.message || error.stack || error
        );
      }
    }
  } catch (error) {
    console.log(error)
    return errorResponse(
      `Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.`
    );
  }
  console.log('No response')
  return errorResponse(
    `Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.`
  );
}

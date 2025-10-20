export class AppointmentFhirMapper {
  static toFhir(appointment: any): any {
    return {
      resourceType: 'Appointment',
      id: appointment.id,
      status: appointment.status || 'booked',
      serviceType: [{
        text: appointment.reason || 'General consultation'
      }],
      start: new Date(`${appointment.appointmentDate.toISOString().split('T')[0]}T${appointment.appointmentTime}`).toISOString(),
      participant: [
        {
          actor: { reference: `Patient/${appointment.patientId}` },
          status: 'accepted'
        },
        {
          actor: { reference: `Practitioner/${appointment.providerId}` },
          status: 'accepted'
        }
      ],
      location: appointment.locationId ? { reference: `Location/${appointment.locationId}` } : undefined
    };
  }

  static fromFhir(fhirAppointment: any): any {
    const startDate = new Date(fhirAppointment.start);
    return {
      appointmentDate: startDate,
      appointmentTime: startDate.toTimeString().slice(0, 5),
      status: fhirAppointment.status,
      reason: fhirAppointment.serviceType?.[0]?.text,
      patientId: fhirAppointment.participant?.find(p => p.actor.reference.startsWith('Patient/'))?.actor.reference.split('/')[1],
      providerId: fhirAppointment.participant?.find(p => p.actor.reference.startsWith('Practitioner/'))?.actor.reference.split('/')[1],
      locationId: fhirAppointment.location?.reference?.split('/')[1]
    };
  }
}
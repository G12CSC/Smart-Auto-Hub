export async function sendAdminMessagesForBookings(id) {
  const msg = prompt("ENTER ADMIN MESSAGE FOR THIS BOOKING REQUEST");

  if (!msg) {
    return;
  }

  await fetch(`/api/Consultations/admin/handleBookings/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      adminMessage: msg,
    }),
  });
}

//this api trigger function calls the backend api endpoint once the user has clicked send admin msg button

//Custom function for the dialog prompt to enter admin message

// export async function sendAdminMessagesForBookings(id, msg) {
//   if (!msg) {
//     return;
//   }

//   await fetch(`/api/Consultations/admin/handleBookings/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       adminMessage: msg,
//     }),
//   });
// }

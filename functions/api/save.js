export async function onRequestPost({ request, env }) {
    try {
      const { calendarId, userId, selectedDays } = await request.json();
  
      if (!calendarId || !userId || !selectedDays) {
        return new Response(JSON.stringify({ ok: false, error: "Datos incompletos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
      const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
  
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}?key=${FIREBASE_API_KEY}`;
  
      const res = await fetch(url);
      if (!res.ok) {
        return new Response(JSON.stringify({ ok: false, error: "Calendario no encontrado" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const doc = await res.json();
  
      const users = doc.fields?.users?.arrayValue?.values || [];
  
      let updatedUsers = [];
      let userExists = false;
  
      for (const user of users) {
        const fields = user.mapValue.fields;
        const uid = fields.userId.stringValue;
  
        if (uid === userId) {
          userExists = true;
          updatedUsers.push({
            mapValue: {
              fields: {
                userId: { stringValue: userId },
                selectedDays: {
                  mapValue: {
                    fields: {
                      green: {
                        arrayValue: {
                          values: selectedDays.green.map(day => ({ stringValue: day }))
                        }
                      },
                      red: {
                        arrayValue: {
                          values: selectedDays.red.map(day => ({ stringValue: day }))
                        }
                      },
                      orange: {
                        arrayValue: {
                          values: selectedDays.orange.map(day => ({ stringValue: day }))
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        } else {
          updatedUsers.push(user);
        }
      }
  
      if (!userExists) {
        updatedUsers.push({
          mapValue: {
            fields: {
              userId: { stringValue: userId },
              selectedDays: {
                mapValue: {
                  fields: {
                    green: {
                      arrayValue: {
                        values: selectedDays.green.map(day => ({ stringValue: day }))
                      }
                    },
                    red: {
                      arrayValue: {
                        values: selectedDays.red.map(day => ({ stringValue: day }))
                      }
                    },
                    orange: {
                      arrayValue: {
                        values: selectedDays.orange.map(day => ({ stringValue: day }))
                      }
                    }
                  }
                }
              }
            }
          }
        });
      }
  
      const patchRes = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            password: doc.fields.password || { stringValue: "" }, // fallback por si se borra accidentalmente
            users: {
              arrayValue: {
                values: updatedUsers
              }
            }
          }
        })
      });
  
      if (!patchRes.ok) {
        let errorText = await patchRes.text();
        return new Response(JSON.stringify({ ok: false, error: errorText }), {
          status: patchRes.status,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      return new Response(JSON.stringify({ ok: true, totalUsers: updatedUsers.length }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  
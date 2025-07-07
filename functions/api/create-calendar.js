export async function onRequestPost({ request, env }) {
    try {
      const { calendarId } = await request.json();
  
      if (!calendarId) {
        return new Response(JSON.stringify({ ok: false, error: "Falta el ID del calendario" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
      const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
  
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}?key=${FIREBASE_API_KEY}`;
  
      const body = {
        fields: {
          createdAt: { timestampValue: new Date().toISOString() },
          users: {
            arrayValue: {
              values: []
            }
          }
        }
      };
  
      const response = await fetch(url, {
        method: "PATCH", // PATCH crea o actualiza
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        const error = await response.json();
        return new Response(JSON.stringify({ ok: false, error }), {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      return new Response(JSON.stringify({ ok: true, calendarId }), {
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
  
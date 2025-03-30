export async function onRequestPost({ request, env }) {
    try {
      const { calendarId, password } = await request.json();
  
      if (!calendarId || !password) {
        return new Response("Faltan campos necesarios", { status: 400 });
      }
  
      const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
      const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
  
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}?key=${FIREBASE_API_KEY}`;
  
      const body = {
        fields: {
          password: { stringValue: password },
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
        return new Response(JSON.stringify({ error }), {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
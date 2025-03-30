export async function onRequestPost({ request, env }) {
    try {
      const { calendarId, password } = await request.json();
  
      if (!calendarId || !password) {
        return new Response(JSON.stringify({ ok: false, error: "Faltan datos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
      const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
  
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/calendarios/${calendarId}?key=${FIREBASE_API_KEY}`;
  
      const res = await fetch(url);
      if (!res.ok) {
        return new Response(JSON.stringify({ ok: false, error: "No encontrado" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const doc = await res.json();
  
      const savedPassword = doc.fields?.password?.stringValue || "";
  
      const isCorrect = savedPassword === password;
  
      return new Response(JSON.stringify({ ok: isCorrect }), {
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
  
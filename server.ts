import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/generate-help', async (req, res) => {
    try {
      const { type, ideaInput } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let prompt = `Actúa como un asistente creativo. Basado en la idea "${ideaInput}":\nGenera:\n`;

      if (type === 'all') {
        prompt += `1. 3 ideas o conceptos creativos (breves).
2. 4 colores para una paleta (HEX y un nombre descriptivo en inglés corto).
3. 5 elementos aleatorios inspirados en la idea (palabras clave cortas).

Usa el siguiente formato exacto, sin markdown ni texto extra, separando las secciones por "|||" y los items por "|":
idea1|idea2|idea3|||#HEX:Nombre|#HEX:Nombre|#HEX:Nombre|#HEX:Nombre|||elemento1|elemento2|elemento3|elemento4|elemento5`;
      } else if (type === 'ideas') {
        prompt += `3 ideas o conceptos creativos (breves).\n\nUsa el siguiente formato exacto, sin markdown ni texto extra, separando los items por "|":\nidea1|idea2|idea3`;
      } else if (type === 'palette') {
        prompt += `4 colores para una paleta (HEX y un nombre descriptivo en inglés corto).\n\nUsa el siguiente formato exacto, sin markdown ni texto extra, separando los items por "|":\n#HEX:Nombre|#HEX:Nombre|#HEX:Nombre|#HEX:Nombre`;
      } else if (type === 'elements') {
        prompt += `5 elementos aleatorios inspirados en la idea (palabras clave cortas).\n\nUsa el siguiente formato exacto, sin markdown ni texto extra, separando los items por "|":\nelemento1|elemento2|elemento3|elemento4|elemento5`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error in /api/generate-help:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/generate-report', async (req, res) => {
    try {
      const { answers } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
Eres un guía amigable, cercano y empático en un viaje de descubrimiento personal y creativo.
El jugador acaba de terminar una fase de exploración y ha respondido a 5 preguntas sobre su experiencia.
Por favor, lee sus respuestas y escribe un breve reporte o reflexión final (unas 3-4 oraciones) que lo haga sentir escuchado, validado y motivado para continuar. Usa un tono cálido y amistoso.

Sus respuestas:
1. ¿Qué hiciste? ${answers.q1}
2. ¿Qué viste? ${answers.q2}
3. ¿Qué sentiste? ${answers.q3}
4. ¿Te recuerda algo? ${answers.q4}
5. ¿Qué ideas tuviste... o generaste? ${answers.q5}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error in /api/generate-report:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

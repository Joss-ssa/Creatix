import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema } from '@google/genai';
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
      let prompt = `Actúa como un asistente creativo. Basado en la idea "${ideaInput}":\n`;
      let schema: Schema;

      if (type === 'all') {
        prompt += `Genera 3 ideas creativas breves, una paleta de 4 colores, y 5 elementos aleatorios inspirados.`;
        schema = {
          type: Type.OBJECT,
          properties: {
            ideas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 ideas cortas" },
            palette: { 
              type: Type.ARRAY, 
              items: { type: Type.OBJECT, properties: { hex: { type: Type.STRING }, name: { type: Type.STRING } } },
              description: "4 colores con código hex y nombre en inglés"
            },
            elements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 palabras clave" }
          }
        };
      } else if (type === 'ideas') {
        prompt += `Genera 3 ideas o conceptos creativos breves.`;
        schema = {
          type: Type.OBJECT,
          properties: {
            ideas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 ideas cortas" }
          }
        };
      } else if (type === 'palette') {
        prompt += `Genera 4 colores para una paleta (con código HEX y un nombre descriptivo en inglés corto).`;
        schema = {
          type: Type.OBJECT,
          properties: {
            palette: { 
              type: Type.ARRAY, 
              items: { type: Type.OBJECT, properties: { hex: { type: Type.STRING }, name: { type: Type.STRING } } },
              description: "4 colores con código hex"
            }
          }
        };
      } else if (type === 'elements') {
        prompt += `Genera 5 elementos aleatorios inspirados en la idea (palabras clave cortas).`;
        schema = {
          type: Type.OBJECT,
          properties: {
            elements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 palabras clave" }
          }
        };
      } else {
        throw new Error('Invalid type parameter');
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
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
        model: 'gemini-2.5-flash',
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

# Guia para guardar datos de un formulario en Firebase Firestore

Este documento sirve como instruccion para que otra IA implemente la conexion entre un formulario del frontend y una base de datos de Firebase Firestore. Aplica a cualquier proyecto web que necesite almacenar entradas del usuario en una coleccion de Firestore.

## Objetivo

Hacer que una app web pueda:

- mostrar un formulario al usuario en el frontend
- enviar los datos de ese formulario a Firebase Firestore
- guardar esos datos como un nuevo documento en una coleccion
- confirmar al usuario que el guardado fue exitoso o mostrar el error

## Que resuelve esta guia

Firebase ofrece Firestore, una base de datos NoSQL en tiempo real orientada a documentos. Esta guia cubre el caso basico: insertar documentos desde un formulario.

Las piezas que necesitan existir:

1. un proyecto de Firebase con Firestore habilitado
2. la configuracion del proyecto Firebase para el cliente web
3. reglas de seguridad de Firestore configuradas para la coleccion
4. el formulario en el frontend que llama a Firestore con el SDK

Al igual que Supabase, Firebase permite llamar a Firestore directamente desde el frontend, siempre que las reglas de seguridad esten bien configuradas. Sin necesidad de un endpoint backend propio para el caso basico.

Si las reglas de Firestore permiten lectura y escritura sin restriccion (`allow read, write: if true`), cualquiera en internet puede leer, modificar o borrar todos los datos. Eso no es aceptable en produccion.

## Requisitos minimos

La otra IA debe implementar estas piezas:

1. proyecto de Firebase con Firestore en modo produccion o test
2. reglas de Firestore que permitan insertar documentos segun el caso de uso
3. variables de entorno con la configuracion del proyecto Firebase
4. SDK de Firebase inicializado una sola vez en el proyecto
5. formulario en el frontend que use `addDoc` para guardar datos
6. manejo de estado: cargando, exito, error

## Paso 1. Crear el proyecto en Firebase

Ir a `https://console.firebase.google.com` y crear un nuevo proyecto.

Dentro del proyecto, agregar una app web desde `Project Overview > Add app > Web`. Firebase generara una configuracion similar a esta:

```ts
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mi-proyecto.firebaseapp.com",
  projectId: "mi-proyecto",
  storageBucket: "mi-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Guardar estos valores. Van en variables de entorno del cliente porque son datos del SDK web, no credenciales de servidor.

## Paso 2. Habilitar Firestore

En el panel de Firebase, ir a `Firestore Database` y crear la base de datos. Elegir entre:

- **modo produccion**: todo bloqueado por defecto, hay que definir reglas manualmente
- **modo test**: escritura y lectura libre durante 30 dias (solo para desarrollo, no para produccion)

Se recomienda siempre empezar en modo produccion y definir reglas explicitas.

## Paso 3. Configurar las reglas de seguridad de Firestore

Las reglas se editan desde `Firestore Database > Rules` en el panel de Firebase.

Para permitir que cualquier visitante inserte documentos sin autenticacion (formulario publico):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactos/{docId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

Esta regla permite insertar pero no leer, modificar ni borrar desde el cliente. Es la configuracion correcta para un formulario de contacto publico.

Si el formulario solo puede usarlo un usuario autenticado:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactos/{docId} {
      allow create: if request.auth != null;
      allow read, update, delete: if false;
    }
  }
}
```

Nunca usar `allow read, write: if true` en produccion. Eso expone todos los datos a cualquier persona.

## Paso 4. Configurar las variables de entorno del cliente

Para proyectos con Vite:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=mi-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mi-proyecto
VITE_FIREBASE_STORAGE_BUCKET=mi-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Para Next.js, usar el prefijo `NEXT_PUBLIC_` en cada variable.

Estos valores son del SDK web y estan pensados para ser publicos (son visibles en el navegador). La seguridad real viene de las reglas de Firestore.

## Paso 5. Instalar el SDK de Firebase

```bash
npm install firebase
```

## Paso 6. Inicializar Firebase en el proyecto

Crear un archivo reutilizable, por ejemplo `src/lib/firebase.ts`:

```ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
```

La condicion `getApps().length === 0` evita inicializar Firebase mas de una vez, lo que causaria errores en frameworks como Next.js con hot reload.

Para Next.js reemplazar `import.meta.env.VITE_` por `process.env.NEXT_PUBLIC_`.

## Paso 7. Crear el formulario en el frontend

El formulario importa `db` y usa `addDoc` para insertar un nuevo documento en la coleccion.

Ejemplo base en React:

```tsx
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function ContactForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado('cargando');

    try {
      await addDoc(collection(db, 'contactos'), {
        nombre,
        email,
        mensaje,
        creadoEn: new Date(),
      });
      setEstado('ok');
    } catch (error) {
      console.error(error);
      setEstado('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
      <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Mensaje" required />
      <button type="submit" disabled={estado === 'cargando'}>
        {estado === 'cargando' ? 'Enviando...' : 'Enviar'}
      </button>
      {estado === 'ok' && <p>Guardado correctamente</p>}
      {estado === 'error' && <p>Hubo un error, intenta de nuevo</p>}
    </form>
  );
}
```

`addDoc` genera un ID automatico para el documento. Si se necesita un ID personalizado, usar `setDoc` en su lugar:

```ts
import { doc, setDoc } from 'firebase/firestore';

await setDoc(doc(db, 'contactos', idPersonalizado), {
  nombre,
  email,
  mensaje,
  creadoEn: new Date(),
});
```

## Paso 8. Alternativa con Cloud Function (endpoint backend)

Si se necesita logica de servidor antes de guardar (enviar email de confirmacion, validar datos criticos, enriquecer informacion), usar una Cloud Function de Firebase en lugar de llamar directamente desde el frontend.

Ejemplo de Cloud Function en TypeScript:

```ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const guardarContacto = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Metodo no permitido');
    return;
  }

  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    res.status(400).json({ error: 'Faltan campos requeridos' });
    return;
  }

  try {
    await admin.firestore().collection('contactos').add({
      nombre,
      email,
      mensaje,
      creadoEn: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar' });
  }
});
```

Las Cloud Functions usan `firebase-admin` que tiene acceso completo a Firestore sin importar las reglas de seguridad del cliente.

Desplegar con:

```bash
npx firebase deploy --only functions
```

## Paso 9. Manejar errores comunes

| Error                                      | Causa probable                                                        |
|--------------------------------------------|-----------------------------------------------------------------------|
| `Missing or insufficient permissions`      | Las reglas de Firestore no permiten `create` en esa coleccion         |
| `FirebaseError: No Firebase App '[DEFAULT]'`| Firebase no esta inicializado antes de llamar a Firestore             |
| `Cannot read properties of undefined`      | Las variables de entorno no estan cargadas o tienen el prefijo incorrecto |
| `quota-exceeded`                           | Se alcanzo el limite del plan gratuito de Firebase                    |
| `invalid-argument`                         | El documento contiene un tipo de dato no soportado por Firestore      |

El error mas comun al empezar es el de permisos. Si las reglas de Firestore no tienen una regla `allow create`, la operacion falla aunque el SDK este bien configurado.

## Paso 10. Verificar desde el panel de Firebase

Despues de que el formulario envie datos, ir a `Firestore Database > Data` en el panel de Firebase y verificar que el nuevo documento aparece en la coleccion correcta.

## Tipos de datos compatibles con Firestore

Firestore acepta estos tipos de forma nativa:

- `string`
- `number`
- `boolean`
- `Date` (se guarda como Timestamp)
- `array`
- objeto anidado
- `null`

Para la fecha de creacion, usar `serverTimestamp()` desde el SDK en lugar de `new Date()` cuando sea posible, para consistencia entre zonas horarias:

```ts
import { serverTimestamp } from 'firebase/firestore';

await addDoc(collection(db, 'contactos'), {
  nombre,
  email,
  mensaje,
  creadoEn: serverTimestamp(),
});
```

## Checklist final

Antes de dar por implementado esto, verificar:

- [ ] El proyecto de Firebase existe y Firestore esta habilitado
- [ ] Las reglas de Firestore permiten `create` en la coleccion correcta
- [ ] Las reglas no usan `allow read, write: if true` en produccion
- [ ] Las variables de entorno de Firebase estan definidas con el prefijo correcto segun el framework
- [ ] Firebase se inicializa una sola vez usando `getApps()` para evitar errores
- [ ] El formulario muestra estados de cargando, exito y error
- [ ] Al enviar el formulario, aparece un nuevo documento en la coleccion de Firestore
- [ ] Si se usa Cloud Function, la funcion esta desplegada y la URL es correcta
- [ ] Si hay validacion de datos, ocurre antes de llamar a `addDoc`

## Contexto del proyecto

La otra IA debe reemplazar esta seccion con el contexto real del proyecto antes de implementar:

- framework del frontend: ___
- nombre de la coleccion en Firestore: ___
- nombres de los campos del formulario y sus campos correspondientes en el documento: ___
- formulario publico o solo para usuarios autenticados: ___
- se necesita logica de servidor adicional (Cloud Function): ___
- plataforma de despliegue del frontend: ___

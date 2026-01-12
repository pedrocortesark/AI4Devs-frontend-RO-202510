# Contexto de Producto: LTI Talent Tracking System

## Usuarios Principales

### 1. Reclutadores/HR Managers
**Necesidades**:
- Gestionar múltiples posiciones abiertas simultáneamente
- Evaluar candidatos de manera estructurada a través de flujos de entrevistas
- Seguimiento del progreso de candidatos en tiempo real
- Generación de reportes sobre el estado de contrataciones

**Casos de Uso**:
- Crear y publicar nuevas posiciones con requisitos detallados
- Revisar aplicaciones entrantes y filtrar candidatos
- Programar y gestionar entrevistas con diferentes tipos (técnica, cultural, managerial)
- Actualizar el estado de candidatos a lo largo del proceso de selección

### 2. Candidatos
**Necesidades**:
- Aplicar fácilmente a posiciones relevantes
- Subir y gestionar su CV y documentos
- Seguimiento del estado de sus aplicaciones
- Comunicación clara sobre próximos pasos

**Casos de Uso**:
- Registro completo de perfil profesional (educación, experiencia, contacto)
- Aplicación a posiciones con un clic
- Recepción de feedback sobre su progreso en el proceso

### 3. Administradores del Sistema
**Necesidades**:
- Configuración de flujos de entrevistas reutilizables
- Gestión de usuarios y permisos
- Monitoreo del rendimiento del sistema
- Mantenimiento de datos maestros (tipos de entrevista, compañías)

## Flujos de Negocio Principales

### 1. Proceso de Contratación Completo
1. **Creación de Posición**: HR define posición con flujo de entrevista específico
2. **Publicación**: Posición se hace visible para candidatos
3. **Aplicaciones**: Candidatos aplican con su perfil completo
4. **Evaluación**: HR revisa aplicaciones y programa entrevistas
5. **Entrevistas**: Ejecución de flujo estructurado con múltiples pasos
6. **Decisión**: Aprobación/rechazo con feedback
7. **Contratación**: Actualización final del estado

### 2. Gestión de Candidatos
1. **Registro**: Candidato crea perfil con educación y experiencia
2. **Aplicación**: Selección de posiciones relevantes
3. **Seguimiento**: Visualización del progreso en dashboard
4. **Feedback**: Recepción de resultados y próximos pasos

### 3. Configuración del Sistema
1. **Setup de Compañía**: Creación de entidades base (compañías, empleados)
2. **Flujos de Entrevista**: Diseño de procesos reutilizables
3. **Tipos de Entrevista**: Definición de formatos de evaluación

## Requisitos Funcionales Críticos
- **Validación de Datos**: Regex y constraints estrictos para integridad
- **Gestión de Archivos**: Upload seguro de CVs (PDF/DOCX)
- **Autenticación**: Sistema básico de usuarios (planeado)
- **Auditoría**: Tracking de cambios en estados de aplicación
- **Escalabilidad**: Arquitectura preparada para múltiples compañías

## Métricas de Producto
- **Tiempo de Proceso**: Reducción del 40% en ciclos de contratación
- **Experiencia de Usuario**: Aplicaciones completadas en <5 minutos
- **Tasa de Conversión**: 70% de posiciones cubiertas exitosamente
- **Satisfacción**: Feedback positivo de reclutadores y candidatos
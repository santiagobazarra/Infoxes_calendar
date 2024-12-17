<template>
  <div class="full-calendar">
    <div class="full-calendar-container">
      <FullCalendar :options="calendarOptions" />
      <!--Filas debajo del calendario-->
      <div class="calendar-footer">
        <div class="time-column">
          <!-- Columna de tiempo -->
        </div>
        <div v-for="day in 5" :key="day" class="day-columns">
          <div class="column c-column">C</div>
          <div class="column d-column">D</div>
        </div>
      </div>
      <div class="calendar-footer">
        <div class="time-column">
          <!-- Columna de tiempo -->
        </div>
        <div v-for="day in 5" :key="day" class="day-columns">
          <div class="column c-column"></div>
          <div class="column d-column"></div>
        </div>
      </div>

    </div>

    <!-- Modal con animación -->
    <transition name="fade">
      <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <!-- Indicador de color -->
          <div 
            class="modal-header" 
            :style="{ backgroundColor: obtenerColorEstado(eventoSeleccionado.estado) }">
            <h2 class="modal-title">Detalles del Evento</h2>
          </div>
          <div class="modal-body">
            <p><strong>TIPO:</strong> {{ eventoSeleccionado.tipo }}</p>
            <p><strong>ESTADO:</strong> {{ eventoSeleccionado.estado }}</p>
            <p><strong>FECHA:</strong> {{ eventoSeleccionado.fecha }}</p>
            <p><strong>HORA:</strong> {{ eventoSeleccionado.hora }}</p>
            <p><strong>PLANTA:</strong> {{ eventoSeleccionado.informacionPlanta }}</p>
            <p><strong>MATRICULA:</strong> {{ eventoSeleccionado.matricula }}</p>
            <p><strong>EMPRESA:</strong> {{ eventoSeleccionado.empresa }}</p>
          </div>
          <button class="modal-close-button" @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      modalVisible: false, // Controla la visibilidad del modal
      eventoSeleccionado: {}, // Datos del evento seleccionado
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin],
        initialView: 'resourceTimeGridWeek',
        datesAboveResources: true,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: ''
        },
        firstDay: 1,
        slotMinTime: '06:00:00', // Hora mínima visible
        slotMaxTime: '21:00:00', // Hora máxima visible
        slotDuration: '00:30:00', // Duración de cada slot (media hora)
        slotLabelInterval: '00:30:00', // Intervalo para las etiquetas de tiempo
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: false,
        }, // Formato para mostrar las etiquetas de tiempo
        locale: 'es',
        hiddenDays: [0, 6],
        allDaySlot: false,
        resources: [], // Recursos cargados dinámicamente
        events: [], // Eventos cargados dinámicamente
        eventClick: this.mostrarDetallesEvento, // Llama a un método al hacer clic en un evento
      },
    };
  },
  methods: {
    async cargarDatos() {
      try {
        const respuesta = await fetch('http://localhost:3001/cargas-descargas');
        const datos = await respuesta.json();

        const recursos = [
          { id: 'cargas', title: 'C' },
          { id: 'descargas', title: 'D' },
        ];

        const eventos = datos.map((evento) => ({
          id: evento.id,
          title: `${evento.tipo.toUpperCase()} ${evento.estado}`,
          start: `${evento.fecha}T${evento.hora.split('-')[0]}:00`,
          end: `${evento.fecha}T${evento.hora.split('-')[1]}:00`,
          resourceId: evento.tipo.toUpperCase() === 'CARGA' ? 'cargas' : 'descargas',
          backgroundColor: this.obtenerColorEstado(evento.estado),
          extendedProps: evento, // Añade todos los datos del evento como `extendedProps`
        }));

        this.calendarOptions.resources = recursos;
        this.calendarOptions.events = eventos;
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    },
    obtenerColorEstado(estado) {
      switch (estado) {
        case 'PENDIENTE':
          return 'orange';
        case 'CERRADA':
          return 'green';
        case 'EN CARGA':
          return 'blue';
        case 'CARGADA':
          return 'purple';
        case 'ANULADA':
          return 'red';
        default:
          return 'gray';
      }
    },
    mostrarDetallesEvento(info) {
      // Muestra el modal con los detalles del evento seleccionado
      this.eventoSeleccionado = info.event.extendedProps; // Obtén los datos extendidos del evento
      this.modalVisible = true;
    },
    cerrarModal() {
      // Cierra el modal
      this.modalVisible = false;
      this.eventoSeleccionado = {};
    },
  },
  mounted() {
    this.cargarDatos(); // Cargar datos al montar el componente
  }
};
</script>

<style scoped>
/* Estilos existentes */
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

.full-calendar {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.full-calendar-container {
  flex-grow: 1;
  padding: 3em;
  background: #f5f5f5;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-bottom-style:groove;
  max-height: 800px;
}


/* Efecto de fondo desenfocado con modal */
body.modal-open {
  overflow: hidden; /* Evitar scroll al abrir el modal */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px); /* Efecto de desenfoque */
  transition: backdrop-filter 0.3s ease; /* Transición para suavizar el efecto */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s ease, transform 0.3s ease;
  animation: modal-open 0.5s ease-out;
}

@keyframes modal-open {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Encabezado del modal con diseño mejorado */
.modal-header {
  padding: 20px;
  font-size: 22px;
  font-weight: bold;
  color: white;
  background-color: var(--header-bg-color, gray);
  border-radius: 10px 10px 10px 10px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-body {
  padding: 15px;
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  display: flex;
  flex-direction: column;
}

.modal-body p {
  margin: 10px 0;
  font-size: 16px;
}

.modal-body p strong {
  color: #002043;
}

.modal-close-button {
  width: 100%;
  padding: 15px 0;
  border: none;
  background: #0056b3;
  color: white;
  border-radius: 10px 10px 10px 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  transition: background 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-close-button:hover {
  background: linear-gradient(45deg, #0056b3, #003f7f);
  transform: translateY(-2px);
}

/* Transiciones para el modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Nuevos estilos para la fila adicional */
.calendar-footer {
  display: flex;
  margin-top: 1px;
  border: 1px solid #ddd;
  background: white;
  max-width: 1100px;
  margin: 0 auto;
}

.time-column {
  width: 44px; /* Ajusta este valor para que coincida con el ancho de la columna de tiempo del calendario */
  border-right: 1px solid #ddd;
}

.day-columns {
  flex: 1;
  display: flex;
}

.column {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-right: 1px solid #ddd;
  font-weight: bold;
}

.c-column {
  background-color: #f5f5f5;
}

.d-column {
  background-color: #eaeaea;
}

</style>

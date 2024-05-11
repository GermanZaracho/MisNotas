navigator.serviceWorker.register('sw.js');

const btnSave = document.querySelector('#btn-save');
const textArea = document.querySelector('#ingresar-texto');

document.addEventListener('DOMContentLoaded', function () {

  let modal = document.querySelectorAll('.modal');
  let instanciaModal = M.Modal.init(modal, {});

});

document.getElementById('botonDesplegar').addEventListener('click', function () {
  var texto1 = document.getElementById('texto1');
  var texto2 = document.getElementById('texto2');

  if (texto1.style.display === 'none') {
    texto1.style.display = 'block';
    texto2.style.display = 'block';
  } else {
    texto1.style.display = 'none';
    texto2.style.display = 'none';
  }
});

var app = new Vue({
  el: '#app',
  data: {
    dialog: false,
    listNote: [],
    note: '',
    dialogEditar: false,
    notaEditada: '',
    oldNote: '',
    noteCreated: 0
  },
  created() {
    this.leerNotas();
  },
  mounted() {
    this.renderizarNotas(this.listNote);
    document.getElementById('botonDesplegar').addEventListener('click', function () {
      var texto1 = document.getElementById('texto1');
      var texto2 = document.getElementById('texto2');
      var menuContainer = document.querySelector('.menuContainer');

      if (texto1.style.display === 'none') {
        console.log('hola1');
        texto1.style.display = 'block';
        texto2.style.display = 'block';
      } else {
        console.log('hola2');
        texto1.style.display = 'none';
        texto2.style.display = 'none';
      }

      // Add event listener for clicks throughout the document
      document.addEventListener('click', function (event) {
        var targetElement = event.target; // Element clicked

        // Check if the click was outside menuContainer and the texts are visible
        if (!menuContainer.contains(targetElement) && texto1.style.display === 'block') {
          texto1.style.display = 'none';
          texto2.style.display = 'none';
        }
      });
    });
  },
  methods: {
    logout() {
      localStorage.setItem("login", JSON.stringify(false));
      this.$router.push("/");
    },
    guardarNotas(lista) {

      this.dialog = true;

      if (this.note != '') {

        const newNote = {
          note: this.note,
          check: false,
          show: true,
          fecha: this.obtenerFechaActual()
        };

        lista.push(newNote);
        this.note = "";
        localStorage.setItem("listNote", JSON.stringify(lista));
        this.dialog = false;
        this.noteCreated++;
        localStorage.setItem("noteCreated", JSON.stringify(this.noteCreated));
      }
      this.renderizarNotas(this.listNote);
    },
    cancelNote() {
      this.dialog = false;
    },
    leerNotas() {
      const topList = JSON.parse(localStorage.getItem("listNote"));
      this.listNote = topList ? topList : [];
      const quantityNotes = JSON.parse(localStorage.getItem("noteCreated"));
      this.noteCreated = quantityNotes ? quantityNotes : 0;
    },
    renderizarNotas(lista) {

      let container = document.querySelector('.listCollection');
      container.innerHTML = '';
      lista.forEach((item) => {
        let noteCard = document.createElement('div');
        noteCard.className = 'collectionItem';
        noteCard.innerHTML = `<div class="noteInfo"><div class="noteDate">${item.fecha}</div><div class="noteContent">${item.note}</div></div>`;

        let iconContainer = document.createElement('div');
        iconContainer.className = 'iconContainer';

        let deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.addEventListener('click', () => this.deleteNote(item.note));

        let iconDeleteBtn = document.createElement('i');
        iconDeleteBtn.className = 'material-icons';
        iconDeleteBtn.innerHTML = 'delete';
        deleteBtn.appendChild(iconDeleteBtn);
        iconContainer.appendChild(deleteBtn);

        let editBtn = document.createElement('a');
        editBtn.classList.add('btn-edit', 'modal-trigger');
        editBtn.setAttribute('href', '#modal2');
        editBtn.addEventListener('click', () => this.editarNota(item.note));

        let iconEditBtn = document.createElement('i');
        iconEditBtn.className = 'material-icons';
        iconEditBtn.innerHTML = 'edit';
        editBtn.appendChild(iconEditBtn);
        iconContainer.appendChild(editBtn);

        noteCard.appendChild(iconContainer);

        container.appendChild(noteCard);

      });

    },
    deleteNote(item) {
      this.listNote = this.listNote.filter(function (note) {
        return note.note !== item;
      });

      localStorage.setItem('listNote', JSON.stringify(this.listNote));

      this.renderizarNotas(this.listNote);

    },
    obtenerFechaActual() {
      let now = new Date();
      let day = now.getDate();
      let month = now.getMonth() + 1; // Months go from 0 to 11
      let year = now.getFullYear();
      let hours = now.getHours();
      let minutes = now.getMinutes();

      // Add leading zeros if necessary to maintain the HH:mm format
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    },
    deleteEveryNote() {
      console.log('borrando todas');
      this.listNote = [];
      localStorage.setItem('listNote', JSON.stringify(this.listNote));
      this.renderizarNotas(this.listNote);
    },
    editarNota(nota) {
      this.notaEditada = nota;
      this.oldNote = nota;
      this.dialogEditar = true;
      console.log(this.notaEditada, 'editando la nota');
    },
    guardarEdicion() {

      this.listNote = this.listNote.map(nota => {
        // If the current note matches this.oldNote, update the value of note.note
        if (nota.note === this.oldNote) {
          nota.note = this.notaEditada;
        }
        // Returns the note, whether modified or not
        return nota;
      });
      localStorage.setItem('listNote', JSON.stringify(this.listNote));

      this.renderizarNotas(this.listNote);
      this.dialogEditar = false;
    },

    cancelarEdicion() {
      this.dialogEditar = false;
    }
  }
})

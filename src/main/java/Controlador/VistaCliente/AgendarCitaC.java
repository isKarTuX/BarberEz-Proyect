package Controlador.VistaCliente;

import Modelo.Cliente;
import Modelo.Conexiones.ConsultaDB;
import Observer.BarberoSubject;
import Observer.BarberoObserver;
import Vistas.Clientes.ClienteVistaDefault;
import Vistas.Clientes.PanelAgendarCita;

import java.awt.BorderLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.swing.*;

public class AgendarCitaC implements BarberoObserver {

    private PanelAgendarCita PC;
    private Cliente cliente;
    private BarberoSubject barberoSubject;

    public AgendarCitaC(PanelAgendarCita PC, Cliente cliente, BarberoSubject barberoSubject) {
        this.PC = PC;
        this.cliente = cliente;
        this.barberoSubject = barberoSubject;
        configurarVista();
        configurarEventos();
        cargarBarberos();

    }

    private void configurarVista() {
        PC.Titulo1.setFont(new Font("Montserrat", Font.BOLD, 14));
        PC.Titulo.setFont(new Font("Montserrat", Font.BOLD, 14));
        PC.Subtitulo1.setFont(new Font("Montserrat", Font.BOLD, 12));
        PC.horatxt.setFont(new Font("Montserrat", Font.BOLD, 12));
        PC.horabox.setFont(new Font("Montserrat", Font.BOLD, 12));
        PC.barbacheck.setFont(new Font("Montserrat", Font.BOLD, 12));
        PC.cortecheck.setFont(new Font("Montserrat", Font.BOLD, 12));
        PC.exfoliacioncheck.setFont(new Font("Montserrat", Font.BOLD, 12));
        PC.efectivocheck.setFont(new Font("Montserrat", Font.BOLD, 12));
        PC.digitalcheck.setFont(new Font("Montserrat", Font.BOLD, 12));
    }

    public void iniciar(ClienteVistaDefault vista) {
        PC.setSize(690, 530);
        PC.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(PC, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
    }

    private void configurarEventos() {
        PC.jButtonRegistrarCita.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent evt) {
                registrarCita();
            }
        });

        PC.jButtonLimpiar.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent evt) {
                limpiarFormulario();
            }
        });

        PC.jButtonGuardarFecha.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent evt) {
                guardarFecha();
            }
        });

        PC.barberosBox.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent evt) {
                actualizarHorasDisponibles();
            }
        });
    }

    private void actualizarHorasDisponibles() {
        String barberoSeleccionado = (String) PC.barberosBox.getSelectedItem();
        Date fechaSeleccionada = PC.getSelectedDate();

        if (barberoSeleccionado == null || "Seleccionar".equals(barberoSeleccionado) || fechaSeleccionada == null) {
            PC.horabox.removeAllItems();
            PC.horabox.addItem("Seleccionar");
            return;
        }

        // Validar que la fecha seleccionada no sea anterior a la fecha actual
        Date fechaActual = new Date();
        if (fechaSeleccionada.before(fechaActual) && !esMismaFecha(fechaSeleccionada, fechaActual)) {
            JOptionPane.showMessageDialog(PC, "No puedes agendar una cita en una fecha pasada.");
            return;
        }

        DefaultComboBoxModel<String> loadingModel = new DefaultComboBoxModel<>();
        loadingModel.addElement("Cargando...");
        PC.horabox.setModel(loadingModel);  // Establecer el modelo temporal

        int idBarbero = cliente.obtenerIdBarbero(barberoSeleccionado);
        ConsultaDB<List<String>> consultaDB = new ConsultaDB<>(null,
                () -> cliente.obtenerHorasDisponibles(idBarbero, fechaSeleccionada),
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(List<String> horasDisponibles) {
                        DefaultComboBoxModel<String> model = new DefaultComboBoxModel<>();
                        model.addElement("Seleccionar");

                        if (isSameDay(fechaSeleccionada, fechaActual)) {
                            Calendar calendar = Calendar.getInstance();
                            int horaActual = calendar.get(Calendar.HOUR_OF_DAY);
                            for (String hora : horasDisponibles) {
                                int horaInt = Integer.parseInt(hora.split(":")[0]);
                                if (horaInt > horaActual) {
                                    model.addElement(hora);
                                }
                            }
                        } else {
                            for (String hora : horasDisponibles) {
                                model.addElement(hora);
                            }
                        }

                        PC.horabox.setModel(model);
                    }

                    @Override
                    public void onError(Exception e) {
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(PC, "Error al cargar las horas disponibles: " + e.getMessage());
                    }
                });

        consultaDB.execute();
    }

    private boolean esMismaFecha(Date fecha1, Date fecha2) {
        SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMdd");
        return fmt.format(fecha1).equals(fmt.format(fecha2));
    }

    private boolean isSameDay(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        cal1.setTime(date1);
        cal2.setTime(date2);
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
    }

    private void registrarCita() {
        if (cliente == null) {
            JOptionPane.showMessageDialog(PC, "Error: Cliente no inicializado.");
            return;
        }

        // Obtener datos del formulario
        Date fechaSeleccionada = PC.getSelectedDate();
        String horaSeleccionada = PC.getSelectedHour();
        String categoriaSeleccionada = String.join(", ", PC.getSelectedServices());
        String barberoSeleccionado = (String) PC.barberosBox.getSelectedItem();
        String metodoPago = PC.getSelectedPaymentMethod();

        // Validar datos del formulario
        if (fechaSeleccionada == null || "Seleccionar".equals(horaSeleccionada)) {
            JOptionPane.showMessageDialog(PC, "Por favor seleccione una fecha y hora válidas.");
            return;
        }

        // Mostrar el indicador de progreso
        DefaultComboBoxModel<String> loadingModel = new DefaultComboBoxModel<>();
        loadingModel.addElement("Registrando cita...");
        PC.horabox.setModel(loadingModel);

        // Usar SwingWorker para realizar la operación en segundo plano
        ConsultaDB<Boolean> consultaDB = new ConsultaDB<>(
                null,
                () -> cliente.reservarCita(fechaSeleccionada, horaSeleccionada, categoriaSeleccionada, barberoSeleccionado, metodoPago),
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(Boolean exito) {
                        if (exito) {
                            JOptionPane.showMessageDialog(PC, "Cita registrada con éxito.");
                            limpiarFormulario();
                        } else {
                            JOptionPane.showMessageDialog(PC, "Error al registrar la cita. Por favor, intente de nuevo.");
                        }
                        cargarBarberos(); // Restaurar el ComboBox
                    }

                    @Override
                    public void onError(Exception e) {
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(PC, "Ocurrió un error al registrar la cita: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                        cargarBarberos(); // Restaurar el ComboBox
                    }
                }
        );

        // Ejecutar la operación
        consultaDB.execute();
    }


    private void limpiarFormulario() {
        PC.jCalendar2.setDate(new Date());
        PC.txtMostrarFecha.setText("Fecha elegida: ");
        PC.cortecheck.setSelected(false);
        PC.barbacheck.setSelected(false);
        PC.exfoliacioncheck.setSelected(false);
        PC.horabox.setSelectedIndex(0);
        PC.buttonGroup1.clearSelection();
    }

    private void guardarFecha() {
        Date fechaSeleccionada = PC.getSelectedDate();
        SimpleDateFormat fecha = new SimpleDateFormat("dd/MM/yyyy");
        String formattedFecha = fecha.format(fechaSeleccionada);
        PC.txtMostrarFecha.setText("Fecha elegida: " + formattedFecha);
    }
    private void cargarBarberos() {
        DefaultComboBoxModel<String> loadingModel = new DefaultComboBoxModel<>();
        loadingModel.addElement("Cargando...");
        PC.barberosBox.setModel(loadingModel);

        ConsultaDB<List<String>> consultaDB = new ConsultaDB<>(null,
                () -> cliente.obtenerBarberos(),
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(List<String> barberos) {
                        DefaultComboBoxModel<String> model = new DefaultComboBoxModel<>();
                        model.addElement("Seleccionar");
                        for (String barbero : barberos) {
                            model.addElement(barbero);
                        }
                        PC.barberosBox.setModel(model);
                    }

                    @Override
                    public void onError(Exception e) {
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(PC, "Error al cargar la lista de barberos: " + e.getMessage());
                    }
                });
        consultaDB.execute();
    }

    @Override
    public void update(List<String> listaDeBarberos) {
        if (PC.isVisible()) { // Verifica si la vista está actualmente visible
            JOptionPane.showMessageDialog(null, "Se ha actualizado la lista de barberos");
            cargarBarberos();
        }
    }


}

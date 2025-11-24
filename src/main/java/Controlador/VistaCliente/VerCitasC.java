package Controlador.VistaCliente;

import Modelo.Conexiones.ConsultaDB;
import Vistas.Clientes.ClienteVistaDefault;
import Vistas.Clientes.PanelVerCitas;
import java.awt.BorderLayout;
import java.util.List;
import Modelo.Cliente;

import javax.swing.*;

public class VerCitasC {

    private PanelVerCitas pvc;
    private Cliente cliente;

    public VerCitasC(PanelVerCitas pvc, Cliente cliente) {
        this.pvc = pvc;
        this.cliente = cliente;
        cargarCitas();
        configurarEventos();
    }
    private void configurarEventos() {
        pvc.jButtonCancelarCita.addActionListener(evt -> cancelarCita());
    }

    public void iniciar(ClienteVistaDefault vista) {
        pvc.setSize(680, 530);
        pvc.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(pvc, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
    }
    public void cargarCitas() {
        ConsultaDB<List<String>> consultaDB = new ConsultaDB<>(
                null,  // Parent JFrame, or replace with the actual parent if available
                () -> cliente.obtenerCitasPendientes(),  // Task to fetch pending appointments
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(List<String> citas) {
                        // Populate the JList with the fetched appointments
                        DefaultListModel<String> model = new DefaultListModel<>();
                        for (String cita : citas) {
                            model.addElement(cita);
                        }
                        pvc.jListVerCitas.setModel(model);
                    }

                    @Override
                    public void onError(Exception e) {
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(null, "Error al cargar las citas: " + e.getMessage());
                    }
                }
        );

        // Execute the background task
        consultaDB.execute();
    }

    private void cancelarCita() {
        String selectedCita = pvc.jListVerCitas.getSelectedValue();
        if (selectedCita == null) {
            JOptionPane.showMessageDialog(pvc, "Por favor seleccione una cita para cancelar.");
            return;
        }

        String[] citaDetails = selectedCita.split(" ");
        if (citaDetails.length < 4) {
            JOptionPane.showMessageDialog(pvc, "Formato de cita inválido.");
            return;
        }

        String fecha = citaDetails[0];
        String hora = citaDetails[1];
        String barbero = citaDetails[citaDetails.length - 1];

        // Use ConsultaDB to perform the cancellation
        ConsultaDB<Boolean> consultaDB = new ConsultaDB<>(
                null,  // Parent JFrame, or replace with the actual parent if available
                () -> cliente.cancelarCita(fecha, hora, barbero),  // Task to cancel the appointment
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(Boolean exito) {
                        if (exito) {
                            JOptionPane.showMessageDialog(pvc, "Cita cancelada con éxito.");
                            cargarCitas();  // Refresh the appointments list
                        } else {
                            JOptionPane.showMessageDialog(pvc, "Error al cancelar la cita.");
                        }
                    }

                    @Override
                    public void onError(Exception e) {
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(pvc, "Error al cancelar la cita: " + e.getMessage());
                    }
                }
        );

        // Execute the background task
        consultaDB.execute();
    }

}

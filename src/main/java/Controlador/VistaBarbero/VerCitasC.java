/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controlador.VistaBarbero;


import Modelo.Barbero;
import Modelo.Conexiones.ConsultaDB;
import Vistas.Barberos.PanelVerCitas;
import Vistas.Barberos.BarberoVistaDefault;

import javax.swing.*;
import java.awt.BorderLayout;
import java.util.List;


public class VerCitasC {

    private PanelVerCitas pvc;
    private Barbero barbero;

    public VerCitasC(PanelVerCitas pvc, Barbero barbero) {
        pvc.jButtonConfirmarCita.addActionListener(e -> confirmarCita());
        this.pvc = pvc;
        this.barbero = barbero;
        configurarVista();
    }

    public void iniciar(BarberoVistaDefault vista) {
        pvc.setSize(680, 530);
        pvc.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(pvc, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
        mostrarCitasPendientes();
    }

    private void configurarVista() {
        pvc.jButtonConfirmarCita.addActionListener(e -> confirmarCita());
    }

    public void mostrarCitasPendientes() {
        // Mostrar "Cargando..." en el JList mientras se obtienen las citas pendientes
        DefaultListModel<String> loadingModel = new DefaultListModel<>();
        loadingModel.addElement("Cargando...");
        pvc.jListVerCitasBarberos.setModel(loadingModel);

        // Crear la tarea para obtener las citas pendientes
        ConsultaDB<List<String>> consultaDB = new ConsultaDB<>(
                null, // Parent JFrame, puede ser null si no se necesita
                () -> barbero.obtenerCitasPendientes(), // Tarea para obtener citas pendientes
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(List<String> citasPendientes) {
                        // Actualizar el JList con las citas pendientes obtenidas
                        DefaultListModel<String> model = new DefaultListModel<>();
                        for (String cita : citasPendientes) {
                            model.addElement(cita);
                        }
                        pvc.jListVerCitasBarberos.setModel(model);
                    }

                    @Override
                    public void onError(Exception e) {
                        // Manejar errores durante la consulta
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(pvc, "Error al cargar las citas pendientes: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                }
        );

        // Ejecutar la tarea en segundo plano
        consultaDB.execute();
    }


    private void confirmarCita() {
        String selectedCita = pvc.jListVerCitasBarberos.getSelectedValue();
        if (selectedCita != null) {
            try {
                // Procesar la cita seleccionada
                String[] parts = selectedCita.split(" ");
                String fecha = parts[0];
                String hora = parts[1];
                String cliente = parts[parts.length - 1]; // Manejo de nombres compuestos

                // Crear la tarea para confirmar la cita
                ConsultaDB<Boolean> consultaDB = new ConsultaDB<>(
                        null, // Parent JFrame, puede ser null si no se necesita
                        () -> barbero.confirmarCita(fecha, hora, cliente), // Tarea para confirmar la cita
                        new ConsultaDB.DatabaseTaskListener<>() {
                            @Override
                            public void onSuccess(Boolean confirmada) {
                                if (confirmada) {
                                    JOptionPane.showMessageDialog(pvc, "Cita confirmada exitosamente.", "Éxito", JOptionPane.INFORMATION_MESSAGE);
                                } else {
                                    JOptionPane.showMessageDialog(pvc, "No se pudo confirmar la cita. Verifica los datos.", "Error", JOptionPane.ERROR_MESSAGE);
                                }
                                mostrarCitasPendientes(); // Refrescar el JList
                            }

                            @Override
                            public void onError(Exception e) {
                                // Manejar errores durante la confirmación
                                e.printStackTrace();
                                JOptionPane.showMessageDialog(pvc, "Error al confirmar la cita: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                            }
                        }
                );

                // Ejecutar la tarea en segundo plano
                consultaDB.execute();
            } catch (ArrayIndexOutOfBoundsException e) {
                JOptionPane.showMessageDialog(pvc, "Error al procesar la cita seleccionada.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(pvc, "Por favor selecciona una cita.", "Advertencia", JOptionPane.WARNING_MESSAGE);
        }
    }

}

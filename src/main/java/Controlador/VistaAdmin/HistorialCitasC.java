/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controlador.VistaAdmin;

import Modelo.Conexiones.ConsultaDB;
import Vistas.Admin.*;
import java.awt.BorderLayout;
import java.util.List;
import Modelo.Admin;

import javax.swing.*;

/**
 *
 * @author andre
 */
public class HistorialCitasC {

    private PanelHistorialCitas phc;
    private Admin admin;

    public HistorialCitasC(PanelHistorialCitas phc, Admin admin) {
        this.phc = phc;
        this.admin = admin;
        cargarCitas();
    }

    public void iniciar(AdminVistaDefault vista) {
        phc.setSize(690, 530);
        phc.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(phc, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
    }
    private void cargarCitas() {
        // Mostrar "Cargando..." en el JList mientras se obtienen las citas
        DefaultListModel<String> loadingModel = new DefaultListModel<>();
        loadingModel.addElement("Cargando...");
        phc.jListHistorialCitas.setModel(loadingModel); // Establecer el modelo temporal

        // Crear la tarea que se ejecutará en segundo plano para obtener las citas completadas
        ConsultaDB<List<String>> consultaDB = new ConsultaDB<>(
                null, // Parent JFrame, puede ser null si no se necesita
                () -> admin.obtenerCitasCompletadas(), // Tarea para obtener citas completadas
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(List<String> citas) {
                        // Una vez que los datos se hayan cargado, se actualiza el JList
                        DefaultListModel<String> model = new DefaultListModel<>();
                        for (String cita : citas) {
                            model.addElement(cita);
                        }
                        phc.jListHistorialCitas.setModel(model); // Actualizar el modelo del JList con las citas
                    }

                    @Override
                    public void onError(Exception e) {
                        // Manejar el error si ocurre algún problema durante la consulta
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(phc, "Error al cargar el historial de citas: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                }
        );

        // Ejecutar la tarea en segundo plano
        consultaDB.execute();
    }
}

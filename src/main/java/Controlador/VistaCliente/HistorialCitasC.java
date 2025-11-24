package Controlador.VistaCliente;

import Modelo.Cliente;
import Modelo.Conexiones.ConsultaDB;
import Vistas.Clientes.ClienteVistaDefault;
import Vistas.Clientes.PanelHistorialCitas;

import javax.swing.*;
import java.awt.BorderLayout;
import java.util.List;

public class HistorialCitasC {

    private PanelHistorialCitas phc;
    Cliente cliente;

    public HistorialCitasC(PanelHistorialCitas phc, Cliente cliente) {
        this.phc = phc;
        this.cliente = cliente;
    }

    public void iniciar(ClienteVistaDefault vista) {
        phc.setSize(680, 530);
        phc.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(phc, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
        mostrarCitasCompletadas(cliente);
    }

    public void mostrarCitasCompletadas(Cliente cliente) {
        // Mostrar "Cargando..." en el JList mientras se obtienen las citas
        DefaultListModel<String> loadingModel = new DefaultListModel<>();
        loadingModel.addElement("Cargando...");  // Mensaje de carga
        phc.jListHistorialCitas.setModel(loadingModel);  // Establecer el modelo temporal

        // Crear la tarea que se ejecutará en segundo plano para obtener las citas
        ConsultaDB<List<String>> consultaDB = new ConsultaDB<>(
                null,  // Parent JFrame, puede ser null si no se necesita
                () -> cliente.obtenerCitasCompletadas(),  // Tarea para obtener citas completadas
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(List<String> citasCompletadas) {
                        // Una vez que los datos se hayan cargado, se actualiza el panel
                        DefaultListModel<String> model = new DefaultListModel<>();
                        for (String cita : citasCompletadas) {
                            model.addElement(cita);
                        }
                        phc.jListHistorialCitas.setModel(model);  // Actualizar el modelo del JList con las citas
                    }

                    @Override
                    public void onError(Exception e) {
                        // Manejar el error si ocurre algún problema durante la consulta
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(phc, "Error al cargar el historial de citas: " + e.getMessage());
                    }
                }
        );

        // Ejecutar la tarea en segundo plano
        consultaDB.execute();
    }
}

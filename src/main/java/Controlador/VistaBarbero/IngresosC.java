/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controlador.VistaBarbero;

import Modelo.Barbero;
import Modelo.Conexiones.ConsultaDB;
import Vistas.Barberos.BarberoVistaDefault;
import Vistas.Barberos.PanelIngresos;

import javax.swing.*;
import java.awt.*;
import java.text.SimpleDateFormat;
import java.util.List;

public class IngresosC {

    private PanelIngresos PI;
    private Barbero barbero;

    public IngresosC(PanelIngresos PI, Barbero barbero) {
        this.PI = PI;
        this.barbero = barbero;
    }

    public void iniciar(BarberoVistaDefault vista) {
        PI.setSize(690, 530);
        PI.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(PI, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
        actualizarVistaIngresos();
    }

    // src/main/java/Controlador/VistaBarbero/IngresosC.java
    public void actualizarVistaIngresos() {
        // Mostrar "Cargando..." en los elementos de la interfaz mientras se obtienen los datos
        DefaultListModel<String> loadingModel = new DefaultListModel<>();
        loadingModel.addElement("Cargando...");
        PI.verIngresosDiarios.setModel(loadingModel);
        PI.IngresosTotalesTxt.setText("Cargando...");
        PI.PorcentajeTxt.setText("Cargando...");

        // Crear la tarea que se ejecutará en segundo plano
        ConsultaDB<Object[]> consultaDB = new ConsultaDB<>(
                null, // Parent JFrame, puede ser null si no se necesita
                this::obtenerDatosIngresos,
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(Object[] resultados) {
                        procesarDatosIngresos(resultados);
                    }

                    @Override
                    public void onError(Exception e) {
                        // Manejar errores durante la consulta
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(PI, "Error al cargar los datos: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                }
        );

        // Ejecutar la tarea en segundo plano
        consultaDB.execute();
    }

    private Object[] obtenerDatosIngresos() throws Exception {
        // Obtener datos en segundo plano
        List<String> gananciasDiarias = barbero.obtenerGananciasDiarias();
        double ingresosTotales = barbero.obtenerIngresosTotales();
        double porcentajeComision = barbero.obtenerPorcentajeComision();
        double comision = ingresosTotales * porcentajeComision;
        double ingresosNetos = ingresosTotales - comision;

        // Retornar todos los datos en un arreglo de objetos
        return new Object[]{gananciasDiarias, ingresosNetos, porcentajeComision};
    }

    private void procesarDatosIngresos(Object[] resultados) {
        // Procesar los datos obtenidos
        @SuppressWarnings("unchecked")
        List<String> gananciasDiarias = (List<String>) resultados[0];
        double ingresosNetos = (Double) resultados[1];
        double porcentajeComision = (Double) resultados[2];

        // Actualizar el JList con las ganancias diarias
        DefaultListModel<String> model = new DefaultListModel<>();
        for (String ganancia : gananciasDiarias) {
            model.addElement(ganancia);
        }
        PI.verIngresosDiarios.setModel(model);

        // Actualizar los campos de texto con los ingresos y la comisión
        PI.IngresosTotalesTxt.setText(String.format("Ingresos Netos: $%,.0f", ingresosNetos));
        PI.PorcentajeTxt.setText(String.format("%.0f%%", porcentajeComision * 100));
    }
}
